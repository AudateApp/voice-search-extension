
// A class for generating audio-waves inside a given Canvas element.

// To test changes to this function, copy-paste this entire file here https://codepen.io/justiceo/pen/PoEVEvw.
// and uncomment the lines below:
// document.addEventListener("DOMContentLoaded",
//     () => {
//         const aw = new AudioWave();
//         aw.init(document.getElementById('canvas') as HTMLCanvasElement);
//     }, false);
export class AudioWave {
  canvas!: HTMLCanvasElement;
  renderingContext!: CanvasRenderingContext2D;
  waves: any[] = [];

  // This determines the number of peaks and troughs visible at a time. 1 - flat barely overlapping waves, 100 - a riot of waves.
  nodeCount = 2;

  // This determines the height of the canvas, and by extension the height of the waves.
  waveHeight = 10;

  // This determines the width of the canvas which affects how many nodes are packed in the visible area.
  canvasWidth = 400;

  // This is the color from which screening (or color bleaching) begins.
  darkColor = '#22184c';

  // These three colors are 'screen'ed out of the topColor to create the bottom color. See https://colorblendy.com/#!/screen.
  // To determine  what the final screened out color would be (usually close to #fff) - use a color picker :D
  // If needed programmatically, here is the formular `Cscreen = 1 - [(1 - Ca) * (1 - Cb) * (1 - Cc)].
  // Where Cx is a color and 1-Cx is an invertion of Cx.
  // Based on the definition here https://developer.mozilla.org/en-US/docs/Web/CSS/blend-mode#values
  // And https://webdesign.tutsplus.com/tutorials/blending-modes-in-css-color-theory-and-practical-application--cms-25201.
  // For inverting a color, see https://stackoverflow.com/a/6961743.
  screenColors = ['#f80000', '#00f800', '#0000f8'];

  // The animation ID of the current running aniation from.
  animationId?: number;

  constructor() {}

  // TODO: Slowly add and remove nodes to avoid jank due to complete canvas redraw.
  init(canvas: HTMLCanvasElement): boolean {
    this.canvas = canvas;
    // This may be null if another context already in use, https://stackoverflow.com/a/13406681.
    const context = this.canvas.getContext('2d');
    if (context == null) {
      console.error("Unable to obtain '2d' context for Canvas");
      return false;
    }
    this.renderingContext = context;
    // Clear waves since #init may be called multiple times per instance.
    this.waves = [];

    // Clear animation frames.
    if(this.animationId){
      window.cancelAnimationFrame(this.animationId);
    }
    this.resizeCanvas(this.canvas, this.canvasWidth);
    this.screenColors.forEach((color) =>
      this.waves.push(new AudioWave.Wave(this.canvas, color, 1, this.nodeCount))
    );
    this.update();
    return true;
  }

  // This function runs the animation. To get its gist, comment out #requestAnimationFrame.
  // It may be invoked 60x per second on 60fps browsers to update the canvas and should be as fast as possible to avoid dropping frames.
  private update() {
    this.renderingContext.fillStyle = this.darkColor;
    this.renderingContext.globalCompositeOperation = 'source-over';
    this.renderingContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderingContext.globalCompositeOperation = 'screen';
    this.waves.forEach((wave) => {
      wave.nodes.forEach((node: any) => this.bounce(node));
      this.drawWave(wave);
    });

    this.animationId = requestAnimationFrame(() => this.update());
  }

  private bounce(nodeArr: any[]) {
    nodeArr[1] =
      (this.waveHeight / 2) * Math.sin(nodeArr[2] / 20) +
      this.canvas.height / 2;
    nodeArr[2] = nodeArr[2] + nodeArr[3];
  }

  private drawWave(wave: { color: string; nodes: any[] }) {
    let diff = function (a: number, b: number) {
      return (b - a) / 2 + a;
    };

    this.renderingContext.fillStyle = wave.color;
    this.renderingContext.beginPath();
    this.renderingContext.moveTo(0, this.canvas.height);
    this.renderingContext.lineTo(wave.nodes[0][0], wave.nodes[0][1]);

    for (let i = 0; i < wave.nodes.length; i++) {
      if (wave.nodes[i + 1]) {
        this.renderingContext.quadraticCurveTo(
          wave.nodes[i][0],
          wave.nodes[i][1],
          diff(wave.nodes[i][0], wave.nodes[i + 1][0]),
          diff(wave.nodes[i][1], wave.nodes[i + 1][1])
        );
      } else {
        this.renderingContext.lineTo(wave.nodes[i][0], wave.nodes[i][1]);
        this.renderingContext.lineTo(this.canvas.width, this.canvas.height);
      }
    }
    this.renderingContext.closePath();
    this.renderingContext.fill();
  }

  private resizeCanvas(canvas: HTMLCanvasElement, width?: number) {
    if (width) {
      canvas.width = width;
    } else {
      if (window.innerWidth > 1920) {
        canvas.width = window.innerWidth;
      } else {
        canvas.width = 1920;
      }
    }

    canvas.height = this.waveHeight;
  }

  private static Wave = class {
    color: string;
    lambda: number;
    nodes: any[];
    constructor(
      cvs: HTMLCanvasElement,
      color: string,
      lambda: number,
      nodeCount: number
    ) {
      this.color = color;
      this.lambda = lambda;
      this.nodes = [];

      for (let i = 0; i <= nodeCount + 2; i++) {
        // Index 1 is reset in #bounce.
        let temp = [((i - 1) * cvs.width) / nodeCount, 0, Math.random() * 200, 0.3];
        this.nodes.push(temp);
      }
    }
  };
}



