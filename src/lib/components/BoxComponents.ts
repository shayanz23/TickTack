import { GameCanvas } from './GameCanvas';

export class BoxComponent {
	public areaXBegin: number;
	public areaYBegin: number;
	lineWidth: number;
	padding: number;
	drawSize: number = 0;
	drawPosX: number = 0;
	drawPosY: number = 0;
	drawn: boolean = false;
	player: string = 'empty box';
	gameCanvas: GameCanvas;
	private _winOrientation: number = 0;
	private _winnerCoords: { x: number; y: number; }[] = [];

    public get winnerCoords(): { x: number; y: number; }[] {
        return this._winnerCoords;
    }
    public get winOrientation(): number {
        return this._winOrientation;
    }

	constructor(areaXBegin: number, areaYBegin: number, canvas: GameCanvas) {
		this.areaXBegin = areaXBegin;
		this.areaYBegin = areaYBegin;
		this.gameCanvas = canvas;
		this.lineWidth = Math.min(this.gameCanvas.boxAreaHeight, this.gameCanvas.boxAreaWidth) / 7;
		this.padding = this.lineWidth;
		this.calculateDrawPos();
	}

	protected beginDrawing() {
		this.gameCanvas.context.lineWidth = this.lineWidth;

		// this.context.strokeStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
		this.gameCanvas.context.beginPath();
		return true;
	}

	protected endDrawing() {
		this.gameCanvas.context.closePath();
		this.gameCanvas.context.stroke();
		this.drawn = true;
	}

	public calculateDrawPos() {
		this.drawSize =
			Math.min(this.gameCanvas.boxAreaHeight, this.gameCanvas.boxAreaWidth) - this.padding * 2;
		this.drawPosX = this.areaXBegin + (this.gameCanvas.boxAreaWidth - this.drawSize) / 2;
		this.drawPosY = this.areaYBegin + (this.gameCanvas.boxAreaHeight - this.drawSize) / 2;
	}

	public recalculateDrawPos(areaXBegin: number, areaYBegin: number) {
		this.areaXBegin = areaXBegin;
		this.areaYBegin = areaYBegin;
		this.lineWidth = Math.min(this.gameCanvas.boxAreaHeight, this.gameCanvas.boxAreaWidth) / 7;
		this.padding = this.lineWidth;
		this.calculateDrawPos();
	}

	public draw(): void {}

	public isWinnerBase(col: number, row: number): boolean {
		if (this.player === 'empty box') {
			return false;
		}
		let diagToRightWinner = this.isWinner(col, row, 0, 1, []);
		let diagToLeftWinner = this.isWinner(col, row, 0, 2, []);
		let horizWinner = this.isWinner(col, row, 0, 3, []);
		let vertWinner = this.isWinner(col, row, 0, 4, []);

		return diagToRightWinner || diagToLeftWinner || horizWinner || vertWinner;
	}

	private isWinner(
		col: number,
		row: number,
		len: number,
		orientation: number,
		tempCoords: { x: number; y: number }[]
	): boolean {
		let won = false;
		if (len >= this.gameCanvas.winLength) {
			this._winOrientation = orientation;
			this._winnerCoords = tempCoords;
			console.log(this.winOrientation)
			return true;
		}
		if (this.gameCanvas.boxes[col] === undefined || this.gameCanvas.boxes[col][row] === undefined) {
			return false;
		}
		if (this.gameCanvas.boxes[col][row].player === this.player) {
			tempCoords.push({ x: col, y: row });
			if (orientation === 1) {
				won = this.isWinner(col + 1, row + 1, len + 1, 1, tempCoords);
			} else if (orientation === 2) {
				won = this.isWinner(col - 1, row + 1, len + 1, 2, tempCoords);
			} else if (orientation === 3) {
				won = this.isWinner(col + 1, row, len + 1, 3, tempCoords);
			} else if (orientation === 4) {
				won = this.isWinner(col, row + 1, len + 1, 4, tempCoords);
			}
		}
		return won;
	}
}

export class Component0 extends BoxComponent {
	constructor(AreaXBegin: number, AreaYBegin: number, canvas: GameCanvas, player: string) {
		super(AreaXBegin, AreaYBegin, canvas);
		this.player = player;
		this.draw();
	}

	public draw() {
		this.beginDrawing();
		this.gameCanvas.context.moveTo(this.drawPosX, this.drawPosY);
		this.gameCanvas.context.lineTo(this.drawPosX + this.drawSize, this.drawPosY + this.drawSize);
		this.gameCanvas.context.moveTo(this.drawPosX + this.drawSize, this.drawPosY);
		this.gameCanvas.context.lineTo(this.drawPosX, this.drawPosY + this.drawSize);
		this.endDrawing();
	}
}

export class Component1 extends BoxComponent {
	constructor(AreaXBegin: number, AreaYBegin: number, canvas: GameCanvas, player: string) {
		super(AreaXBegin, AreaYBegin, canvas);
		this.player = player;
		this.draw();
	}

	public draw() {
		this.beginDrawing();
		this.gameCanvas.context.arc(
			this.drawPosX + this.drawSize / 2,
			this.drawPosY + this.drawSize / 2,
			this.drawSize / 2,
			0,
			2 * Math.PI
		);
		this.endDrawing();
	}
}

export class Component2 extends BoxComponent {
	constructor(AreaXBegin: number, AreaYBegin: number, canvas: GameCanvas, player: string) {
		super(AreaXBegin, AreaYBegin, canvas);
		this.player = player;
		this.draw();
	}

	public draw() {
		this.beginDrawing();
		this.gameCanvas.context.arc(
			this.drawPosX + this.drawSize / 2,
			this.drawPosY + this.drawSize / 2,
			this.drawSize / 2,
			0,
			2 * Math.PI
		);
		this.endDrawing();
	}
}

export class Component3 extends BoxComponent {
	constructor(AreaXBegin: number, AreaYBegin: number, canvas: GameCanvas, player: string) {
		super(AreaXBegin, AreaYBegin, canvas);
		this.player = player;
		this.draw();
	}

	public draw() {
		this.beginDrawing();
		this.gameCanvas.context.arc(
			this.drawPosX + this.drawSize / 2,
			this.drawPosY + this.drawSize / 2,
			this.drawSize / 2,
			0,
			2 * Math.PI
		);
		this.endDrawing();
	}
}
