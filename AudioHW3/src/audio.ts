let audioCtx: AudioContext;

let element: HTMLAudioElement, sourceNode: MediaElementAudioSourceNode, analyserNode: AnalyserNode, gainNode: GainNode, bassNode: BiquadFilterNode, trebleNode: BiquadFilterNode;

const DEFAULTS = Object.freeze({
    gain: 0.5,
    numSamples: 256,
});

let audioData: Uint8Array = new Uint8Array(DEFAULTS.numSamples / 2);

const setupWebaudio = (filePath: string): void => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContext();

    element = new Audio();

    loadSoundFile(filePath);

    sourceNode = audioCtx.createMediaElementSource(element);

    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = DEFAULTS.numSamples;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    bassNode = audioCtx.createBiquadFilter();
    bassNode.type = "lowshelf";
    bassNode.frequency.value = 200;
    bassNode.gain.value = 0;

    trebleNode = audioCtx.createBiquadFilter();
    trebleNode.type = "highshelf";
    trebleNode.frequency.value = 3000;
    trebleNode.gain.value = 0;

    sourceNode.connect(bassNode);
    bassNode.connect(trebleNode);
    trebleNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
};

const loadSoundFile = (filePath: string): void => {
    element.src = filePath;
};

const playCurrentSound = (): void => {
    element.play();
};

const pauseCurrentSound = (): void => {
    element.pause();
};

const setVolume = (value: number): void => {
    gainNode.gain.value = value;
};

const setBass = (value: number): void => {
    bassNode.gain.value = value;
};

const setTreble = (value: number): void => {
    trebleNode.gain.value = value;
};

export {
    audioCtx,
    setupWebaudio,
    playCurrentSound,
    pauseCurrentSound,
    loadSoundFile,
    setVolume,
    analyserNode,
    bassNode,
    trebleNode,
    setBass,
    setTreble,
};