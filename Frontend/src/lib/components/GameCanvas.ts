import { BoxComponent } from './BoxComponents';
import { get } from 'svelte/store';
import { darkTheme } from '$lib/shared/stores/appTheme';
import gameDefaults from '$lib/shared/gameDefaults.json';

let thisGameCanvas: GameCanvas;

export class GameCanvas {
	private gridY: number;
	private gridX: number;
	private _winLength;
	private _height: number;
	private _width: number;
	private _scale: number;
	private _htmlCanvas: HTMLCanvasElement;
	private _context!: CanvasRenderingContext2D;
	private _boxes: BoxComponent[][] = [];
	private readonly strokeStyles = [gameDefaults.darkGreyColor, gameDefaults.almostWhiteColor];
	private _boxAreaHeight: number;
	private _boxAreaWidth: number;
	private gridLineWidth: number;
	private _winLineWidth: number;
	private _winLnPts = [] as { x: number; y: number; }[];
	private _lnAnimateT = 1;
	public get winLineWidth(): number {
		return this._winLineWidth;
	}
	public set winLineWidth(value: number) {
		this._winLineWidth = value;
	}
	public get winLnPts() {
		return this._winLnPts;
	}
	public set winLnPts(value) {
		this._winLnPts = value;
	}
	public get lnAnimateT() {
		return this._lnAnimateT;
	}
	public set lnAnimateT(value) {
		this._lnAnimateT = value;
	}
	private _winnerCanvasCoords: {
		firstBoxCanvasX: number | null;
		firstBoxCanvasY: number | null;
		lastBoxCanvasX: number | null;
		lastBoxCanvasY: number | null;
	} = { firstBoxCanvasX: null, firstBoxCanvasY: null, lastBoxCanvasX: null, lastBoxCanvasY: null };
	public get winnerCanvasCoords(): {
		firstBoxCanvasX: number | null;
		firstBoxCanvasY: number | null;
		lastBoxCanvasX: number | null;
		lastBoxCanvasY: number | null;
	} {
		return this._winnerCanvasCoords;
	}
	public set winnerCanvasCoords(value: {
		firstBoxCanvasX: number | null;
		firstBoxCanvasY: number | null;
		lastBoxCanvasX: number | null;
		lastBoxCanvasY: number | null;
	}) {
		this._winnerCanvasCoords = value;
	}

	public get scale() {
		return this._scale;
	}
	public set scale(value: number) {
		this._scale = value / gameDefaults.scaling;
		this.htmlCanvas.style.width = this._width * this._scale + gameDefaults.pxHtml;
		this.htmlCanvas.style.height = this._height * this._scale + gameDefaults.pxHtml;
	}

	public get boxAreaHeight(): number {
		return this._boxAreaHeight!;
	}

	public get boxAreaWidth(): number {
		return this._boxAreaWidth!;
	}

	public get width() {
		return this._width / gameDefaults.scaling;
	}

	public get height() {
		return this._height / gameDefaults.scaling;
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
		gridY: number,
		gridX: number,
		winLength: number,
		scale: number
	) {
		this._htmlCanvas = htmlCanvas;
		this.gridX = gridX;
		this.gridY = gridY;

		this._width = width * gameDefaults.scaling;
		this._height = height * gameDefaults.scaling;
		this._scale = scale / gameDefaults.scaling;

		this._boxAreaHeight = this._height / this.gridY;
		this._boxAreaWidth = this._width / this.gridX;
		this.gridLineWidth = Math.min(this.boxAreaHeight, this.boxAreaWidth) / gameDefaults.gridLineFactor;
		this._winLineWidth = Math.min(this.boxAreaHeight, this.boxAreaWidth) / gameDefaults.winLineFactor;
		this._winLength = winLength;
		this.context = htmlCanvas.getContext('2d')!;
		this.initializeCanvas();
		thisGameCanvas = this;
	}

	private initializeCanvas(): void {
		this.htmlCanvas.width = this._width;
		this.htmlCanvas.height = this._height;
		this.htmlCanvas.style.width = this._width * this.scale + gameDefaults.pxHtml;
		this.htmlCanvas.style.height = this._height * this.scale + gameDefaults.pxHtml;

		this.drawBackground();
		this.createBoxes();
	}

