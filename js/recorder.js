export async function getMicrophoneAccess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        return stream;
    } catch (error) {
        console.log("Microphone access denied:", error);
    }
}
