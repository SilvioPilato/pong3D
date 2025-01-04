export class AudioHandler {
    static tracks = new Map();

    static addTrack(audio, id) {
        this.tracks.set(id, audio);
    }

    static setMuted(muted = true) {
        for (let [_, track] of this.tracks) {
            track.muted = muted;
        }
    }

    static setVolume(volume = 1) {
        for (let [_, track] of this.tracks) {
            track.volume = volume;
        }
    }


    static play(id) {
        let track = this.tracks.get(id);
        if (!track || track.muted) return;
        track.play();
    }
}