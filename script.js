const topics = ["Topic 1", "Topic 2", "Topic 3"];
const randomBtn = document.getElementById('randomBtn');
const topicDisplay = document.getElementById('topicDisplay');
const timerDisplay = document.getElementById('timerDisplay');

let timer;
 
randomBtn.addEventListener('click', function() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    topicDisplay.textContent = randomTopic;

    let timeLeft = 10;
    clearInterval(timer);
    timer = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(timer);
            const audio = new Audio("sounds/timeup.mp3");
            audio.play();
            timerDisplay.textContent = "Time's up! 🎉";
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

