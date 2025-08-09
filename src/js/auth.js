NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC6SVlrk8ymdPFOqN5FTUQ1QydK8YTlZeU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=eventmappr-b1b81.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=eventmappr-b1b81
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=eventmappr-b1b81.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=700964450420
NEXT_PUBLIC_FIREBASE_APP_ID=1:700964450420:web:ff727469ff05f049d5a121

firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

let currentUser = null;

firebase.auth().onAuthStateChanged((user) => {
    currentUser = user;
    updateUIForAuthState(user);
    updateNavigationForAuthState(user);
    updatePageSpecificAuthState(user);
});

function updateUIForAuthState(user) {
    const authLinks = document.getElementById('authLinks');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const eventForm = document.getElementById('eventForm');
    const authStatus = document.getElementById('authStatus');
    const authSection = document.querySelector('.auth-section');

    if (user) {
        console.log('User is signed in:', user.displayName);
        
        if (authLinks) authLinks.classList.add('d-none');
        if (userProfile) {
            userProfile.classList.remove('d-none');
            if (userName) userName.textContent = user.displayName || user.email;
        }

        if (eventForm) eventForm.style.display = 'flex';
        if (authStatus) authStatus.style.display = 'none';
        if (authSection) authSection.style.display = 'none';

        localStorage.setItem('currentUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }));

    } else {
        console.log('User is signed out');
        
        if (authLinks) authLinks.classList.remove('d-none');
        if (userProfile) userProfile.classList.add('d-none');

        if (eventForm) eventForm.style.display = 'none';
        if (authStatus) authStatus.style.display = 'block';
        if (authSection) authSection.style.display = 'block';

        localStorage.removeItem('currentUser');
    }
}

function updateNavigationForAuthState(user) {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            firebase.auth().signOut().then(() => {
                window.location.href = 'index.html';
            }).catch((error) => {
                console.error('Logout error:', error);
            });
        });
    }
}

function updatePageSpecificAuthState(user) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'explore.html':
            updateExplorePageAuth(user);
            break;
        case 'event.html':
            updateEventPageAuth(user);
            break;
        case 'index.html':
            updateHomePageAuth(user);
            break;
        case 'auth.html':
            updateAuthPageAuth(user);
            break;
    }
}

function updateExplorePageAuth(user) {
    const eventForm = document.getElementById('eventForm');
    const authStatus = document.getElementById('authStatus');
    const authSection = document.querySelector('.auth-section');
    
    if (user) {
        if (eventForm) eventForm.style.display = 'flex';
        if (authStatus) authStatus.style.display = 'none';
        if (authSection) authSection.style.display = 'none';
    } else {
        if (eventForm) eventForm.style.display = 'none';
        if (authStatus) authStatus.style.display = 'block';
        if (authSection) authSection.style.display = 'block';
    }
}

function updateEventPageAuth(user) {
    const addEventBtn = document.getElementById('addEventBtn');
    if (addEventBtn) {
        addEventBtn.style.display = user ? 'block' : 'none';
    }
}

function updateHomePageAuth(user) {
    const heroBtn = document.querySelector('.hero-btn');
    if (heroBtn && user) {
        heroBtn.href = 'explore.html';
        heroBtn.textContent = 'Start Exploring';
    }
}

function updateAuthPageAuth(user) {
    if (user) {
        window.location.href = 'index.html';
    }
}

function signInWithEmail(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

function signUpWithEmail(email, password, displayName) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return userCredential.user.updateProfile({
                displayName: displayName
            });
        });
}

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
}

function signOut() {
    return firebase.auth().signOut();
}

function getCurrentUser() {
    return currentUser;
}

function isAuthenticated() {
    return currentUser !== null;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');
    const googleLoginBtn = document.getElementById('googleLogin');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                await signInWithEmail(email, password);
                window.location.href = 'index.html';
            } catch (error) {
                if (loginError) {
                    loginError.textContent = error.message;
                    loginError.style.display = 'block';
                }
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            try {
                await signUpWithEmail(email, password, name);
                window.location.href = 'index.html';
            } catch (error) {
                if (signupError) {
                    signupError.textContent = error.message;
                    signupError.style.display = 'block';
                }
            }
        });
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            try {
                await signInWithGoogle();
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Google sign-in error:', error);
            }
        });
    }

    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const inputId = button.getAttribute('data-target');
            const input = document.getElementById(inputId);
            const icon = button.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabName}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });
});

window.authManager = {
    getCurrentUser,
    isAuthenticated,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut
}; 
// === Dark Mode Toggle ===
const toggleButton = document.getElementById('darkModeToggle');
if (toggleButton) {
    const icon = toggleButton.querySelector('i');

    // On load, apply stored theme
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    toggleButton.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');

        // Update icon
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);

        // Store preference
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    });
}
