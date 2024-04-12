import { BoxComponent } from './BoxComponents';
import { get } from 'svelte/store';
import { darkTheme } from '$lib/shared/stores/appTheme';

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
	private readonly strokeStyles = ['#222222', '#efefef'];

	private _boxAreaHeight: number;
	private _boxAreaWidth: number;

	public get scale() {
		return this._scale;
	}

	public set scale(value: number) {
		this._scale = value / 2;
		this.htmlCanvas.style.width = this._width * this._scale + 'px';
		this.htmlCanvas.style.height = this._height * this._scale + 'px';
	}

	public get boxAreaHeight(): number {
		return this._boxAreaHeight!;
	}

	public get boxAreaWidth(): number {
		return this._boxAreaWidth!;
	}

	public get width() {
		return this._width / 2;
	}

	public get height() {
		return this._height / 2;
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

	private set htmlCanvas(value: HTMLCanvasElement) {
		this._htmlCanvas = value;
	}

	constructor(
		htmlCanvas: HTMLCanvasElement,
		width: number,
		height: number,
		gridRows: number,
		gridColumns: number,
		winLength: number,
		scale: number
	) {
		this._htmlCanvas = htmlCanvas;
		this.gridColumns = gridColumns;
		this.gridRows = gridRows;

		this._width = width * 2;
		this._height = height * 2;
		this._scale = scale / 2;

		this._boxAreaHeight = this._height / this.gridRows;
		this._boxAreaWidth = this._width / this.gridColumns;

		this._winLength = winLength;
		this.context = htmlCanvas.getContext('2d')!;
		this.initializeCanvas();
	}

	private initializeCanvas(): void {
		this.htmlCanvas.width = this._width;
		this.htmlCanvas.height = this._height;
		this.htmlCanvas.style.width = this._width * this.scale + 'px';
		this.htmlCanvas.style.height = this._height * this.scale + 'px';

		this.drawBackground();
		this.createBoxes();
	}

	protected beginDrawing() {
		this.context.beginPath();
		return true;
	}

	protected endDrawing() {
		this.context.closePath();
		this.context.stroke();
	}

	public drawWinLine(winnerCanvasCoords: {firstBoxCanvasX: number | null, firstBoxCanvasY: number | null, lastBoxCanvasX: number | null, lastBoxCanvasY: number | null}) {
		if (winnerCanvasCoords.firstBoxCanvasX == null || winnerCanvasCoords.firstBoxCanvasY == null || winnerCanvasCoords.lastBoxCanvasX == null || winnerCanvasCoords.lastBoxCanvasY == null) {
			return
		}
		
		this.context.strokeStyle = this.strokeStyles[+get(darkTheme)];

		this.beginDrawing();
		this.context.moveTo(
			winnerCanvasCoords.firstBoxCanvasX,
			winnerCanvasCoords.firstBoxCanvasY
		);
		this.context.lineTo(winnerCanvasCoords.lastBoxCanvasX, winnerCanvasCoords.lastBoxCanvasY);
		this.endDrawing();
	}

	private drawBackground() {
		let occumilatedLineHeight = 0;
		let occumilatedLineWidth = 0;
		// Pick the opposite of the current theme for the background.
		this.context.fillStyle = this.strokeStyles[+!get(darkTheme)];
		this.context.strokeStyle = this.strokeStyles[+get(darkTheme)];
		this.context.fillRect(0, 0, this._width, this._height);
		this.context.lineWidth = Math.min(this.boxAreaHeight, this.boxAreaWidth) / 12;
		for (let i = 0; i < this.gridRows - 1; i++) {
			occumilatedLineHeight += this._boxAreaHeight;
			this.context.beginPath();
			this.context.moveTo(0, occumilatedLineHeight);
			this.context.lineTo(this._width, occumilatedLineHeight);
			this.context.closePath();
			this.context.stroke();
		}
		for (let i = 0; i < this.gridColumns - 1; i++) {
			occumilatedLineWidth += this._boxAreaWidth!;
			this.context.beginPath();
			this.context.moveTo(occumilatedLineWidth, 0);
			this.context.lineTo(occumilatedLineWidth, this._height);
			this.context.closePath();
			this.context.stroke();
		}
	}

	public redraw() {
		this.context.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
		this.drawBackground();
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
			for (let j = 0; j < this.gridRows; j++) {
				//for each column add the rows of boxes
				this._boxes[i].push(
					new BoxComponent(i * this._boxAreaWidth, j * this._boxAreaHeight, this)
				);
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
