// ── Auth Guard ──────────────────────────────────────────────
const usuarioLogado = localStorage.getItem('usuarioLogado');
if (!usuarioLogado) window.location.href = 'index.html';

document.getElementById('usuarioLogado').textContent = usuarioLogado;

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
});

// ── Particles ──────────────────────────────────────────────
particlesJS("particles-js", {
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
});

// ── Tabs ────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
    });
});

// ── Sliders ─────────────────────────────────────────────────
const fovSlider  = document.getElementById('fovSlider');
const sensSlider = document.getElementById('sensSlider');
const fovValue   = document.getElementById('fovValue');
const sensValue  = document.getElementById('sensValue');
const fovOverlay = document.getElementById('fovOverlay');
const fovCircle  = document.getElementById('fovCircle');

fovSlider.addEventListener('input', (e) => {
    fovValue.textContent = e.target.value;
    if (fovOverlay.classList.contains('active')) updateFOVCircle();
});

sensSlider.addEventListener('input', (e) => {
    sensValue.textContent = e.target.value;
});

function updateFOVCircle() {
    const size = 80 + parseInt(fovSlider.value) * 28;
    fovCircle.style.width  = size + 'px';
    fovCircle.style.height = size + 'px';
}

// ── Inject ──────────────────────────────────────────────────
document.getElementById('injetarBtn').addEventListener('click', () => {
    const ativarAuxilio  = document.getElementById('ativarAuxilio').checked;
    const ativarFov      = document.getElementById('ativarFov').checked;
    const ativarAntiRecuo = document.getElementById('ativarAntiRecuo').checked;

    if (!ativarAuxilio && !ativarFov && !ativarAntiRecuo) {
        showNotification('⚠️ Ative pelo menos uma função VIP!', 'error');
        return;
    }

    if (ativarFov) {
        updateFOVCircle();
        fovOverlay.classList.add('active');
    } else {
        fovOverlay.classList.remove('active');
    }

    showNotification('👑 FUNÇÕES VIP INJETADAS!', 'success');
    setTimeout(abrirFreefire, 900);
});

// ── Open Free Fire ──────────────────────────────────────────
function abrirFreefire() {
    const ua        = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS     = /iPhone|iPad|iPod/i.test(ua);

    if (isAndroid) {
        abrirAndroid();
    } else if (isIOS) {
        abrirIOS();
    } else {
        showNotification('📱 Abra no celular para jogar!', 'error');
    }
}

