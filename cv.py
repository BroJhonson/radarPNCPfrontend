# Dentro da classe PostsView, método edit_post

# ... (início do método, antes do "if request.method == 'POST':")

if request.method == 'POST':
    # ... (pega todos os dados do formulário: titulo, resumo, etc.)
    slug_original = request.form.get('slug')
    
    # Limpa o slug recebido do formulário
    import re
    slug_limpo = re.sub(r'[^a-z0-9\-]+', '', slug_original.lower()).strip('-')

    try:
        # --- LÓGICA DE UNICIDADE PROATIVA ---
        cursor = conn.cursor(dictionary=True)
        
        # Query para verificar se o slug já existe em OUTRO post
        check_slug_query = "SELECT id FROM posts WHERE slug = %s AND id != %s"
        cursor.execute(check_slug_query, (slug_limpo, post_id if post_id else 0))
        
        slug_final = slug_limpo
        if cursor.fetchone():
            # Se encontrou, o slug já está em uso. Chame sua função!
            slug_final = generate_unique_slug(conn, slug_limpo)
            flash(f"O slug '{slug_limpo}' já estava em uso e foi ajustado para '{slug_final}'.", 'warning')
        
        # Agora, use 'slug_final' para o INSERT ou UPDATE
        if post_id:
            # UPDATE
            query = """UPDATE posts SET titulo=%s, slug=%s, ... WHERE id=%s"""
            # Certifique-se de passar 'slug_final' aqui
            cursor.execute(query, (titulo, slug_final, ..., post_id))
        else:
            # INSERT
            query = """INSERT INTO posts (titulo, slug, ...) VALUES (%s, %s, ...)"""
            # E aqui também
            cursor.execute(query, (titulo, slug_final, ...))
            post_id = cursor.lastrowid
        
        # ... (resto da lógica para salvar tags, commit, etc.)
        
    except mysql.connector.Error as err:
        # ... (tratamento de outros erros)