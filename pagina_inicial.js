
    const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const link = item.getAttribute('onclick');

        if (link && link.includes(paginaAtual)) {
            item.classList.add('is-active');
        } else {
            item.classList.remove('is-active');
        }
    });
