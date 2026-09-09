document.addEventListener("DOMContentLoaded", () => {
  // Obtém o nome do arquivo atual da URL (ex: "estudos.html")
  const paginaAtual = window.location.pathname.split("/").pop();

  // Seleciona todos os botões da navegação
  const botoesNav = document.querySelectorAll(".nav-item");

  botoesNav.forEach(botao => {
    // Pega o destino do link dentro do atributo onclick
    const onclickAtributo = botao.getAttribute("onclick") || "";
    
    // Verifica se o nome da página atual está contido no link de redirecionamento
    if (onclickAtributo.includes(paginaAtual)) {
      botao.classList.add("is-active");
    } else {
      botao.classList.remove("is-active");
    }
  });
});


new window.VLibras.Widget('https://vlibras.gov.br/app');