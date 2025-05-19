let audioCtx;

let element, sourceNode, analyserNode, gainNode, bassNode, trebleNode;

const DEFUALTS = Object.freeze({
    gain        :       .5,
    numSamples  :       256
});


let audioData = new Uint8Array(DEFUALTS.numSamples/2)


function setupWebaudio(filePath){


    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    element = new Audio();

    loadSoundFile(filePath);

    sourceNode = audioCtx.createMediaElementSource(element);

    analyserNode = audioCtx.createAnalyser();


    analyserNode.fftSize =  DEFUALTS.numSamples;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFUALTS.gain;

    bassNode = audioCtx.createBiquadFilter();
    bassNode.type = "lowshelf";
    bassNode.frequency.value = 200;
    bassNode.gain.value =0;

    trebleNode = audioCtx.createBiquadFilter();
    trebleNode.type = "highshelf";
    trebleNode.frequency.value = 3000;
    trebleNode.gain.value =0;

    
    sourceNode.connect(bassNode);
    bassNode.connect(trebleNode);
    trebleNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}



function loadSoundFile(filePath) {
    element.src = filePath;
}
function playCurrentSound(){
    element.play();

}
function pauseCurrentSound(){
    element.pause();
}
function setVolume(value){
    value = Number(value);
    gainNode.gain.value = value;
}
function setBass(value) {
    bassNode.gain.value = Number(value);
}

function setTreble(value) {
    trebleNode.gain.value = Number(value);
}
export {audioCtx,setupWebaudio,playCurrentSound,pauseCurrentSound,loadSoundFile,setVolume,analyserNode,bassNode,trebleNode,setBass,setTreble};