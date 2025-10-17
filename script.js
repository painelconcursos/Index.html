document.addEventListener('DOMContentLoaded', function () {
    // --- CONFIGURAÇÃO DO FIREBASE ---
    const firebaseConfig = {
        apiKey: "AIzaSyDTryEmse4UpbLMXCuixkIBwqxjHHDcFRg",
        authDomain: "painel-concursos.firebaseapp.com",
        projectId: "painel-concursos",
        storageBucket: "painel-concursos.appspot.com",
        messagingSenderId: "862822230527",
        appId: "1:862822230527:web:07656b3af50ee4aa29dfca"
    };

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    // --- ELEMENTOS DA UI ---
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const userInfoDiv = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const loginModal = document.getElementById('login-modal');
    const closeModalButton = document.getElementById('close-modal');
    const googleSignInButton = document.getElementById('google-signin');
    const navMenuButton = document.getElementById('nav-menu-button');
    const navMenu = document.getElementById('nav-menu');
    const openDocsModalButton = document.getElementById('open-docs-modal-button');
    const docsModal = document.getElementById('docs-modal');
    const closeDocsModalButton = document.getElementById('close-docs-modal');
    const docsForm = document.getElementById('docs-form');

    // --- FUNÇÕES DE ATUALIZAÇÃO DE DADOS ---
    function updateUserPaymentLinks(user) {
        if (window.location.pathname.includes('/planos')) {
            const planoStartLink = document.getElementById('plano-start-link');
            const planoCompletoLink = document.getElementById('plano-completo-link');

            if (user && user.uid && planoStartLink && planoCompletoLink) {
                const baseStartURL = "https://www.asaas.com/c/dxam6zihgy7ce0bu";
                const baseCompletoURL = "https://www.asaas.com/c/7qtj87ok4gqdwyxw";
                planoStartLink.href = `${baseStartURL}?externalReference=${user.uid}`;
                planoCompletoLink.href = `${baseCompletoURL}?externalReference=${user.uid}`;
            }
        }
    }

    async function updateAccountInfo(user) {
        const accountName = document.getElementById('account-name');
        const accountEmail = document.getElementById('account-email');
        const meuPlanoDiv = document.getElementById("meu-plano-div");

        if (accountName && accountEmail) {
            accountName.textContent = user.displayName;
            accountEmail.textContent = user.email;
        }

        if (user && meuPlanoDiv) {
            const db = firebase.database();
            // LINHA CORRIGIDA AQUI!
            const userRef = db.ref('users/' + user.uid);
            try {
                const snapshot = await userRef.get();
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    meuPlanoDiv.innerHTML = `<p class="text-lg"><strong>Plano:</strong> ${userData.plano || 'N/A'}</p><p class="text-green-600 font-semibold"><strong>Status:</strong> ${userData.statusPlano || 'N/A'}</p>`;
                } else {
                    meuPlanoDiv.innerHTML = `<p>Você ainda não possui um plano ativo.</p><a href="planos.html" class="font-semibold hover:underline mt-2 inline-block">Ver planos disponíveis</a>`;
                }
            } catch (error) {
                console.error("Erro ao buscar informações do plano: ", error);
                meuPlanoDiv.innerHTML = `<p class="text-red-500">Ocorreu um erro ao carregar as informações do seu plano.</p>`;
            }
        }
    }

    // --- GERENCIADOR CENTRAL DE AUTENTICAÇÃO ---
    auth.onAuthStateChanged(user => {
        if (user) {
            // --- USUÁRIO LOGADO ---
            const firstName = user.displayName.split(' ')[0];
            if (loginButton) loginButton.style.display = 'none';
            if (userInfoDiv) userInfoDiv.classList.remove('hidden');
            if (userNameSpan) userNameSpan.textContent = firstName;
            if (loginModal) loginModal.classList.add('hidden');
            
            updateAccountInfo(user);
            updateUserPaymentLinks(user);

        } else {
            // --- USUÁRIO DESLOGADO ---
            if (loginButton) loginButton.style.display = 'block';
            if (userInfoDiv) userInfoDiv.classList.add('hidden');
            if (window.location.pathname.includes('minha-conta.html')) {
                window.location.replace('index.html');
            }
        }
    });

    // --- LÓGICA DE LOGIN/LOGOUT E INTERFACE ---
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', () => {
            const authError = document.getElementById('auth-error');
            auth.signInWithPopup(provider)
                .then(() => { window.location.href = 'minha-conta.html'; })
                .catch(error => { console.error("Erro login: ", error); if (authError) authError.textContent = "Falha no login: " + error.message; });
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => { e.preventDefault(); auth.signOut().then(() => { window.location.href = 'index.html'; }); });
    }

    if (loginModal && loginButton) {
        loginButton.addEventListener('click', (e) => { e.preventDefault(); loginModal.classList.remove('hidden'); });
        if(closeModalButton) { closeModalButton.addEventListener('click', () => { loginModal.classList.add('hidden'); }); }
        loginModal.addEventListener('click', (e) => { if (e.target === loginModal) { loginModal.classList.add('hidden'); } });
    }

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', () => { userMenu.classList.toggle('hidden'); });
        document.addEventListener('click', function(event) { if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) { userMenu.classList.add('hidden'); } });
    }

    if (navMenuButton && navMenu) {
        navMenuButton.addEventListener('click', () => { if(userMenu) userMenu.classList.add('hidden'); navMenu.classList.toggle('hidden'); });
        document.addEventListener('click', function(event) { if (!navMenuButton.contains(event.target) && !navMenu.contains(event.target)) { navMenu.classList.add('hidden'); } });
    }

    if (openDocsModalButton && docsModal && closeDocsModalButton) {
        openDocsModalButton.addEventListener('click', () => { docsModal.classList.remove('hidden'); });
        closeDocsModalButton.addEventListener('click', () => { docsModal.classList.add('hidden'); });
        docsModal.addEventListener('click', (e) => { if (e.target === docsModal) { docsModal.classList.add('hidden'); } });
        if (docsForm) {
            docsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Documentos enviados para análise!');
                docsModal.classList.add('hidden');
                docsForm.reset();
            });
        }
    }
});
