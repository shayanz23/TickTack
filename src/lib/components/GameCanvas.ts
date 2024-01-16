import { onMount } from 'svelte';
import { navigating } from '$app/stores';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { BoxComponent, XComponent, OComponent } from './BoxComponent';



export class GameCanvas {

    private gridRows: number = 5;
    private gridColumns: number = 5;
    private _winLength = 4;
    private _height: number;
    private _width: number;
    private _htmlCanvas: HTMLCanvasElement;
    private _context!: CanvasRenderingContext2D;
    private _boxes: BoxComponent[][] = [];
    protected playerTurn = 1;
    private _winner = 0;
    private _boxAreaHeight: number;
    private _boxAreaWidth: number;

    public get boxAreaHeight(): number {
        return this._boxAreaHeight!;
    }

    public get boxAreaWidth(): number {
        return this._boxAreaWidth!;
    }

    public get winner() {
        return this._winner;
    }
    public set winner(value) {
        this._winner = value;
    }

    public get width() {
        return this._width;
    }

    public set width(value: number) {
        this._width = value;
        this._boxAreaWidth = this.width / this.gridColumns;
        this.htmlCanvas.width = value;
        this.redraw();
    }

    public get height() {
        return this._height;
    }

    public set height(value: number) {
        this._height = value;
        this._boxAreaHeight = this.height / this.gridRows;
        this.htmlCanvas.height = value;
        this.redraw();
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

    constructor(htmlCanvas: HTMLCanvasElement, gridRows: number, gridColumns: number, winLength: number) {
            this._htmlCanvas = htmlCanvas;
            this.gridColumns = gridColumns;
            this.gridRows = gridRows;
            this._width = htmlCanvas.width;
            this._height = htmlCanvas.height;
            this._boxAreaHeight = this.height / this.gridRows;
            this._boxAreaWidth = this.width / this.gridColumns;
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
            this._context.lineTo(this.width, occumilatedLineHeight);
            this._context.closePath();
            this._context.stroke();
        }
        for (let i = 0; i < this.gridColumns - 1; i++) {
            occumilatedLineWidth += this._boxAreaWidth!;
            this._context.beginPath();
            this._context.moveTo(occumilatedLineWidth, 0);
            this._context.lineTo(occumilatedLineWidth, this.height);
            this._context.closePath();
            this._context.stroke();
        }
        this.createBoxes();
    }

    public redraw() {
        console.log("redrawing")
        this.drawGrid()
        for (let i = 0; i < this.gridColumns; i++) {
            for (let j = 0; j < this.gridRows; j++) {
                this.boxes[i][j].recalculateDrawPos(i * this._boxAreaWidth, j * this._boxAreaHeight)
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

    public findWinner() {
        console.log('********Finding wonner********');
        console.log('********Finding wonner********');
        for (let i = 0; i < this._boxes.length; i++) {
            for (let j = 0; j < this._boxes[i].length; j++) {
                if (this._boxes[i][j].checkWinnerBase(i, j) === true) {
                    this.winner = this._boxes[i][j].player;

                    console.log('++++Winner: ', this.winner);
                }
            }
        }
    }

    public checkTie(): boolean {
        for (let i = 0; i < this._boxes.length; i++) {
            for (let j = 0; j < this._boxes[i].length; j++) {
                if (this._boxes[i][j].player === 0) {
                    return false;
                    console.log('++++Winner: ', this.winner);
                }
            }
        }
        return true;
    }
    

    public findBox(x: number, y: number) {
        let found = false;
        let boxCol = null;
        let boxRow = null;
        for (let i = 0; i < this._boxes.length; i++) {
            for (let j = 0; j < this._boxes[i].length; j++) {
                if (
                    x > this._boxes[i][j].areaXBegin &&
                    x < this._boxes[i][j].areaXBegin + this._boxAreaWidth &&
                    y > this._boxes[i][j].areaYBegin &&
                    y < this._boxes[i][j].areaYBegin + this._boxAreaHeight
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

    public drawBox(boxPos: { boxCol: number | null; boxRow: number | null }) {
        if (boxPos.boxCol === null || boxPos.boxRow === null) {
            return new Error("");
        }
        let box = this.boxes[boxPos.boxCol][boxPos.boxRow];
        if (box !== null && !box.drawn) {
            if (this.playerTurn === 1) {
                box = new XComponent(box.areaXBegin, box.areaYBegin, this);
                this.playerTurn = 2;
            } else if (this.playerTurn === 2) {
                box = new OComponent(box.areaXBegin, box.areaYBegin, this);
                this.playerTurn = 1;
            }
        }
        this.boxes[boxPos.boxCol][boxPos.boxRow] = box;
    }

}