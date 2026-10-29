import { auth } from '../services/firebase.js'

export async function verifyTokenAndUser() {
    try{
        const currentUser = auth.currentUser;  

        if(!currentUser) {
            window.location.href = '../../login.html';
            return;
        }
    const idToken = await currentUser.getIdToken();
    
    return idToken;
    } catch (err) {
        console.error("Sessão expirada ou inválida! ",err);
    }
};