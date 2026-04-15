// ── Service Worker ──────────────────────────────────────────
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('[SW] Registrado'))
            .catch(err => console.warn('[SW] Erro:', err));
    });
}


const PARTICLES_CONFIG = {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ["#FFD700", "#FFA500"] },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.1 } },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 140, color: "#FFD700", opacity: 0.2, width: 1 },
        move: { enable: true, speed: 1.2, random: true, out_mode: "out" }
    },
    interactivity: {
        detect_on: "canvas",
        events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { grab: { distance: 130, line_linked: { opacity: 0.6 } }, push: { particles_nb: 3 } }
    },
    retina_detect: true
};

particlesJS("particles-js", PARTICLES_CONFIG);

// ── PWA Install ─────────────────────────────────────────────
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.style.display = 'none';
});

// ── Login ───────────────────────────────────────────────────
const userInput  = document.getElementById('userInput');
const keyInput   = document.getElementById('keyInput');
const saveBtn    = document.getElementById('saveBtn');
const errorMsg   = document.getElementById('errorMessage');

// Credenciais — mova para variáveis de ambiente ou backend em produção
const CREDS = { user: 'LARTX01', key: 'LARTX01' };

saveBtn.addEventListener('click', handleLogin);
[userInput, keyInput].forEach(el => el.addEventListener('keydown', e => e.key === 'Enter' && handleLogin()));

function handleLogin() {
    const usuario = userInput.value.trim();
    const key     = keyInput.value.trim();

    hideError();

    if (!usuario || !key) {
        showError('Preencha todos os campos.');
        return;
    }

    if (usuario !== CREDS.user || key !== CREDS.key) {
        showError('Usuário ou Key VIP incorretos.');
        return;
    }

    localStorage.setItem('usuarioLogado', usuario);
    window.location.href = 'dashboard.html';
}

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
    setTimeout(hideError, 3000);
}

function hideError() {
    errorMsg.style.display = 'none';
}

// ── Termos ──────────────────────────────────────────────────
document.getElementById('termosLink').addEventListener('click', (e) => {
    e.preventDefault();
    alert('📋 TERMOS DE USO VIP\n\n' +
          '• Versão VIP Premium com recursos exclusivos\n' +
          '• Não nos responsabilizamos por qualquer mal uso\n' +
          '• Use por sua conta e risco\n\n' +
          '⚠️ O uso inadequado pode resultar em banimento.\n\n' +
          '💎 Compre o VIP: https://discord.gg/J6YbmjEV');
});
