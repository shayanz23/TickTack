import { darkTheme } from '$lib/shared/stores/appTheme';

import { BoxComponent } from './BoxComponents';
import { DynamicComponent } from './DynamicComponent';
import gameDefaults from '$lib/shared/gameDefaults.json';
import { get } from 'svelte/store';

let thisGameCanvas: GameLogic;

export class GameLogic {
	protected gridY: number;
	protected gridX: number;
	protected _winLength;
	protected _height: number;
	protected _width: number;
	protected _scale: number;
	protected _htmlCanvas: HTMLCanvasElement;
	protected _context!: CanvasRenderingContext2D;
	protected _boxes: BoxComponent[][] = [];
	protected readonly strokeStyles = [gameDefaults.darkGreyColor, gameDefaults.almostWhiteColor];
	protected _boxAreaHeight: number;
	protected _boxAreaWidth: number;
	protected gridLineWidth: number;
	protected _winLineWidth: number;
	protected _winLnPts = [] as { x: number; y: number; }[];
	protected _lnAnimateT = 1;
	protected _gameOver =  false;
	protected _mouseDownBoxPos: { boxCol: number | null; boxRow: number | null; } = {boxCol: null, boxRow: null};
	protected _playerTurnNum = 0;
	protected _winnerName = '';
	protected _playerNames: string[];
	
	public get playerNames(): string[] {
		return this._playerNames;
	}
	public set playerNames(value: string[]) {
		this._playerNames = value;
	}
	
	public get mouseDownBoxPos(): { boxCol: number | null; boxRow: number | null; } {
		return this._mouseDownBoxPos;
	}
	public set mouseDownBoxPos(value: { boxCol: number | null; boxRow: number | null; }) {
		this._mouseDownBoxPos = value;
	}

	public get gameOver() {
		return this._gameOver;
	}
	public set gameOver(value) {
		this._gameOver = value;
	}

	public get winLineWidth(): number {
		return this._winLineWidth;
	}
	public set winLineWidth(value: number) {
		this._winLineWidth = value;
	}
	public get winLnCoords() {
		return this._winLnPts;
	}
	public set winLnCoords(value) {
		this._winLnPts = value;
	}
	public get lnAnimateT() {
		return this._lnAnimateT;
	}
	public set lnAnimateT(value) {
		this._lnAnimateT = value;
	}
	protected _winnerCanvasCoords: {
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
		this._scale = value / gameDefaults.scaleDivider;
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
		return this._width / gameDefaults.scaleDivider;
	}