	public beginDrawing() {
		this.context.beginPath();
		return true;
	}

	public endDrawing() {
		this.context.closePath();
		this.context.stroke();
	}

	public preDrawWinLine() {
		this.lnAnimateT = 1;
		var points = this.calcWinLnPts();
		if (points == undefined) { return; }
		this.winLnPts = points;
		drawWinLine();
	}

	

	private calcWinLnPts(){
		if (
			this.winnerCanvasCoords.firstBoxCanvasX == null ||
			this.winnerCanvasCoords.firstBoxCanvasY == null ||
			this.winnerCanvasCoords.lastBoxCanvasX == null ||
			this.winnerCanvasCoords.lastBoxCanvasY == null
		) {
			return;
		}
		var waypoints = [] as {x: number, y: number}[];

			var dx=this.winnerCanvasCoords.lastBoxCanvasX-this.winnerCanvasCoords.firstBoxCanvasX;
			var dy=this.winnerCanvasCoords.lastBoxCanvasY-this.winnerCanvasCoords.firstBoxCanvasY;
			for(var j=0;j<gameDefaults.winLnDrawIncr;j++){
				var x=this.winnerCanvasCoords.firstBoxCanvasX+dx*j/gameDefaults.winLnDrawIncr;
				var y=this.winnerCanvasCoords.firstBoxCanvasY+dy*j/gameDefaults.winLnDrawIncr;
				waypoints.push({x:x,y:y});
			}
			waypoints.push({x:this.winnerCanvasCoords.lastBoxCanvasX,y:this.winnerCanvasCoords.lastBoxCanvasY});
		return(waypoints);
	}

	private drawBackground() {
		let occumilatedLineHeight = 0;
		let occumilatedLineWidth = 0;
		// Pick the opposite of the current theme for the background.
		this.context.fillStyle = this.strokeStyles[+!get(darkTheme)];
		this.context.strokeStyle = this.strokeStyles[+get(darkTheme)];
		this.context.fillRect(0, 0, this._width, this._height);
		this.context.lineWidth = this.gridLineWidth;
		for (let i = 0; i < this.gridY - 1; i++) {
			occumilatedLineHeight += this._boxAreaHeight;
			this.context.beginPath();
			this.context.moveTo(0, occumilatedLineHeight);
			this.context.lineTo(this._width, occumilatedLineHeight);
			this.context.closePath();
			this.context.stroke();
		}
		for (let i = 0; i < this.gridX - 1; i++) {
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
		for (let i = 0; i < this.gridX; i++) {
			for (let j = 0; j < this.gridY; j++) {
				this.boxes[i][j].draw();
			}
		}
		if (this.winnerCanvasCoords === undefined) {
			return;
		}
		this.preDrawWinLine();
	}

	private createBoxes() {
		for (let i = 0; i < this.gridX; i++) {
			this._boxes.push([]);
			for (let j = 0; j < this.gridY; j++) {
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

function drawWinLine() {
	if(thisGameCanvas.lnAnimateT<thisGameCanvas.winLnPts.length-1){ requestAnimationFrame(drawWinLine); }
	thisGameCanvas.context.lineWidth = thisGameCanvas.winLineWidth;
	//thisGameCanvas.context.strokeStyle = thisGameCanvas.strokeStyles[+get(darkTheme)];
	thisGameCanvas.context.strokeStyle = gameDefaults.winLineColor;
	thisGameCanvas.beginDrawing();
	thisGameCanvas.context.moveTo(thisGameCanvas.winLnPts[thisGameCanvas.lnAnimateT-1].x,thisGameCanvas.winLnPts[thisGameCanvas.lnAnimateT-1].y);
	thisGameCanvas.context.lineTo(thisGameCanvas.winLnPts[thisGameCanvas.lnAnimateT].x,thisGameCanvas.winLnPts[thisGameCanvas.lnAnimateT].y);
	thisGameCanvas.endDrawing();
	thisGameCanvas.lnAnimateT++;
}