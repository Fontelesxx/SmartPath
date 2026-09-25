// ============================================================
// SMARTPATH - PÁGINA INICIAL
// ============================================================


// ============================================================
// SAUDAÇÃO
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    const saudacao =
        document.getElementById("boas-vindas");

    const nomeUsuario =
        localStorage.getItem("nomeUsuario");


    if (saudacao && nomeUsuario) {

        saudacao.textContent =
            `Olá, ${nomeUsuario}! 👋`;

    }


    // ========================================================
    // PÁGINA ATUAL
    // ========================================================

    const paginaAtual =
        window.location.pathname
            .split("/")
            .pop();


    // ========================================================
    // NAVEGAÇÃO
    // ========================================================

    const botoesNav =
        document.querySelectorAll(".nav-item");


    botoesNav.forEach((botao) => {

        const onclickAtributo =
            botao.getAttribute("onclick") || "";


        if (
            onclickAtributo.includes(
                paginaAtual
            )
        ) {

            botao.classList.add(
                "is-active"
            );

        } else {

            botao.classList.remove(
                "is-active"
            );

        }

    });


    // ========================================================
    // ROTAS
    // ========================================================

    document
        .querySelectorAll("[data-route]")
        .forEach((element) => {

            element.addEventListener(
                "click",
                () => {

                    const rota =
                        element.getAttribute(
                            "data-route"
                        );


                    if (rota) {

                        window.location.href =
                            rota;

                    }

                }
            );

        });


    // ========================================================
    // PROGRESSO
    // ========================================================

    const completed =
        JSON.parse(
            localStorage.getItem(
                "smartpath-trail-completed"
            ) || "[]"
        ).length;


    const percent =
        Math.round(
            (completed / 8) * 100
        );


    const ring =
        document.querySelector(
            ".progress-ring"
        );


    const progressNumber =
        document.querySelector(
            ".progress-ring strong"
        );


    const trailModule =
        document.querySelector(
            ".trail-summary p"
        );


    if (ring) {

        ring.style.background =
            `conic-gradient(
                var(--blue) 0 ${percent}%,
                #d9eafa ${percent}% 100%
            )`;

    }


    if (progressNumber) {

        progressNumber.innerHTML =
            `${percent}<span>%</span>`;

    }


    if (trailModule) {

        trailModule.textContent =
            `Módulo ${completed} de 8`;

    }

});


// ============================================================
// VLIBRAS
// ============================================================

if (window.VLibras) {

    new window.VLibras.Widget(
        "https://vlibras.gov.br/app"
    );

}


// ============================================================
// SMARTPATH IA
// ============================================================


// ============================================================
// BACKEND
// ============================================================

const SMARTPATH_API = "/api/ia";


// ============================================================
// ELEMENTOS
// ============================================================

const openSmartIA =
    document.getElementById(
        "openSmartIA"
    );


const closeSmartIA =
    document.getElementById(
        "closeSmartIA"
    );


const smartIABox =
    document.getElementById(
        "smartIABox"
    );


const smartIAInput =
    document.getElementById(
        "smartIAInput"
    );


const sendSmartIA =
    document.getElementById(
        "sendSmartIA"
    );


const smartIAChat =
    document.getElementById(
        "smartIAChat"
    );


// ============================================================
// LOG
// ============================================================

console.log(
    "SmartPath IA carregada."
);

console.log(
    "Input:",
    smartIAInput
);

console.log(
    "Botão:",
    sendSmartIA
);

console.log(
    "Chat:",
    smartIAChat
);

console.log(
    "Caixa:",
    smartIABox
);


// ============================================================
// ABRIR IA
// ============================================================

if (
    openSmartIA &&
    smartIABox
) {

    openSmartIA.addEventListener(
        "click",
        () => {

            smartIABox.classList.add(
                "active"
            );


            setTimeout(() => {

                if (smartIAInput) {

                    smartIAInput.focus();

                }

            }, 250);

        }
    );

}


// ============================================================
// FECHAR IA
// ============================================================

if (
    closeSmartIA &&
    smartIABox
) {

    closeSmartIA.addEventListener(
        "click",
        () => {

            smartIABox.classList.remove(
                "active"
            );

        }
    );

}


