const topics = ["Topic 1", "Topic 2", "Topic 3"];
const randomBtn = document.getElementById('randomBtn');
const topicDisplay = document.getElementById('topicDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const resultDisplay = document.getElementById('resultDisplay');

const homeScreen = document.getElementById('homeScreen');
const researchScreen = document.getElementById('researchScreen');
const explainScreen = document.getElementById('explainScreen');
const resultScreen = document.getElementById('resultScreen');


let timer;
let explainTimer;

randomBtn.addEventListener('click', function() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    topicDisplay.textContent = randomTopic;
    homeScreen.style.display = "none";
    researchScreen.style.display = "block";

    let timeLeft = 3;
    let initialTimeLeft = timeLeft;
    clearInterval(timer);
    timer = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(timer);

            researchScreen.style.display = "none";
            explainScreen.style.display = "block";

            const audio = new Audio("sounds/timeup.mp3");
            audio.play();
            timerDisplay.textContent = "Time's up! 🎉";
            
            let explainTimeLeft = 2;
            let initialExplainTimeLeft = explainTimeLeft;
            explainTimer = setInterval(function() {
                if (explainTimeLeft <= 0) {
                    clearInterval(explainTimer);
                    
                    explainScreen.style.display = "none";
                    resultScreen.style.display = "block";

                    resultDisplay.innerHTML = "You learned: " + randomTopic + "<br>" + "Research time: " + initialTimeLeft + "s"
                    + "<br>" + "Explain time: " + initialExplainTimeLeft + "s";
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

