import {
  Component, ElementRef, EventEmitter, Input, Output, Renderer, ViewChild
} from '@angular/core';

export interface Marker {
  x: number;
  y: number;
  type?: string;
}

@Component({
  selector: 'img-map',
  styles: [
    '.img-map { position: relative; }',
    '.img-map canvas, .img-map img { position: absolute; top: 0; left: 0; }',
    '.img-map img { display: block; height: auto; max-width: 100%; }'
  ],
  template: `
    <div
      class="img-map"
      #container
      (window:resize)="onResize($event)"
    >
      <img
        #image
        [src]="src"
        (load)="onLoad($event)"
      >
      <canvas
        #canvas
        (click)="onClick($event)"
        (mousemove)="onMousemove($event)"
        (mouseout)="onMouseout($event)"
      ></canvas>
    </div>
  `
})
export class ImgMapComponent {

  /**
   * Canvas element.
   */
  @ViewChild('canvas')
  private canvas: ElementRef;

  /**
   * Container element.
   */
  @ViewChild('container')
  private container: ElementRef;

  /**
   * Image element.
   */
  @ViewChild('image')
  private image: ElementRef;

  @Input('markers')
  set setMarkers(markers: Marker[]) {
    this.markerActive = null;
    this.markerHover = null;
    this.markers = markers;
    this.draw();
  }

  /**
   * Radius of the markers.
   */
  @Input()
  markerRadius: number = 10;

  /**
   * Image source URL.
   */
  @Input()
  src: string;

  /**
   * On change event.
   */
  @Output('change')
  changeEvent = new EventEmitter<number[]>();

  /**
   * On mark event.
   */
  @Output('mark')
  markEvent = new EventEmitter<number[]>();

  /**
   * Collection of markers.
   */
  private markers: Marker[] = [];

  /**
   * Index of the hover state marker.
   */
  private markerHover: number = null;

  /**
   * Pixel position of markers.
   */
  private pixels: Marker[] = [];

  /**
   * Index of the active state marker.
   */
  markerActive: number;

  constructor(private renderer: Renderer) { }

  private change(): void {
    if (this.markerActive === null) {
      this.changeEvent.emit(null);
    } else {
      this.changeEvent.emit(this.markers[this.markerActive]);
    }
    this.draw();
  }

