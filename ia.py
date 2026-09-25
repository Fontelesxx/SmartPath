import os
import json

from flask import Flask, request, Response, stream_with_context
from flask_cors import CORS

from google import genai
#
# ============================================================
# FLASK
# ============================================================

app = Flask(__name__)

CORS(app)


# ============================================================
# GEMINI
# ============================================================

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")


if not GEMINI_API_KEY:
    print("AVISO: GEMINI_API_KEY não foi configurada.")
    print("Configure a variável GEMINI_API_KEY antes de iniciar.")


client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ============================================================
# CONFIGURAÇÃO DA SMARTPATH IA
# ============================================================

SYSTEM_PROMPT = """
Você é o Guga, assistente educacional da plataforma SmartPath.

Responda sempre em português do Brasil.

Ajude estudantes com:

- Matemática
- Português
- Literatura
- História
- Geografia
- Física
- Química
- Biologia
- Inglês
- Redação
- ENEM
- Organização dos estudos

REGRAS:

1. Seja didático, claro e direto.

2. Use parágrafos curtos.

3. Deixe uma linha em branco entre assuntos diferentes.

4. Quando houver etapas, use listas numeradas.

5. Em exercícios matemáticos, mostre os cálculos passo a passo.

6. Use títulos curtos quando necessário.

7. Use negrito apenas para conceitos importantes.

8. NÃO coloque a resposta inteira entre aspas.

9. NÃO use blocos de código para explicações comuns.

10. NÃO use LaTeX.

11. NÃO use $$.

12. NÃO use \\( \\).

13. NÃO use \\[ \\].

14. Escreva fórmulas matemáticas em texto simples.

Exemplo:

sen(30°) = x / 10

x = 10 / 2

x = 5

15. Evite respostas excessivamente longas.

16. Não invente informações.

17. Se não souber alguma coisa, diga claramente.

18. O objetivo é ensinar o aluno, não apenas entregar a resposta.

19. Mantenha as respostas adequadas para estudantes.

20. Não use emojis em excesso.

Priorize respostas rápidas, claras e organizadas.
"""


# ============================================================
# LIMPAR RESPOSTA
# ============================================================

def limpar_texto(texto):

    if not texto:
        return ""


    texto = str(texto).strip()


    # --------------------------------------------------------
    # REMOVER ASPAS EXTERNAS
    # --------------------------------------------------------

    if (
        texto.startswith('"')
        and texto.endswith('"')
    ):

        texto = texto[1:-1].strip()


    # --------------------------------------------------------
    # REMOVER $$ DESNECESSÁRIOS
    # --------------------------------------------------------

    texto = texto.replace("$$", "")


    # --------------------------------------------------------
    # REMOVER DELIMITADORES LATEX
    # --------------------------------------------------------

    texto = texto.replace("\\(", "")
    texto = texto.replace("\\)", "")

    texto = texto.replace("\\[", "")
    texto = texto.replace("\\]", "")


    # --------------------------------------------------------
    # CONVERTER ALGUNS COMANDOS LATEX
    # --------------------------------------------------------

    texto = texto.replace(
        "\\theta",
        "θ"
    )

    texto = texto.replace(
        "\\pi",
        "π"
    )

    texto = texto.replace(
        "\\alpha",
        "α"
    )

    texto = texto.replace(
        "\\beta",
        "β"
    )


    return texto


# ============================================================
# ROTA DE STREAMING
# ============================================================

@app.route(
    "/api/ia",
    methods=["POST"]
)
def smartpath_ia():

    try:

        # ----------------------------------------------------
        # RECEBER JSON
        # ----------------------------------------------------

        data = request.get_json(
            silent=True
        )


        if not data:

            return {
                "error": "Dados não enviados."
            }, 400


        # ----------------------------------------------------
        # RECEBER PERGUNTA
        # ----------------------------------------------------

        pergunta = data.get(
            "message",
            ""
        )


        if not isinstance(
            pergunta,
            str
        ):

            return {
                "error": "Mensagem inválida."
            }, 400


        pergunta = pergunta.strip()


        if not pergunta:

            return {
                "error": "A mensagem está vazia."
            }, 400


        # ----------------------------------------------------
        # LIMITE
        # ----------------------------------------------------

        if len(pergunta) > 5000:

            return {
                "error": "Mensagem muito longa."
            }, 400


        # ----------------------------------------------------
        # PROMPT
        # ----------------------------------------------------

        prompt = f"""
{SYSTEM_PROMPT}

Pergunta do aluno:

{pergunta}
"""


        # ----------------------------------------------------
        # STREAMING
        # ----------------------------------------------------

        def gerar():

            try:

                response_stream = (
                    client.models.generate_content_stream(

                        model="gemini-3.5-flash-lite",

                        contents=prompt

                    )
                )


                # --------------------------------------------
                # ENVIAR CADA CHUNK
                # --------------------------------------------

                for chunk in response_stream:

                    texto = getattr(
                        chunk,
                        "text",
                        None
                    )


                    if texto:

                        texto = limpar_texto(
                            texto
                        )


                        if texto:

                            # Enviamos JSON por linha
                            dados = json.dumps(
                                {
                                    "text": texto
                                },
                                ensure_ascii=False
                            )


                            yield (
                                dados +
                                "\n"
                            )


            except Exception as erro:

                print(
                    "ERRO NO STREAM GEMINI:",
                    erro
                )


                erro_json = json.dumps(
                    {
                        "error":
                        "Erro ao comunicar com a SmartPath IA."
                    },
                    ensure_ascii=False
                )


                yield (
                    erro_json +
                    "\n"
                )


        # ----------------------------------------------------
        # RETORNAR STREAM
        # ----------------------------------------------------

        return Response(

            stream_with_context(
                gerar()
            ),

            content_type=
                "application/x-ndjson; charset=utf-8",

            headers={

                "Cache-Control":
                    "no-cache",

                "X-Accel-Buffering":
                    "no"

            }

        )


    except Exception as erro:

        print(
            "ERRO FLASK:",
            erro
        )


        return {
            "error":
            "Erro ao comunicar com a SmartPath IA."
        }, 500


# ============================================================
# EXECUÇÃO
# ============================================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True,

        threaded=True

    )