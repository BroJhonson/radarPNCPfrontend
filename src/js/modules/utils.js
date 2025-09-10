// frontend/src/js/modules/utils.js

/**
 * Decodifica entidades HTML de uma string de forma segura.
 * Ex: Converte '&lt;p&gt;Texto&lt;/p&gt;' para '<p>Texto</p>'.
 * @param {string} html A string contendo entidades HTML.
 * @returns {string} A string com HTML decodificado.
 */
export function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}