// ============================================================
// MENSAGEM DO ALUNO
// ============================================================

function adicionarMensagemAluno(
    texto
) {

    if (!smartIAChat) {

        return;

    }


    const mensagem =
        document.createElement(
            "div"
        );


    mensagem.className =
        "student-message";


    mensagem.textContent =
        texto;


    smartIAChat.appendChild(
        mensagem
    );


    smartIAChat.scrollTop =
        smartIAChat.scrollHeight;

}


// ============================================================
// MENSAGEM "PENSANDO"
// ============================================================

function adicionarCarregando() {

    if (!smartIAChat) {

        return null;

    }


    const carregando =
        document.createElement(
            "div"
        );


    carregando.className =
        "smart-ia-message ia-message";


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


    smartIAChat.appendChild(
        carregando
    );


    smartIAChat.scrollTop =
        smartIAChat.scrollHeight;


    return carregando;

}


// ============================================================
// FORMATAR RESPOSTA
// ============================================================

function formatarRespostaIA(
    texto
) {

    if (!texto) {

        return "";

    }


    let resposta =
        String(texto);


    // ========================================================
    // LIMPAR $$ 
    // ========================================================

    resposta =
        resposta.replace(
            /\$\$/g,
            ""
        );


    // ========================================================
    // LIMPAR LATEX
    // ========================================================

    resposta =
        resposta.replace(
            /\\\(/g,
            ""
        );


    resposta =
        resposta.replace(
            /\\\)/g,
            ""
        );


    resposta =
        resposta.replace(
            /\\\[/g,
            ""
        );


    resposta =
        resposta.replace(
            /\\\]/g,
            ""
        );


    // ========================================================
    // FRAÇÕES
    // ========================================================

    resposta =
        resposta.replace(
            /\\frac\{([^{}]+)\}\{([^{}]+)\}/g,
            "$1 / $2"
        );


    // ========================================================
    // SÍMBOLOS
    // ========================================================

    resposta =
        resposta.replace(
            /\\theta/g,
            "θ"
        );


    resposta =
        resposta.replace(
            /\\pi/g,
            "π"
        );


    resposta =
        resposta.replace(
            /\\alpha/g,
            "α"
        );


    resposta =
        resposta.replace(
            /\\beta/g,
            "β"
        );


    resposta =
        resposta.replace(
            /\\text\{([^{}]+)\}/g,
            "$1"
        );


    resposta =
        resposta.replace(
            /\\mathrm\{([^{}]+)\}/g,
            "$1"
        );


    // ========================================================
    // ESCAPAR HTML
    // ========================================================

    resposta =
        resposta
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            );


    // ========================================================
    // CÓDIGO
    // ========================================================

    resposta =
        resposta.replace(
            /```([\s\S]*?)```/g,
            "<pre class=\"ia-code\"><code>$1</code></pre>"
        );


    // ========================================================
    // TÍTULOS
    // ========================================================

    resposta =
        resposta.replace(
            /^### (.*?)$/gm,
            "<h4>$1</h4>"
        );


    resposta =
        resposta.replace(
            /^## (.*?)$/gm,
            "<h3>$1</h3>"
        );


    resposta =
        resposta.replace(
            /^# (.*?)$/gm,
            "<h3>$1</h3>"
        );


    // ========================================================
    // NEGRITO
    // ========================================================

    resposta =
        resposta.replace(
            /\*\*(.*?)\*\*/g,
            "<strong>$1</strong>"
        );


    // ========================================================
    // ITÁLICO
    // ========================================================

    resposta =
        resposta.replace(
            /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
            "<em>$1</em>"
        );


    // ========================================================
    // LISTAS
    // ========================================================

    resposta =
        resposta.replace(
            /^- (.*?)$/gm,
            "<div class=\"ia-list-item\">• $1</div>"
        );


    resposta =
        resposta.replace(
            /^\* (.*?)$/gm,
            "<div class=\"ia-list-item\">• $1</div>"
        );


    // ========================================================
    // LISTA NUMERADA
    // ========================================================

    resposta =
        resposta.replace(
            /^(\d+)\. (.*?)$/gm,
            "<div class=\"ia-list-item\"><strong>$1.</strong> $2</div>"
        );


    // ========================================================
    // SEPARADOR
    // ========================================================

    resposta =
        resposta.replace(
            /^---$/gm,
            "<hr>"
        );


    // ========================================================
    // ESPAÇAMENTO
    // ========================================================

    resposta =
        resposta.replace(
            /\n{3,}/g,
            "\n\n"
        );


    resposta =
        resposta.replace(
            /\n\n/g,
            "<div class=\"ia-space\"></div>"
        );


    resposta =
        resposta.replace(
            /\n/g,
            "<br>"
        );


    return resposta;

}


