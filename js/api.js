export async function uploadToCloudinary(blob) {
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', 'yzqrk0q5')

    const response = await fetch('https://api.cloudinary.com/v1_1/dqdo3ghwo/auto/upload', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    return data.secure_url;
}

export async function analyzeChallenge(audioUrl, topic) {
    const transcribeResponse = await fetch('https://soile-backend-production.up.railway.app/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: audioUrl })
    });
    const transcribeData = await transcribeResponse.json();
    
    const analyzeResponse = await fetch('https://soile-backend-production.up.railway.app/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcribeData.text, topic: topic })
    })
    const analysisData = await analyzeResponse.json();

    return analysisData;
}