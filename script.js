const topics = [
    "Why is the sky blue?",
    "How do black holes work?",
    "Why do we dream?",
    "How does anesthesia work?",
    "Why do we get hiccups?",
    "How does a microwave heat food?",
    "Why do magnets attract?",
    "How do vaccines work?",
    "Why does time feel faster as we get older?",
    "How do airplanes fly?",
    "Why do we have fingerprints?",
    "How does the immune system recognize viruses?",
    "Why does ice float?",
    "How do batteries work?",
    "What causes earthquakes?",
    "Why did the Roman Empire fall?",
    "How did the printing press change the world?",
    "Why did the Cold War happen?",
    "How did the Internet begin?",
    "Why did humans start farming?",
    "How did money originate?",
    "Why do countries have borders?",
    "How did democracy develop?",
    "Why did the Titanic sink?",
    "How did the Silk Road work?",
    "How does GPS know where you are?",
    "How does Wi-Fi work?",
    "How does facial recognition work?",
    "How does Bitcoin work?",
    "How does a search engine work?",
    "How do recommendation algorithms work?",
    "How does cloud computing work?",
    "How do video games render graphics?",
    "How does a QR code work?",
    "How does encryption work?",
    "Why do we sleep?",
    "How does the brain store memories?",
    "Why do we age?",
    "Why do muscles grow?",
    "How does the heart pump blood?",
    "Why do we blush?",
    "Why do we sneeze?",
    "How does hearing work?",
    "Why do we feel pain?",
    "How does caffeine affect the brain?",
    "Why does inflation happen?",
    "How does the stock market work?",
    "Why do companies go bankrupt?",
    "How do banks make money?",
    "Why does the price of gold change?",
    "What causes economic recessions?",
    "Why are some countries rich and others poor?",
    "How does compound interest work?",
    "Why does supply and demand affect prices?",
    "How does a credit card company make money?",
    "Why are LEGO bricks so strong?",
    "How does a piano make sound?",
    "Why do onions make us cry?",
    "Why are cats afraid of cucumbers?",
    "How does perfume work?",
    "Why do popcorn kernels explode?",
    "How does a vending machine know what you bought?",
    "Why do we have different accents?",
    "How does magic actually fool the brain?",
    "Why are diamonds so expensive?",
    "How does a lie detector work?",
    "Why do people believe conspiracy theories?",
    "How does a roller coaster stay on the track?",
    "Why are bananas slightly radioactive?",
    "How does a barcode work?"
];

import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
 
const randomBtn = document.getElementById('randomBtn');
const topicDisplay = document.getElementById('topicDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const resultDisplay = document.getElementById('resultDisplay');

const homeScreen = document.getElementById('homeScreen');
const researchScreen = document.getElementById('researchScreen');
const explainScreen = document.getElementById('explainScreen');
const resultScreen = document.getElementById('resultScreen');

const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const signUpBtn = document.getElementById('signUpBtn');
const signInBtn = document.getElementById('signInBtn');
const authError = document.getElementById('authError');
const authScreen = document.getElementById('authScreen');

const userEmailText = document.getElementById('userEmail')
const logoutBtn = document.getElementById('logoutBtn')

const historyScreen = document.getElementById('historyScreen');
const historyCount = document.getElementById('historyCount');
const historyList = document.getElementById('historyList');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');
const backHomeBtn = document.getElementById('backHomeBtn');

const db = getFirestore()

let timer;
let explainTimer;

randomBtn.addEventListener('click', function() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    topicDisplay.textContent = randomTopic;
    homeScreen.style.display = "none";
    researchScreen.style.display = "block";

    let timeLeft = 10;
    let initialTimeLeft = timeLeft;
    clearInterval(timer);
    timer = setInterval(async function() {
        if (timeLeft <= 0) {
            clearInterval(timer);

            researchScreen.style.display = "none";
            explainScreen.style.display = "block";

            const audio = new Audio("sounds/timeup.mp3");
            audio.play();
            timerDisplay.textContent = "Time's up! 🎉";

            const stream = await getMicrophoneAccess();

            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorder.ondataavailable = function(event) {
                audioChunks.push(event.data);
            };

            mediaRecorder.start()

            let explainTimeLeft = 10;
            let initialExplainTimeLeft = explainTimeLeft;
            explainTimer = setInterval(async function() {
                if (explainTimeLeft <= 0) {
                    clearInterval(explainTimer);
                    
                    explainScreen.style.display = "none";
                    resultScreen.style.display = "block";

                    resultDisplay.innerHTML = "You learned: " + randomTopic + "<br>" + "Research time: " + initialTimeLeft + "s"
                    + "<br>" + "Explain time: " + initialExplainTimeLeft + "s";

                    mediaRecorder.stop();

                    mediaRecorder.onstop = function() {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        console.log(audioBlob);
                    }

                    await addDoc(collection(db, "challenges"), {
                        topic: randomTopic,
                        researchTime: initialTimeLeft,
                        explainTime: initialExplainTimeLeft,
                        userId: auth.currentUser.uid,
                    })
                    return;
                }

                const minutes = Math.floor(explainTimeLeft / 60);
                const seconds = explainTimeLeft % 60;

                const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
                const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

                timerDisplay.textContent = formattedMinutes + ":" + formattedSeconds;

                explainTimeLeft -= 1;
            }, 1000);
            return;
        }

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        const formattedMinutes = minutes < 10 ? "0"+minutes : minutes;
        const formattedSeconds = seconds < 10 ? "0"+seconds : seconds;

        timerDisplay.textContent = formattedMinutes + ":" + formattedSeconds;

        timeLeft -= 1;
    }, 1000);
});

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
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        authError.textContent = error.message;
    }
})

onAuthStateChanged(auth, function(user) {
    if (user) {
        authScreen.style.display = "none";
        homeScreen.style.display = "block";

        userEmailText.textContent = user.email;
    } else {
        authScreen.style.display = "block";
        homeScreen.style.display = "none";
    }
})

logoutBtn.addEventListener('click', async function() {
    try {
        await signOut(auth);
    } catch {
        //pass
    }
})

viewHistoryBtn.addEventListener('click', async function() {
    homeScreen.style.display = "none";
    historyScreen.style.display = "block";

    const q = query(collection(db, "challenges"), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    historyList.innerHTML = "";
    let count = 0;

    querySnapshot.forEach(function(doc) {
        const data = doc.data();
        count += 1;

        historyList.innerHTML += "<p>" + data.topic + " — Research: " + data.researchTime + "s, Explain: " + data.explainTime + "s</p>";
    });

    historyCount.textContent = count + " topic learned";
})

backHomeBtn.addEventListener('click', function() {
    historyScreen.style.display = "none";
    homeScreen.style.display = "block";
})


async function getMicrophoneAccess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        return stream;
    } catch (error) {
        console.log("Microphone access denied:", error);
    }
}