// ── Android: tenta 3 deep links em sequência ────────────────
function abrirAndroid() {
    const STORE = 'https://play.google.com/store/apps/details?id=com.dts.freefireth';

    // Estratégia 1: Intent URL (mais confiável no Android)
    const intentUrl = 'intent://com.dts.freefireth#Intent;scheme=com.dts.freefireth;package=com.dts.freefireth;end';

    // Estratégia 2: deep link padrão
    const deepLink = 'com.dts.freefireth://';

    // Estratégia 3: link universal Garena
    const universalLink = 'https://ff.garena.com/';

    let tentativa = 0;
    let appAberto = false;

    // Detecta se o app abriu: página fica oculta = app abriu
    const onVisibilityChange = () => {
        if (document.hidden) {
            appAberto = true;
            document.removeEventListener('visibilitychange', onVisibilityChange);
        }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    function tentar(url) {
        tentativa++;
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        try {
            iframe.src = url;
        } catch(e) {}

        setTimeout(() => {
            document.body.removeChild(iframe);
            if (!appAberto) {
                if (tentativa === 1) {
                    // Tenta deep link direto
                    window.location.href = deepLink;
                    setTimeout(() => {
                        if (!appAberto && tentativa === 2) {
                            tentativa++;
                            // Tenta universal link
                            window.open(universalLink, '_blank');
                            setTimeout(() => {
                                if (!appAberto) {
                                    document.removeEventListener('visibilitychange', onVisibilityChange);
                                    perguntarDownload(STORE);
                                }
                            }, 2000);
                        }
                    }, 2000);
                }
            }
        }, 1500);
    }

    // Começa pelo intent (mais confiável)
    window.location.href = intentUrl;

    // Fallback se intent não funcionar
    setTimeout(() => {
        if (!appAberto) tentar(deepLink);
    }, 2000);
}

// ── iOS: tenta deep link + universal link ───────────────────
function abrirIOS() {
    const STORE = 'https://apps.apple.com/app/garena-free-fire/id1300146617';
    let appAberto = false;

    const onVisibilityChange = () => {
        if (document.hidden) {
            appAberto = true;
            document.removeEventListener('visibilitychange', onVisibilityChange);
        }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // iOS: usar link universal é mais confiável que scheme
    const links = [
        'freefire://',
        'garena://',
        'https://ff.garena.com/'
    ];

    let idx = 0;

    function tentarLink() {
        if (appAberto) return;
        if (idx >= links.length) {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            perguntarDownload(STORE);
            return;
        }

        window.location.href = links[idx];
        idx++;

        setTimeout(() => {
            if (!appAberto) tentarLink();
        }, 2200);
    }

    tentarLink();
}

// ── Pergunta download ───────────────────────────────────────
function perguntarDownload(storeUrl) {
    // Usa notificação customizada em vez de confirm nativo
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed; inset:0; background:rgba(0,0,0,0.85);
        z-index:99999; display:flex; align-items:center; justify-content:center;
        padding:20px; backdrop-filter:blur(6px);
    `;
    overlay.innerHTML = `
        <div style="
            background:linear-gradient(160deg,#1a1400,#0e0b00);
            border:1px solid rgba(255,215,0,0.25);
            border-radius:14px; padding:28px 24px; max-width:320px; width:100%;
            text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.7);
        ">
            <div style="font-size:40px; margin-bottom:12px;">🎮</div>
            <p style="color:#fff; font-size:16px; font-weight:700; margin-bottom:8px;">Free Fire não encontrado</p>
            <p style="color:rgba(245,230,163,0.55); font-size:13px; margin-bottom:24px; line-height:1.5;">
                O app não foi detectado no dispositivo.<br>Deseja baixar agora?
            </p>
            <div style="display:flex; gap:10px;">
                <button id="dlCancel" style="
                    flex:1; padding:12px; background:transparent;
                    border:1px solid rgba(255,215,0,0.2); border-radius:9px;
                    color:rgba(245,230,163,0.5); font-size:14px; font-weight:600;
                    cursor:pointer; font-family:inherit;
                ">Cancelar</button>
                <button id="dlConfirm" style="
                    flex:1; padding:12px;
                    background:linear-gradient(135deg,#FFD700,#FF9500);
                    border:none; border-radius:9px;
                    color:#000; font-size:14px; font-weight:800;
                    cursor:pointer; font-family:inherit;
                    box-shadow:0 4px 16px rgba(255,180,0,0.35);
                ">Baixar</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('dlConfirm').onclick = () => {
        window.open(storeUrl, '_blank');
        document.body.removeChild(overlay);
    };
    document.getElementById('dlCancel').onclick = () => {
        document.body.removeChild(overlay);
    };
}

// ── Termos ──────────────────────────────────────────────────
document.getElementById('termosDashboard').addEventListener('click', (e) => {
    e.preventDefault();
    alert('📋 TERMOS DE USO VIP\n\n' +
          '• Versão VIP Premium com recursos exclusivos\n' +
          '• Não nos responsabilizamos por qualquer mal uso\n' +
          '• Use por sua conta e risco\n\n' +
          '⚠️ O uso inadequado pode resultar em banimento.\n\n' +
          '💎 Compre o VIP: https://discord.gg/J6YbmjEV');
});

// ── Notification ────────────────────────────────────────────
function showNotification(message, type) {
    const el = document.createElement('div');
    el.className = `notification ${type}`;
    el.textContent = message;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add('show'));
    });

    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 400);
    }, 1800);
}
