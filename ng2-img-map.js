"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ImgMapComponent = (function () {
    function ImgMapComponent(renderer) {
        this.renderer = renderer;
        /**
         * Radius of the markers.
         */
        this.markerRadius = 10;
        /**
         * On change event.
         */
        this.changeEvent = new core_1.EventEmitter();
        /**
         * On mark event.
         */
        this.markEvent = new core_1.EventEmitter();
        /**
         * Collection of markers.
         */
        this.markers = [];
        /**
         * Index of the hover state marker.
         */
        this.markerHover = null;
        /**
         * Pixel position of markers.
         */
        this.pixels = [];
    }
    Object.defineProperty(ImgMapComponent.prototype, "setMarkers", {
        set: function (markers) {
            this.markerActive = null;
            this.markerHover = null;
            this.markers = markers;
            this.draw();
        },
        enumerable: true,
        configurable: true
    });
    ImgMapComponent.prototype.change = function () {
        if (this.markerActive === null) {
            this.changeEvent.emit(null);
        }
        else {
            this.changeEvent.emit(this.markers[this.markerActive]);
        }
        this.draw();
    };
    /**
     * Get the cursor position relative to the canvas.
     */
    ImgMapComponent.prototype.cursor = function (event) {
        var rect = this.canvas.nativeElement.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };
    /**
     * Draw a line between markers
     */
    ImgMapComponent.prototype.drawLine = function (pixel) {
        var context = this.canvas.nativeElement.getContext('2d');
        if (pixel.linkedNodes && pixel.linkedNodes.length) {
            for (var i = 0; i < pixel.linkedNodes.length; i++) {
                if (pixel.level === pixel.linkedNodes[i].level) {
                    context.beginPath();
                    context.moveTo(pixel.x, pixel.y);
                    context.lineTo(pixel.linkedNodes[i].x, pixel.linkedNodes[i].y);
                    context.stroke();
                }
            }
        }
    };
    /**
     * Draw a marker.
     */
    ImgMapComponent.prototype.drawMarker = function (pixel, markerState, markerType) {
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
        if (markerType) {
            switch (markerType) {
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
    ;
    /**
     * Check if a position is inside a marker.
     */
    ImgMapComponent.prototype.insideMarker = function (pixel, coordinate) {
        return Math.sqrt((coordinate.x - pixel.x) * (coordinate.x - pixel.x)
            + (coordinate.y - pixel.y) * (coordinate.y - pixel.y)) < this.markerRadius;
    };
    /**
     * Convert a percentage position to a pixel position.
     */
    ImgMapComponent.prototype.markerToPixel = function (marker) {
        var image = this.image.nativeElement;
        return {
            x: (image.clientWidth / 100) * marker.x,
            y: (image.clientHeight / 100) * marker.y,
            type: marker.type,
            level: marker.level,
            linkedNodes: marker.linkedNodes
        };
    };
    /**
     * Convert a pixel position to a percentage position.
     */
    ImgMapComponent.prototype.pixelToMarker = function (pixel) {
        var image = this.image.nativeElement;
        return {
            x: (pixel.x / image.clientWidth) * 100,
            y: (pixel.y / image.clientHeight) * 100,
            type: pixel.type,
            level: pixel.level,
            linkedNodes: pixel.linkedNodes
        };
    };
    /**
     * Sets the new marker position.
     */
    ImgMapComponent.prototype.mark = function (pixel) {
        this.markerActive = this.markers.length;
        this.markers.push(this.pixelToMarker(pixel));
        this.draw();
        this.markEvent.emit(this.markers[this.markerActive]);
    };
    /**
     * Sets the marker pixel positions.
     */
    ImgMapComponent.prototype.setPixels = function () {
        var _this = this;
        this.pixels = [];
        this.markers.forEach(function (marker) {
            if (marker.linkedNodes) {
                for (var i = 0; i < marker.linkedNodes.length; i++) {
                    if (marker.linkedNodes[i].x <= 100 && marker.linkedNodes[i].y <= 100) {
                        marker.linkedNodes[i] = _this.markerToPixel(marker.linkedNodes[i]);
                    }
                }
            }
            _this.pixels.push(_this.markerToPixel(marker));
        });
    };
    /**
     * Clears the canvas and draws the markers.
     */
    ImgMapComponent.prototype.draw = function () {
        var _this = this;
        var canvas = this.canvas.nativeElement;
        var container = this.container.nativeElement;
        var image = this.image.nativeElement;
        var height = image.clientHeight;
        var width = image.clientWidth;
        this.renderer.setElementAttribute(canvas, 'height', "" + height);
        this.renderer.setElementAttribute(canvas, 'width', "" + width);
        this.renderer.setElementStyle(container, 'height', height + "px");
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, width, height);
        this.setPixels();
        this.pixels.forEach(function (pixel, index) {
            if (_this.markerActive === index) {
                _this.drawMarker(pixel, 'active');
            }
            else if (_this.markerHover === index) {
                _this.drawMarker(pixel, 'hover');
            }
            else {
                _this.drawMarker(pixel, '', pixel.type);
            }
            _this.drawLine(pixel);
        });
    };
    ImgMapComponent.prototype.onClick = function (event) {
        var _this = this;
        var cursor = this.cursor(event);
        var active = false;
        if (this.changeEvent.observers.length) {
            var change = false;
            this.pixels.forEach(function (pixel, index) {
                if (_this.insideMarker(pixel, cursor)) {
                    active = true;
                    if (_this.markerActive === null || _this.markerActive !== index) {
                        _this.markerActive = index;
                        change = true;
                    }
                }
            });
            if (!active && this.markerActive !== null) {
                this.markerActive = null;
                change = true;
            }
            if (change)
                this.change();
        }
        if (!active && this.markEvent.observers.length) {
            this.mark(cursor);
        }
    };
    ImgMapComponent.prototype.onLoad = function (event) {
        this.draw();
    };
    ImgMapComponent.prototype.onMousemove = function (event) {
        var _this = this;
        if (this.changeEvent.observers.length) {
            var cursor_1 = this.cursor(event);
            var hover = false;
            var draw = false;
            this.pixels.forEach(function (pixel, index) {
                if (_this.insideMarker(pixel, cursor_1)) {
                    hover = true;
                    if (_this.markerHover === null || _this.markerHover !== index) {
                        _this.markerHover = index;
                        draw = true;
                    }
                }
            });
            if (!hover && this.markerHover !== null) {
                this.markerHover = null;
                draw = true;
            }
            if (draw)
                this.draw();
        }
    };
    ImgMapComponent.prototype.onMouseout = function (event) {
        if (this.markerHover) {
            this.markerHover = null;
        }
    };
    ImgMapComponent.prototype.onResize = function (event) {
        this.draw();
    };
    __decorate([
        core_1.ViewChild('canvas'), 
        __metadata('design:type', (typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object)
    ], ImgMapComponent.prototype, "canvas", void 0);
    __decorate([
        core_1.ViewChild('container'), 
        __metadata('design:type', (typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object)
    ], ImgMapComponent.prototype, "container", void 0);
    __decorate([
        core_1.ViewChild('image'), 
        __metadata('design:type', (typeof (_c = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _c) || Object)
    ], ImgMapComponent.prototype, "image", void 0);
    __decorate([
        core_1.Input('markers'), 
        __metadata('design:type', Array), 
        __metadata('design:paramtypes', [Array])
    ], ImgMapComponent.prototype, "setMarkers", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ImgMapComponent.prototype, "markerRadius", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ImgMapComponent.prototype, "src", void 0);
    __decorate([
        core_1.Output('change'), 
        __metadata('design:type', Object)
    ], ImgMapComponent.prototype, "changeEvent", void 0);
    __decorate([
        core_1.Output('mark'), 
        __metadata('design:type', Object)
    ], ImgMapComponent.prototype, "markEvent", void 0);
    ImgMapComponent = __decorate([
        core_1.Component({
            selector: 'img-map',
            styles: [
                '.img-map { position: relative; }',
                '.img-map canvas, .img-map img { position: absolute; top: 0; left: 0; }',
                '.img-map img { display: block; height: auto; max-width: 100%; }'
            ],
            template: "\n    <div\n      class=\"img-map\"\n      #container\n      (window:resize)=\"onResize($event)\"\n    >\n      <img\n        #image\n        [src]=\"src\"\n        (load)=\"onLoad($event)\"\n      >\n      <canvas\n        #canvas\n        (click)=\"onClick($event)\"\n        (mousemove)=\"onMousemove($event)\"\n        (mouseout)=\"onMouseout($event)\"\n      ></canvas>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [(typeof (_d = typeof core_1.Renderer !== 'undefined' && core_1.Renderer) === 'function' && _d) || Object])
    ], ImgMapComponent);
    return ImgMapComponent;
    var _a, _b, _c, _d;
}());
exports.ImgMapComponent = ImgMapComponent;
//# sourceMappingURL=ng2-img-map.js.map