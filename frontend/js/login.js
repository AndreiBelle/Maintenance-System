import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js';

import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js';

import { sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js';


import { auth } from "./firebase";


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

    feedback.textContent = "Validando acesso...";

    try {
        await signInWithEmailAndPassword(auth, email, password)
        window.location.href = "./dashboard.html"
    } catch (err) {
        console.log("Ocorreu um problema ao validar: ", err)
        feedback.textContent = "Não foi possível entrar. Verifique suas credenciais e tente novamente";
    }
});

registerButton.addEventListener('click', async (event) => {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        feedback.textContent = "Necessário colocar e-mail e senha para criar a conta";
        return
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password)
        feedback.textContent = "Conta criada com sucesso!"
        setTimeout((
            window.location.href = "./dashboard.html" 
        ), 1000)
       
    } catch (err) {
        console.log("Ocorreu um problema ao validar: ", err)
        feedback.textContent = "Não foi possível entrar. Verifique suas credenciais e tente novamente";
    }
});

resetPassword.addEventListener('click', async (event) => {
    const email = emailInput.value.trim();

    if (!email) {
        feedback.textContent = "Necessário colocar e-mailresetar a senha";
        return
    }

    try {
        await sendPasswordResetEmail(auth, email)
        feedback.textContent = "E-mail enviado!";
    } catch (err) {
        console.log("Ocorreu um problema ao validar: ", err)
        feedback.textContent = "Não foi possível realizar o envio, tente novamente mais tarde!";
    }
    
})