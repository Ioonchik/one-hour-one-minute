import { historyList, progressBarFill, historyCount, sumTime, avgScoreText, levelText, streakText, viewHistoryBtn, backHomeBtn } from "./dom.js";
import { getUserChallenges } from "./challenges.js";

export function calculateStats(challenges) {
    let count = 0;
    let scoredCount = 0;
    let timeSum = 0;
    let scoreSum = 0;
    let totalXp = 0;

    const uniqueDates = new Set();

    challenges.forEach(function(data) {
        count += 1;
        timeSum += data.researchTime + data.explainTime;

        if (data.createdAt !== undefined) {
            const date = data.createdAt.toDate();
            const dateString = toLocalDateString(date);
            uniqueDates.add(dateString);
        }
        
        if (data.score !== undefined) {
            let multiplier = data.isBoss ? 2 : 1
            scoredCount += 1;
            totalXp += data.score * 10 * multiplier;
            scoreSum += data.score;
        }
    });

    const avgScore = scoredCount > 0 ? scoreSum / scoredCount : null;

    let streak = 0;
    let checkDate = new Date();

    if (!uniqueDates.has(toLocalDateString(checkDate))) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (uniqueDates.has(toLocalDateString(checkDate))) {
        streak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
    }
    

    return { count, timeSum, avgScore, totalXp, streak };
}

export function renderHistory(challenges, stats) {
    historyList.innerHTML = "";

    challenges.forEach(function(data) {
        historyList.innerHTML += "<p>" + data.topic + " — Research: " + data.researchTime + "s, Explain: " + data.explainTime + "s</p>";
    }) 
    
    const level = Math.floor(stats.totalXp / 100) + 1
    const xpInCurrentLevel = stats.totalXp % 100;
    const progressPercent = (xpInCurrentLevel / 100) * 100;
    progressBarFill.style.width = progressPercent + "%";

    historyCount.textContent = stats.count + " topic learned";
    sumTime.textContent = stats.timeSum;
    avgScoreText.textContent = stats.avgScore !== null ? stats.avgScore.toFixed(1) : "No data yet";
    levelText.textContent = "XP: " + xpInCurrentLevel + " / 100";
    streakText.textContent = "🔥 " + stats.streak + " day streak";
}

function toLocalDateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
}

viewHistoryBtn.addEventListener('click', async function() {
    homeScreen.style.display = "none";
    historyScreen.style.display = "block";

    const challenges = await getUserChallenges();
    const stats = calculateStats(challenges);
    renderHistory(challenges, stats);
})

backHomeBtn.addEventListener('click', function() {
    historyScreen.style.display = "none";
    homeScreen.style.display = "block";
})