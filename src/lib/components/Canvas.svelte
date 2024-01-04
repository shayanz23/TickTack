<script lang="ts">
	import { onMount } from 'svelte';
	let height: number = 600;
	let width: number = 600;
	let gridRows: number = 4;
	let gridColumns: number = 4;
	let boxAreaHeight: number = height / gridRows;
	let boxAreaWidth: number = width / gridColumns;
	let gameCanvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	let boxes: BoxComponent[][] = [];
	let playerTurn: number = 1;
	let left: number = 0;
	let top: number = 0;

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
			console.log(this);
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

		public checkWinner() {

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
		if (gameCanvas == null) {
			console.error('game Canvas is null');
			return;
		}
		left = gameCanvas.getBoundingClientRect().left;
		top = gameCanvas.getBoundingClientRect().top;
		console.log('left, top ', left, top);
		if (context == null) {
			console.error('context is null');
			return;
		}
		const x = event.clientX - left;
		const y = event.clientY - top;

		const boxPos = findBox(x, y);

		console.log(boxes);
		
		drawBox(boxPos);
	}

	function findBox(x: number, y: number) {
		let found = false;
		let boxColumn = null;
		let boxRow = null;
		for (let i = 0; i < boxes.length; i++) {
			for (let j = 0; j < boxes[i].length; j++) {
				if (
					x > boxes[i][j].AreaXBegin &&
					x < boxes[i][j].AreaXBegin + boxAreaWidth &&
					y > boxes[i][j].AreaYBegin &&
					y < boxes[i][j].AreaYBegin + boxAreaHeight
				) {
					boxColumn = i;
					boxRow = j;
					found = true;
					break;
				}
			}
			if (found) {
				console.log(found);
				break;
			}
		}
		return {boxColumn, boxRow};
	}

	function drawBox(boxPos: {boxColumn: number|null, boxRow: number|null}) {
		if (boxPos.boxColumn === null || boxPos.boxRow === null) {
			return;
		}
		if (boxes[boxPos.boxColumn][boxPos.boxRow] != null && !boxes[boxPos.boxColumn][boxPos.boxRow].drawn) {
			if (playerTurn == 1) {
				let newComponent = new XComponent(
					boxes[boxPos.boxColumn][boxPos.boxRow].AreaXBegin,
					boxes[boxPos.boxColumn][boxPos.boxRow].AreaYBegin
				);
				boxes[boxPos.boxColumn][boxPos.boxRow] = newComponent;
				if (boxes[boxPos.boxColumn][boxPos.boxRow].drawn) {
					playerTurn = 2;
				}
				return;
			} else if (playerTurn == 2) {
				let newComponent = new OComponent(
					boxes[boxPos.boxColumn][boxPos.boxRow].AreaXBegin,
					boxes[boxPos.boxColumn][boxPos.boxRow].AreaYBegin
				);
				boxes[boxPos.boxColumn][boxRow] = newComponent;
				if (boxes[boxPos.boxColumn][boxPos.boxRow].drawn) {
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
