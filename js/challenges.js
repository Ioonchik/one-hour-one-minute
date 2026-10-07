import { auth, db } from "../firebase-config.js";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function isNextChallengeBoss() {
    const nextChallengeNumber = (await getUserChallenges()).length + 1;

    return nextChallengeNumber % 5 === 0;
}

export async function saveChallenge(topic, researchTime, explainTime, audioUrl, analysis, isBoss) {
    await addDoc(collection(db, "challenges"), {
        topic: topic,
        researchTime: researchTime,
        explainTime: explainTime,
        userId: auth.currentUser.uid,
        audioUrl: audioUrl,
        score: analysis.score,
        fillerWordsCount: analysis.fillerWordsCount,
        feedback: analysis.feedback,
        coversTopicWell: analysis.coversTopicWell,
        isBoss: isBoss,
        createdAt: serverTimestamp(),
    });
}

export async function getUserChallenges() {
    const q = query(collection(db, "challenges"), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
}