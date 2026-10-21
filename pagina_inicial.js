document.addEventListener("DOMContentLoaded", () => {
    const saudacao = document.getElementById('boas-vindas');
    const nomeUsuario = localStorage.getItem('nomeUsuario');

    if (saudacao && nomeUsuario) {
        saudacao.textContent = `Olá, ${nomeUsuario}! 👋`;
    }

    // Mantém a guia da página atual selecionada, independentemente de a navegação
    // usar data-route (páginas novas) ou onclick (páginas legadas).
    const paginaAtual = window.location.pathname.split("/").pop() || "pagina_inicial.html";

    document.querySelectorAll(".nav-item").forEach(botao => {
        const destino = botao.dataset.route || botao.getAttribute("onclick") || "";
        const estaNaPaginaAtual = destino.includes(paginaAtual);

        botao.classList.toggle("is-active", estaNaPaginaAtual);

        if (estaNaPaginaAtual) {
            botao.setAttribute("aria-current", "page");
        } else {
            botao.removeAttribute("aria-current");
        }
    });

    // Mostra a mudança de seleção antes de abrir a próxima página. O listener em
    // captura também cobre os botões antigos que ainda possuem onclick no HTML.
    let navegandoPelaBarra = false;
    document.addEventListener("click", evento => {
        const botao = evento.target.closest(".side-nav .nav-item");
        if (!botao || navegandoPelaBarra) return;

        const destinoLegado = botao.getAttribute("onclick") || "";
        const destino = botao.dataset.route || destinoLegado.match(/['\"]([^'\"]+\.html)['\"]/)?.[1];
        if (!destino) return;

        evento.preventDefault();
        evento.stopImmediatePropagation();
        navegandoPelaBarra = true;

        document.querySelectorAll(".side-nav .nav-item").forEach(item => {
            const selecionado = item === botao;
            item.classList.toggle("is-active", selecionado);
            item.toggleAttribute("aria-current", selecionado);
        });

        window.setTimeout(() => {
            window.location.href = destino;
        }, 180);
    }, true);

    document.querySelectorAll('[data-route]').forEach((element) => {
        element.addEventListener('click', () => {
            window.location.href = element.dataset.route;
        });
    });

    const completed = JSON.parse(localStorage.getItem('smartpath-trail-completed') || '[]').length;
    const percent = Math.round((completed / 8) * 100);
    const ring = document.querySelector('.progress-ring');
    const progressNumber = document.querySelector('.progress-ring strong');
    const trailModule = document.querySelector('.trail-summary p');
    if (ring) ring.style.background = `conic-gradient(var(--blue) 0 ${percent}%, #d9eafa ${percent}% 100%)`;
    if (progressNumber) progressNumber.innerHTML = `${percent}<span>%</span>`;
    if (trailModule) trailModule.textContent = `Módulo ${completed} de 8`;
});


new window.VLibras.Widget('https://vlibras.gov.br/app');


// ==========================================
// SMARTPATH - PÁGINA INICIAL
// ==========================================


// ==========================================
// NAVEGAÇÃO DOS BOTÕES
// ==========================================

document.querySelectorAll("[data-route]").forEach((button) => {

    button.addEventListener("click", () => {

        const route = button.getAttribute("data-route");

        if (route) {
            window.location.href = route;
        }

    });

});


// ==========================================
// SMARTPATH IA - ELEMENTOS
// ==========================================

const openSmartIA = document.getElementById("openSmartIA");
const closeSmartIA = document.getElementById("closeSmartIA");
const smartIABox = document.getElementById("smartIABox");

const smartIAInput = document.getElementById("smartIAInput");
const sendSmartIA = document.getElementById("sendSmartIA");
const smartIAChat = document.getElementById("smartIAChat");

// Mantém a conversa disponível enquanto o aluno navega pelas páginas do site.
const IA_HISTORICO_CHAVE = "smartpath-ia-historico";
const IA_ABERTA_CHAVE = "smartpath-ia-aberta";
let restaurandoHistoricoIA = false;

function obterHistoricoIA() {
    try {
        const historico = JSON.parse(localStorage.getItem(IA_HISTORICO_CHAVE) || "[]");
        return Array.isArray(historico) ? historico : [];
    } catch {
        return [];
    }
}

function registrarMensagemNoHistorico(tipo, texto) {
    if (restaurandoHistoricoIA) return;

    try {
        const historico = obterHistoricoIA();
        historico.push({ tipo, texto: String(texto) });
        localStorage.setItem(IA_HISTORICO_CHAVE, JSON.stringify(historico.slice(-80)));
    } catch {
        // Se o armazenamento não estiver disponível, o chat continua funcionando nesta página.
    }
}

function restaurarConversaIA() {
    if (!smartIAChat) return;

    const historico = obterHistoricoIA();
    if (historico.length) {
        restaurandoHistoricoIA = true;
        smartIAChat.replaceChildren();
        historico.forEach(mensagem => {
            if (mensagem.tipo === "aluno") adicionarMensagemAluno(mensagem.texto);
            if (mensagem.tipo === "ia") adicionarMensagemIA(mensagem.texto);
        });
        restaurandoHistoricoIA = false;
    }

    if (localStorage.getItem(IA_ABERTA_CHAVE) === "true") {
        smartIABox?.classList.add("active");
    }
}

if (smartIABox) {
    new MutationObserver(() => {
        try {
            localStorage.setItem(IA_ABERTA_CHAVE, String(smartIABox.classList.contains("active")));
        } catch {
            // Sem armazenamento persistente, não há ação adicional necessária.
        }
    }).observe(smartIABox, { attributes: true, attributeFilter: ["class"] });
}


// ==========================================
// ABRIR IA
// ==========================================

if (openSmartIA && smartIABox) {

    openSmartIA.addEventListener("click", () => {

        smartIABox.classList.add("active");

        setTimeout(() => {
            smartIAInput.focus();
        }, 250);

    });

}


// ==========================================
// FECHAR IA
// ==========================================

if (closeSmartIA && smartIABox) {

    closeSmartIA.addEventListener("click", () => {

        smartIABox.classList.remove("active");

    });

}


// ==========================================
// FUNÇÃO PARA ADICIONAR MENSAGEM DO ALUNO
// ==========================================

function adicionarMensagemAluno(texto) {

    const mensagem = document.createElement("div");

    mensagem.className = "student-message";

    mensagem.textContent = texto;

    smartIAChat.appendChild(mensagem);

    registrarMensagemNoHistorico("aluno", texto);

    smartIAChat.scrollTop = smartIAChat.scrollHeight;

}


// ==========================================
// FUNÇÃO PARA MOSTRAR "PENSANDO..."
// ==========================================

function adicionarCarregando() {

    const carregando = document.createElement("div");

    carregando.className = "smart-ia-message ia-message";

    carregando.innerHTML = `
        <div class="message-avatar">
            <img
                src="img/IA_smartpath.png"
                alt="SmartPath IA"
            >
        </div>

        <div class="message-content">

            <span class="message-name">
                SmartPath IA
            </span>

            <p class="ia-loading">
                Pensando...
            </p>

        </div>
    `;

    smartIAChat.appendChild(carregando);

    smartIAChat.scrollTop = smartIAChat.scrollHeight;

    return carregando;

}


// ==========================================
// FUNÇÃO PARA ADICIONAR RESPOSTA DA IA
// ==========================================


function adicionarTextoFormatado(texto, destino) {
    String(texto).split(/(\*\*[^*]+\*\*)/g).forEach(trecho => {
        const destaque = trecho.match(/^\*\*(.+)\*\*$/);
        const no = document.createElement(destaque ? "strong" : "span");
        no.textContent = destaque ? destaque[1] : trecho;
        destino.appendChild(no);
    });
}

function formatarRespostaIA(texto, destino) {
    const linhas = String(texto)
        .replace(/\\n/g, "\n")
        .replace(/\r\n?/g, "\n")
        .split("\n");
    let paragrafo = [];
    let lista;

    const finalizarParagrafo = () => {
        if (!paragrafo.length) return;
        const elemento = document.createElement("p");
        adicionarTextoFormatado(paragrafo.join(" "), elemento);
        destino.appendChild(elemento);
        paragrafo = [];
    };

    const finalizarLista = () => {
        lista = undefined;
    };

    linhas.forEach(linha => {
        const titulo = linha.match(/^(#{1,3})\s+(.+)$/);
        const item = linha.match(/^\s*([-*]|\d+\.)\s+(.+)$/);

        if (titulo) {
            finalizarParagrafo();
            finalizarLista();
            const elemento = document.createElement(titulo[1].length === 1 ? "h2" : "h3");
            adicionarTextoFormatado(titulo[2], elemento);
            destino.appendChild(elemento);
        } else if (item) {
            finalizarParagrafo();
            const tipo = /^\d+\.$/.test(item[1]) ? "ol" : "ul";
            if (!lista || lista.tagName.toLowerCase() !== tipo) {
                lista = document.createElement(tipo);
                destino.appendChild(lista);
            }
            const elemento = document.createElement("li");
            adicionarTextoFormatado(item[2], elemento);
            lista.appendChild(elemento);
        } else if (!linha.trim()) {
            finalizarParagrafo();
            finalizarLista();
        } else {
            finalizarLista();
            paragrafo.push(linha.trim());
        }
    });

    finalizarParagrafo();
}

function adicionarMensagemIA(texto) {
    const mensagem = document.createElement("div");
    mensagem.className = "smart-ia-message ia-message";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";

    const imagem = document.createElement("img");
    imagem.src = "img/IA_smartpath.png";
    imagem.alt = "SmartPath IA";
    avatar.appendChild(imagem);

    const conteudo = document.createElement("div");
    conteudo.className = "message-content";

    const nome = document.createElement("span");
    nome.className = "message-name";
    nome.textContent = "SmartPath IA";

    const textoResposta = document.createElement("div");
    textoResposta.className = "ia-response-text";

    formatarRespostaIA(texto, textoResposta);

    conteudo.appendChild(nome);
    conteudo.appendChild(textoResposta);

    mensagem.appendChild(avatar);
    mensagem.appendChild(conteudo);

    smartIAChat.appendChild(mensagem);
    smartIAChat.scrollTop = smartIAChat.scrollHeight;

    registrarMensagemNoHistorico("ia", texto);
}



// ==========================================
// FUNÇÃO PARA MOSTRAR ERRO
// ==========================================

function adicionarMensagemErro() {

    adicionarMensagemIA(
        "Não consegui me conectar à SmartPath IA no momento. Tente novamente."
    );

}


// ==========================================
// ENVIAR MENSAGEM PARA O PYTHON
// ==========================================

async function enviarMensagemIA() {

    if (!smartIAInput || !sendSmartIA) {
        return;
    }


    // Remove espaços vazios do começo/final

    const pergunta = smartIAInput.value.trim();


    // Não envia mensagem vazia

    if (!pergunta) {
        return;
    }


    // Mostra pergunta do aluno

    adicionarMensagemAluno(pergunta);


    // Limpa o campo

    smartIAInput.value = "";


    // Impede vários envios simultâneos

    sendSmartIA.disabled = true;

    smartIAInput.disabled = true;


    // Mostra carregamento

    const carregando = adicionarCarregando();


    try {

        const resposta = await fetch("/api/ia", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: pergunta
            })

        });


        // Tenta ler o JSON

        const dados = await resposta.json();


        // Remove "Pensando..."

        carregando.remove();


        // Se o backend retornar erro

        if (!resposta.ok) {

            console.error("Erro do servidor:", dados);

            adicionarMensagemErro();

            return;
        }


        // Resposta recebida

        if (dados.response) {

            adicionarMensagemIA(dados.response);

        } else {

            adicionarMensagemErro();

        }


    } catch (erro) {

        console.error("Erro ao conectar com o backend:", erro);

        carregando.remove();

        adicionarMensagemErro();

    } finally {

        sendSmartIA.disabled = false;

        smartIAInput.disabled = false;

        smartIAInput.focus();

    }

}


// ==========================================
// BOTÃO ENVIAR
// ==========================================

if (sendSmartIA) {

    sendSmartIA.addEventListener(
        "click",
        enviarMensagemIA
    );

}


// ==========================================
// ENTER PARA ENVIAR
// SHIFT + ENTER = NOVA LINHA
// ==========================================

if (smartIAInput) {

    smartIAInput.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            enviarMensagemIA();

        }

    });

}


