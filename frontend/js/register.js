import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';


const registerForm = document.getElementById('registerForm');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const btnLogin = document.querySelector('#btnLogin');


registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
        const password = passwordInput.value;
    
        if (!email || !password) {
            feedback.textContent = "Necessário colocar e-mail e senha para criar a conta";
            return
        }
    
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            setTimeout((
                window.location.href = "../dashboard.html" 
            ), 1000)
           
        } catch (err) {
            console.error("Ocorreu um problema ao validar: ", err)
        }
});

btnLogin.addEventListener('click', () => {
    window.location.href = "../../login.html";
})