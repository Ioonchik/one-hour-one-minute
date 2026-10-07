import { topics } from "./topics.js";

import { auth, db } from "../firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { getMicrophoneAccess } from "./recorder.js";
import { uploadToCloudinary, analyzeChallenge } from "./api.js";

import "./auth.js";
import { randomBtn, topicDisplay, homeScreen, researchScreen, explainScreen, timerDisplay, resultDisplay, savingIndicator, authScreen, userEmailText, logoutBtn, historyScreen, viewHistoryBtn, backHomeBtn } from "./dom.js";
import { saveChallenge, isNextChallengeBoss, getUserChallenges } from "./challenges.js";
import "./history.js";

let timer;
let explainTimer;

randomBtn.addEventListener('click', async function() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const isBoss = await isNextChallengeBoss();
    topicDisplay.textContent = randomTopic;
    homeScreen.style.display = "none";
    researchScreen.style.display = "block";
    console.log(isBoss);

    if (isBoss) {
        researchScreen.classList.add('boss-mode');
    } else {
        researchScreen.classList.remove('boss-mode');
    }

    let researchTimeLeft = 10;
    let initialResearchTimeLeft = researchTimeLeft;
    clearInterval(timer);
    timer = setInterval(async function() {
        if (researchTimeLeft <= 0) {
            clearInterval(timer);

            researchScreen.style.display = "none";
            explainScreen.style.display = "block";

            const audio = new Audio("sounds/timeup.mp3");
            audio.play();
            timerDisplay.textContent = "Time's up! 🎉";

            await runExplainPhase(randomTopic, isBoss, initialResearchTimeLeft)
            return;
        }

        const minutes = Math.floor(researchTimeLeft / 60);
        const seconds = researchTimeLeft % 60;
        
        const formattedMinutes = minutes < 10 ? "0"+minutes : minutes;
        const formattedSeconds = seconds < 10 ? "0"+seconds : seconds;

        timerDisplay.textContent = formattedMinutes + ":" + formattedSeconds;

        researchTimeLeft -= 1;
    }, 1000);
});

async function runExplainPhase(topic, isBoss, researchTime) {
    explainScreen.style.display = "block";

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

            resultDisplay.innerHTML = "You learned: " + topic + "<br>" + "Research time: " + researchTime + "s"
            + "<br>" + "Explain time: " + initialExplainTimeLeft + "s";

            mediaRecorder.stop();


            mediaRecorder.onstop = async function() {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

                savingIndicator.style.display = "block";

                const audioUrl = await uploadToCloudinary(audioBlob);

                const analysis = await analyzeChallenge(audioUrl, topic);

                await saveChallenge(
                    topic,
                    researchTime,
                    initialExplainTimeLeft,
                    audioUrl,
                    analysis,
                    isBoss
                )

                savingIndicator.style.display = "none";
                
            };

            return;
        }

        const minutes = Math.floor(explainTimeLeft / 60);
        const seconds = explainTimeLeft % 60;

        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

        timerDisplay.textContent = formattedMinutes + ":" + formattedSeconds;

        explainTimeLeft -= 1;
    }, 1000);
}

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

