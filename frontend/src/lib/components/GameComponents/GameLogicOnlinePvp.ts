import { darkTheme } from '$lib/shared/stores/appTheme';

import { BoxComponent } from './BoxComponents';
import { DynamicComponent } from './DynamicComponent';
import gameDefaults from '$lib/shared/gameDefaults.json';
import { get } from 'svelte/store';
import { GameLogic } from './GameLogic';

export class GameLogicLocalPvp extends GameLogic {

	constructor(
		playerNames: string[],
		htmlCanvas: HTMLCanvasElement,
		gridY: number,
		gridX: number,
		winLength: number,
		scale: number) {
		super(playerNames, htmlCanvas, gameDefaults.localPvp.width, gameDefaults.localPvp.height, gridY, gridX, winLength, scale);
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
		let success = this.replaceEmptyBox(boxPos, this._playerTurnNum);
		if (!success) {
			return;
		}

		this.getPlayerName(this._playerTurnNum);
		this.findWinner();
		this.winnerName;

		if (this.winnerName !== '' || this.checkCanvasFull()) {
			this.gameOver = true;
		}
	}

}