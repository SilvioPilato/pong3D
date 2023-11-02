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
        if (!this.tracks.has(id)) return;
        this.tracks.get(id).play();
    }
}