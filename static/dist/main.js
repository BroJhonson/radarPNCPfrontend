(() => {
  // src/js/modules/global.js
  function debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  function setupGlobalFeatures() {
    console.log("Configurando funcionalidades globais...");
    const templateFeedback = document.getElementById("template-painel-feedback");
    const placeholderDesktop = document.getElementById("feedback-placeholder-desktop");
    const placeholderMobile = document.getElementById("feedback-placeholder-mobile");
    const mobileMenuButton = document.getElementById("mobileMenuButton");
    if (templateFeedback && placeholderDesktop && placeholderMobile) {
      const cloneFeedbackContent = () => {
        placeholderDesktop.innerHTML = "";
        placeholderMobile.innerHTML = "";
        return templateFeedback.content.cloneNode(true);
      };
      const positionFeedbackPanel = () => {
        const feedbackContent = cloneFeedbackContent();
        if (window.innerWidth >= 992) {
          placeholderDesktop.appendChild(feedbackContent);
        } else {
          placeholderMobile.appendChild(feedbackContent);
        }
      };
      positionFeedbackPanel();
      window.addEventListener("resize", debounce(positionFeedbackPanel, 200));
    }
    if (mobileMenuButton) {
      const offcanvasElements = document.querySelectorAll(".offcanvas");
      const mobileMenuDropdown = mobileMenuButton.closest(".dropdown");
      offcanvasElements.forEach((offcanvasEl) => {
        offcanvasEl.addEventListener("show.bs.offcanvas", () => {
          if (mobileMenuDropdown) mobileMenuDropdown.style.zIndex = "1040";
        });
        offcanvasEl.addEventListener("hidden.bs.offcanvas", () => {
          if (mobileMenuDropdown) mobileMenuDropdown.style.zIndex = "";
        });
      });
    }
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    const btnVoltarAoTopo = document.getElementById("btnVoltarAoTopo");
    if (btnVoltarAoTopo) {
      btnVoltarAoTopo.addEventListener("click", scrollToTop);
      window.onscroll = function() {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
          btnVoltarAoTopo.classList.add("show");
        } else {
          btnVoltarAoTopo.classList.remove("show");
        }
      };
    }
    const COOKIE_CONSENT_KEY = "radarPncpCookieConsent";
    const banner = document.getElementById("cookieConsentBanner");
    const btnAceitar = document.getElementById("btnAceitarCookies");
    if (!localStorage.getItem(COOKIE_CONSENT_KEY) && banner) {
      setTimeout(() => banner.classList.add("show"), 500);
    }
    if (btnAceitar) {
      btnAceitar.addEventListener("click", () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ accepted: true, timestamp: (/* @__PURE__ */ new Date()).toISOString() }));
        if (banner) banner.classList.remove("show");
      });
    }
    function ajustarLogoPorPagina() {
      const logoDesktop = document.getElementById("logoDesktop");
      const logoBuscaLicitacoes = document.getElementById("logoBuscaLicitacoes");
      const logoMobile = document.getElementById("logoMobile");
      const logoBuscaLicitacoesMobile = document.getElementById("logoBuscaLicitacoesMobile");
      if (!logoDesktop || !logoBuscaLicitacoes || !logoMobile || !logoBuscaLicitacoesMobile) return;
      if (document.body.classList.contains("page-busca-licitacoes")) {
        logoDesktop.style.display = "none";
        logoBuscaLicitacoes.style.display = "inline-block";
        logoMobile.style.display = "none";
        logoBuscaLicitacoesMobile.style.display = "inline-block";
      } else {
        logoDesktop.style.display = "inline-block";
        logoBuscaLicitacoes.style.display = "none";
        logoMobile.style.display = "inline-block";
        logoBuscaLicitacoesMobile.style.display = "none";
      }
    }
    ajustarLogoPorPagina();
    if (document.body.classList.contains("page-home")) {
      let handleMouseOver = function() {
        accordionCards.forEach((c) => c.classList.remove("active"));
        this.classList.add("active");
      }, handleClick = function() {
        const isAlreadyActive = this.classList.contains("active");
        accordionCards.forEach((c) => c.classList.remove("active"));
        if (!isAlreadyActive) {
          this.classList.add("active");
        }
      };
      console.log("L\xF3gica da Home Page (acorde\xE3o) iniciada.");
      const accordionCards = document.querySelectorAll(".accordion-card");
      const isMobile = () => window.innerWidth <= 767;
      const setupAccordionListeners = () => {
        accordionCards.forEach((card) => {
          card.removeEventListener("mouseover", handleMouseOver);
          card.removeEventListener("click", handleClick);
        });
        if (isMobile()) {
          accordionCards.forEach((card) => card.addEventListener("click", handleClick));
        } else {
          accordionCards.forEach((card) => card.addEventListener("mouseover", handleMouseOver));
        }
      };
      setupAccordionListeners();
      window.addEventListener("resize", debounce(setupAccordionListeners, 250));
    }
  }

  // src/js/modules/favorites.js
  var FAVORITOS_KEY = "radarPncpFavoritos";
  function getFavoritos() {
    const favoritosJson = localStorage.getItem(FAVORITOS_KEY);
    try {
      return favoritosJson ? JSON.parse(favoritosJson) : [];
    } catch (e) {
      console.error("Erro ao parsear favoritos do localStorage:", e);
      localStorage.removeItem(FAVORITOS_KEY);
      return [];
    }
  }
  function adicionarFavorito(pncpId) {
    if (!pncpId) return false;
    let favoritos = getFavoritos();
    if (!favoritos.includes(pncpId)) {
      favoritos.push(pncpId);
      localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
      console.log("Adicionado aos favoritos:", pncpId);
      return true;
    }
    return false;
  }
  function removerFavorito(pncpId) {
    if (!pncpId) return false;
    let favoritos = getFavoritos();
    const index = favoritos.indexOf(pncpId);
    if (index > -1) {
      favoritos.splice(index, 1);
      localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
      console.log("Removido dos favoritos:", pncpId);
      return true;
    }
    return false;
  }
  function isFavorito(pncpId) {
    if (!pncpId) return false;
    return getFavoritos().includes(pncpId);
  }

  // src/js/config.js
  var isProduction = false;
  var API_BASE_URL_PROD = "https://api.seusite.com";
  var API_BASE_URL_DEV = "http://localhost:5000";
  var API_BASE_URL = isProduction ? API_BASE_URL_PROD : API_BASE_URL_DEV;
  console.log(`[Config] Ambiente: ${isProduction ? "Produ\xE7\xE3o" : "Desenvolvimento"}. API URL: ${API_BASE_URL}`);

  // src/js/pages/radar.js
  function initRadarPage() {
    console.log("P\xE1gina Radar: Inicializando funcionalidades...");
    const filtrosAtivosContainer = document.getElementById("filtrosAtivosContainer");
    const filtrosAtivosTexto = document.getElementById("filtrosAtivosTexto");
    const linkLimparFiltrosRapido = document.getElementById("linkLimparFiltrosRapido");
    const ufsContainer = document.getElementById("ufsContainerDropdown");
    const municipiosHelp = document.getElementById("municipiosHelp");
    const modalidadesContainer = document.getElementById("modalidadesContainerDropdown");
    const statusContainer = document.getElementById("statusContainer");
    const statusWarning = document.getElementById("statusWarning");
    const dataPubInicioInput = document.getElementById("dataPubInicio");
    const dataPubFimInput = document.getElementById("dataPubFim");
    const dataAtualizacaoInicioInput = document.getElementById("dataAtualizacaoInicio");
    const dataAtualizacaoFimInput = document.getElementById("dataAtualizacaoFim");
    const valorMinInput = document.getElementById("valorMin");
    const valorMaxInput = document.getElementById("valorMax");
    const btnBuscarLicitacoes = document.getElementById("btnBuscarLicitacoes");
    const btnLimparFiltros = document.getElementById("btnLimparFiltros");
    const licitacoesTableBody = document.getElementById("licitacoesTableBody");
    const paginationControls = document.getElementById("paginationControls");
    const totalRegistrosInfo = document.getElementById("totalRegistrosInfo");
    const exibicaoInfo = document.getElementById("exibicaoInfo");
    const ordenarPorSelect = document.getElementById("ordenarPor");
    const itensPorPaginaSelect = document.getElementById("itensPorPagina");
    const palavraChaveInclusaoInputField = document.getElementById("palavraChaveInclusaoInput");
    const tagsPalavraInclusaoContainer = document.getElementById("tagsPalavraInclusaoContainer");
    const palavraChaveExclusaoInputField = document.getElementById("palavraChaveExclusaoInput");
    const tagsPalavraExclusaoContainer = document.getElementById("tagsPalavraExclusaoContainer");
    const loadingOverlay = document.getElementById("loadingOverlay");
    const listaFavoritosSidebar = document.getElementById("lista-favoritos-sidebar");
    const detailsPanelElement = document.getElementById("detailsPanel");
    const offcanvasFiltrosBody = document.getElementById("offcanvasFiltrosBody");
    let palavrasChaveInclusao = [];
    let palavrasChaveExclusao = [];
    let currentPage = 1;
    let cacheLicitacoesSidebar = {};
    const ufsLista = [
      { sigla: "AC", nome: "Acre" },
      { sigla: "AL", nome: "Alagoas" },
      { sigla: "AP", nome: "Amap\xE1" },
      { sigla: "AM", nome: "Amazonas" },
      { sigla: "BA", nome: "Bahia" },
      { sigla: "CE", nome: "Cear\xE1" },
      { sigla: "DF", nome: "Distrito Federal" },
      { sigla: "ES", nome: "Esp\xEDrito Santo" },
      { sigla: "GO", nome: "Goi\xE1s" },
      { sigla: "MA", nome: "Maranh\xE3o" },
      { sigla: "MT", nome: "Mato Grosso" },
      { sigla: "MS", nome: "Mato Grosso do Sul" },
      { sigla: "MG", nome: "Minas Gerais" },
      { sigla: "PA", nome: "Par\xE1" },
      { sigla: "PB", nome: "Para\xEDba" },
      { sigla: "PR", nome: "Paran\xE1" },
      { sigla: "PE", nome: "Pernambuco" },
      { sigla: "PI", nome: "Piau\xED" },
      { sigla: "RJ", nome: "Rio de Janeiro" },
      { sigla: "RN", nome: "Rio Grande do Norte" },
      { sigla: "RS", nome: "Rio Grande do Sul" },
      { sigla: "RO", nome: "Rond\xF4nia" },
      { sigla: "RR", nome: "Roraima" },
      { sigla: "SC", nome: "Santa Catarina" },
      { sigla: "SP", nome: "S\xE3o Paulo" },
      { sigla: "SE", nome: "Sergipe" },
      { sigla: "TO", nome: "Tocantins" }
    ];
    const FILTROS_KEY = "radarPncpUltimosFiltros";
    const COLLAPSE_KEY = "radarPncpCollapseState";
    const formatDateTime = (dateTimeString) => {
      if (!dateTimeString) return "N/I";
      try {
        if (dateTimeString.includes("T")) {
          const dateObj = new Date(dateTimeString);
          if (isNaN(dateObj.getTime())) return "Data/Hora Inv\xE1lida";
          return dateObj.toLocaleString("pt-BR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
          });
        } else {
          const dateObj = /* @__PURE__ */ new Date(dateTimeString + "T00:00:00");
          if (isNaN(dateObj.getTime())) return "Data Inv\xE1lida";
          return dateObj.toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
          });
        }
      } catch (e) {
        console.error("Erro ao formatar data e hora:", dateTimeString, e);
        return "Formato Inv\xE1lido";
      }
    };
    if (linkLimparFiltrosRapido) {
      linkLimparFiltrosRapido.addEventListener("click", function(e) {
        e.preventDefault();
        limparFiltros();
      });
    }
    const btnExportarCsv = document.getElementById("btnExportarCsv");
    if (btnExportarCsv) {
      btnExportarCsv.addEventListener("click", function() {
        const params = new URLSearchParams();
        if (palavrasChaveInclusao.length > 0) {
          palavrasChaveInclusao.forEach((p) => params.append("palavraChave", p));
        }
        if (palavrasChaveExclusao.length > 0) {
          palavrasChaveExclusao.forEach((p) => params.append("excluirPalavra", p));
        }
        document.querySelectorAll(".filter-uf:checked").forEach((cb) => params.append("uf", cb.value));
        document.querySelectorAll(".filter-modalidade:checked").forEach((cb) => params.append("modalidadeId", cb.value));
        const statusSelecionado = document.querySelector(".filter-status:checked");
        if (statusSelecionado) {
          params.append("statusRadar", statusSelecionado.value);
        }
        document.querySelectorAll("#municipiosContainerDropdown .filter-municipio:checked").forEach((cb) => params.append("municipioNome", cb.value));
        if (dataPubInicioInput.value) params.append("dataPubInicio", dataPubInicioInput.value);
        if (dataPubFimInput.value) params.append("dataPubFim", dataPubFimInput.value);
        if (dataAtualizacaoInicioInput.value) params.append("dataAtualizacaoInicio", dataAtualizacaoInicioInput.value);
        if (dataAtualizacaoFimInput.value) params.append("dataAtualizacaoFim", dataAtualizacaoFimInput.value);
        if (valorMinInput.value) params.append("valorMin", valorMinInput.value);
        if (valorMaxInput.value) params.append("valorMax", valorMaxInput.value);
        const [orderByField, orderDirValue] = ordenarPorSelect.value.split("_");
        params.append("orderBy", orderByField);
        params.append("orderDir", orderDirValue.toUpperCase());
        console.log("Exportando com os seguintes par\xE2metros:", params.toString());
        const url = `/api/exportar-csv?${params.toString()}`;
        window.open(url, "_blank");
      });
    }
    if (offcanvasFiltrosBody) {
      offcanvasFiltrosBody.addEventListener("keydown", function(event) {
        if ((event.key === "Enter" || event.key === "NumpadEnter") && (event.ctrlKey || event.metaKey)) {
          console.log("Ctrl+Enter pressionado, aplicando filtros...");
          event.preventDefault();
          buscarLicitacoes(1);
          const offcanvasFiltrosElement = document.getElementById("offcanvasFiltros");
          if (offcanvasFiltrosElement) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasFiltrosElement);
            if (bsOffcanvas) {
              bsOffcanvas.hide();
            }
          }
        }
      });
      offcanvasFiltrosBody.addEventListener("click", function(event) {
        if (event.target.classList.contains("btn-limpar-grupo")) {
          const tipoLimpeza = event.target.dataset.limpar;
          console.log(`[DEBUG] \u{1F5B1}\uFE0F Clique no 'X' do GRUPO '${tipoLimpeza}'`);
          let estadoAlterado = false;
          switch (tipoLimpeza) {
            case "status":
              const defaultStatus = document.querySelector('.filter-status[value="A Receber/Recebendo Proposta"]');
              if (defaultStatus) defaultStatus.checked = true;
              break;
            case "modalidades":
              document.querySelectorAll("#modalidadesContainerDropdown .filter-modalidade:checked").forEach((cb) => cb.checked = false);
              updateModalidadeSelectedCount();
              break;
            case "inclusao":
              if (palavrasChaveInclusao.length > 0) {
                palavrasChaveInclusao = [];
                renderTags(palavrasChaveInclusao, tagsPalavraInclusaoContainer, "inclusao");
                estadoAlterado = true;
              }
              break;
            case "exclusao":
              if (palavrasChaveExclusao.length > 0) {
                palavrasChaveExclusao = [];
                renderTags(palavrasChaveExclusao, tagsPalavraExclusaoContainer, "exclusao");
                estadoAlterado = true;
              }
              break;
            case "localizacao":
              document.querySelectorAll("#ufsContainerDropdown .filter-uf:checked").forEach((cb) => cb.checked = false);
              handleUFChange();
              break;
            case "avancado":
              if (dataPubInicioInput) dataPubInicioInput.value = "";
              if (dataPubFimInput) dataPubFimInput.value = "";
              if (dataAtualizacaoInicioInput) dataAtualizacaoInicioInput.value = "";
              if (dataAtualizacaoFimInput) dataAtualizacaoFimInput.value = "";
              if (valorMinInput) valorMinInput.value = "";
              if (valorMaxInput) valorMaxInput.value = "";
              break;
          }
          if (estadoAlterado) {
            salvarFiltrosAtuais(true);
          }
        }
      });
    }
    function renderTags(palavrasArray, containerElement, tipo) {
      console.log(`[DEBUG] \u{1F3A8} RENDERIZANDO TAGS para '${tipo}'. Dados:`, JSON.stringify(palavrasArray));
      if (!containerElement) return;
      containerElement.innerHTML = "";
      palavrasArray.forEach((palavra, index) => {
        const tag = document.createElement("span");
        tag.classList.add("tag-item");
        tag.textContent = palavra;
        const removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-tag");
        removeBtn.innerHTML = "\xD7";
        removeBtn.title = "Remover palavra";
        removeBtn.type = "button";
        removeBtn.addEventListener("click", () => {
          if (tipo === "inclusao") {
            palavrasChaveInclusao.splice(index, 1);
            renderTags(palavrasChaveInclusao, tagsPalavraInclusaoContainer, "inclusao");
          } else if (tipo === "exclusao") {
            palavrasChaveExclusao.splice(index, 1);
            renderTags(palavrasChaveExclusao, tagsPalavraExclusaoContainer, "exclusao");
          }
          salvarFiltrosAtuais();
        });
        tag.appendChild(removeBtn);
        containerElement.appendChild(tag);
      });
    }
    function addPalavraChave(inputField, palavrasArray, containerElement, tipo) {
      console.log(`[DEBUG] \u{1F4E5} Adicionando palavra-chave para '${tipo}'...`);
      if (!inputField) return;
      const termos = inputField.value.trim();
      if (termos) {
        const novasPalavras = termos.split(/[,;]+/).map((p) => p.trim()).filter((p) => p !== "" && p.length > 0);
        let adicionouAlguma = false;
        novasPalavras.forEach((novaPalavra) => {
          if (!palavrasArray.includes(novaPalavra)) {
            palavrasArray.push(novaPalavra);
            adicionouAlguma = true;
          }
        });
        inputField.value = "";
        if (adicionouAlguma) {
          renderTags(palavrasArray, containerElement, tipo);
          salvarFiltrosAtuais();
        }
      }
    }
    function configurarInputDeTags(inputField, containerElement, tipo) {
      if (!inputField) return;
      inputField.addEventListener("keyup", function(e) {
        if (e.key === "Enter" || e.key === "NumpadEnter" || e.keyCode === 13) {
          e.preventDefault();
          if (tipo === "inclusao") {
            addPalavraChave(inputField, palavrasChaveInclusao, containerElement, tipo);
          } else if (tipo === "exclusao") {
            addPalavraChave(inputField, palavrasChaveExclusao, containerElement, tipo);
          }
        }
      });
      inputField.addEventListener("input", function(e) {
        const valorAtual = inputField.value;
        if (valorAtual.endsWith(",") || valorAtual.endsWith(";")) {
          inputField.value = valorAtual.slice(0, -1);
          if (tipo === "inclusao") {
            addPalavraChave(inputField, palavrasChaveInclusao, containerElement, tipo);
          } else if (tipo === "exclusao") {
            addPalavraChave(inputField, palavrasChaveExclusao, containerElement, tipo);
          }
        }
      });
    }
    function atualizarExibicaoFiltrosAtivos() {
      if (!filtrosAtivosContainer || !filtrosAtivosTexto) return;
      let filtrosAplicados = [];
      if (palavrasChaveInclusao.length > 0) {
        filtrosAplicados.push(`Buscar: ${palavrasChaveInclusao.map((p) => `<span class="badge bg-primary">${p}</span>`).join(" ")}`);
      }
      if (palavrasChaveExclusao.length > 0) {
        filtrosAplicados.push(`Excluir: ${palavrasChaveExclusao.map((p) => `<span class="badge bg-danger">${p}</span>`).join(" ")}`);
      }
      const ufsSelecionadas = Array.from(document.querySelectorAll("#ufsContainerDropdown .filter-uf:checked")).map((cb) => cb.value);
      if (ufsSelecionadas.length > 0) {
        filtrosAplicados.push(`UF: ${ufsSelecionadas.map((uf) => `<span class="badge bg-secondary">${uf}</span>`).join(" ")}`);
      }
      const municipiosSelecionados = Array.from(document.querySelectorAll("#municipiosContainerDropdown .filter-municipio:checked")).map((cb) => cb.value);
      if (municipiosSelecionados.length > 0) {
        filtrosAplicados.push(`Munic\xEDpio: ${municipiosSelecionados.map((m) => `<span class="badge bg-info text-dark">${m}</span>`).join(" ")}`);
      }
      const modalidadesSelecionadas = Array.from(document.querySelectorAll("#modalidadesContainerDropdown .filter-modalidade:checked")).map((cb) => {
        const label = document.querySelector(`label[for="${cb.id}"]`);
        return label ? label.textContent : cb.value;
      });
      if (modalidadesSelecionadas.length > 0) {
        filtrosAplicados.push(`Modalidade: ${modalidadesSelecionadas.map((m) => `<span class="badge bg-warning text-dark">${m}</span>`).join(" ")}`);
      }
      const statusSelecionadoRadio = document.querySelector(".filter-status:checked");
      if (statusSelecionadoRadio && statusSelecionadoRadio.value) {
        const labelStatus = document.querySelector(`label[for="${statusSelecionadoRadio.id}"]`);
        filtrosAplicados.push(`Status: <span class="badge bg-success">${labelStatus ? labelStatus.textContent : statusSelecionadoRadio.value}</span>`);
      } else if (statusSelecionadoRadio && statusSelecionadoRadio.value === "") {
        filtrosAplicados.push(`Status: <span class="badge bg-dark">Todos</span>`);
      }
      if (dataPubInicioInput.value || dataPubFimInput.value) {
        let strDataPub = "Data Pub.: ";
        if (dataPubInicioInput.value) strDataPub += `de ${(/* @__PURE__ */ new Date(dataPubInicioInput.value + "T00:00:00")).toLocaleDateString("pt-BR")} `;
        if (dataPubFimInput.value) strDataPub += `at\xE9 ${(/* @__PURE__ */ new Date(dataPubFimInput.value + "T00:00:00")).toLocaleDateString("pt-BR")}`;
        filtrosAplicados.push(`<span class="badge bg-light text-dark border">${strDataPub.trim()}</span>`);
      }
      if (dataAtualizacaoInicioInput && dataAtualizacaoFimInput && (dataAtualizacaoInicioInput.value || dataAtualizacaoFimInput.value)) {
        let strDataAtual = "Data Atual.: ";
        if (dataAtualizacaoInicioInput.value) strDataAtual += `de ${(/* @__PURE__ */ new Date(dataAtualizacaoInicioInput.value + "T00:00:00")).toLocaleDateString("pt-BR")} `;
        if (dataAtualizacaoFimInput.value) strDataAtual += `at\xE9 ${(/* @__PURE__ */ new Date(dataAtualizacaoFimInput.value + "T00:00:00")).toLocaleDateString("pt-BR")}`;
        filtrosAplicados.push(`<span class="badge bg-light text-dark border">${strDataAtual.trim()}</span>`);
      }
      if (valorMinInput.value || valorMaxInput.value) {
        let strValor = "Valor: ";
        if (valorMinInput.value) strValor += `min R$ ${valorMinInput.value} `;
        if (valorMaxInput.value) strValor += `max R$ ${valorMaxInput.value}`;
        filtrosAplicados.push(`<span class="badge bg-light text-dark border">${strValor.trim()}</span>`);
      }
      if (filtrosAplicados.length > 0) {
        filtrosAtivosTexto.innerHTML = filtrosAplicados.join(" \u2022 ");
        filtrosAtivosContainer.style.display = "block";
      } else {
        filtrosAtivosTexto.innerHTML = "Nenhum filtro aplicado.";
      }
    }
    function updateUFSelectedCount() {
      const count = document.querySelectorAll("#ufsContainerDropdown .filter-uf:checked").length;
      const badge = document.getElementById("ufSelectedCount");
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? "" : "none";
      }
    }
    function updateModalidadeSelectedCount() {
      const count = document.querySelectorAll("#modalidadesContainerDropdown .filter-modalidade:checked").length;
      const badge = document.getElementById("modalidadesSelectedCount");
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? "inline-block" : "none";
      }
    }
    function updateMunicipioSelectedCount() {
      const count = document.querySelectorAll("#municipiosContainerDropdown .filter-municipio:checked").length;
      const badge = document.getElementById("municipiosSelectedCount");
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? "inline-block" : "none";
        if (count === 0) badge.textContent = "0";
      }
    }
    function setupFilterSearch(inputId, containerId, itemSelector) {
      const searchInput = document.getElementById(inputId);
      const container = document.getElementById(containerId);
      if (!searchInput || !container) {
        return;
      }
      searchInput.addEventListener("input", function() {
        const searchTerm = searchInput.value.toLowerCase();
        const items = container.querySelectorAll(itemSelector);
        items.forEach((item) => {
          const label = item.querySelector("label");
          if (label) {
            const itemText = label.textContent.toLowerCase();
            if (itemText.includes(searchTerm)) {
              item.style.display = "block";
            } else {
              item.style.display = "none";
            }
          }
        });
      });
      container.addEventListener("click", function(event) {
        if (event.target.matches(".form-check-input")) {
          searchInput.value = "";
          const items = container.querySelectorAll(itemSelector);
          items.forEach((item) => {
            item.style.display = "block";
          });
        }
      });
    }
    function salvarFiltrosAtuais() {
      console.log("[DEBUG] \u{1F4BE} SALVANDO FILTROS no localStorage...");
      const filtros = {
        palavrasChaveInclusao,
        palavrasChaveExclusao,
        status: document.querySelector(".filter-status:checked")?.value || "A Receber/Recebendo Proposta",
        ufs: Array.from(document.querySelectorAll("#ufsContainerDropdown .filter-uf:checked")).map((cb) => cb.value),
        municipios: Array.from(document.querySelectorAll("#municipiosContainerDropdown .filter-municipio:checked")).map((cb) => cb.value),
        modalidades: Array.from(document.querySelectorAll("#modalidadesContainerDropdown .filter-modalidade:checked")).map((cb) => cb.value),
        dataPubInicio: dataPubInicioInput.value,
        dataPubFim: dataPubFimInput.value,
        dataAtualizacaoInicio: dataAtualizacaoInicioInput.value,
        dataAtualizacaoFim: dataAtualizacaoFimInput.value,
        valorMin: valorMinInput.value,
        valorMax: valorMaxInput.value,
        ordenacao: ordenarPorSelect.value,
        itensPorPagina: itensPorPaginaSelect.value
      };
      localStorage.setItem(FILTROS_KEY, JSON.stringify(filtros));
      console.log("[DEBUG] \u2705 Filtros salvos. Estado atual:", {
        inclusao: palavrasChaveInclusao,
        exclusao: palavrasChaveExclusao
      });
      console.log("[DEBUG] localStorage agora cont\xE9m:", localStorage.getItem(FILTROS_KEY));
    }
    function carregarFiltrosSalvos() {
      console.log("[DEBUG] \u{1F504} CARREGANDO FILTROS do localStorage...");
      const filtrosSalvosJson = localStorage.getItem(FILTROS_KEY);
      if (!filtrosSalvosJson) {
        console.log("Nenhum filtro salvo encontrado.");
        return;
      }
      try {
        const filtros = JSON.parse(filtrosSalvosJson);
        console.log("Carregando filtros salvos:", filtros);
        if (filtros.palavrasChaveInclusao) {
          palavrasChaveInclusao = filtros.palavrasChaveInclusao;
          renderTags(palavrasChaveInclusao, tagsPalavraInclusaoContainer, "inclusao");
        }
        if (filtros.palavrasChaveExclusao) {
          palavrasChaveExclusao = filtros.palavrasChaveExclusao;
          renderTags(palavrasChaveExclusao, tagsPalavraExclusaoContainer, "exclusao");
        }
        if (filtros.status) {
          const radioStatus = document.querySelector(`.filter-status[value="${filtros.status}"]`);
          if (radioStatus) radioStatus.checked = true;
        }
        if (filtros.ufs && filtros.ufs.length > 0) {
          filtros.ufs.forEach((ufSigla) => {
            const checkUf = document.querySelector(`#ufsContainerDropdown .filter-uf[value="${ufSigla}"]`);
            if (checkUf) checkUf.checked = true;
          });
          handleUFChange().then(() => {
            if (filtros.municipios && filtros.municipios.length > 0) {
              filtros.municipios.forEach((munNome) => {
                const checkMun = document.querySelector(`#municipiosContainerDropdown .filter-municipio[value="${munNome}"]`);
                if (checkMun) checkMun.checked = true;
              });
              updateMunicipioSelectedCount();
            }
          });
        }
        if (filtros.modalidades && filtros.modalidades.length > 0) {
          filtros.modalidades.forEach((modId) => {
            const checkMod = document.querySelector(`#modalidadesContainerDropdown .filter-modalidade[value="${modId}"]`);
            if (checkMod) checkMod.checked = true;
          });
          updateModalidadeSelectedCount();
        }
        if (filtros.dataPubInicio) dataPubInicioInput.value = filtros.dataPubInicio;
        if (filtros.dataPubFim) dataPubFimInput.value = filtros.dataPubFim;
        if (filtros.dataAtualizacaoInicio) dataAtualizacaoInicioInput.value = filtros.dataAtualizacaoInicio;
        if (filtros.dataAtualizacaoFim) dataAtualizacaoFimInput.value = filtros.dataAtualizacaoFim;
        if (filtros.valorMin) valorMinInput.value = filtros.valorMin;
        if (filtros.valorMax) valorMaxInput.value = filtros.valorMax;
        if (filtros.ordenacao) ordenarPorSelect.value = filtros.ordenacao;
        if (filtros.itensPorPagina) itensPorPaginaSelect.value = filtros.itensPorPagina;
      } catch (e) {
        console.error("[DEBUG] \u274C Erro ao carregar/parsear filtros:", e);
        localStorage.removeItem(FILTROS_KEY);
      }
    }
    const collapsibles = document.querySelectorAll(".filter-collapsible .collapse");
    collapsibles.forEach((el) => {
      el.addEventListener("shown.bs.collapse", (event) => {
        const state = JSON.parse(localStorage.getItem(COLLAPSE_KEY) || "{}");
        state[event.target.id] = true;
        localStorage.setItem(COLLAPSE_KEY, JSON.stringify(state));
      });
      el.addEventListener("hidden.bs.collapse", (event) => {
        const state = JSON.parse(localStorage.getItem(COLLAPSE_KEY) || "{}");
        state[event.target.id] = false;
        localStorage.setItem(COLLAPSE_KEY, JSON.stringify(state));
      });
    });
    function aplicarEstadoCollapse() {
      const state = JSON.parse(localStorage.getItem(COLLAPSE_KEY) || "{}");
      for (const id in state) {
        if (state[id]) {
          const el = document.getElementById(id);
          if (el) {
            new bootstrap.Collapse(el, {
              toggle: false
            }).show();
          }
        }
      }
    }
    function atualizarBotaoFavoritoUI(buttonElement, pncpId) {
      if (!buttonElement || !pncpId) return;
      const ehFavoritoAgora = isFavorito(pncpId);
      const icon = buttonElement.querySelector("i");
      buttonElement.title = ehFavoritoAgora ? "Desfavoritar" : "Favoritar";
      if (icon) {
        if (ehFavoritoAgora) {
          icon.classList.remove("bi-star");
          icon.classList.add("bi-star-fill");
          if (!buttonElement.classList.contains("btn-link")) {
            buttonElement.classList.remove("btn-outline-warning");
            buttonElement.classList.add("btn-warning", "active");
          } else {
            buttonElement.classList.add("active");
          }
        } else {
          icon.classList.remove("bi-star-fill");
          icon.classList.add("bi-star");
          if (!buttonElement.classList.contains("btn-link")) {
            buttonElement.classList.remove("btn-warning", "active");
            buttonElement.classList.add("btn-outline-warning");
          } else {
            buttonElement.classList.remove("active");
          }
        }
      }
    }
    function handleFavoritarClick(event) {
      const button = event.target.closest(".btn-favoritar");
      if (!button) return;
      const pncpId = button.dataset.pncpId;
      if (!pncpId) return;
      let alterou = false;
      if (isFavorito(pncpId)) {
        alterou = removerFavorito(pncpId);
      } else {
        alterou = adicionarFavorito(pncpId);
      }
      if (alterou) {
        atualizarBotaoFavoritoUI(button, pncpId);
        const btnNaTabela = licitacoesTableBody.querySelector(`.btn-favoritar[data-pncp-id="${pncpId}"]`);
        if (btnNaTabela && btnNaTabela !== button) {
          atualizarBotaoFavoritoUI(btnNaTabela, pncpId);
        }
        const btnNosDetalhes = document.getElementById("detailsPanelFavoriteBtn");
        if (btnNosDetalhes && btnNosDetalhes !== button && btnNosDetalhes.dataset.pncpId === pncpId) {
          atualizarBotaoFavoritoUI(btnNosDetalhes, pncpId);
        }
        renderizarFavoritosSidebar();
      }
    }
    if (licitacoesTableBody) {
      licitacoesTableBody.addEventListener("click", handleFavoritarClick);
    }
    if (detailsPanelElement) {
      detailsPanelElement.addEventListener("click", function(event) {
        const favoriteButton = event.target.closest("#detailsPanelFavoriteBtn");
        if (favoriteButton) {
          handleFavoritarClick(event);
        }
      });
    }
    document.addEventListener("click", function(event) {
      const removeButton = event.target.closest(".btn-remover-fav-sidebar");
      if (removeButton) {
        event.preventDefault();
        event.stopPropagation();
        const pncpId = removeButton.dataset.pncpId;
        if (pncpId) {
          removerFavorito(pncpId);
          renderizarFavoritosSidebar();
          const btnNaTabela = licitacoesTableBody.querySelector(`.btn-favoritar[data-pncp-id="${pncpId}"]`);
          if (btnNaTabela) atualizarBotaoFavoritoUI(btnNaTabela, pncpId);
          const btnNosDetalhes = document.getElementById("detailsPanelFavoriteBtn");
          if (btnNosDetalhes && btnNosDetalhes.dataset.pncpId === pncpId) atualizarBotaoFavoritoUI(btnNosDetalhes, pncpId);
        }
      }
      const linkLicitacao = event.target.closest(".sidebar-fav-link");
      if (linkLicitacao) {
        event.preventDefault();
        const pncpId = linkLicitacao.dataset.pncpId;
        const fakeButton = document.createElement("button");
        fakeButton.dataset.pncpId = pncpId;
        const fakeEvent = {
          currentTarget: fakeButton
        };
        handleDetalhesClick(fakeEvent);
      }
    });
    async function renderizarFavoritosSidebar() {
      const listaSidebar = document.getElementById("lista-favoritos-sidebar");
      const listaOffcanvas = document.getElementById("lista-favoritos-offcanvas");
      if (!listaSidebar && !listaOffcanvas) {
        return;
      }
      const favoritosIds = getFavoritos();
      const msgVazio = '<li class="list-group-item text-muted small">Nenhuma licita\xE7\xE3o favoritada ainda.</li>';
      const msgLoader = '<li class="list-group-item text-muted small"><div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>Carregando...</li>';
      const msgErro = '<li class="list-group-item text-danger small fst-italic">Erro ao carregar dados dos favoritos.</li>';
      if (listaSidebar) listaSidebar.innerHTML = msgLoader;
      if (listaOffcanvas) listaOffcanvas.innerHTML = msgLoader;
      if (favoritosIds.length === 0) {
        if (listaSidebar) listaSidebar.innerHTML = msgVazio;
        if (listaOffcanvas) listaOffcanvas.innerHTML = msgVazio;
        return;
      }
      let contentRendered = false;
      for (const pncpId of favoritosIds) {
        let licData = cacheLicitacoesSidebar[pncpId];
        if (!licData) {
          try {
            const response = await fetch(`${API_BASE_URL}/api/licitacao/${encodeURIComponent(pncpId)}`);
            if (response.ok) {
              const fullData = await response.json();
              if (fullData.licitacao) {
                licData = fullData.licitacao;
                cacheLicitacoesSidebar[pncpId] = licData;
              }
            }
          } catch (error) {
            console.error("Erro ao buscar favorito para sidebar:", error);
          }
        }
        if (licData) {
          if (!contentRendered) {
            if (listaSidebar) listaSidebar.innerHTML = "";
            if (listaOffcanvas) listaOffcanvas.innerHTML = "";
            contentRendered = true;
          }
          const objeto = licData.objetoCompra || licData.numeroControlePNCP;
          const itemHtml = `
                    <li class="list-group-item d-flex justify-content-between align-items-center py-1 px-1" style="font-size: 0.78em;">
                        <a href="#" class="text-decoration-none text-dark flex-grow-1 me-1 sidebar-fav-link" title="${objeto}" data-pncp-id="${pncpId}">
                            ${objeto.length > 45 ? objeto.substring(0, 42) + "..." : objeto}
                        </a>
                        <button class="btn btn-sm btn-outline-danger p-0 px-1 btn-remover-fav-sidebar" title="Remover dos Favoritos" data-pncp-id="${pncpId}">
                            <i class="bi bi-x-lg" style="font-size: 0.7em;"></i>
                        </button>
                    </li>
                `;
          if (listaSidebar) listaSidebar.insertAdjacentHTML("beforeend", itemHtml);
          if (listaOffcanvas) listaOffcanvas.insertAdjacentHTML("beforeend", itemHtml);
        }
      }
      if (!contentRendered && favoritosIds.length > 0) {
        if (listaSidebar) listaSidebar.innerHTML = msgErro;
        if (listaOffcanvas) listaOffcanvas.innerHTML = msgErro;
      }
    }
    async function popularModalidades() {
      if (!modalidadesContainer) return;
      modalidadesContainer.innerHTML = '<small class="text-muted">Carregando modalidades...</small>';
      try {
        const response = await fetch(`${API_BASE_URL}/api/referencias/modalidades`);
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        const modalidadesApi = await response.json();
        modalidadesContainer.innerHTML = "";
        if (modalidadesApi && modalidadesApi.length > 0) {
          modalidadesApi.sort((a, b) => a.modalidadeNome.localeCompare(b.modalidadeNome));
          modalidadesApi.forEach((mod) => {
            const div = document.createElement("div");
            div.classList.add("form-check");
            div.innerHTML = `
                        <input class="form-check-input filter-modalidade" type="checkbox" value="${mod.modalidadeId}" id="mod-${mod.modalidadeId}">
                        <label class="form-check-label" for="mod-${mod.modalidadeId}">${mod.modalidadeNome}</label>
                    `;
            modalidadesContainer.appendChild(div);
            div.querySelector(".filter-modalidade").addEventListener("change", updateModalidadeSelectedCount);
          });
        } else {
          modalidadesContainer.innerHTML = '<small class="text-danger">Nenhuma modalidade encontrada.</small>';
        }
      } catch (error) {
        console.error("Erro ao carregar modalidades:", error);
        modalidadesContainer.innerHTML = `<small class="text-danger">Erro ao carregar modalidades: ${error.message}</small>`;
      }
      updateModalidadeSelectedCount();
    }
    async function popularStatus() {
      if (!statusContainer) return;
      statusContainer.innerHTML = '<small class="text-muted">Carregando status...</small>';
      try {
        const response = await fetch(`${API_BASE_URL}/api/referencias/statusradar`);
        if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
        const statusRadarApi = await response.json();
        statusContainer.innerHTML = "";
        if (statusRadarApi && statusRadarApi.length > 0) {
          const defaultStatusValue = "A Receber/Recebendo Proposta";
          statusRadarApi.sort((a, b) => a.nome.localeCompare(b.nome));
          statusRadarApi.forEach((st) => {
            const div = document.createElement("div");
            div.classList.add("form-check");
            const isChecked = st.id === defaultStatusValue;
            const elementId = `status-radar-${st.id.toLowerCase().replace(/[^a-z0-9-_]/g, "") || "unk"}`;
            div.innerHTML = `
                        <input class="form-check-input filter-status" type="radio" name="statusLicitacao" 
                            value="${st.id}" id="${elementId}" ${isChecked ? "checked" : ""}>
                        <label class="form-check-label" for="${elementId}">${st.nome}</label>
                    `;
            statusContainer.appendChild(div);
          });
          const divTodos = document.createElement("div");
          divTodos.classList.add("form-check");
          const idTodos = "status-radar-todos";
          divTodos.innerHTML = `
                    <input class="form-check-input filter-status" type="radio" name="statusLicitacao" value="" id="${idTodos}">
                    <label class="form-check-label" for="${idTodos}">Todos</label>
                `;
          statusContainer.appendChild(divTodos);
          document.querySelectorAll(".filter-status").forEach((radio) => {
            radio.addEventListener("change", handleStatusChange);
          });
        } else {
          statusContainer.innerHTML = '<small class="text-danger">Nenhum status encontrado.</small>';
        }
      } catch (error) {
        console.error("Erro ao carregar status radar:", error);
        statusContainer.innerHTML = `<small class="text-danger">Erro ao carregar status: ${error.message}</small>`;
      }
    }
    function popularUFs() {
      if (!ufsContainer) return;
      ufsContainer.innerHTML = "";
      ufsLista.forEach((uf) => {
        const div = document.createElement("div");
        div.classList.add("form-check");
        const elementId = `uf-${uf.sigla.toLowerCase().replace(/[^a-z0-9-_]/g, "")}`;
        div.innerHTML = `
                <input class="form-check-input filter-uf" type="checkbox" value="${uf.sigla}" id="${elementId}">
                <label class="form-check-label" for="${elementId}">${uf.nome} (${uf.sigla})</label>
            `;
        ufsContainer.appendChild(div);
      });
      document.querySelectorAll(".filter-uf").forEach((checkbox) => {
        checkbox.addEventListener("change", handleUFChange);
      });
      updateUFSelectedCount();
    }
    async function handleUFChange() {
      updateUFSelectedCount();
      const ufsSelecionadas = Array.from(document.querySelectorAll(".filter-uf:checked")).map((cb) => cb.value);
      const municipiosContainer = document.getElementById("municipiosContainerDropdown");
      const municipiosDropdownButton = document.getElementById("dropdownMunicipiosButton");
      const municipiosHelp2 = document.getElementById("municipiosHelp");
      if (!municipiosContainer || !municipiosDropdownButton) return;
      municipiosDropdownButton.disabled = true;
      municipiosContainer.innerHTML = "";
      if (ufsSelecionadas.length === 0) {
        municipiosContainer.innerHTML = '<small class="text-muted p-2">Selecione uma UF primeiro</small>';
        if (municipiosHelp2) municipiosHelp2.textContent = "Selecione uma ou mais UFs para listar os munic\xEDpios.";
        updateMunicipioSelectedCount();
        return;
      }
      municipiosDropdownButton.disabled = false;
      municipiosContainer.innerHTML = '<div class="p-2 text-muted">Carregando munic\xEDpios...</div>';
      if (municipiosHelp2) municipiosHelp2.textContent = `Carregando munic\xEDpios para ${ufsSelecionadas.join(", ")}...`;
      let todosMunicipios = [];
      let ufsComErro = [];
      for (const uf of ufsSelecionadas) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/ibge/municipios/${uf}`);
          const data = await response.json();
          console.log(`Resposta da API para UF ${uf}:`, data);
          if (!response.ok) {
            ufsComErro.push(uf);
            continue;
          }
          data.forEach((mun) => {
            todosMunicipios.push({
              id: `${uf}-${mun.id}`,
              nome: `${mun.nome} (${uf})`,
              nomeOriginal: mun.nome,
              uf
            });
          });
        } catch (error) {
          console.error(`Erro cr\xEDtico ao carregar munic\xEDpios para ${uf}:`, error);
          ufsComErro.push(uf);
        }
      }
      todosMunicipios.sort((a, b) => a.nome.localeCompare(b.nome));
      municipiosContainer.innerHTML = "";
      if (todosMunicipios.length > 0) {
        todosMunicipios.forEach((mun) => {
          const div = document.createElement("div");
          div.classList.add("form-check", "ms-2");
          const munId = `mun-${mun.id.replace(/[^a-zA-Z0-9]/g, "")}`;
          div.innerHTML = `
                    <input class="form-check-input filter-municipio" type="checkbox" value="${mun.nomeOriginal}" id="${munId}">
                    <label class="form-check-label" for="${munId}">${mun.nome}</label>
                `;
          municipiosContainer.appendChild(div);
        });
        document.querySelectorAll(".filter-municipio").forEach((cb) => {
          cb.addEventListener("change", updateMunicipioSelectedCount);
        });
        if (municipiosHelp2) municipiosHelp2.textContent = `Munic\xEDpios de ${ufsSelecionadas.join(", ")}. Selecione um ou mais.`;
      } else {
        municipiosContainer.innerHTML = '<small class="text-danger p-2">Nenhum munic\xEDpio encontrado.</small>';
        if (municipiosHelp2) municipiosHelp2.textContent = "Nenhum munic\xEDpio encontrado para as UFs selecionadas.";
      }
      if (ufsComErro.length > 0 && municipiosHelp2) {
        municipiosHelp2.textContent += ` (Erro ao carregar de: ${ufsComErro.join(", ")})`;
      }
      updateMunicipioSelectedCount();
    }
    function handleStatusChange(event) {
      const selectedStatus = event.target.value;
      if (selectedStatus === "" || selectedStatus === "Encerrada") {
      }
    }
    async function buscarLicitacoes(page = 1) {
      console.log(`[DEBUG] \u{1F4E1} BUSCANDO LICITA\xC7\xD5ES... P\xE1gina: ${page}`);
      salvarFiltrosAtuais();
      const btnAplicar = document.getElementById("btnBuscarLicitacoes");
      if (btnAplicar) {
        btnAplicar.disabled = true;
        btnAplicar.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Buscando...`;
      }
      currentPage = page;
      const params = new URLSearchParams();
      if (loadingOverlay) loadingOverlay.classList.remove("d-none");
      if (palavrasChaveInclusao.length > 0) {
        palavrasChaveInclusao.forEach((p) => params.append("palavraChave", p));
      }
      if (palavrasChaveExclusao.length > 0) {
        palavrasChaveExclusao.forEach((p) => params.append("excluirPalavra", p));
      }
      document.querySelectorAll(".filter-uf:checked").forEach((cb) => params.append("uf", cb.value));
      document.querySelectorAll(".filter-modalidade:checked").forEach((cb) => params.append("modalidadeId", cb.value));
      const statusSelecionadoRadio = document.querySelector(".filter-status:checked");
      let statusRadarValor = "";
      if (statusSelecionadoRadio) {
        statusRadarValor = statusSelecionadoRadio.value;
      }
      if (statusRadarValor) {
        params.append("statusRadar", statusRadarValor);
      }
      if (statusWarning) statusWarning.classList.add("d-none");
      if ((statusRadarValor === "" || statusRadarValor === "Encerrada") && palavrasChaveInclusao.length === 0) {
        if (statusWarning) {
          statusWarning.textContent = "Palavra-chave de busca \xE9 obrigat\xF3ria para este status.";
          statusWarning.classList.remove("d-none");
        }
        if (licitacoesTableBody) licitacoesTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Forne\xE7a uma palavra-chave para buscar com o status selecionado.</td></tr>`;
        if (totalRegistrosInfo) totalRegistrosInfo.textContent = "0";
        if (exibicaoInfo) exibicaoInfo.textContent = "";
        if (paginationControls) paginationControls.innerHTML = "";
        if (loadingOverlay) loadingOverlay.classList.add("d-none");
        if (btnAplicar) {
          btnAplicar.disabled = false;
          btnAplicar.innerHTML = `<i class="bi bi-search"></i> Aplicar Filtros`;
        }
        return;
      }
      const municipiosSelecionados = Array.from(document.querySelectorAll("#municipiosContainerDropdown .filter-municipio:checked")).map((cb) => cb.value);
      if (municipiosSelecionados.length > 0) {
        municipiosSelecionados.forEach((mun) => params.append("municipioNome", mun));
      }
      const dataInicio = dataPubInicioInput.value;
      if (dataInicio) params.append("dataPubInicio", dataInicio);
      const dataFim = dataPubFimInput.value;
      if (dataFim) params.append("dataPubFim", dataFim);
      if (dataAtualizacaoInicioInput && dataAtualizacaoFimInput) {
        const dataAtualInicio = dataAtualizacaoInicioInput.value;
        if (dataAtualInicio) params.append("dataAtualizacaoInicio", dataAtualInicio);
        const dataAtualFim = dataAtualizacaoFimInput.value;
        if (dataAtualFim) params.append("dataAtualizacaoFim", dataAtualFim);
      }
      const valMin = valorMinInput.value;
      if (valMin) params.append("valorMin", valMin);
      const valMax = valorMaxInput.value;
      if (valMax) params.append("valorMax", valMax);
      params.append("pagina", currentPage);
      params.append("porPagina", itensPorPaginaSelect.value);
      const [orderByField, orderDirValue] = ordenarPorSelect.value.split("_");
      params.append("orderBy", orderByField);
      params.append("orderDir", orderDirValue.toUpperCase());
      licitacoesTableBody.innerHTML = `<tr><td colspan="8" class="text-center">Buscando licita\xE7\xF5es... <div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div></td></tr>`;
      totalRegistrosInfo.textContent = "-";
      exibicaoInfo.textContent = "";
      try {
        console.log("[DEBUG] \u2699\uFE0F Par\xE2metros da API:", params.toString());
        const apiUrl = `${API_BASE_URL}/api/licitacoes?${params.toString()}`;
        console.log("[DEBUG] Chamando API em:", apiUrl);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Erro da API:", response.status, errorData);
          let errorMessage = `Erro ${response.status}`;
          if (response.status === 400 && errorData.erro) {
            errorMessage = `Erro de valida\xE7\xE3o: ${errorData.erro}${errorData.detalhes ? " (" + errorData.detalhes + ")" : ""}`;
          } else if (response.status === 404) {
            errorMessage = "Recurso n\xE3o encontrado no servidor (404).";
          } else if (errorData.erro_backend) {
            errorMessage = `Erro no servidor: ${errorData.erro_backend}`;
          } else if (errorData.erro_frontend) {
            errorMessage = `Erro no servidor do frontend: ${errorData.erro_frontend}`;
          } else if (response.statusText) {
            errorMessage = `Erro ${response.status}: ${response.statusText}`;
          }
          throw new Error(`Erro na API: ${response.status}`);
        }
        const data = await response.json();
        console.log("[DEBUG] \u2705 Dados recebidos da API:", data);
        renderLicitacoesTable(data.licitacoes);
        renderPagination2(data);
        atualizarExibicaoFiltrosAtivos();
        totalRegistrosInfo.textContent = data.total_registros || "0";
        if (data.licitacoes && data.licitacoes.length > 0) {
          const inicio = (data.pagina_atual - 1) * parseInt(data.por_pagina, 10) + 1;
          const fim = inicio + data.licitacoes.length - 1;
          exibicaoInfo.textContent = `Exibindo ${inicio}-${fim} de ${data.total_registros}`;
        } else {
          exibicaoInfo.textContent = "Nenhum resultado";
          if (!data.total_registros || data.total_registros === 0) {
            licitacoesTableBody.innerHTML = `<tr><td colspan="8" class="text-center">Nenhuma licita\xE7\xE3o encontrada para os filtros aplicados.</td></tr>`;
          }
        }
      } catch (error) {
        console.error("[DEBUG] \u{1F4A5} Erro cr\xEDtico ao buscar licita\xE7\xF5es:", error);
        licitacoesTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Erro ao buscar licita\xE7\xF5es: ${error.message}</td></tr>`;
        totalRegistrosInfo.textContent = "0";
        exibicaoInfo.textContent = "Erro";
        paginationControls.innerHTML = "";
      } finally {
        if (loadingOverlay) loadingOverlay.classList.add("d-none");
        if (btnAplicar) {
          btnAplicar.disabled = false;
          btnAplicar.innerHTML = `<i class="bi bi-search"></i> Aplicar Filtros`;
        }
        console.log("[DEBUG] \u{1F3C1} Fim da busca.");
      }
    }
    function renderLicitacoesTable(licitacoes) {
      if (!licitacoesTableBody) return;
      licitacoesTableBody.innerHTML = "";
      if (!licitacoes || licitacoes.length === 0) {
        licitacoesTableBody.innerHTML = `<tr><td colspan="8" class="text-center">Nenhuma licita\xE7\xE3o encontrada para os filtros aplicados.</td></tr>`;
        return;
      }
      if (licitacoes.length > 0) {
        console.log("[DEBUG] Formato do objeto da primeira licita\xE7\xE3o:", licitacoes[0]);
        console.log("[DEBUG] Tipo de 'dataAtualizacao':", typeof licitacoes[0].dataAtualizacao);
      }
      licitacoes.forEach((lic) => {
        const tr = document.createElement("tr");
        const statusBadgeClass = getStatusBadgeClass(lic.situacaoReal);
        const objetoCompleto = lic.objetoCompra || "N/I";
        const objetoCurto = objetoCompleto.substring(0, 100);
        let objetoHtml = objetoCompleto;
        if (objetoCompleto.length > 100) {
          objetoHtml = `<span class="objeto-curto">${objetoCurto}... <a href="#" class="ver-mais-objeto" data-objeto-completo="${lic.id}">Ver mais</a></span>
                            <span class="objeto-completo d-none">${objetoCompleto} <a href="#" class="ver-menos-objeto" data-objeto-completo="${lic.id}">Ver menos</a></span>`;
        }
        let valorEstimadoDisplay = "N/I";
        if (lic.valorTotalEstimado === null) {
          valorEstimadoDisplay = '<span class="text-info fst-italic">Sigiloso</span>';
        } else if (lic.valorTotalEstimado !== void 0 && lic.valorTotalEstimado !== "" && !isNaN(parseFloat(lic.valorTotalEstimado))) {
          valorEstimadoDisplay = `R$ ${parseFloat(lic.valorTotalEstimado).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else if (typeof lic.valorTotalEstimado === "string" && lic.valorTotalEstimado.trim() === "") {
          valorEstimadoDisplay = '<span class="text-info fst-italic">Sigiloso</span>';
        } else if (!lic.valorTotalEstimado && lic.valorTotalEstimado !== 0) {
          valorEstimadoDisplay = '<span class="text-info fst-italic">Sigiloso</span>';
        }
        const ehFavorito = isFavorito(lic.numeroControlePNCP);
        const btnFavoritoHtml = `
                <button class="btn btn-sm ${ehFavorito ? "btn-warning active" : "btn-outline-warning"} btn-favoritar" 
                        title="${ehFavorito ? "Desfavoritar" : "Favoritar"}" data-pncp-id="${lic.numeroControlePNCP}">
                    <i class="bi ${ehFavorito ? "bi-star-fill" : "bi-star"}"></i>
                </button>
            `;
        let dataAtualizacaoDisplay = "N/I";
        if (lic.dataAtualizacao) {
          const dateObj = new Date(lic.dataAtualizacao);
          if (!isNaN(dateObj.getTime())) {
            dataAtualizacaoDisplay = dateObj.toLocaleDateString("pt-BR", { timeZone: "UTC" });
          } else {
            dataAtualizacaoDisplay = "Data Inv\xE1lida";
          }
        }
        tr.innerHTML = `
                <td data-label="Munic\xEDpio/UF" class="align-middle">${lic.unidadeOrgaoMunicipioNome || "N/I"}/${lic.unidadeOrgaoUfSigla || "N/I"}</td>
                <td data-label="Objeto"><div class="objeto-container" data-lic-id="${lic.id}">${objetoHtml}</div></td>
                <td data-label="\xD3rg\xE3o" class="align-middle">${lic.orgaoEntidadeRazaoSocial || "N/I"}</td>
                <td data-label="Status" class="align-middle"><span class="badge ${statusBadgeClass}">${lic.situacaoReal || lic.situacaoCompraNome || "N/I"}</span></td>
                <td data-label="Valor (R$)" class="align-middle">${valorEstimadoDisplay}</td>
                <td data-label="Modalidade" class="align-middle">${lic.modalidadeNome || "N/I"}</td>
                <td data-label="Atualiza\xE7\xE3o" class="align-middle">${dataAtualizacaoDisplay}</td>
                <td data-label="A\xE7\xF5es" class="text-nowrap align-middle">
                    <button class="btn btn-sm btn-info btn-detalhes" title="Mais Detalhes" data-pncp-id="${lic.numeroControlePNCP}"><i class="bi bi-eye-fill"></i></button>                                                
                    ${btnFavoritoHtml}
                </td>
            `;
        licitacoesTableBody.appendChild(tr);
      });
      document.querySelectorAll(".ver-mais-objeto").forEach((link) => {
        link.addEventListener("click", function(e) {
          e.preventDefault();
          const container = this.closest(".objeto-container");
          container.querySelector(".objeto-curto").classList.add("d-none");
          container.querySelector(".objeto-completo").classList.remove("d-none");
        });
      });
      document.querySelectorAll(".ver-menos-objeto").forEach((link) => {
        link.addEventListener("click", function(e) {
          e.preventDefault();
          const container = this.closest(".objeto-container");
          container.querySelector(".objeto-completo").classList.add("d-none");
          container.querySelector(".objeto-curto").classList.remove("d-none");
        });
      });
      document.querySelectorAll(".btn-detalhes").forEach((button) => {
        button.addEventListener("click", handleDetalhesClick);
      });
    }
    function getStatusBadgeClass(situacaoReal) {
      if (!situacaoReal) return "bg-secondary";
      const statusLower = situacaoReal.toLowerCase();
      if (statusLower.includes("recebendo") || statusLower.includes("aberta") || statusLower.includes("divulgada")) {
        return "bg-success";
      } else if (statusLower.includes("encerrada") || statusLower.includes("homologada") || statusLower.includes("conclu\xEDda")) {
        return "bg-primary";
      } else if (statusLower.includes("julgamento")) {
        return "bg-warning text-dark";
      } else if (statusLower.includes("suspensa")) {
        return "bg-info text-dark";
      } else if (statusLower.includes("anulada") || statusLower.includes("revogada") || statusLower.includes("cancelada")) {
        return "bg-danger";
      }
      return "bg-secondary";
    }
    function renderPagination2(data) {
      paginationControls.innerHTML = "";
      if (!data || !data.licitacoes || data.total_paginas == null || data.total_paginas <= 1) {
        return;
      }
      const pagina_atual = parseInt(data.pagina_atual, 10);
      const total_paginas = parseInt(data.total_paginas, 10);
      if (isNaN(pagina_atual) || isNaN(total_paginas)) {
        return;
      }
      const prevLi = document.createElement("li");
      prevLi.classList.add("page-item");
      if (pagina_atual === 1) {
        prevLi.classList.add("disabled");
      }
      prevLi.innerHTML = `<a class="page-link" href="#" data-page="${pagina_atual - 1}">Anterior</a>`;
      paginationControls.appendChild(prevLi);
      let startPage = Math.max(1, pagina_atual - 2);
      let endPage = Math.min(total_paginas, pagina_atual + 2);
      const maxPageLinks = 5;
      if (endPage - startPage + 1 < maxPageLinks) {
        if (pagina_atual < maxPageLinks / 2) {
          endPage = Math.min(total_paginas, startPage + maxPageLinks - 1);
        } else if (pagina_atual > total_paginas - maxPageLinks / 2) {
          startPage = Math.max(1, endPage - maxPageLinks + 1);
        } else {
          const diff = Math.floor((maxPageLinks - (endPage - startPage + 1)) / 2);
          startPage = Math.max(1, startPage - diff);
          endPage = Math.min(total_paginas, endPage + (maxPageLinks - (endPage - startPage + 1) - diff));
        }
        if (endPage - startPage + 1 > maxPageLinks) {
          if (startPage === 1) endPage = startPage + maxPageLinks - 1;
          else startPage = endPage - maxPageLinks + 1;
        }
      }
      if (startPage > 1) {
        const firstLi = document.createElement("li");
        firstLi.classList.add("page-item");
        firstLi.innerHTML = `<a class="page-link" href="#" data-page="1">1</a>`;
        paginationControls.appendChild(firstLi);
        if (startPage > 2) {
          const dotsLi = document.createElement("li");
          dotsLi.classList.add("page-item", "disabled");
          dotsLi.innerHTML = `<span class="page-link">...</span>`;
          paginationControls.appendChild(dotsLi);
        }
      }
      for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement("li");
        pageLi.classList.add("page-item");
        if (i === pagina_atual) {
          pageLi.classList.add("active");
        }
        pageLi.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
        paginationControls.appendChild(pageLi);
      }
      if (endPage < total_paginas) {
        if (endPage < total_paginas - 1) {
          const dotsLi = document.createElement("li");
          dotsLi.classList.add("page-item", "disabled");
          dotsLi.innerHTML = `<span class="page-link">...</span>`;
          paginationControls.appendChild(dotsLi);
        }
        const lastLi = document.createElement("li");
        lastLi.classList.add("page-item");
        lastLi.innerHTML = `<a class="page-link" href="#" data-page="${total_paginas}">${total_paginas}</a>`;
        paginationControls.appendChild(lastLi);
      }
      const nextLi = document.createElement("li");
      nextLi.classList.add("page-item");
      if (pagina_atual === total_paginas) {
        nextLi.classList.add("disabled");
      }
      nextLi.innerHTML = `<a class="page-link" href="#" data-page="${pagina_atual + 1}">Pr\xF3xima</a>`;
      paginationControls.appendChild(nextLi);
      paginationControls.querySelectorAll(".page-link").forEach((link) => {
        link.addEventListener("click", function(e) {
          e.preventDefault();
          const parentLi = this.closest(".page-item");
          if (parentLi && (parentLi.classList.contains("disabled") || parentLi.classList.contains("active"))) {
            return;
          }
          const page = parseInt(this.dataset.page);
          if (page && !isNaN(page)) {
            buscarLicitacoes(page);
          }
        });
      });
    }
    function limparFiltros() {
      console.log("[DEBUG] \u{1F5D1}\uFE0F INICIANDO LIMPEZA TOTAL DE FILTROS...");
      if (palavraChaveInclusaoInputField) palavraChaveInclusaoInputField.value = "";
      if (palavraChaveExclusaoInputField) palavraChaveExclusaoInputField.value = "";
      console.log("[DEBUG] Limpando arrays de palavras-chave em mem\xF3ria...");
      palavrasChaveInclusao = [];
      palavrasChaveExclusao = [];
      renderTags(palavrasChaveInclusao, tagsPalavraInclusaoContainer, "inclusao");
      renderTags(palavrasChaveExclusao, tagsPalavraExclusaoContainer, "exclusao");
      document.querySelectorAll("#ufsContainerDropdown .filter-uf:checked").forEach((cb) => cb.checked = false);
      if (typeof updateUFSelectedCount === "function") updateUFSelectedCount();
      handleUFChange();
      document.querySelectorAll("#modalidadesContainerDropdown .filter-modalidade:checked").forEach((cb) => cb.checked = false);
      if (typeof updateModalidadeSelectedCount === "function") updateModalidadeSelectedCount();
      const radiosStatus = document.querySelectorAll(".filter-status");
      let defaultStatusRadio = null;
      const defaultStatusValue = "A Receber/Recebendo Proposta";
      radiosStatus.forEach((radio) => {
        if (radio.value === defaultStatusValue) {
          defaultStatusRadio = radio;
        }
      });
      if (defaultStatusRadio) {
        defaultStatusRadio.checked = true;
      } else if (radiosStatus.length > 0) {
        const primeiroValido = Array.from(radiosStatus).find((r) => r.value !== "");
        if (primeiroValido) primeiroValido.checked = true;
        else if (radiosStatus.length > 0) radiosStatus[0].checked = true;
      }
      statusWarning.classList.add("d-none");
      if (dataPubInicioInput) dataPubInicioInput.value = "";
      if (dataPubFimInput) dataPubFimInput.value = "";
      if (dataAtualizacaoInicioInput) dataAtualizacaoInicioInput.value = "";
      if (dataAtualizacaoFimInput) dataAtualizacaoFimInput.value = "";
      if (valorMinInput) valorMinInput.value = "";
      if (valorMaxInput) valorMaxInput.value = "";
      const advancedCollapse = document.getElementById("collapseAdvanced");
      if (advancedCollapse && advancedCollapse.classList.contains("show")) {
        new bootstrap.Collapse(advancedCollapse).hide();
      }
      console.log("[DEBUG] Chamando salvarFiltrosAtuais() ap\xF3s zerar os arrays...");
      salvarFiltrosAtuais();
      console.log("[DEBUG] Limpeza conclu\xEDda. Acionando nova busca...");
      atualizarExibicaoFiltrosAtivos();
      buscarLicitacoes(1);
    }
    const detailsPanelBody = document.getElementById("detailsPanel");
    const detailsPanel = detailsPanelBody ? new bootstrap.Offcanvas(detailsPanelBody) : null;
    const detailsPanelContent = document.getElementById("detailsPanelContent");
    async function handleDetalhesClick(event) {
      const button = event.currentTarget;
      const pncpId = button.dataset.pncpId;
      if (!pncpId || !detailsPanel) return;
      detailsPanelContent.innerHTML = '<p class="text-center">Carregando detalhes...</p>';
      document.getElementById("detailsPanelItensTableBody").innerHTML = "";
      document.getElementById("detailsPanelItensPagination").innerHTML = "";
      document.getElementById("detailsPanelArquivosList").innerHTML = "";
      detailsPanel.show();
      try {
        const response = await fetch(`${API_BASE_URL}/api/licitacao/${encodeURIComponent(pncpId)}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({
            erro_frontend: "Erro desconhecido na resposta da API de detalhes."
          }));
          throw new Error(errorData.erro_backend || errorData.erro_frontend || `Erro ${response.status}`);
        }
        const data = await response.json();
        console.log("[DEBUG] Dados de DETALHES recebidos para PNCP ID:", pncpId, JSON.parse(JSON.stringify(data)));
        renderDetailsPanelContent(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da licita\xE7\xE3o:", error);
        detailsPanelContent.innerHTML = `<p class="text-center text-danger">Erro ao carregar detalhes: ${error.message}</p>`;
      }
    }
    if (licitacoesTableBody) {
      licitacoesTableBody.addEventListener("click", function(event) {
        const trClicada = event.target.closest("tr");
        if (!trClicada) return;
        if (event.target.closest("a, button")) {
          return;
        }
        const linhaJaSelecionada = licitacoesTableBody.querySelector(".linha-selecionada");
        if (linhaJaSelecionada) {
          linhaJaSelecionada.classList.remove("linha-selecionada");
        }
        trClicada.classList.add("linha-selecionada");
      });
    }
    function renderDetailsPanelContent(data) {
      if (!detailsPanelElement) return;
      if (!data || !data.licitacao) {
        detailsPanelContent.innerHTML = '<p class="text-center text-danger">Dados da licita\xE7\xE3o n\xE3o encontrados.</p>';
        return;
      }
      const lic = data.licitacao;
      const detailsPanelSubtitle = document.getElementById("detailsPanelSubtitle");
      const detailsPanelLabel = document.getElementById("detailsPanelLabel");
      const favoriteIconContainer = document.getElementById("detailsPanelFavoriteIconContainer");
      if (favoriteIconContainer) {
        favoriteIconContainer.innerHTML = "";
        if (lic && lic.numeroControlePNCP) {
          const ehFavorito = isFavorito(lic.numeroControlePNCP);
          const favButton = document.createElement("button");
          favButton.id = "detailsPanelFavoriteBtn";
          favButton.classList.add("btn", "btn-link", "text-warning", "p-0", "btn-favoritar");
          favButton.style.fontSize = "1.5rem";
          favButton.dataset.pncpId = lic.numeroControlePNCP;
          favButton.title = ehFavorito ? "Desfavoritar" : "Favoritar";
          favButton.innerHTML = `<i class="bi ${ehFavorito ? "bi-star-fill" : "bi-star"}"></i>`;
          favoriteIconContainer.appendChild(favButton);
        }
      }
      let tituloPrincipal = `Detalhes: ${lic.numeroControlePNCP || "N/I"}`;
      if (lic.unidadeOrgaoNome) {
        tituloPrincipal = lic.unidadeOrgaoNome;
      } else if (lic.processo) {
        tituloPrincipal = `Processo: ${lic.processo}`;
      }
      if (detailsPanelLabel) {
        detailsPanelLabel.textContent = tituloPrincipal;
      }
      if (detailsPanelSubtitle) {
        if (lic.numeroCompra && lic.anoCompra) {
          detailsPanelSubtitle.textContent = `Edital: ${lic.numeroCompra}/${lic.anoCompra}`;
          detailsPanelSubtitle.style.display = "block";
        } else if (lic.numeroCompra) {
          detailsPanelSubtitle.textContent = `N\xFAmero da Compra: ${lic.numeroCompra}`;
          detailsPanelSubtitle.style.display = "block";
        } else {
          detailsPanelSubtitle.textContent = "";
          detailsPanelSubtitle.style.display = "none";
        }
      }
      const formatDate = (dateString) => {
        if (!dateString) return "N/I";
        const dateObj = /* @__PURE__ */ new Date(dateString + "T00:00:00");
        if (isNaN(dateObj.getTime())) return "Data Inv\xE1lida";
        return dateObj.toLocaleDateString("pt-BR", {
          timeZone: "America/Sao_Paulo"
        });
      };
      let numeroEditalHtml = "";
      if (lic.numeroCompra && lic.anoCompra) {
        numeroEditalHtml = `<p class="mb-1"><strong>Edital:</strong> ${lic.numeroCompra}/${lic.anoCompra}</small></p>`;
      } else if (lic.numeroCompra) {
        numeroEditalHtml = `<p class="mb-0"><strong>N\xFAmero Compra:</strong> ${lic.numeroCompra}</small></p>`;
      }
      let htmlContent = ` 
            <p><strong>N\xFAmero PNCP:</strong> ${lic.numeroControlePNCP || "N/I"}</p>
            ${lic.processo ? `<p><strong>N\xFAmero do Processo:</strong> ${lic.processo}</p>` : ""}     
            <p><strong>Objeto:</strong></p>
            <div class="mb-2" style="white-space: pre-wrap; background-color: #f8f9fa; padding: 10px; border-radius: 5px; max-height: 150px; overflow-y: auto;">${lic.objetoCompra || "N/I"}</div>
            <p><strong>\xD3rg\xE3o:</strong> ${lic.orgaoEntidadeRazaoSocial || "N/I"}</p>
            <p><strong>Unidade Compradora:</strong> ${lic.unidadeOrgaoNome || "N/I"}</p>
            <p><strong>Munic\xEDpio/UF:</strong> ${lic.unidadeOrgaoMunicipioNome || "N/I"}/${lic.unidadeOrgaoUfSigla || "N/I"}</p>
            <p><strong>Modalidade:</strong> ${lic.modalidadeNome || "N/I"}</p>                    
            ${lic.amparoLegalNome ? `<p><strong>Amparo Legal:</strong> ${lic.amparoLegalNome}</p>` : ""}
            ${lic.valorTotalHomologado ? `<p><strong>Valor Total Homologado:</strong> R$ ${parseFloat(lic.valorTotalHomologado).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>` : ""}
            ${lic.modoDisputaNome ? `<p><strong>Modo de Disputa:</strong> ${lic.modoDisputaNome}</p>` : '<p class="text-muted small"><small><strong>Modo de Disputa:</strong> (N\xE3o informado)</small></p>'}
            ${lic.tipolnstrumentoConvocatorioNome ? `<p><strong>Tipo:</strong> ${lic.tipolnstrumentoConvocatorioNome}</p>` : '<p class="text-muted small"><small><strong>Tipo:</strong> (N\xE3o informado)</small></p>'}
            <p><strong>Situa\xE7\xE3o Atual:</strong> <span class="badge ${getStatusBadgeClass(lic.situacaoReal)}">${lic.situacaoReal || "N/I"}</span></p>                
            <p><strong>Data Publica\xE7\xE3o PNCP:</strong> ${formatDate(lic.dataPublicacaoPncp)}</p>                
            <div class="my-2 p-2 border-start border-primary border-3 bg-light-subtle rounded-end">
                <p class="mb-1"><strong>In\xEDcio Recebimento Propostas:</strong> ${formatDateTime(lic.dataAberturaProposta)} (Hor\xE1rio de Bras\xEDlia)</p>
                <p class="mb-0"><strong>Fim Recebimento Propostas:</strong> ${formatDateTime(lic.dataEncerramentoProposta)} (Hor\xE1rio de Bras\xEDlia)</p>
            </div>
            <p><strong>\xDAltima Atualiza\xE7\xE3o:</strong> ${formatDate(lic.dataAtualizacao)}</p>            
            <p><strong>Valor Total Estimado:</strong> ${lic.valorTotalEstimado === null ? '<span class="text-info fst-italic">Sigiloso</span>' : lic.valorTotalEstimado ? `R$ ${parseFloat(lic.valorTotalEstimado).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Sigiloso"}</p>
            <p><strong>Informa\xE7\xE3o Complementar:</strong></p>
            <div style="white-space: pre-wrap; background-color: #f8f9fa; padding: 10px; border-radius: 5px; max-height: 150px; overflow-y: auto;">
                ${lic.informacaoComplementar || "Nenhuma"}
            </div>
        `;
      let justificativaHtml = "";
      if (lic.justificativaPresencial) {
        const textoCompleto = lic.justificativaPresencial;
        const limite = 200;
        if (textoCompleto.length > limite) {
          const textoCurto = textoCompleto.substring(0, limite);
          justificativaHtml = `
                    <p><strong>Justificativa Presencial:</strong></p>
                    <div class="justificativa-container">
                        <span class="justificativa-curta" style="white-space: pre-wrap;">${textoCurto}... <a href="#" class="ver-mais-justificativa">Ver mais</a></span>
                        <span class="justificativa-completa d-none" style="white-space: pre-wrap;">${textoCompleto} <a href="#" class="ver-menos-justificativa">Ver menos</a></span>
                    </div>`;
        } else {
          justificativaHtml = `<p><strong>Justificativa Presencial:</strong></p><div style="white-space: pre-wrap;">${textoCompleto}</div>`;
        }
      }
      htmlContent += justificativaHtml;
      detailsPanelContent.innerHTML = htmlContent;
      const verMaisJust = detailsPanelContent.querySelector(".ver-mais-justificativa");
      if (verMaisJust) {
        verMaisJust.addEventListener("click", function(e) {
          e.preventDefault();
          const container = this.closest(".justificativa-container");
          container.querySelector(".justificativa-curta").classList.add("d-none");
          container.querySelector(".justificativa-completa").classList.remove("d-none");
        });
      }
      const verMenosJust = detailsPanelContent.querySelector(".ver-menos-justificativa");
      if (verMenosJust) {
        verMenosJust.addEventListener("click", function(e) {
          e.preventDefault();
          const container = this.closest(".justificativa-container");
          container.querySelector(".justificativa-completa").classList.add("d-none");
          container.querySelector(".justificativa-curta").classList.remove("d-none");
        });
      }
      const btnPncp = document.getElementById("detailsPanelBtnPncp");
      if (btnPncp) {
        if (lic.link_portal_pncp && lic.link_portal_pncp.trim() !== "") {
          btnPncp.href = lic.link_portal_pncp;
          btnPncp.classList.remove("disabled");
          btnPncp.removeAttribute("aria-disabled");
        } else {
          btnPncp.href = "#";
          btnPncp.classList.add("disabled");
          btnPncp.setAttribute("aria-disabled", "true");
        }
      }
      const btnSistemaOrigem = document.getElementById("detailsPanelBtnSistemaOrigem");
      if (btnSistemaOrigem) {
        if (lic.linkSistemaOrigem && lic.linkSistemaOrigem.trim() !== "") {
          btnSistemaOrigem.disabled = false;
          btnSistemaOrigem.innerHTML = '<i class="bi bi-building"></i> Acessar Sistema de Origem';
          btnSistemaOrigem.onclick = () => {
            window.open(lic.linkSistemaOrigem, "_blank");
          };
        } else {
          btnSistemaOrigem.disabled = true;
          btnSistemaOrigem.innerHTML = '<i class="bi bi-building"></i> Sistema de Origem (N\xE3o dispon\xEDvel)';
          btnSistemaOrigem.onclick = null;
        }
      }
      renderDetailsPanelItens(data.itens || []);
      renderDetailsPanelArquivos(data.arquivos || []);
    }
    let currentDetalhesItens = [];
    let currentDetalhesItensPage = 1;
    const ITENS_POR_PAGINA_DETALHES = 5;
    function renderDetailsPanelItens(itens) {
      currentDetalhesItens = itens;
      currentDetalhesItensPage = 1;
      displayDetalhesItensPage();
    }
    function displayDetalhesItensPage() {
      const tableBody = document.getElementById("detailsPanelItensTableBody");
      const pagination = document.getElementById("detailsPanelItensPagination");
      tableBody.innerHTML = "";
      pagination.innerHTML = "";
      if (!currentDetalhesItens || currentDetalhesItens.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum item encontrado.</td></tr>';
        return;
      }
      const totalPages = Math.ceil(currentDetalhesItens.length / ITENS_POR_PAGINA_DETALHES);
      const startIndex = (currentDetalhesItensPage - 1) * ITENS_POR_PAGINA_DETALHES;
      const endIndex = startIndex + ITENS_POR_PAGINA_DETALHES;
      const pageItens = currentDetalhesItens.slice(startIndex, endIndex);
      pageItens.forEach((item) => {
        const tr = document.createElement("tr");
        let valorUnitarioDisplay = "N/I";
        if (item.valorUnitarioEstimado === null) {
          valorUnitarioDisplay = '<span class="text-info fst-italic">Sigiloso</span>';
        } else if (item.valorUnitarioEstimado !== void 0 && item.valorUnitarioEstimado !== "" && !isNaN(parseFloat(item.valorUnitarioEstimado))) {
          valorUnitarioDisplay = parseFloat(item.valorUnitarioEstimado).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          });
        }
        let valorTotalItemDisplay = "N/I";
        if (item.valorTotal === null) {
          valorTotalItemDisplay = '<span class="text-info fst-italic">Sigiloso</span>';
        } else if (item.valorTotal !== void 0 && item.valorTotal !== "" && !isNaN(parseFloat(item.valorTotal))) {
          valorTotalItemDisplay = parseFloat(item.valorTotal).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
          });
        }
        tr.innerHTML = `
                <td data-label="Item">${item.numeroItem || "N/I"}</td>
                <td data-label="Descri\xE7\xE3o">${item.descricao || "N/I"}</td>
                <td data-label="Qtde." class="text-end">${item.quantidade || "N/I"}</td>
                <td data-label="Un." class="text-center">${item.unidadeMedida || "N/I"}</td>
                <td data-label="Vl. Unit." class="text-end">${valorUnitarioDisplay}</td>
                <td data-label="Vl. Total" class="text-end">${valorTotalItemDisplay}</td>
            `;
        tableBody.appendChild(tr);
      });
      if (totalPages > 1) {
        const prevLi = document.createElement("li");
        prevLi.classList.add("page-item");
        if (currentDetalhesItensPage === 1) {
          prevLi.classList.add("disabled");
        }
        prevLi.innerHTML = `<a class="page-link page-link-sm" href="#">Ant</a>`;
        prevLi.addEventListener("click", (e) => {
          e.preventDefault();
          if (currentDetalhesItensPage > 1) {
            currentDetalhesItensPage--;
            displayDetalhesItensPage();
          }
        });
        pagination.appendChild(prevLi);
        const pageInfo = document.createElement("li");
        pageInfo.classList.add("page-item", "disabled");
        pageInfo.innerHTML = `<span class="page-link page-link-sm">${currentDetalhesItensPage}/${totalPages}</span>`;
        pagination.appendChild(pageInfo);
        const nextLi = document.createElement("li");
        nextLi.classList.add("page-item");
        if (currentDetalhesItensPage === totalPages) {
          nextLi.classList.add("disabled");
        }
        nextLi.innerHTML = `<a class="page-link page-link-sm" href="#">Pr\xF3x</a>`;
        nextLi.addEventListener("click", (e) => {
          e.preventDefault();
          if (currentDetalhesItensPage < totalPages) {
            currentDetalhesItensPage++;
            displayDetalhesItensPage();
          }
        });
        pagination.appendChild(nextLi);
      } else if (totalPages === 1 && currentDetalhesItens.length > 0) {
        const pageInfo = document.createElement("li");
        pageInfo.classList.add("page-item");
        pageInfo.classList.add("disabled");
        pageInfo.innerHTML = `<span class="page-link page-link-sm">${currentDetalhesItensPage} / ${totalPages}</span>`;
        pagination.appendChild(pageInfo);
      }
    }
    function renderDetailsPanelArquivos(arquivos) {
      const listElement = document.getElementById("detailsPanelArquivosList");
      listElement.innerHTML = "";
      if (!arquivos || arquivos.length === 0) {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.textContent = "Nenhum arquivo encontrado.";
        listElement.appendChild(li);
        return;
      }
      arquivos.forEach((arq) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerHTML = `<a href="${arq.link_download}" target="_blank"><i class="bi bi-file-earmark-arrow-down"></i> ${arq.titulo || "Arquivo sem t\xEDtulo"}</a>`;
        listElement.appendChild(li);
      });
    }
    async function inicializarPagina() {
      console.log("[DEBUG] \u{1F3C1} INICIALIZANDO A P\xC1GINA...");
      popularUFs();
      await popularModalidades();
      await popularStatus();
      carregarFiltrosSalvos();
      renderizarFavoritosSidebar();
      buscarLicitacoes(1);
      setupFilterSearch("ufSearchInput", "ufsContainerDropdown", ".form-check");
      setupFilterSearch("modalidadeSearchInput", "modalidadesContainerDropdown", ".form-check");
      setupFilterSearch("municipioSearchInput", "municipiosContainerDropdown", ".form-check");
      configurarInputDeTags(palavraChaveInclusaoInputField, tagsPalavraInclusaoContainer, "inclusao");
      configurarInputDeTags(palavraChaveExclusaoInputField, tagsPalavraExclusaoContainer, "exclusao");
      if (btnBuscarLicitacoes) {
        btnBuscarLicitacoes.addEventListener("click", () => buscarLicitacoes(1));
      }
      if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener("click", limparFiltros);
      }
      if (ordenarPorSelect) {
        ordenarPorSelect.addEventListener("change", () => buscarLicitacoes(currentPage || 1));
      }
      if (itensPorPaginaSelect) {
        itensPorPaginaSelect.addEventListener("change", () => buscarLicitacoes(1));
      }
      const btnAtualizarTabela = document.getElementById("btnAtualizarTabela");
      if (btnAtualizarTabela) {
        btnAtualizarTabela.disabled = false;
        btnAtualizarTabela.addEventListener("click", () => {
          console.log("Bot\xE3o Atualizar Tabela clicado - Refazendo busca para p\xE1gina:", currentPage);
          if (currentPage < 1) currentPage = 1;
          buscarLicitacoes(currentPage);
        });
      }
      console.log("[DEBUG] \u2705 P\xE1gina inicializada e listeners configurados.");
    }
    inicializarPagina();
  }

  // src/js/modules/utils.js
  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // src/js/pages/blog.js
  function createPostCard(post) {
    if (!post.slug) return "";
    const imageUrl = post.imagem_destaque ? post.imagem_destaque.startsWith("http") ? post.imagem_destaque : `./static/images/${post.imagem_destaque}` : "https://i.postimg.cc/XqFpk2fX/grtrtrf564.png";
    function formatDateBR(isoString) {
      if (!isoString) return "--/--/----";
      const [y, m, d] = isoString.slice(0, 10).split("-");
      return `${d}/${m}/${y}`;
    }
    const postDate = formatDateBR(post.data_publicacao);
    const postLink = `/post.html?slug=${post.slug}`;
    return `
        <div class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
            <article class="blog-post-summary-grid w-100">
                <a href="${postLink}" class="text-decoration-none">
                    <img src="${imageUrl}" alt="${post.titulo}" class="img-fluid rounded-top blog-grid-image">
                </a>
                <div class="p-3">
                    <p class="text-muted small mb-1">
                        Categoria: 
                        <a href="/blog.html?categoria=${post.categoria_slug}">
                            ${post.categoria_nome || "Sem categoria"}
                        </a>
                    </p>
                    <h2 class="h5 blog-post-title mb-2">
                        <a href="${postLink}" class="text-decoration-none link-dark">
                            ${decodeHtml(post.titulo)}
                        </a>
                    </h2>
                    <p class="blog-post-meta text-muted small">
                        <i class="bi bi-calendar3"></i> ${postDate}
                    </p>
                </div>
            </article>
        </div>
    `;
  }
  async function loadSidebarData() {
    const categoryList = document.getElementById("category-list");
    const tagCloud = document.getElementById("tag-cloud");
    try {
      const response = await fetch(`${API_BASE_URL}/api/categorias`);
      const data = await response.json();
      if (data.categorias) {
        categoryList.innerHTML = data.categorias.map(
          (cat) => `<li><a href="/blog.html?categoria=${cat.slug}">${cat.nome}</a></li>`
        ).join("");
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      categoryList.innerHTML = "<li>Falha ao carregar.</li>";
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/tags`);
      const data = await response.json();
      if (data.tags) {
        tagCloud.innerHTML = data.tags.map(
          (tag) => `<a href="/blog.html?tag=${tag.nome}" class="tag-item">${tag.nome}</a>`
        ).join(" ");
      }
    } catch (error) {
      console.error("Erro ao carregar tags:", error);
      tagCloud.innerHTML = '<span class="text-danger">Falha ao carregar.</span>';
    }
  }
  function renderPagination(currentPage, totalPages) {
    const container = document.getElementById("pagination-container");
    if (!container) return;
    container.innerHTML = "";
    if (totalPages <= 1) return;
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");
    ul.className = "pagination";
    const createPageItem = (page, text = page, disabled = false, active = false) => {
      const li = document.createElement("li");
      li.className = `page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#" data-page="${page}">${text}</a>`;
      return li;
    };
    ul.appendChild(createPageItem(currentPage - 1, "Anterior", currentPage === 1));
    const pagesToShow = [];
    const range = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || i >= currentPage - range && i <= currentPage + range) {
        pagesToShow.push(i);
      }
    }
    let lastPage = 0;
    for (const pageNum of pagesToShow) {
      if (lastPage + 1 < pageNum) {
        const li = document.createElement("li");
        li.className = "page-item disabled";
        li.innerHTML = `<span class="page-link">...</span>`;
        ul.appendChild(li);
      }
      ul.appendChild(createPageItem(pageNum, pageNum, false, pageNum === currentPage));
      lastPage = pageNum;
    }
    ul.appendChild(createPageItem(currentPage + 1, "Pr\xF3xima", currentPage === totalPages));
    nav.appendChild(ul);
    container.appendChild(nav);
  }
  async function fetchAndDisplayPosts() {
    const postsContainer = document.getElementById("posts-container");
    const loadingIndicator = document.getElementById("loading-posts");
    loadingIndicator.style.display = "block";
    postsContainer.innerHTML = "";
    try {
      const params = new URLSearchParams(window.location.search);
      const categoriaSlug = params.get("categoria");
      const tagNome = params.get("tag");
      const searchTerm = params.get("q");
      const page = params.get("page") || "1";
      let apiUrl = `${API_BASE_URL}/api/posts`;
      const queryParams = [];
      if (categoriaSlug) queryParams.push(`categoria=${categoriaSlug}`);
      if (tagNome) queryParams.push(`tag=${encodeURIComponent(tagNome)}`);
      if (searchTerm) queryParams.push(`q=${encodeURIComponent(searchTerm)}`);
      if (queryParams.length > 0) {
        apiUrl += `?${queryParams.join("&")}`;
      }
      queryParams.push(`page=${page}`);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
      const data = await response.json();
      if (data.posts && data.posts.length > 0) {
        const postsHtml = data.posts.map(createPostCard).join("");
        postsContainer.innerHTML = postsHtml;
        renderPagination(data.pagina_atual, data.total_paginas);
      } else {
        const message = searchTerm ? `Nenhum post encontrado para a busca: "${decodeHtml(searchTerm)}".` : "Nenhum post encontrado.";
        postsContainer.innerHTML = `<p class="text-center">${message}</p>`;
        document.getElementById("pagination-container").innerHTML = "";
      }
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      postsContainer.innerHTML = '<p class="text-center text-danger">Falha ao carregar os posts.</p>';
    } finally {
      loadingIndicator.style.display = "none";
    }
  }
  async function initBlogPage() {
    const postsContainer = document.getElementById("posts-container");
    const loadingIndicator = document.getElementById("loading-posts");
    if (!postsContainer) return;
    loadSidebarData();
    const searchForm = document.getElementById("blog-search-form");
    const searchInput = searchForm.querySelector('input[name="q"]');
    const currentParams = new URLSearchParams(window.location.search);
    if (currentParams.has("q")) {
      searchInput.value = currentParams.get("q");
    }
    searchForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      const url = new URL(window.location);
      url.searchParams.set("q", searchTerm);
      url.searchParams.delete("tag");
      url.searchParams.delete("categoria");
      history.pushState({}, "", url);
      fetchAndDisplayPosts();
    });
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.addEventListener("click", function(event) {
      event.preventDefault();
      const target = event.target;
      if (target.tagName === "A" && target.hasAttribute("data-page")) {
        const page = target.getAttribute("data-page");
        const url = new URL(window.location);
        url.searchParams.set("page", page);
        history.pushState({}, "", url);
        fetchAndDisplayPosts();
        window.scrollTo(0, 0);
      }
    });
    loadingIndicator.style.display = "block";
    postsContainer.innerHTML = "";
    try {
      const params = new URLSearchParams(window.location.search);
      const categoriaSlug = params.get("categoria");
      const tagNome = params.get("tag");
      let apiUrl = `${API_BASE_URL}/api/posts`;
      const queryParams = [];
      if (categoriaSlug) queryParams.push(`categoria=${categoriaSlug}`);
      if (tagNome) queryParams.push(`tag=${encodeURIComponent(tagNome)}`);
      if (queryParams.length > 0) apiUrl += `?${queryParams.join("&")}`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
      const data = await response.json();
      if (data.posts && data.posts.length > 0) {
        const postsHtml = data.posts.map(createPostCard).join("");
        postsContainer.innerHTML = postsHtml;
      } else {
        postsContainer.innerHTML = '<p class="text-center">Nenhum post encontrado.</p>';
      }
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      postsContainer.innerHTML = '<p class="text-center text-danger">Falha ao carregar os posts.</p>';
    } finally {
      loadingIndicator.style.display = "none";
    }
  }

  // src/js/pages/post.js
  async function initPostPage() {
    const titleElement = document.getElementById("post-title");
    const contentElement = document.getElementById("post-content");
    const metaContainer = document.getElementById("post-meta");
    if (!titleElement || !contentElement) return;
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get("slug");
    if (!postSlug) {
      titleElement.textContent = "Post n\xE3o encontrado";
      contentElement.innerHTML = '<p class="text-danger">O link para este post parece estar quebrado.</p>';
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/post/${postSlug}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.erro || "Erro ao buscar o post.");
      }
      const post = data.post;
      document.title = `${decodeHtml(post.titulo)} - Blog RADAR PNCP`;
      titleElement.innerHTML = decodeHtml(post.titulo);
      contentElement.innerHTML = decodeHtml(post.conteudo_completo);
      const postDate = document.getElementById("post-date");
      if (postDate) postDate.textContent = new Date(post.data_publicacao).toLocaleDateString("pt-BR");
      const catElem = document.getElementById("post-category");
      if (catElem) {
        if (post.categoria_nome && post.categoria_slug) {
          catElem.textContent = post.categoria_nome;
          catElem.href = `/blog.html?categoria=${post.categoria_slug}`;
        } else {
          catElem.textContent = "Sem categoria";
          catElem.removeAttribute("href");
        }
      }
      const tagsElem = document.getElementById("post-tags");
      if (tagsElem) {
        tagsElem.innerHTML = "";
        if (post.tags && post.tags.length > 0) {
          post.tags.forEach((tag) => {
            const a = document.createElement("a");
            a.href = `/blog.html?tag=${encodeURIComponent(tag)}`;
            a.textContent = tag;
            a.classList.add("badge", "bg-secondary", "text-decoration-none", "me-1");
            tagsElem.appendChild(a);
          });
        } else {
          tagsElem.textContent = "\u2014";
        }
      }
      const crumb = document.getElementById("breadcrumb-post-title");
      if (crumb) crumb.textContent = decodeHtml(post.titulo);
    } catch (error) {
      console.error("Erro ao carregar post:", error);
      document.title = "Erro - RADAR PNCP";
      titleElement.textContent = "Ocorreu um Erro";
      contentElement.innerHTML = `<p class="text-center text-danger">N\xE3o foi poss\xEDvel carregar o conte\xFAdo do post. Causa: ${error.message}</p>`;
    }
    async function loadSidebar() {
      const categoryList = document.getElementById("category-list");
      const tagCloud = document.getElementById("tag-cloud");
      try {
        const [catsRes, tagsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categorias`),
          fetch(`${API_BASE_URL}/api/tags`)
        ]);
        const catsData = await catsRes.json();
        const tagsData = await tagsRes.json();
        if (categoryList && catsData.categorias) {
          categoryList.innerHTML = catsData.categorias.map((cat) => `<li><a href="/blog.html?categoria=${cat.slug}">${cat.nome}</a></li>`).join("");
        }
        if (tagCloud && tagsData.tags) {
          tagCloud.innerHTML = tagsData.tags.map((tag) => `<a href="/blog.html?tag=${tag.nome}" class="tag-item">${tag.nome}</a>`).join(" ");
        }
      } catch (e) {
        if (categoryList) categoryList.innerHTML = "<li>Falha ao carregar.</li>";
        if (tagCloud) tagCloud.innerHTML = '<span class="text-danger">Falha ao carregar.</span>';
      }
    }
    loadSidebar();
  }

  // src/js/pages/contato.js
  function createAlert(message, type) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    return wrapper;
  }
  function initContatoPage() {
    const form = document.getElementById("formContato");
    const alertPlaceholder = document.getElementById("alert-placeholder");
    const submitButton = form.querySelector('button[type="submit"]');
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const originalButtonText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Enviando...
        `;
      alertPlaceholder.innerHTML = "";
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      try {
        const response = await fetch(`${API_BASE_URL}/api/contato`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.mensagem || "Ocorreu um erro.");
        }
        alertPlaceholder.append(createAlert(result.mensagem, "success"));
        form.reset();
      } catch (error) {
        console.error("Erro ao enviar formul\xE1rio:", error);
        alertPlaceholder.append(createAlert(error.message, "danger"));
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    });
  }

  // src/js/pages/home.js
  function createPostCard2(post) {
    if (!post.slug) return "";
    const imageUrl = post.imagem_destaque ? post.imagem_destaque.startsWith("http") ? post.imagem_destaque : `./static/images/${post.imagem_destaque}` : "https://i.postimg.cc/XqFpk2fX/grtrtrf564.png";
    const postLink = `/post.html?slug=${post.slug}`;
    return `
        <div class="col-md-4 d-flex align-items-stretch">
            <div class="card blog-card h-100 w-100">
                <img src="${imageUrl}" class="card-img-top" alt="${decodeHtml(post.titulo)}}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${decodeHtml(post.titulo)}</h5>
                    <p class="card-text flex-grow-1">${decodeHtml(post.resumo || "")}</p>
                    <a href="${postLink}" class="btn btn-outline-primary mt-auto">Ler mais</a>
                </div>
            </div>
        </div>
    `;
  }
  async function initHomePage() {
    const container = document.getElementById("destaques-blog-container");
    if (!container) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/destaques`);
      const data = await response.json();
      if (data.posts && data.posts.length > 0) {
        const postsHtml = data.posts.map(createPostCard2).join("");
        container.innerHTML = postsHtml;
      } else {
        container.innerHTML = '<p class="text-muted col-12 text-center">Nenhum artigo em destaque encontrado.</p>';
      }
    } catch (error) {
      console.error("Erro ao buscar posts em destaque:", error);
      container.innerHTML = '<p class="text-danger col-12 text-center">N\xE3o foi poss\xEDvel carregar os artigos.</p>';
    }
  }

  // src/js/main.js
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Carregado. Orquestrador JS iniciado.");
    setupGlobalFeatures();
    const bodyClassList = document.body.classList;
    if (bodyClassList.contains("page-home")) {
      initHomePage();
    } else if (bodyClassList.contains("page-busca-licitacoes")) {
      initRadarPage();
    } else if (bodyClassList.contains("page-blog")) {
      initBlogPage();
    } else if (bodyClassList.contains("page-post-individual")) {
      initPostPage();
    } else if (bodyClassList.contains("page-contato")) {
      initContatoPage();
    }
  });
})();
