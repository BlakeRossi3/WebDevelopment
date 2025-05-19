import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';



const drawParams = {
  showBars     : true,
  showCircles  : true,
  showNoise    : false,
  showInvert   : false,
  showEmboss   : false
};


// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
  audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
  canvas.setupCanvas(canvasElement,audio.analyserNode);
    loop();
}

function setupUI(canvasElement){

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

  const fsButton = document.querySelector("#fsButton");
	
  fsButton.onclick = () => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  playButton.onclick = e => {
      if(audio.audioCtx.state  == "suspended") {
         audio.audioCtx.resume();
      }
      console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
      if(e.target.dataset.playing == "no") {
          audio.playCurrentSound();
          e.target.dataset.playing = "yes";
      }
      else{
          audio.pauseCurrentSound();
          e.target.dataset.playing = "no";
        }
  }

  const audioFormButton = document.querySelector("#audioFormButton");

  audioFormButton.onclick = () => {
    canvas.changeAudioForm();

    if(canvas.getWaveForm()){
      audioFormButton.innerHTML = "Waveform Mode"
    }
    else{
      audioFormButton.innerHTML = "Frequency Mode"
    }
  }

  document.getElementById("toggle-panel").addEventListener("click", function () {
    let panel = document.getElementById("left-panel");
    if (panel.style.display === "none" || panel.style.display === "") {
        panel.style.display = "block";
        this.textContent = "Hide Controls";
    } else {
        panel.style.display = "none";
        this.textContent = "Show Controls";
    }
});

  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel  = document.querySelector("#volumeLabel");

  let bassSlider = document.querySelector("#bassSlider");
  let trebleSlider = document.querySelector("#trebleSlider");

  volumeSlider.oninput = e => {
    audio.setVolume(e.target.value);
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
    let minSpeed = 0.5;
    let maxSpeed = 2.0;
    let newPlaybackRate = minSpeed + (e.target.value / 2) * (maxSpeed - minSpeed); 

    document.getElementById("mewgif").playbackRate = newPlaybackRate;
  };

  bassSlider.oninput = e => {
    let value = Number(e.target.value);
    audio.bassNode.gain.value = value;
  }
  trebleSlider.oninput = e => {
    let value = Number(e.target.value);
    audio.trebleNode.gain.value = value;
  }

  volumeSlider.dispatchEvent(new Event("input"));
  bassSlider.value = 0;
  trebleSlider.value = 0;

  let fileInput = document.querySelector("#file-input");
  let defaultTrackButton = document.querySelector("#default-track-btn");
  let nowPlaying = document.querySelector("#now-playing");
  
  fileInput.onchange = e => {
    let file = e.target.files[0]; 
    if (file) {
        let objectURL = URL.createObjectURL(file);
        audio.loadSoundFile(objectURL);
    }
    nowPlaying.innerHTML = "Now playing:    " + file.name;
 };

  defaultTrackButton.onclick = () => {
      audio.loadSoundFile("media/New Adventure Theme.mp3");

      nowPlaying.innerHTML = "Now playing:    New Adventure Theme.mp3" ;
  };
  
  document.querySelector("#cb-bars").onclick = (e) => {
    drawParams.showBars = e.target.checked;
  };
  document.querySelector("#cb-circles").onclick = (e) => {
    drawParams.showCircles = e.target.checked;
  };
  document.querySelector("#cb-noise").onclick = (e) => {
    drawParams.showNoise = e.target.checked;
  };
  document.querySelector("#cb-invert").onclick = (e) => {
    drawParams.showInvert = e.target.checked;
  };
  document.querySelector("#cb-emboss").onclick = (e) => {
    drawParams.showEmboss = e.target.checked;
  };
  
	
}

function loop(){
  requestAnimationFrame(loop);
  canvas.draw(drawParams);
}


export {init}