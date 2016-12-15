import { Renderer } from '@angular/core';
export interface Marker {
    x: number;
    y: number;
    type?: string;
}
export declare class ImgMapComponent {
    private renderer;
    /**
     * Canvas element.
     */
    private canvas;
    /**
     * Container element.
     */
    private container;
    /**
     * Image element.
     */
    private image;
    setMarkers: Marker[];
    /**
     * Radius of the markers.
     */
    markerRadius: number;
    /**
     * Image source URL.
     */
    src: string;
    /**
     * On change event.
     */
    changeEvent: any;
    /**
     * On mark event.
     */
    markEvent: any;
    /**
     * Collection of markers.
     */
    private markers;
    /**
     * Index of the hover state marker.
     */
    private markerHover;
    /**
     * Pixel position of markers.
     */
    private pixels;
    /**
     * Index of the active state marker.
     */
    markerActive: number;
    constructor(renderer: Renderer);
    private change();
    /**
     * Get the cursor position relative to the canvas.
     */
    private cursor(event);
    /**
     * Draw a marker.
     */
    private drawMarker(pixel, markerState?);
    /**
     * Check if a position is inside a marker.
     */
    private insideMarker(pixel, coordinate);
    /**
     * Convert a percentage position to a pixel position.
     */
    private markerToPixel(marker);
    /**
     * Convert a pixel position to a percentage position.
     */
    private pixelToMarker(pixel);
    /**
     * Sets the new marker position.
     */
    private mark(pixel);
    /**
     * Sets the marker pixel positions.
     */
    private setPixels();
    /**
     * Clears the canvas and draws the markers.
     */
    draw(): void;
    onClick(event: MouseEvent): void;
    onLoad(event: UIEvent): void;
    onMousemove(event: MouseEvent): void;
    onMouseout(event: MouseEvent): void;
    onResize(event: UIEvent): void;
}
