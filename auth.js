// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDOhPO50_bSDoNJ1lKOV7NRN672dq_1Ldg",
  authDomain: "eventmappr23.firebaseapp.com",
  projectId: "eventmappr23",
  storageBucket: "eventmappr23.firebasestorage.app",
  messagingSenderId: "767568582880",
  appId: "1:767568582880:web:c5438cf3a3d371a47d1885",
  measurementId: "G-VG4E8PJ29S"
});

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
                const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
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
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                await userCredential.user.updateProfile({
                    displayName: name
                });
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
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                const result = await firebase.auth().signInWithPopup(provider);
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Google sign-in error:', error);
            }
        });
    }
        // Password visibility toggles
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


    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabName}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
    
        console.log('User is signed in:', user.displayName);
        const authLinks = document.getElementById('authLinks');
        const userProfile = document.getElementById('userProfile');
        const userName = document.getElementById('userName');
        
        if (authLinks) authLinks.classList.add('d-none');
        if (userProfile) {
            userProfile.classList.remove('d-none');
            if (userName) userName.textContent = user.displayName || user.email;
        }
    } else {
        console.log('User is signed out');
        const authLinks = document.getElementById('authLinks');
        const userProfile = document.getElementById('userProfile');
        
        if (authLinks) authLinks.classList.remove('d-none');
        if (userProfile) userProfile.classList.add('d-none');
    }

}); 