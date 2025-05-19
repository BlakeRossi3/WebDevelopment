class Sprite {
    x: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;
    pulseFactor: number;

    constructor(x: number, y: number, imageSrc: string, width: number = 50, height: number = 50) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
        this.pulseFactor = 1;
    }

    update(audioData: Uint8Array, bassScale: number, trebleScale: number, audioNum: number): void {
        const percent = audioData[audioNum] / 255;
        const maxPulse = 1.5;

        const bassPulseFactor = Math.sin(Date.now() / 500) * 0.5 + 1;
        const treblePulseFactor = Math.sin(Date.now() / 500) * 0.5 + 1;

        this.pulseFactor =
            1 +
            (percent * (maxPulse - 1) * (bassScale * bassPulseFactor + trebleScale * treblePulseFactor)) / 2;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const scaledWidth = this.width * this.pulseFactor;
        const scaledHeight = this.height * this.pulseFactor;

        ctx.drawImage(
            this.image,
            this.x - scaledWidth / 2,
            this.y - scaledHeight / 2,
            scaledWidth,
            scaledHeight
        );

    }    
}    

export default Sprite;
