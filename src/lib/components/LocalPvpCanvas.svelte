<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { GameCanvas } from './GameCanvas';
	import { TickTackGame } from './TickTackGame';
	import darkTheme from '$lib/shared/stores/darkTheme';

	export let winner = '';
	export let gameOver = false;
	export let currentPlayer: string = '';
	export let player1Name: string;
	export let player2Name: string;

	const height = 600;
	const width = 600;
	let htmlCanvas: HTMLCanvasElement;
	let gameCanvas: GameCanvas;
	let game: TickTackGame;
	let playerTurn = 0;
	let mouseDownBoxPos: { boxCol: number | null; boxRow: number | null };

	const player1DefaultName = 'Player 1';
	const player2DefaultName = 'Player 2';
	const maxPlayers = 2;

	export const screens = {
		sm: 640,
		md: 768,
		lg: 1024,
		xl: 1280
	};

	function setDefaultPlayerName() {
		if (player1Name === '') {
			player1Name = player1DefaultName;
		}
		if (player2Name === '') {
			player2Name = player2DefaultName;
		}
	}

	/**
	 * Sets the mousedownPos to be checked against the mouse up pos
	 * later. It ensures a user does not click on the wrong box.
	 * @param event
	 */
	function handleCanvasMouseDown(event: MouseEvent) {
		if (gameOver) {
			return;
		}
		if (htmlCanvas === null) {
			console.error('game Canvas is null');
			return;
		}

		// Set the mouse x, y coordinates relative to the canvas
		const canvasRect = htmlCanvas.getBoundingClientRect();
		const x = event.clientX - canvasRect.left;
		const y = event.clientY - canvasRect.top;
		mouseDownBoxPos = gameCanvas.findBox(x, y);
	}

	/**
	 * This runs to draw the box the player has clicked, and runs the logic to check if the 
	 * game is over.
	 * @param event
	 */
	function handleCanvasMouseUp(event: MouseEvent) {
		if (gameOver) {
			return;
		}
		if (htmlCanvas === null) {
			console.error('game Canvas is null');
			return;
		}

		// Set the mouse x, y coordinates relative to the canvas
		const canvasRect = htmlCanvas.getBoundingClientRect();
		const x = event.clientX - canvasRect.left;
		const y = event.clientY - canvasRect.top;
		const boxPos = gameCanvas.findBox(x, y);

		if (boxPos.boxCol !== mouseDownBoxPos.boxCol || boxPos.boxRow !== mouseDownBoxPos.boxRow) {
			return;
		}

		//Run the game logics for each round.
		gameLogic(boxPos);
	}

	/**
	 * Game logic, replacing an empty box with the corresponding player box,
	 * change the player turn, find current player, winner and end game if there is a winner,
	 * or the canvas is full.
	 * @param boxPos
	 */
	function gameLogic(boxPos: { boxCol: number | null; boxRow: number | null }) {
		let success = game.replaceEmptyBox(boxPos, playerTurn);
		if (!success) {
			return;
		}
		playerTurn = (playerTurn + 1) % maxPlayers;

		currentPlayer = game.getCurrentPlayer();
		game.findWinner();
		winner = game.winnerName;

		if (winner !== '' || game.checkCanvasFull()) {
			gameOver = true;
		}
	}

	function redraw() {
		if (browser && gameCanvas !== undefined) {
			gameCanvas.redraw();
		}
	}

	function rescaleCanvas() {
		if (window.outerWidth <= screens.md) {
			gameCanvas.scale = 0.5;
		} else {
			gameCanvas.scale = 1;
		}
	}

	// Code inside ran once the component has been mounted (created and inserted in)to the dom.
	onMount(() => {
		// Insure html canvas and its context aren't null.
		if (htmlCanvas === null) {
			console.error('game Canvas is null');
			return;
		} else if (htmlCanvas.getContext('2d') === null) {
			console.error('game Canvas context is null');
			return;
		}

		// Change HTMLCanvas Size to match screen size before drawing anything.
		if (browser) {
			// Initialize gameCanvas with the ready htmlCanvas injected.
			gameCanvas = new GameCanvas(htmlCanvas, width, height, 5, 5, 4, 1);
			setDefaultPlayerName();
			game = new TickTackGame(gameCanvas, [player1Name, player2Name]);
			currentPlayer = game.getCurrentPlayer();

			// Rescale canvas incase the window size is smaller or is changed.
			rescaleCanvas();
			window.addEventListener('resize', rescaleCanvas);
		}
	});

	$: $darkTheme, redraw();
</script>

<canvas
	id="game-canvas"
	bind:this={htmlCanvas}
	on:mouseup={handleCanvasMouseUp}
	on:mousedown={handleCanvasMouseDown}
></canvas>

<style>
	#game-canvas {
		padding: 0;
		margin: auto;
	}
</style>
