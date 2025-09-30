document.addEventListener('DOMContentLoaded', function () {
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

    // --- Elementos da UI ---
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const userInfoDiv = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const loginModal = document.getElementById('login-modal');
    const closeModalButton = document.getElementById('close-modal');
    const googleSignInButton = document.getElementById('google-signin');

    // --- LÓGICA DO MODAL DE LOGIN ---
    if (loginModal && loginButton) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.remove('hidden');
        });
        if(closeModalButton) {
            closeModalButton.addEventListener('click', () => {
                loginModal.classList.add('hidden');
            });
        }
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.add('hidden');
            }
        });
    }

    // --- LÓGICA DE AUTENTICAÇÃO ---

    // Ação de Login com Google (botão de dentro do modal)
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', () => {
            const authError = document.getElementById('auth-error');
            auth.signInWithPopup(provider)
                .then((result) => {
                    // **CORREÇÃO APLICADA AQUI**
                    // O redirecionamento agora acontece apenas no sucesso do login.
                    window.location.href = 'minha-conta.html';
                })
                .catch(error => {
                    console.error("Erro ao fazer login com Google: ", error);
                    if (authError) authError.textContent = "Falha no login: " + error.message;
                });
        });
    }

    // Ação de Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            auth.signOut().then(() => {
                // Garante que o usuário vá para a home page ao deslogar
                window.location.href = 'index.html';
            });
        });
    }

    // Gerenciador de estado de autenticação
    auth.onAuthStateChanged(user => {
        if (user) {
            // --- USUÁRIO LOGADO ---
            const firstName = user.displayName.split(' ')[0];

            if (loginButton) loginButton.style.display = 'none';
            if (userInfoDiv) userInfoDiv.classList.remove('hidden');
            if (userNameSpan) userNameSpan.textContent = firstName;
            if (loginModal) loginModal.classList.add('hidden');

            // **CORREÇÃO APLICADA AQUI**
            // Lógica de redirecionamento foi REMOVIDA daqui para evitar o loop.
            // O código abaixo apenas preenche os dados se o usuário estiver na página.
            if (window.location.pathname.includes('minha-conta.html')) {
                const accountName = document.getElementById('account-name');
                const accountEmail = document.getElementById('account-email');
                if (accountName) accountName.textContent = user.displayName;
                if (accountEmail) accountEmail.textContent = user.email;
            }

        } else {
            // --- USUÁRIO DESLOGADO ---
            if (loginButton) loginButton.style.display = 'block';
            if (userInfoDiv) userInfoDiv.classList.add('hidden');

            if (window.location.pathname.includes('minha-conta.html')) {
                window.location.replace('index.html');
            }
        }
    });

    // Toggle do menu dropdown do usuário
    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', () => {
            userMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', function(event) {
            if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
                userMenu.classList.add('hidden');
            }
        });
    }

    // Lógica do Menu de Navegação
    const navMenuButton = document.getElementById('nav-menu-button');
    const navMenu = document.getElementById('nav-menu');
    if (navMenuButton && navMenu) {
        navMenuButton.addEventListener('click', () => {
            if(userMenu) userMenu.classList.add('hidden');
            navMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', function(event) {
            if (!navMenuButton.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.add('hidden');
            }
        });
    }

    // --- LÓGICA DO MODAL DE DOCUMENTOS (Página Minha Conta) ---
    const openDocsModalButton = document.getElementById('open-docs-modal-button');
    const docsModal = document.getElementById('docs-modal');
    const closeDocsModalButton = document.getElementById('close-docs-modal');
    const docsForm = document.getElementById('docs-form');

    if (openDocsModalButton && docsModal && closeDocsModalButton) {
        openDocsModalButton.addEventListener('click', () => {
            docsModal.classList.remove('hidden');
        });
        closeDocsModalButton.addEventListener('click', () => {
            docsModal.classList.add('hidden');
        });
        docsModal.addEventListener('click', (e) => {
            if (e.target === docsModal) {
                docsModal.classList.add('hidden');
            }
        });
        if (docsForm) {
            docsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Documentos enviados para análise! Agradecemos a colaboração.');
                docsModal.classList.add('hidden');
                docsForm.reset();
            });
        }
    }
});
