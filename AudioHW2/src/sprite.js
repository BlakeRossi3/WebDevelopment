class Sprite {
    constructor(x, y, imageSrc, width = 50, height = 50) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
        this.pulseFactor = 1;
    }
    
    update(audioData, bassScale, trebleScale, audioNum) {
        let percent = audioData[audioNum] / 255;
        let maxPulse = 1.5;
        
        let bassPulseFactor = Math.sin(Date.now() / 500) * 0.5 + 1;
        let treblePulseFactor = Math.sin(Date.now() / 500) * 0.5 + 1;
        this.pulseFactor = 1 + percent * (maxPulse - 1) * (bassScale * bassPulseFactor + trebleScale * treblePulseFactor) / 2;
    }
    
    draw(ctx) {

        let scaledWidth = this.width * this.pulseFactor;
        let scaledHeight = this.height * this.pulseFactor;
        ctx.drawImage(this.image, this.x - scaledWidth / 2, this.y - scaledHeight / 2, scaledWidth, scaledHeight);

    }
}
  
  
  export default Sprite;
  