// ============================================================
// CRIAR MENSAGEM DA IA
// ============================================================

function criarMensagemIA() {

    const mensagem =
        document.createElement(
            "div"
        );


    mensagem.className =
        "smart-ia-message ia-message";


    // ========================================================
    // AVATAR
    // ========================================================

    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "message-avatar";


    const imagem =
        document.createElement(
            "img"
        );


    imagem.src =
        "img/IA_smartpath.png";


    imagem.alt =
        "SmartPath IA";


    avatar.appendChild(
        imagem
    );


    // ========================================================
    // CONTEÚDO
    // ========================================================

    const conteudo =
        document.createElement(
            "div"
        );


    conteudo.className =
        "message-content";


    // ========================================================
    // NOME
    // ========================================================

    const nome =
        document.createElement(
            "span"
        );


    nome.className =
        "message-name";


    nome.textContent =
        "SmartPath IA";


    // ========================================================
    // TEXTO
    // ========================================================

    const textoResposta =
        document.createElement(
            "div"
        );


    textoResposta.className =
        "ia-response";


    conteudo.appendChild(
        nome
    );


    conteudo.appendChild(
        textoResposta
    );


    mensagem.appendChild(
        avatar
    );


    mensagem.appendChild(
        conteudo
    );


    smartIAChat.appendChild(
        mensagem
    );


    return textoResposta;

}


// ============================================================
// MENSAGEM DE ERRO
// ============================================================

function adicionarMensagemErro(
    texto
) {

    const elemento =
        criarMensagemIA();


    elemento.textContent =
        texto;


    smartIAChat.scrollTop =
        smartIAChat.scrollHeight;

}


// ============================================================
// ENVIAR MENSAGEM COM STREAMING
// ============================================================