  /**
   * Get the cursor position relative to the canvas.
   */
  private cursor(event: MouseEvent): Marker {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  /**
   * Draw a marker.
   */
  private drawMarker(pixel: Marker, markerState?:string) : void {
    var context = this.canvas.nativeElement.getContext('2d');
    context.beginPath();
    context.arc(pixel.x, pixel.y, this.markerRadius, 0, 2 * Math.PI);

    switch (markerState) {
      case 'active':
        context.fillStyle = 'rgba(255, 0, 0, 0.6)'; // Red
        break;
      case 'hover':
        context.fillStyle = 'rgba(0, 0, 255, 0.6)'; // Blue
        break;
      default:
        context.fillStyle = 'rgba(0, 0, 255, 0.4)'; // Blue
    }

    if (pixel.type) {
      switch (pixel.type) {
        case 'Advert':
          context.fillStyle = 'rgba(0, 255, 0, 0.6)'; // Green
          break;
        case 'ATM':
          context.fillStyle = 'rgba(0, 77, 0, 0.6)'; // Dark Green
          break;
        case 'Baby Change Room':
          context.fillStyle = 'rgba(255, 0, 102, 0.6)'; // Magenta
          break;
        case 'Entrance':
          context.fillStyle = 'rgba(102, 255, 255, 0.6)'; // Light Blue
          break;
        case 'Escalator':
          context.fillStyle = 'rgba(255, 0, 255, 0.6)'; // Pink
          break;
        case 'Kiosk':
          context.fillStyle = 'rgba(128, 128, 128, 0.6)'; // Grey
          break;
        case 'Lift':
          context.fillStyle = 'rgba(255, 0, 255, 0.6)'; // Pink
          break;
        case 'Path':
          context.fillStyle = 'rgba(255, 153, 51, 0.6)'; // Orange
          break;
        case 'Store':
          context.fillStyle = 'rgba(0, 0, 0, 1)'; // Black
          break;
        case 'Text Point':
          context.fillStyle = 'rgba(102, 102, 51, 0.6)'; // Olivish
          break;
        case 'Toilet':
          context.fillStyle = 'rgba(102, 51, 0, 0.6)'; // Brown
          break;
        default:
          context.fillStyle = 'rgba(0, 0, 255, 0.4)'; // Blue
      }
    }
    context.fill();
  };

  /**
   * Check if a position is inside a marker.
   */
  private insideMarker(pixel: Marker, coordinate: Marker): boolean {
    return Math.sqrt(
      (coordinate.x - pixel.x) * (coordinate.x - pixel.x)
      + (coordinate.y - pixel.y) * (coordinate.y - pixel.y)
    ) < this.markerRadius;
  }

  /**
   * Convert a percentage position to a pixel position.
   */
  private markerToPixel(marker: Marker): Marker {
    const image: HTMLImageElement = this.image.nativeElement;
    return {
      x: (image.clientWidth / 100) * marker.x,
      y: (image.clientHeight / 100) * marker.y,
      type: marker.type
    };
  }

  /**
   * Convert a pixel position to a percentage position.
   */
  private pixelToMarker(pixel: Marker): Marker {
    const image: HTMLImageElement = this.image.nativeElement;
    return {
      x: (pixel.x / image.clientWidth) * 100,
      y: (pixel.y / image.clientHeight) * 100,
      type: pixel.type
    };
  }

  /**
   * Sets the new marker position.
   */
  private mark(pixel: Marker): void {
    this.markerActive = this.markers.length;
    this.markers.push(this.pixelToMarker(pixel));
    this.draw();
    this.markEvent.emit(this.markers[this.markerActive]);
  }

  /**
   * Sets the marker pixel positions.
   */
  private setPixels(): void {
    this.pixels = [];
    this.markers.forEach(marker => {
      this.pixels.push(this.markerToPixel(marker));
    });
  }

  /**
   * Clears the canvas and draws the markers.
   */
  draw(): void {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    const container: HTMLDivElement = this.container.nativeElement;
    const image: HTMLImageElement = this.image.nativeElement;
    const height = image.clientHeight;
    const width = image.clientWidth;
    this.renderer.setElementAttribute(canvas, 'height', `${height}`);
    this.renderer.setElementAttribute(canvas, 'width', `${width}`);
    this.renderer.setElementStyle(container, 'height', `${height}px`);
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, width, height);
    this.setPixels();
    this.pixels.forEach((pixel, index) => {
      if (this.markerActive === index) {
        this.drawMarker(pixel, 'active');
      } else if (this.markerHover === index) {
        this.drawMarker(pixel, 'hover');
      } else {
        this.drawMarker(pixel);
      }
    });
  }

  onClick(event: MouseEvent): void {
    const cursor = this.cursor(event);
    var active = false;
    if (this.changeEvent.observers.length) {
      var change = false;
      this.pixels.forEach((pixel, index) => {
        if (this.insideMarker(pixel, cursor)) {
          active = true;
          if (this.markerActive === null || this.markerActive !== index) {
            this.markerActive = index;
            change = true;
          }
        }
      });
      if (!active && this.markerActive !== null) {
        this.markerActive = null;
        change = true;
      }
      if (change) this.change();
    }
    if (!active && this.markEvent.observers.length) {
      this.mark(cursor);
    }
  }

  onLoad(event: UIEvent): void {
    this.draw();
  }

  onMousemove(event: MouseEvent): void {
    if (this.changeEvent.observers.length) {
      const cursor = this.cursor(event);
      var hover = false;
      var draw = false;
      this.pixels.forEach((pixel, index) => {
        if (this.insideMarker(pixel, cursor)) {
          hover = true;
          if (this.markerHover === null || this.markerHover !== index) {
            this.markerHover = index;
            draw = true;
          }
        }
      });
      if (!hover && this.markerHover !== null) {
        this.markerHover = null;
        draw = true;
      }
      if (draw) this.draw();
    }
  }

  onMouseout(event: MouseEvent): void {
    if (this.markerHover) {
      this.markerHover = null;
      this.draw();
    }
  }

  onResize(event: UIEvent): void {
    this.draw();
  }

}
