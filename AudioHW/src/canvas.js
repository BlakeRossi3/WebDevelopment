/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';
import Sprite from './sprite.js';

let ctx,canvasWidth,canvasHeight,analyserNode,audioData;

let waveForm = false;

let gifImage = new Image();
gifImage.src = "media/space.jpg";

let starData = [];

fetch('data/av-data.json')
    .then(response => response.json())
    .then(data => {
        starData = data.stars;
        starData.forEach(data => {
            starSprites.push(new Sprite(data.x, data.y, "media/star.png", 50, 50));
        });
    });

const starSprites = starData.map(data => new Sprite(data.x, data.y, "media/pokeball.png", 50, 50));

function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	analyserNode = analyserNodeRef;
	audioData = new Uint8Array(analyserNode.fftSize/2);
}

function draw(params={}){

    if(waveForm){
        analyserNode.getByteTimeDomainData(audioData); // waveform data
    }
    else{
        analyserNode.getByteFrequencyData(audioData);
    }
	
    ctx.save();
    ctx.drawImage(gifImage, 0, 0, canvasWidth, canvasHeight);
    ctx.restore();
    
	// 4 - draw bars
    if(params.showBars)
    {
	if(!waveForm){
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let centerY = canvasHeight / 2; 

        ctx.save();
        ctx.fillStyle = 'rgba(74, 0, 110, 0.5)';
        ctx.strokeStyle = 'rgb(255, 255, 255)';

        for(let i=0; i<audioData.length; i++){
            let barValue = audioData[i];

            let barTop = centerY - barValue / 2;
            let barBottom = centerY + barValue / 2;

            if(i % 2 === 0){
                ctx.fillRect(500+(margin + i * (barWidth + barSpacing)), barTop, barWidth, barBottom - barTop);
                ctx.strokeRect(500+(margin + i * (barWidth + barSpacing)), barTop, barWidth, barBottom - barTop);
            }
            else{
                ctx.fillRect(500-(margin + i * (barWidth + barSpacing)), barTop, barWidth, barBottom - barTop);
                ctx.strokeRect(500-(margin + i * (barWidth + barSpacing)), barTop, barWidth, barBottom - barTop);
            }
        
            
            
        }
        ctx.restore();
    }
    else if(waveForm){
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let centerY = canvasHeight / 2; 
    
        ctx.save();
        ctx.fillStyle = 'rgba(74, 0, 110, 0.5)';
        ctx.strokeStyle = 'rgb(255, 255, 255)';
    
        for(let i = 0; i < audioData.length; i++){
            let deviation = Math.abs(audioData[i] - 128);
            let barTop = centerY - deviation / 2;
            let barBottom = centerY + deviation / 2;
    
            if(i % 2 === 0){
                ctx.fillRect(500 + (margin + i * (barWidth + barSpacing)), barTop, barWidth, barBottom - barTop);
                ctx.strokeRect(500 + (margin + i * (barWidth + barSpacing)), barTop, barWidth, barBottom - barTop);
            }
            else{
                ctx.fillRect(500 - (margin + i * (barWidth + barSpacing)), barTop, barWidth, barBottom - barTop);
                ctx.strokeRect(500 - (margin + i * (barWidth + barSpacing)), barTop, barWidth, barBottom - barTop);
            }
        }
        ctx.restore();
    }
}
    let bassValue = document.getElementById("bassSlider").value;
    let trebleValue = document.getElementById("trebleSlider").value;


    let bassScale = (bassValue / 30) + 1;
    let trebleScale = (trebleValue / 30) + 1;

   
    if (params.showCircles){
        let maxRadius = canvasHeight/4; 
        ctx.save();
        ctx.globalAlpha = 0.5;

       
        for (let i = 0; i < audioData.length; i++) {
            let percent = audioData[i] / 255;
            
            // take what we had before and scale it based on the bass and treble
            let circleRadius = percent * maxRadius;
            let bassCircleRadius = circleRadius * bassScale;
            let trebleCircleRadius = circleRadius * trebleScale;

            let bassPulseFactor = Math.sin(Date.now() / 500) * 0.5 + 1;
            let treblePulseFactor = Math.sin(Date.now() / 500) * 0.5 + 1;

            bassCircleRadius *= bassPulseFactor;
            trebleCircleRadius *= treblePulseFactor;


            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(75, 0, 130, .34 - percent / 3.0);
            ctx.arc(canvasWidth - 20, 20, bassCircleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 0, .10 - percent / 10.0);
            ctx.arc(canvasWidth - 20, 20, bassCircleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(128, 0, 128, .5 - percent / 5.0);
            ctx.arc(canvasWidth - 20, 20, bassCircleRadius * 0.50, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(75, 0, 130, .34 - percent / 3.0);
            ctx.arc(0, 20, trebleCircleRadius, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(0, 0, 0, .10 - percent / 10.0);
            ctx.arc(0, 20, trebleCircleRadius * 1.5, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = utils.makeColor(128, 0, 128, .5 - percent / 5.0);
            ctx.arc(0, 20, trebleCircleRadius * 0.50, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.closePath();
        }
        ctx.restore();
    }

    let audioNum = Math.floor(Math.random() * audioData.length);
    starSprites.forEach(star => {
        star.update(audioData, bassScale, trebleScale, audioNum);
        star.draw(ctx);
    });

    let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight)
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
	
    for(let i = 0; i < length; i+=4){ 
        if(params.showNoise && Math.random() < 0.05){
            data[i] = data[i+1] = data[i+2] = 0;
            data[i] = 255;
		} // end if
        if(params.showInvert){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red;
            data[i+1] = 255 - green;
            data[i+2] = 255 - blue;
        }
	} // end for

    if(params.showEmboss){
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) continue;
            data[i] = 127 + 2 * data[i] - data[i+4] - data[i + width * 4];
        }
    }

    ctx.putImageData(imageData,0,0);
}
const changeAudioForm = () =>{
    waveForm = !waveForm
}
function getWaveForm() {
    return waveForm;
}


export {setupCanvas,draw, gifImage, changeAudioForm, getWaveForm};