async function enviarMensagemIA() {

    if (
        !smartIAInput ||
        !sendSmartIA ||
        !smartIAChat
    ) {

        console.error(
            "Elementos da SmartPath IA não encontrados."
        );

        return;

    }


    // ========================================================
    // PEGAR PERGUNTA
    // ========================================================

    const pergunta =
        smartIAInput.value.trim();


    if (!pergunta) {

        return;

    }


    // ========================================================
    // MOSTRAR PERGUNTA
    // ========================================================

    adicionarMensagemAluno(
        pergunta
    );


    // ========================================================
    // LIMPAR INPUT
    // ========================================================

    smartIAInput.value =
        "";


    // ========================================================
    // DESABILITAR
    // ========================================================

    sendSmartIA.disabled =
        true;


    smartIAInput.disabled =
        true;


    // ========================================================
    // MOSTRAR PENSANDO
    // ========================================================

    const carregando =
        adicionarCarregando();


    try {

        console.log(
            "Enviando pergunta para:",
            SMARTPATH_API
        );


        // ====================================================
        // FETCH
        // ====================================================

        const resposta =
            await fetch(
                SMARTPATH_API,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            message:
                                pergunta

                        })

                }
            );


        console.log(
            "Status:",
            resposta.status
        );


        // ====================================================
        // VERIFICAR RESPOSTA
        // ====================================================

        if (!resposta.ok) {

            let erroTexto =
                "Erro ao comunicar com a SmartPath IA.";


            try {

                const erro =
                    await resposta.json();


                if (erro.error) {

                    erroTexto =
                        erro.error;

                }

            } catch (e) {

                console.error(
                    "Erro ao ler erro:",
                    e
                );

            }


            if (carregando) {

                carregando.remove();

            }


            adicionarMensagemErro(
                erroTexto
            );


            return;

        }


        // ====================================================
        // REMOVER "PENSANDO"
        // ====================================================

        if (carregando) {

            carregando.remove();

        }


        // ====================================================
        // CRIAR MENSAGEM VAZIA
        // ====================================================

        const elementoResposta =
            criarMensagemIA();


        // ====================================================
        // READER
        // ====================================================

        const reader =
            resposta.body.getReader();


        const decoder =
            new TextDecoder(
                "utf-8"
            );


        let buffer =
            "";


        let textoCompleto =
            "";


        // ====================================================
        // LER STREAM
        // ====================================================

        while (true) {

            const {
                value,
                done
            } =
                await reader.read();


            if (done) {

                break;

            }


            // ------------------------------------------------
            // DECODIFICAR
            // ------------------------------------------------

            buffer +=
                decoder.decode(
                    value,
                    {
                        stream: true
                    }
                );


            // ------------------------------------------------
            // SEPARAR LINHAS
            // ------------------------------------------------

            const linhas =
                buffer.split("\n");


            // Última linha pode estar incompleta
            buffer =
                linhas.pop();


            // ------------------------------------------------
            // PROCESSAR LINHAS
            // ------------------------------------------------

            for (
                const linha of linhas
            ) {

                if (
                    !linha.trim()
                ) {

                    continue;

                }


                try {

                    const dados =
                        JSON.parse(
                            linha
                        );


                    if (
                        dados.error
                    ) {

                        throw new Error(
                            dados.error
                        );

                    }


                    if (
                        dados.text
                    ) {

                        textoCompleto +=
                            dados.text;


                        // ------------------------------------
                        // ATUALIZAR TELA
                        // ------------------------------------

                        elementoResposta.innerHTML =
                            formatarRespostaIA(
                                textoCompleto
                            );


                        // ------------------------------------
                        // SCROLL
                        // ------------------------------------

                        smartIAChat.scrollTop =
                            smartIAChat.scrollHeight;

                    }

                } catch (erroLinha) {

                    console.error(
                        "Erro ao processar chunk:",
                        erroLinha
                    );

                }

            }

        }


        // ====================================================
        // PROCESSAR ÚLTIMO BUFFER
        // ====================================================

        if (
            buffer.trim()
        ) {

            try {

                const dados =
                    JSON.parse(
                        buffer
                    );


                if (
                    dados.text
                ) {

                    textoCompleto +=
                        dados.text;


                    elementoResposta.innerHTML =
                        formatarRespostaIA(
                            textoCompleto
                        );

                }

            } catch (erroFinal) {

                console.error(
                    "Erro no último chunk:",
                    erroFinal
                );

            }

        }


        // ====================================================
        // RESPOSTA VAZIA
        // ====================================================

        if (
            !textoCompleto.trim()
        ) {

            elementoResposta.textContent =
                "A SmartPath IA não retornou uma resposta.";

        }


        // ====================================================
        // SCROLL FINAL
        // ====================================================

        smartIAChat.scrollTop =
            smartIAChat.scrollHeight;


    } catch (erro) {

        console.error(
            "ERRO NO STREAMING:",
            erro
        );


        if (carregando) {

            carregando.remove();

        }


        adicionarMensagemErro(

            "Não consegui conectar ao servidor da SmartPath IA. Verifique se o Python/Flask está rodando na porta 5000."

        );


    } finally {

        // ====================================================
        // REATIVAR
        // ====================================================

        sendSmartIA.disabled =
            false;


        smartIAInput.disabled =
            false;


        smartIAInput.focus();

    }

}


// ============================================================
// BOTÃO ENVIAR
// ============================================================

if (sendSmartIA) {

    sendSmartIA.addEventListener(
        "click",
        enviarMensagemIA
    );

}


// ============================================================
// ENTER
// SHIFT + ENTER = QUEBRA
// ============================================================

if (smartIAInput) {

    smartIAInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                enviarMensagemIA();

            }

        }
    );

}


// ============================================================
// ESC
// ============================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            if (
                smartIABox &&
                smartIABox.classList.contains(
                    "active"
                )
            ) {

                smartIABox.classList.remove(
                    "active"
                );

            }

        }

    }
);



// Tentativa de conexão coma vercel