// ==========================================
// ESC FECHA A IA
// ==========================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (
            smartIABox &&
            smartIABox.classList.contains("active")
        ) {

            smartIABox.classList.remove("active");

        }

    }

});// ==========================================
// SMARTPATH - PÁGINA INICIAL
// ==========================================


// ==========================================
// NAVEGAÇÃO DOS BOTÕES
// ==========================================

document.querySelectorAll("[data-route]").forEach((button) => {

    button.addEventListener("click", () => {

        const route = button.getAttribute("data-route");

        if (route) {
            window.location.href = route;
        }

    });

});


// ==========================================
// SMARTPATH IA - ELEMENTOS
// ==========================================
// 



// ==========================================
// ABRIR IA
// ==========================================

if (openSmartIA && smartIABox) {

    openSmartIA.addEventListener("click", () => {

        smartIABox.classList.add("active");

        setTimeout(() => {
            smartIAInput.focus();
        }, 250);

    });

}


// ==========================================
// FECHAR IA
// ==========================================

if (closeSmartIA && smartIABox) {

    closeSmartIA.addEventListener("click", () => {

        smartIABox.classList.remove("active");

    });

}


// ==========================================
// FUNÇÃO PARA ADICIONAR MENSAGEM DO ALUNO
// ==========================================

function adicionarMensagemAluno(texto) {

    const mensagem = document.createElement("div");

    mensagem.className = "student-message";

    mensagem.textContent = texto;

    smartIAChat.appendChild(mensagem);

    registrarMensagemNoHistorico("aluno", texto);

    smartIAChat.scrollTop = smartIAChat.scrollHeight;

}


