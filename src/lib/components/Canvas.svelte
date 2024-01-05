<script lang="ts">
	import { onMount } from 'svelte';
	const height: number = 600;
	const width: number = 600;
	const gridRows: number = 5;
	const gridColumns: number = 5;
	const winLength = 4;
	const boxAreaHeight: number = height / gridRows;
	const boxAreaWidth: number = width / gridColumns;
	let gameCanvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let boxes: BoxComponent[][] = [];
	let playerTurn: number = 1;
	let left: number = 0;
	let top: number = 0;
	export let winner = 0;
	export let gameOver = false;

	onMount(() => {
		if (gameCanvas == null) {
			console.error('game Canvas is null');
			return;
		} else if (gameCanvas.getContext('2d') == null) {
			console.error('game Canvas context is null');
			return;
		}
		context = gameCanvas.getContext('2d')!;

		drawGrid();
	});

	function drawGrid() {
		if (context == null) {
			console.error('game Canvas context is null');
			return;
		}
		context.font = boxAreaWidth + 'px serif';
		let occumilatedLineHeight = 0;
		let occumilatedLineWidth = 0;
		context.strokeStyle = 'black';
		context.lineWidth = 5;
		for (let i = 0; i < gridRows - 1; i++) {
			occumilatedLineHeight += boxAreaHeight;
			context.beginPath();
			context.moveTo(0, occumilatedLineHeight);
			context.lineTo(width, occumilatedLineHeight);
			context.closePath();
			context.stroke();
		}
		for (let i = 0; i < gridColumns - 1; i++) {
			occumilatedLineWidth += boxAreaWidth;
			context.beginPath();
			context.moveTo(occumilatedLineWidth, 0);
			context.lineTo(occumilatedLineWidth, height);
			context.closePath();
			context.stroke();
		}
	}

	function createBoxes() {
		for (let i = 0; i < gridColumns; i++) {
			boxes.push([]);
			// console.log("column: ", i)
			for (let j = 0; j < gridRows; j++) {
				//for each column add the rows of boxes
				// console.log("row: ", j)
				boxes[i].push(new BoxComponent(i * boxAreaWidth, j * boxAreaHeight));
			}
		}
	}

	class BoxComponent {
		AreaXBegin: number;
		AreaYBegin: number;
		lineWidth: number = Math.min(boxAreaHeight, boxAreaWidth) / 7;
		padding: number = this.lineWidth;
		size: number = 0;
		drawPosX: number = 0;
		drawPosY: number = 0;
		drawn: boolean = false;
		player: number = 0;

		constructor(AreaXBegin: number, AreaYBegin: number) {
			this.AreaXBegin = AreaXBegin;
			this.AreaYBegin = AreaYBegin;
			this.calculateDrawPos();
		}

		protected beginDrawing() {
			console.log('being drawn');
			context.lineWidth = this.lineWidth;

			// context.strokeStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
			context.beginPath();
			return true;
		}

		protected endDrawing() {
			context.closePath();
			context.stroke();
			this.drawn = true;
		}

		private calculateDrawPos() {
			this.size = Math.min(boxAreaHeight, boxAreaWidth) - this.padding * 2;
			this.drawPosX = this.AreaXBegin + (boxAreaWidth - this.size) / 2;
			this.drawPosY = this.AreaYBegin + (boxAreaHeight - this.size) / 2;
		}

		public checkWinnerBase(col: number, row: number): boolean {
			console.log('---checking wonner---');
			if (this.player === 0) {
				return false;
			}
			let diagToRightWinner = this.checkWinner(col, row, 0, 1);
			let diagToLeftWinner = this.checkWinner(col, row, 0, 2);
			let horizWinner = this.checkWinner(col, row, 0, 3);
			let vertWinner = this.checkWinner(col, row, 0, 4);

			if (diagToRightWinner || diagToLeftWinner || horizWinner || vertWinner) {
				return true;
			}

			return false;
		}

		private checkWinner(col: number, row: number, len: number, type: number): boolean {
			let won = false;
			if (len >= winLength) {
				return true;
			}
			if (boxes[col] === undefined || boxes[col][row] === undefined) {
				return false;
			}
			if (boxes[col][row].player === this.player) {
				if (type === 1) {
					won = this.checkWinner(col + 1, row + 1, len + 1, 1);
				} else if (type === 2) {
					won = this.checkWinner(col - 1, row + 1, len + 1, 2);
				} else if (type === 3) {
					won = this.checkWinner(col + 1, row, len + 1, 3);
				} else if (type === 4) {
					won = this.checkWinner(col, row + 1, len + 1, 4);
				}
			}
			return won;
		}
	}

	class XComponent extends BoxComponent {
		constructor(AreaXBegin: number, AreaYBegin: number) {
			super(AreaXBegin, AreaYBegin);
			this.player = 1;
			this.draw();
		}

		private draw() {
			this.beginDrawing();
			context.moveTo(this.drawPosX, this.drawPosY);
			context.lineTo(this.drawPosX + this.size, this.drawPosY + this.size);
			context.moveTo(this.drawPosX + this.size, this.drawPosY);
			context.lineTo(this.drawPosX, this.drawPosY + this.size);
			this.endDrawing();
		}
	}

	class OComponent extends BoxComponent {
		constructor(AreaXBegin: number, AreaYBegin: number) {
			super(AreaXBegin, AreaYBegin);
			this.player = 2;
			this.draw();
		}

		private draw() {
			this.beginDrawing();
			context.arc(
				this.drawPosX + this.size / 2,
				this.drawPosY + this.size / 2,
				this.size / 2,
				0,
				2 * Math.PI
			);
			this.endDrawing();
		}
	}

	function handleCanvasClick(event: MouseEvent) {
		if (!gameOver) {
			if (gameCanvas == null) {
				console.error('game Canvas is null');
				return;
			}
			if (context == null) {
				console.error('context is null');
				return;
			}
			left = gameCanvas.getBoundingClientRect().left;
			top = gameCanvas.getBoundingClientRect().top;
			const x = event.clientX - left;
			const y = event.clientY - top;
			const boxPos = findBox(x, y);

			drawBox(boxPos);
			findWinner();
		}
	}

	function findWinner() {
		console.log('********Finding wonner********');
		console.log('********Finding wonner********');
		for (let i = 0; i < boxes.length; i++) {
			for (let j = 0; j < boxes[i].length; j++) {
				if (boxes[i][j].checkWinnerBase(i, j) === true) {
					winner = boxes[i][j].player;

					console.log('++++Winner: ', winner);
				}
			}
		}
		if (winner != 0) {
			gameOver = true;
		}
	}

	function findBox(x: number, y: number) {
		let found = false;
		let boxCol = null;
		let boxRow = null;
		for (let i = 0; i < boxes.length; i++) {
			for (let j = 0; j < boxes[i].length; j++) {
				if (
					x > boxes[i][j].AreaXBegin &&
					x < boxes[i][j].AreaXBegin + boxAreaWidth &&
					y > boxes[i][j].AreaYBegin &&
					y < boxes[i][j].AreaYBegin + boxAreaHeight
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

	function drawBox(boxPos: { boxCol: number | null; boxRow: number | null }) {
		if (boxPos.boxCol === null || boxPos.boxRow === null) {
			return;
		}
		if (boxes[boxPos.boxCol][boxPos.boxRow] != null && !boxes[boxPos.boxCol][boxPos.boxRow].drawn) {
			if (playerTurn == 1) {
				let newComponent = new XComponent(
					boxes[boxPos.boxCol][boxPos.boxRow].AreaXBegin,
					boxes[boxPos.boxCol][boxPos.boxRow].AreaYBegin
				);
				boxes[boxPos.boxCol][boxPos.boxRow] = newComponent;
				if (boxes[boxPos.boxCol][boxPos.boxRow].drawn) {
					playerTurn = 2;
				}
				return;
			} else if (playerTurn == 2) {
				let newComponent = new OComponent(
					boxes[boxPos.boxCol][boxPos.boxRow].AreaXBegin,
					boxes[boxPos.boxCol][boxPos.boxRow].AreaYBegin
				);
				boxes[boxPos.boxCol][boxPos.boxRow] = newComponent;
				if (boxes[boxPos.boxCol][boxPos.boxRow].drawn) {
					playerTurn = 1;
				}
				return;
			}
		}
	}

	createBoxes();
</script>

<canvas id="game-canvas" {height} {width} bind:this={gameCanvas} on:click={handleCanvasClick}
></canvas>

<style>
	#game-canvas {
		margin: auto;
	}
</style>