	public get height() {
		return this._height / gameDefaults.scaleDivider;
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

	protected set htmlCanvas(value: HTMLCanvasElement) {
		this._htmlCanvas = value;
	}

	public get winnerName() {
		return this._winnerName;
	}
	public set winnerName(value) {
		this._winnerName = value;
	}

	public get playerTurnNum() {
		return this._playerTurnNum;
	}

	protected set playerTurnNum(value) {
		this._playerTurnNum = value;
	}

	constructor(
		playerNames: string[],
		htmlCanvas: HTMLCanvasElement,
		width: number,
		height: number,
		gridY: number,
		gridX: number,
		winLength: number,
		scale: number) {
		this._playerNames = playerNames;
		console.log(playerNames)
		this._htmlCanvas = htmlCanvas;
		this.gridX = gridX;
		this.gridY = gridY;

		this._width = width * gameDefaults.scaleDivider;
		this._height = height * gameDefaults.scaleDivider;
		this._scale = scale / gameDefaults.scaleDivider;

		this._boxAreaHeight = this._height / this.gridY;
		this._boxAreaWidth = this._width / this.gridX;
		this.gridLineWidth = Math.min(this.boxAreaHeight, this.boxAreaWidth) / gameDefaults.gridLineFactor;
		this._winLineWidth = Math.min(this.boxAreaHeight, this.boxAreaWidth) / gameDefaults.winLineFactor;
		this._winLength = winLength;
		this.context = htmlCanvas.getContext('2d')!;
		this.initializeCanvas();
		thisGameCanvas = this;
		darkTheme.subscribe(() => this.redraw())
	}

	/**
	 * Finds the winner player and set the winnerName to it. This is done to
	 * end the game, announce a winner, and to give the option of playing again.
	 * @returns winnerFound
	 */
	public findWinner() {
		for (let i = 0; i < this.boxes.length; i++) {
			for (let j = 0; j < this.boxes[i].length; j++) {
				if (this.boxes[i][j].isWinnerBase(i, j) === true) {
					this.winnerName = this.boxes[i][j].player;
					this.determineWinnerCoords(
						this.boxes[i][j].winnerCoords,
						this.boxes[i][j].winOrientation
					);
					this.preDrawWinLine();
					return true;
				}
			}
		}
		return false;
	}

	protected determineWinnerCoords(winGridCoords: { x: number; y: number }[], orientation: number) {
		const firstBox = this.boxes[winGridCoords[0].x][winGridCoords[0].y];
		const lastBox =
			this.boxes[winGridCoords[winGridCoords.length - 1].x][
				winGridCoords[winGridCoords.length - 1].y
			];

		let firstBoxCanvasX = null;
		let firstBoxCanvasY = null;

		let lastBoxCanvasX = null;
		let lastBoxCanvasY = null;

		/**
		 * The -1 and +1s are for making the line slightly longer on both ends to make the X not show from underneeth.
		 * The /2 is for making the line go in the middle of the boxes if the line vertical or horizontal.
		 * The /3 is for vertical and horizonttal line being shortened to be within the padding area of the boxes.
		 */
		if (orientation === 1) {
			firstBoxCanvasX = firstBox.drawPosX - 1;
			firstBoxCanvasY = firstBox.drawPosY - 1;
			console.log(1);
			lastBoxCanvasX = lastBox.drawPosX + lastBox.drawSize + 1;
			lastBoxCanvasY = lastBox.drawPosY + lastBox.drawSize + 1;
		} else if (orientation === 2) {
			firstBoxCanvasX = firstBox.drawPosX + firstBox.drawSize + 1;
			firstBoxCanvasY = firstBox.drawPosY - 1;
			console.log(2);
			lastBoxCanvasX = lastBox.drawPosX - 1;
			lastBoxCanvasY = lastBox.drawPosY + lastBox.drawSize + 1;
		} else if (orientation === 3) {
			let HoriLineStart = firstBox.areaXBegin + (this.boxAreaWidth - firstBox.drawSize) / 3;
			let HoriLineEnd = lastBox.areaXBegin + this.boxAreaWidth - ((this.boxAreaWidth - lastBox.drawSize) / 3);
			firstBoxCanvasX = HoriLineStart - 1;
			firstBoxCanvasY = firstBox.drawPosY + firstBox.drawSize / 2;
			console.log(3);
			lastBoxCanvasX = HoriLineEnd + 1;
			lastBoxCanvasY = lastBox.areaYBegin + this.boxAreaHeight / 2;
		} else if (orientation === 4) {
			let VertLineStart = firstBox.areaYBegin + (this.boxAreaHeight - firstBox.drawSize) / 3;
			let VertLineEnd = lastBox.areaYBegin + this.boxAreaHeight - ((this.boxAreaHeight - lastBox.drawSize) / 3);
			firstBoxCanvasX = firstBox.areaXBegin + this.boxAreaWidth / 2;
			firstBoxCanvasY = VertLineStart - 1;
			console.log(4);
			lastBoxCanvasX = lastBox.areaXBegin + this.boxAreaWidth / 2;
			lastBoxCanvasY = VertLineEnd + 1;
		}
		this.winnerCanvasCoords = { firstBoxCanvasX, firstBoxCanvasY, lastBoxCanvasX, lastBoxCanvasY };
	}

	/**
	 * Checks if the canvas is full, it is used to check if the game cannot proceed and
	 * is therefore a tie.
	 * @returns if the canvas is full.
	 */
	public checkCanvasFull(): boolean {
		for (let i = 0; i < this.boxes.length; i++) {
			for (let j = 0; j < this.boxes[i].length; j++) {
				if (this.boxes[i][j].player === gameDefaults.emptyBoxPlayer) {
					return false;
				}
			}
		}
		return true;
	}

	public getPlayerName(playerNum: number): string {
		return this.playerNames[playerNum];
	}

	/**
	 * Replaces an empty box with one of the corresponding player. Does this to show game progress.
	 * @param boxPos Coordinates for the box column and row being replaced.
	 * @returns if the box was replaced.
	 */
	public replaceEmptyBox(
		boxPos: { boxCol: number | null; boxRow: number | null },
		playerNum: number
	): boolean {
		let success = false;
		if (boxPos.boxCol === null || boxPos.boxRow === null) {
			return success;
		}
		let box = this.boxes[boxPos.boxCol][boxPos.boxRow];
		if (box !== null && !box.drawn && playerNum === this.playerTurnNum) {
			try {
				box = new DynamicComponent(
					gameDefaults.compoAntecedent + this.playerTurnNum,
					box.areaXBegin,
					box.areaYBegin,
					this,
					this.playerNames[this.playerTurnNum]
				) as BoxComponent;
			} catch (e) {
				console.error(e);
			}
			this._playerTurnNum++;
			success = true;
		}

		this.boxes[boxPos.boxCol][boxPos.boxRow] = box;

		if (this.playerTurnNum >= this.playerNames.length) {
			this.playerTurnNum = 0;
		}
		return success;
	}

	protected initializeCanvas(): void {
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
		var coordinates = this.calcWinLnCoords();
		if (coordinates == undefined) { return; }
		this.winLnCoords = coordinates;
		drawWinLine();
	}

		/**
	 * Sets the mousedownPos to be checked against the mouse up pos
	 * later. It ensures a user does not click on the wrong box.
	 * @param event
	 */
	public handleCanvasMouseDown = (event: MouseEvent) => {
		if (this.gameOver) {
			return;
		}
		if (this.htmlCanvas === null) {
			console.error(gameDefaults.errors.gameCanvNull);
			return;
		}
		// Set the mouse x, y coordinates relative to the canvas
		const canvasRect = this.htmlCanvas.getBoundingClientRect();
		const mouseXCoordinate = event.clientX - canvasRect.left;
		const mouseYCoordinate = event.clientY - canvasRect.top;
		this.mouseDownBoxPos = this.findBox(mouseXCoordinate, mouseYCoordinate);
	}

	/**
	 * This runs to draw the box the player has clicked, and runs the logic to check if the 
	 * game is over.
	 * @param event
	 */
	public handleCanvasMouseUp = (event: MouseEvent) => {
		if (this.gameOver) {
			return;
		}
		if (this.htmlCanvas === null) {
			console.error(gameDefaults.errors.gameCanvNull);
			return;
		}

		// Set the mouse x, y coordinates relative to the canvas
		const canvasRect = this.htmlCanvas.getBoundingClientRect();
		const mouseXCoordinate = event.clientX - canvasRect.left;
		const mouseYCoordinate = event.clientY - canvasRect.top;
		const boxPos = this.findBox(mouseXCoordinate, mouseYCoordinate);

		if (boxPos.boxCol !== this.mouseDownBoxPos.boxCol || boxPos.boxRow !== this.mouseDownBoxPos.boxRow) {
			return;
		}

		//Run the game logics for each round.
		this.gameClickLogic(boxPos);
	}

	/**
	 * Game logic, replacing an empty box with the corresponding player box,
	 * change the player turn, find current player, winner and end game if there is a winner,
	 * or the canvas is full.
	 * @param boxPos
	 */
	protected gameClickLogic(boxPos: { boxCol: number | null; boxRow: number | null }) {
		let success = this.replaceEmptyBox(boxPos, this.playerTurnNum);
		if (!success) {
			return;
		}

		console.log(this.playerTurnNum)
		this.getPlayerName(this.playerTurnNum);
		this.findWinner();
		this.winnerName;

		if (this.winnerName !== '' || this.checkCanvasFull()) {
			this.gameOver = true;
		}
	}

	protected calcWinLnCoords(){
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
			for(var j=0;j<gameDefaults.winLnDrawIncrement;j++){
				var x=this.winnerCanvasCoords.firstBoxCanvasX+dx*j/gameDefaults.winLnDrawIncrement;
				var y=this.winnerCanvasCoords.firstBoxCanvasY+dy*j/gameDefaults.winLnDrawIncrement;
				waypoints.push({x:x,y:y});
			}
			waypoints.push({x:this.winnerCanvasCoords.lastBoxCanvasX,y:this.winnerCanvasCoords.lastBoxCanvasY});
		return(waypoints);
	}

	protected drawBackground() {
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



	/**
	 * Creates empty boxes to be replaced with filled boxes.
	 */
	protected createBoxes() {
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
	if(thisGameCanvas.lnAnimateT < thisGameCanvas.winLnCoords.length-1) { 
		requestAnimationFrame(drawWinLine); 
	}
	thisGameCanvas.context.lineWidth = thisGameCanvas.winLineWidth;
	//thisGameCanvas.context.strokeStyle = thisGameCanvas.strokeStyles[+get(darkTheme)];
	thisGameCanvas.context.strokeStyle = gameDefaults.winLineColor;
	thisGameCanvas.beginDrawing();
	thisGameCanvas.context.moveTo(thisGameCanvas.winLnCoords[thisGameCanvas.lnAnimateT-1].x,thisGameCanvas.winLnCoords[thisGameCanvas.lnAnimateT-1].y);
	thisGameCanvas.context.lineTo(thisGameCanvas.winLnCoords[thisGameCanvas.lnAnimateT].x,thisGameCanvas.winLnCoords[thisGameCanvas.lnAnimateT].y);
	thisGameCanvas.endDrawing();
	thisGameCanvas.lnAnimateT++;
}