// ==========================================
// FUNÇÃO PARA MOSTRAR "PENSANDO..."
// ==========================================

function adicionarCarregando() {

    const carregando = document.createElement("div");

    carregando.className = "smart-ia-message ia-message";

    carregando.innerHTML = `
        <div class="message-avatar">
            <img
                src="img/IA_smartpath.png"
                alt="SmartPath IA"
            >
        </div>

        <div class="message-content">

            <span class="message-name">
                SmartPath IA
            </span>

            <p class="ia-loading">
                Pensando...
            </p>

        </div>
    `;

    smartIAChat.appendChild(carregando);

    smartIAChat.scrollTop = smartIAChat.scrollHeight;

    return carregando;

}


// ==========================================
// FUNÇÃO PARA ADICIONAR RESPOSTA DA IA
// ==========================================

function adicionarMensagemIA(texto) {

    const mensagem = document.createElement("div");

    mensagem.className = "smart-ia-message ia-message";

    const avatar = document.createElement("div");

    avatar.className = "message-avatar";

    const imagem = document.createElement("img");

    imagem.src = "img/IA_smartpath.png";
    imagem.alt = "SmartPath IA";

    avatar.appendChild(imagem);


    const conteudo = document.createElement("div");

    conteudo.className = "message-content";


    const nome = document.createElement("span");

    nome.className = "message-name";
    nome.textContent = "SmartPath IA";


    const textoResposta = document.createElement("div");
    textoResposta.className = "ia-response-text";

    // Converte apenas o Markdown suportado em elementos DOM; o conteúdo da IA
    // continua sendo inserido como texto, sem executar HTML recebido.
    formatarRespostaIA(texto, textoResposta);


    conteudo.appendChild(nome);
    conteudo.appendChild(textoResposta);

    mensagem.appendChild(avatar);
    mensagem.appendChild(conteudo);

    smartIAChat.appendChild(mensagem);

    smartIAChat.scrollTop = smartIAChat.scrollHeight;

    registrarMensagemNoHistorico("ia", texto);

}


