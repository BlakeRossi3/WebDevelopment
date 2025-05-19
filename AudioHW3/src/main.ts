import * as utils from './utils';
import * as audio from './audio';
import * as canvas from './canvas';
import { DrawParams } from './interfaces/draw-params';


const drawParams: DrawParams = {
    showBars: true,
    showCircles: true,
    showNoise: false,
    showInvert: false,
    showEmboss: false,
};

const DEFAULTS = Object.freeze({
    sound1: "media/New Adventure Theme.mp3",
});

const init = (): void => {
    audio.setupWebaudio(DEFAULTS.sound1);
    const canvasElement = document.querySelector("canvas") as HTMLCanvasElement;
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
};

const setupUI = (canvasElement: HTMLCanvasElement): void => {
    fetch('data/av-data.json')
    .then(response => response.json())
    .then(data => {
        const contentDiv = document.querySelector("#instructions");
        if (contentDiv) {
            data.instructions.forEach(paragraph => {
                const p = document.createElement('p');
                p.textContent = paragraph;
                contentDiv.appendChild(p);
            });
        } else {
            console.error("Element with ID 'instructions' not found.");
        }
    })
    .catch(error => {
        console.error('Error loading JSON data:', error);
    });

    const fsButton = document.querySelector("#fs-button") as HTMLButtonElement;
    const playButton = document.querySelector("#play-button") as HTMLButtonElement;

    fsButton.onclick = () => {
        utils.goFullscreen(canvasElement);
    };

    playButton.onclick = (e: MouseEvent) => {
        const target = e.target as HTMLButtonElement;
        if (audio.audioCtx.state === "suspended") {
            audio.audioCtx.resume();
        }
        if (target.dataset.playing === "no") {
            audio.playCurrentSound();
            target.dataset.playing = "yes";
        } else {
            audio.pauseCurrentSound();
            target.dataset.playing = "no";
        }
    };

    const audioFormButton = document.querySelector("#audio-form-button") as HTMLButtonElement;

    audioFormButton.onclick = () => {
        canvas.changeAudioForm();

        if (canvas.getWaveForm()) {
            audioFormButton.innerHTML = "Waveform Mode";
        } else {
            audioFormButton.innerHTML = "Frequency Mode";
        }
    };

    document.getElementById("toggle-panel")?.addEventListener("click", function () {
        const panel = document.getElementById("left-panel");
        if (panel?.style.display === "none" || panel?.style.display === "") {
            if (panel) panel.style.display = "block";
            this.textContent = "Hide Controls";
        } else {
            if (panel) panel.style.display = "none";
            this.textContent = "Show Controls";
        }
    });

    const volumeSlider = document.querySelector("#volume-slider") as HTMLInputElement;
    const volumeLabel = document.querySelector("#volume-label") as HTMLLabelElement;

    const bassSlider = document.querySelector("#bass-slider") as HTMLInputElement;
    const trebleSlider = document.querySelector("#treble-slider") as HTMLInputElement;

    volumeSlider.oninput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        audio.setVolume(Number(target.value));
        volumeLabel.innerHTML = Math.round((Number(target.value) / 2) * 100).toString();
        const minSpeed = 0.5;
        const maxSpeed = 2.0;
        const newPlaybackRate = minSpeed + (Number(target.value) / 2) * (maxSpeed - minSpeed);

        (document.getElementById("mew-gif") as HTMLVideoElement).playbackRate = newPlaybackRate;
    };

    bassSlider.oninput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const value = Number(target.value);
        audio.bassNode.gain.value = value;
    };

    trebleSlider.oninput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const value = Number(target.value);
        audio.trebleNode.gain.value = value;
    };

    volumeSlider.dispatchEvent(new Event("input"));
    bassSlider.value = "0";
    trebleSlider.value = "0";

    const fileInput = document.querySelector("#file-input") as HTMLInputElement;
    const defaultTrackButton = document.querySelector("#default-track-btn") as HTMLButtonElement;
    const nowPlaying = document.querySelector("#now-playing") as HTMLDivElement;

    fileInput.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            audio.loadSoundFile(objectURL);
            nowPlaying.innerHTML = "Now playing: " + file.name;
        }
    };

    defaultTrackButton.onclick = () => {
        audio.loadSoundFile("media/New Adventure Theme.mp3");
        nowPlaying.innerHTML = "Now playing: New Adventure Theme.mp3";
    };

    (document.querySelector("#cb-bars") as HTMLInputElement).onclick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        drawParams.showBars = target.checked;
    };
    (document.querySelector("#cb-circles") as HTMLInputElement).onclick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        drawParams.showCircles = target.checked;
    };
    (document.querySelector("#cb-noise") as HTMLInputElement).onclick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        drawParams.showNoise = target.checked;
    };
    (document.querySelector("#cb-invert") as HTMLInputElement).onclick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        drawParams.showInvert = target.checked;
    };
    (document.querySelector("#cb-emboss") as HTMLInputElement).onclick = (e: Event) => {
        const target = e.target as HTMLInputElement;
        drawParams.showEmboss = target.checked;
    };
};

const loop = (): void => {
    requestAnimationFrame(loop);
    canvas.draw(drawParams);
};

export { init };