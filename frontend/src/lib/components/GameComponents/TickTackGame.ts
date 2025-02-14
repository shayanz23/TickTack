import { GameCanvas } from './GameCanvas';

import { BoxComponent } from './BoxComponents';
import { DynamicComponent } from './DynamicComponent';
import gameDefaults from '$lib/shared/gameDefaults.json';

export class TickTackGame {
	private gameCanvas: GameCanvas;
	private _playerTurnNum = 0;
	private _winnerName = '';
	private players: string[];

	public get winnerName() {
		return this._winnerName;
	}
	public set winnerName(value) {
		this._winnerName = value;
	}

	public get playerTurnNum() {
		return this._playerTurnNum;
	}

	private set playerTurnNum(value) {
		this._playerTurnNum = value;
	}

	constructor(gameCanvas: GameCanvas, players: string[]) {
		this.gameCanvas = gameCanvas;
		this.players = players;
	}

	/**
	 * Finds the winner player and set the winnerName to it. This is done to
	 * end the game, announce a winner, and to give the option of playing again.
	 * @returns winnerFound
	 */
	public findWinner() {
		for (let i = 0; i < this.gameCanvas.boxes.length; i++) {
			for (let j = 0; j < this.gameCanvas.boxes[i].length; j++) {
				if (this.gameCanvas.boxes[i][j].isWinnerBase(i, j) === true) {
					this.winnerName = this.gameCanvas.boxes[i][j].player;
					this.determineWinnerCoords(
						this.gameCanvas.boxes[i][j].winnerCoords,
						this.gameCanvas.boxes[i][j].winOrientation
					);
					this.gameCanvas.preDrawWinLine();
					return true;
				}
			}
		}
		return false;
	}

	private determineWinnerCoords(winGridCoords: { x: number; y: number }[], orientation: number) {
		const firstBox = this.gameCanvas.boxes[winGridCoords[0].x][winGridCoords[0].y];
		const lastBox =
			this.gameCanvas.boxes[winGridCoords[winGridCoords.length - 1].x][
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
			let HoriLineStart = firstBox.areaXBegin + (this.gameCanvas.boxAreaWidth - firstBox.drawSize) / 3;
			let HoriLineEnd = lastBox.areaXBegin + this.gameCanvas.boxAreaWidth - ((this.gameCanvas.boxAreaWidth - lastBox.drawSize) / 3);
			firstBoxCanvasX = HoriLineStart - 1;
			firstBoxCanvasY = firstBox.drawPosY + firstBox.drawSize / 2;
			console.log(3);
			lastBoxCanvasX = HoriLineEnd + 1;
			lastBoxCanvasY = lastBox.areaYBegin + this.gameCanvas.boxAreaHeight / 2;
		} else if (orientation === 4) {
			let VertLineStart = firstBox.areaYBegin + (this.gameCanvas.boxAreaHeight - firstBox.drawSize) / 3;
			let VertLineEnd = lastBox.areaYBegin + this.gameCanvas.boxAreaHeight - ((this.gameCanvas.boxAreaHeight - lastBox.drawSize) / 3);
			firstBoxCanvasX = firstBox.areaXBegin + this.gameCanvas.boxAreaWidth / 2;
			firstBoxCanvasY = VertLineStart - 1;
			console.log(4);
			lastBoxCanvasX = lastBox.areaXBegin + this.gameCanvas.boxAreaWidth / 2;
			lastBoxCanvasY = VertLineEnd + 1;
		}
		this.gameCanvas.winnerCanvasCoords = { firstBoxCanvasX, firstBoxCanvasY, lastBoxCanvasX, lastBoxCanvasY };
	}

	/**
	 * Checks if the canvas is full, it is used to check if the game cannot proceed and
	 * is therefore a tie.
	 * @returns if the canvas is full.
	 */
	public checkCanvasFull(): boolean {
		for (let i = 0; i < this.gameCanvas.boxes.length; i++) {
			for (let j = 0; j < this.gameCanvas.boxes[i].length; j++) {
				if (this.gameCanvas.boxes[i][j].player === gameDefaults.emptyBoxPlayer) {
					return false;
				}
			}
		}
		return true;
	}

	public getCurrentPlayer(): string {
		return this.players[this.playerTurnNum];
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
		let box = this.gameCanvas.boxes[boxPos.boxCol][boxPos.boxRow];
		if (box !== null && !box.drawn && playerNum === this.playerTurnNum) {
			try {
				box = new DynamicComponent(
					gameDefaults.compoAntecedent + this.playerTurnNum,
					box.areaXBegin,
					box.areaYBegin,
					this.gameCanvas,
					this.players[this.playerTurnNum]
				) as BoxComponent;
			} catch (e) {
				console.error(e);
			}
			this.playerTurnNum++;
			success = true;
		}

		this.gameCanvas.boxes[boxPos.boxCol][boxPos.boxRow] = box;

		if (this.playerTurnNum >= this.players.length) {
			this.playerTurnNum = 0;
		}
		return success;
	}
}
