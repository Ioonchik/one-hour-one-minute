import { auth } from "../firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { emailInput, passwordInput, signUpBtn, signInBtn, authError, authScreen, homeScreen, userEmailText, logoutBtn } from "./dom.js";

signUpBtn.addEventListener('click', async function () {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        authError.textContent = error.message;
    }
})

signInBtn.addEventListener('click', async function () {
    console.log("asd");
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        authError.textContent = error.message;
    }
})