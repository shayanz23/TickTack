
import { GameCanvas } from "./GameCanvas";

import {BoxComponent, Component0, Component1 } from './BoxComponents';
import { DynamicComponent } from "./DynamicComponent";

const defaultMaxPlayers = 2;

export class TickTackGame {

    private gameCanvas: GameCanvas;
    private _playerTurn = 0;
    private _winnerName = "";
    private playerNames: string[];
    private _maxPlayers: number = defaultMaxPlayers;

    public get maxPlayers(): number {
        return this._maxPlayers;
    }
    public set maxPlayers(value: number) {
        this._maxPlayers = value;
    }

    public get winnerName() {
        return this._winnerName;
    }
    public set winnerName(value) {
        this._winnerName = value;
    }

    public get playerTurnNum() {
        return this._playerTurn;
    }
    
    private set playerTurnNum(value) {
        this._playerTurn = value;
    }

    constructor(gameCanvas: GameCanvas, players: string[]) {
        this.gameCanvas = gameCanvas
        this.playerNames = players;
    }

    /**
    * Finds the winner player and set the winnerName to it. This is done to
    * end the game, announce a winner, and to give the option of playing again.
    * @returns winnerFound
    */
    public findWinner() {
        for (let i = 0; i < this.gameCanvas.boxes.length; i++) {
            for (let j = 0; j < this.gameCanvas.boxes[i].length; j++) {
                if (this.gameCanvas.boxes[i][j].checkWinnerBase(i, j) === true) {
                    this.winnerName = this.gameCanvas.boxes[i][j].player;
                    return true;
                }
            }
        }
        return false
    }

    /**
     * Checks if the canvas is full, it is used to check if the game cannot proceed and
     * is therefore a tie.
     * @returns if the canvas is full.
     */
    public checkCanvasFull(): boolean {
        for (let i = 0; i < this.gameCanvas.boxes.length; i++) {
            for (let j = 0; j < this.gameCanvas.boxes[i].length; j++) {
                if (this.gameCanvas.boxes[i][j].player === "empty box") {
                    return false;
                }
            }
        }
        return true;
    }

    public getCurrentPlayer(): string {
        return this.playerNames[this.playerTurnNum];
    }

    /**
     * Replaces an empty box with one of the corresponding player. Does this to show game progress.
     * @param boxPos Coordinates for the box column and row being replaced.
     * @returns undefined
     */
    public replaceEmptyBox(boxPos: { boxCol: number | null; boxRow: number | null }, playerNum: number) {
        if (boxPos.boxCol === null || boxPos.boxRow === null) {
            return new Error("");
        }
        let box = this.gameCanvas.boxes[boxPos.boxCol][boxPos.boxRow];

        if (box !== null && !box.drawn && playerNum === this.playerTurnNum) {
            try {
                box = new DynamicComponent('Component' + this.playerTurnNum, box.areaXBegin, box.areaYBegin, this.gameCanvas, this.playerNames[this.playerTurnNum]) as BoxComponent;
            
            } catch (e) {
                console.error(e);
            }
            this.playerTurnNum++;
        }

        this.gameCanvas.boxes[boxPos.boxCol][boxPos.boxRow] = box;

        if (this.playerTurnNum >= this.maxPlayers) {
            this.playerTurnNum = 0;
        }
    }
    
}