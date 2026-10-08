import { topics } from "./topics.js";
import { getMicrophoneAccess } from "./recorder.js";
import { uploadToCloudinary, analyzeChallenge } from "./api.js";
import { isNextChallengeBoss, saveChallenge } from "./challenges.js";
import { randomBtn, topicDisplay, timerDisplay, resultDisplay, homeScreen, researchScreen, explainScreen, resultScreen, savingIndicator } from "./dom.js";

let timer;
let explainTimer;

randomBtn.addEventListener('click', async function() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const isBoss = await isNextChallengeBoss();
    topicDisplay.textContent = randomTopic;
    homeScreen.style.display = "none";
    researchScreen.style.display = "block";

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

        timerDisplay.textContent = formatTime(researchTimeLeft);

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

        timerDisplay.textContent = formatTime(explainTimeLeft);

        explainTimeLeft -= 1;
    }, 1000);
}

function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return minutes + ":" + seconds;
}