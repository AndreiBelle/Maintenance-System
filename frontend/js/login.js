import { auth } from "./services/firebase.js";
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';


const loginForm = document.querySelector('#loginForm');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const feedback = document.querySelector('#feedback');
const registerButton = document.querySelector('#registerButton');
const resetPassword = document.querySelector('#resetPasswordButton');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;


    try {
        await signInWithEmailAndPassword(auth, email, password)
        window.location.href = "./pages/dashboard.html"
    } catch (err) {
        console.error("Ocorreu um problema ao validar: ", err)
    }
});

registerButton.addEventListener('click', () => {

    window.location.href = "./pages/auth/register.html" 

});

// resetPassword.addEventListener('click', async (event) => {
//     const email = emailInput.value.trim();

//     if (!email) {
//         feedback.textContent = "Necessário colocar e-mail para resetar a senha";
//         return
//     }

//     try {
//         await sendPasswordResetEmail(auth, email)
//         feedback.textContent = "E-mail enviado!";
//     } catch (err) {
//         console.log("Ocorreu um problema ao validar: ", err)
//         feedback.textContent = "Não foi possível realizar o envio, tente novamente mais tarde!";
//     }
    
// })