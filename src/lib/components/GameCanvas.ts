import { onMount } from 'svelte';
import { navigating } from '$app/stores';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { BoxComponent, Component0, Component1 } from './BoxComponents';



export class GameCanvas {

    private gridRows: number = 5;
    private gridColumns: number = 5;
    private _winLength = 4;
    private _height: number;
    private _width: number;
    private _scale: number = 1;
    private _htmlCanvas: HTMLCanvasElement;
    private _context!: CanvasRenderingContext2D;
    private _boxes: BoxComponent[][] = [];

    private _boxAreaHeight: number;
    private _boxAreaWidth: number;

    public get scale() {
        return this._scale;
    }

    public set scale(value: number) {
        this._scale = value/2;
        this.htmlCanvas.style.width = (this._width * this._scale) + "px";
        this.htmlCanvas.style.height = (this._height * this._scale) + "px";
    }

    public get boxAreaHeight(): number {
        return this._boxAreaHeight!;
    }

    public get boxAreaWidth(): number {
        return this._boxAreaWidth!;
    }

    public get width() {
        return this._width/2;
    }

    public get height() {
        return this._height/2;
    }

    public get boxes(): BoxComponent[][] {
        return this._boxes;
    }
    public set boxes(value: BoxComponent[][]) {
        this._boxes = value;
    }

    public get winLength(): number {
        return this._winLength;
    }

    public get context(): CanvasRenderingContext2D {
        return this._context!;
    }

    public set context(value: CanvasRenderingContext2D) {
        this._context = value;

    }

    public get htmlCanvas(): HTMLCanvasElement {
        return this._htmlCanvas;
    }
    public set htmlCanvas(value: HTMLCanvasElement) {
        this._htmlCanvas = value;
    }

    constructor(htmlCanvas: HTMLCanvasElement, width: number, height: number, gridRows: number, gridColumns: number, winLength: number, scale: number) {
        this._htmlCanvas = htmlCanvas;
        this.gridColumns = gridColumns;
        this.gridRows = gridRows;
        this._width = width * 2;
        this._height = height * 2;
        this.htmlCanvas.width = this._width;
        this.htmlCanvas.height = this._height;
        this._scale = scale/2;
        this.htmlCanvas.style.width = (this._width * this._scale) + "px";
        this.htmlCanvas.style.height = (this._height * this._scale) + "px";
        this._boxAreaHeight = this._height / this.gridRows;
        this._boxAreaWidth = this._width / this.gridColumns;
        this._winLength = winLength;
        console.log(this.htmlCanvas);
        this.context = htmlCanvas.getContext('2d')!;
        this.drawGrid();
    }

    private drawGrid() {

        this._context.font = this._boxAreaWidth + 'px serif';
        let occumilatedLineHeight = 0;
        let occumilatedLineWidth = 0;
        this._context.strokeStyle = 'black';
        this._context.lineWidth = Math.min(this.boxAreaHeight, this.boxAreaWidth) / 12;
        for (let i = 0; i < this.gridRows - 1; i++) {
            occumilatedLineHeight += this._boxAreaHeight;
            this._context.beginPath();
            this._context.moveTo(0, occumilatedLineHeight);
            this._context.lineTo(this._width, occumilatedLineHeight);
            this._context.closePath();
            this._context.stroke();
        }
        for (let i = 0; i < this.gridColumns - 1; i++) {
            occumilatedLineWidth += this._boxAreaWidth!;
            this._context.beginPath();
            this._context.moveTo(occumilatedLineWidth, 0);
            this._context.lineTo(occumilatedLineWidth, this._height);
            this._context.closePath();
            this._context.stroke();
        }
        this.createBoxes();
    }

    public redraw() {
        console.log("redrawing");
        this.drawGrid();
        for (let i = 0; i < this.gridColumns; i++) {
            for (let j = 0; j < this.gridRows; j++) {
                this.boxes[i][j].recalculateDrawPos(i * this._boxAreaWidth, j * this._boxAreaHeight);
                this.boxes[i][j].draw();
            }
        }
    }

    private createBoxes() {
        for (let i = 0; i < this.gridColumns; i++) {
            this._boxes.push([]);
            // console.log("column: ", i)
            for (let j = 0; j < this.gridRows; j++) {
                //for each column add the rows of boxes
                // console.log("row: ", j)
                this._boxes[i].push(new BoxComponent(i * this._boxAreaWidth, j * this._boxAreaHeight, this));
            }
        }
    }

    public findBox(x: number, y: number) {
        let found = false;
        let boxCol = null;
        let boxRow = null;
        for (let i = 0; i < this._boxes.length; i++) {
            for (let j = 0; j < this._boxes[i].length; j++) {
                if (
                    x / this._scale > this._boxes[i][j].areaXBegin &&
                    x / this._scale < this._boxes[i][j].areaXBegin + this._boxAreaWidth &&
                    y / this._scale > this._boxes[i][j].areaYBegin &&
                    y / this._scale < this._boxes[i][j].areaYBegin + this._boxAreaHeight
                ) {
                    boxCol = i;
                    boxRow = j;
                    found = true;
                    break;
                }
            }
            if (found) {
                break;
            }
        }
        return { boxCol, boxRow };
    }

}