// ==========================================
// FUNÇÃO PARA MOSTRAR ERRO
// ==========================================

function adicionarMensagemErro() {

    adicionarMensagemIA(
        "Não consegui me conectar à SmartPath IA no momento. Tente novamente."
    );

}


// ==========================================
// ENVIAR MENSAGEM PARA O PYTHON
// ==========================================

async function enviarMensagemIA() {

    if (!smartIAInput || !sendSmartIA) {
        return;
    }


    // Remove espaços vazios do começo/final

    const pergunta = smartIAInput.value.trim();


    // Não envia mensagem vazia

    if (!pergunta) {
        return;
    }


    // Mostra pergunta do aluno

    adicionarMensagemAluno(pergunta);


    // Limpa o campo

    smartIAInput.value = "";


    // Impede vários envios simultâneos

    sendSmartIA.disabled = true;

    smartIAInput.disabled = true;


    // Mostra carregamento

    const carregando = adicionarCarregando();


    try {

        const resposta = await fetch("http://127.0.0.1:5000/api/ia", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: pergunta
            })

        });


        // Tenta ler o JSON

        const dados = await resposta.json();


        // Remove "Pensando..."

        carregando.remove();


        // Se o backend retornar erro

        if (!resposta.ok) {

            console.error("Erro do servidor:", dados);

            adicionarMensagemErro();

            return;
        }


        // Resposta recebida

        if (dados.response) {
            console.log("Resposta recebida:", JSON.stringify(dados.response));
            adicionarMensagemIA(dados.response);
        } else {

            adicionarMensagemErro();

        }


    } catch (erro) {

        console.error("Erro ao conectar com o backend:", erro);

        carregando.remove();

        adicionarMensagemErro();

    } finally {

        sendSmartIA.disabled = false;

        smartIAInput.disabled = false;

        smartIAInput.focus();

    }

}


// ==========================================
// BOTÃO ENVIAR
// ==========================================

if (sendSmartIA) {

    sendSmartIA.addEventListener(
        "click",
        enviarMensagemIA
    );

}


// ==========================================
// ENTER PARA ENVIAR
// SHIFT + ENTER = NOVA LINHA
// ==========================================

if (smartIAInput) {

    smartIAInput.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            enviarMensagemIA();

        }

    });

}


// ==========================================
// ESC FECHA A IA
// ==========================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (
            smartIABox &&
            smartIABox.classList.contains("active")
        ) {

            smartIABox.classList.remove("active");

        }

    }

});

restaurarConversaIA();
