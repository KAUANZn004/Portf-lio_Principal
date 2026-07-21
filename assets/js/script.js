// Navegação ativa ao rolar
const secoes = document.querySelectorAll('section');
const linksNav = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let atual = '';
    secoes.forEach(secao => {
        const secaoTopo = secao.offsetTop;
        const secaoAltura = secao.clientHeight;
        if (scrollY >= secaoTopo - 150) {
            atual = secao.getAttribute('id');
        }
    });

    linksNav.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${atual}`) {
            link.classList.add('active');
        }
    });
});

// Funcionalidade de expandir serviços
const servicos = document.querySelectorAll('.servico-item');

const atualizarBotaoServico = (item, ativo) => {
    const botao = item.querySelector('.btn-expandir');

    if (!botao) return;

    botao.innerHTML = ativo ? '<i class="fas fa-times"></i>' : '<i class="fas fa-plus"></i>';
    botao.setAttribute('aria-expanded', String(ativo));
};

servicos.forEach(item => {
    const botao = item.querySelector('.btn-expandir');
    if (!botao) return;

    botao.addEventListener('click', () => {
        const ativo = item.classList.contains('ativo');

        servicos.forEach(servico => {
            servico.classList.remove('ativo');
            atualizarBotaoServico(servico, false);
        });

        if (!ativo) {
            item.classList.add('ativo');
            atualizarBotaoServico(item, true);
        }
    });
});

// Efeito de rolagem suave
document.querySelectorAll('a[href^="#"]').forEach(ancora => {
    ancora.addEventListener('click', function(e) {
        const destino = this.getAttribute('href');

        if (!destino || destino === '#' || this.hasAttribute('data-modal')) {
            return;
        }

        const alvo = document.querySelector(destino);
        if (!alvo) {
            return;
        }

        e.preventDefault();
        window.scrollTo({
            top: alvo.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

function formatarTelefone(valor) {
    const comPrefixo = valor.startsWith('+55') ? '+55 ' : '';
    const numeros = valor.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 10) {
        const formatado = numeros.replace(/(\d{2})(\d{0,4})(\d{0,4})/, (_, ddd, prefixo, sufixo) => {
            if (!prefixo && !sufixo) return `(${ddd}`;
            if (prefixo && !sufixo) return `(${ddd}) ${prefixo}`;
            return `(${ddd}) ${prefixo}-${sufixo}`;
        });

        return comPrefixo ? `${comPrefixo}${formatado}` : formatado;
    }

    const formatado = numeros.replace(/(\d{2})(\d{0,5})(\d{0,4})/, (_, ddd, parte1, parte2) => {
        if (!parte1 && !parte2) return `(${ddd}`;
        if (parte1 && !parte2) return `(${ddd}) ${parte1}`;
        return `(${ddd}) ${parte1}-${parte2}`;
    });

    return comPrefixo ? `${comPrefixo}${formatado}` : formatado;
}

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('btn-menu');
    const links = document.querySelector('.nav-links');
    const itensMenu = document.querySelectorAll('.nav-links a');

    if (logo && links) {
        logo.addEventListener('click', (event) => {
            event.preventDefault();
            links.classList.toggle('ativo');
        });
    }

    itensMenu.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                links.classList.remove('ativo');
            }
        });
    });

    const modalContato = document.getElementById('modal-contato');
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const btnFecharModal = document.getElementById('btn-fechar-modal');
    const linksContato = document.querySelectorAll('a[href="#contato"]');
    const trigersModal = document.querySelectorAll('[data-modal]');
    const formulario = document.getElementById('form-contato');
    const inputTelefone = document.querySelector('input[name="telefone"]');

    const abrirModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.add('ativo');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const fecharModal = (modalId = null) => {
        const modais = modalId ? [document.getElementById(modalId)] : document.querySelectorAll('.modal');

        modais.forEach(modal => {
            if (!modal) return;
            modal.classList.remove('ativo');
            modal.setAttribute('aria-hidden', 'true');
        });

        if (!document.querySelector('.modal.ativo')) {
            document.body.style.overflow = '';
        }
    };

    if (btnAbrirModal) {
        btnAbrirModal.addEventListener('click', (event) => {
            event.preventDefault();
            abrirModal('modal-contato');
        });
    }

    linksContato.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            abrirModal('modal-contato');
        });
    });

    trigersModal.forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            abrirModal(trigger.dataset.modal);
        });
    });

    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', () => fecharModal('modal-contato'));
    }

    document.querySelectorAll('.modal-close').forEach(botao => {
        botao.addEventListener('click', () => {
            const modalPai = botao.closest('.modal');
            if (modalPai) {
                fecharModal(modalPai.id);
            }
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                fecharModal(modal.id);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            fecharModal();
        }
    });

    if (inputTelefone) {
        inputTelefone.addEventListener('input', (event) => {
            event.target.value = formatarTelefone(event.target.value);
        });
    }

    if (formulario) {
        formulario.addEventListener('submit', (event) => {
            event.preventDefault();

            const numeroWhatsApp = (formulario.dataset.whatsapp || '+5538984352816').replace(/\D/g, '');
            const nome = formulario.querySelector('input[name="nome"]').value.trim();
            const email = formulario.querySelector('input[name="email"]').value.trim();
            const telefone = formulario.querySelector('input[name="telefone"]').value.trim();
            const mensagem = formulario.querySelector('textarea[name="mensagem"]').value.trim();

            const textoMensagem = encodeURIComponent(
                `Olá! Me chamo ${nome}.\n\n` +
                `E-mail: ${email}\n` +
                `Telefone: ${telefone}\n\n` +
                `Assunto: ${mensagem}`
            );

            window.open(`https://wa.me/${numeroWhatsApp}?text=${textoMensagem}`, '_blank');
            formulario.reset();
            fecharModal('modal-contato');
        });
    }
});