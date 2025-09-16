<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { GameLogic } from '../GameComponents/GameLogic';
	import { darkTheme } from '$lib/shared/stores/appTheme';
	import gameDefaults from '$lib/shared/gameDefaults.json';

	export let winner = '';
	export let gameOver = false;
	export let currentPlayer: string = '';
	export let playerNames:string[];
	export let gridX = gameDefaults.gridX;
	export let gridY = gameDefaults.gridY;
	export let winLength = gameDefaults.winLength;

	let htmlCanvas: HTMLCanvasElement | null;
	let gameLogic: GameLogic | null = null;

	function setDefaultPlayerName() {
		for (let index = 0; index < playerNames.length; index++) {
			if (playerNames[index] === '') {
				playerNames[index] = gameDefaults.genPrePlNm + (index + 1);
			}
		}
	}

	function rescaleCanvas() {
		if (gameLogic === null) {
			return;
		}
		if (window.outerWidth <= gameDefaults.screens.md || window.innerHeight <= gameDefaults.screens.md) {
			gameLogic.scale = gameDefaults.halfScale;
		} else {
			gameLogic.scale = 1;
		}
	}

	// Code inside ran once the component has been mounted (created and inserted in)to the dom.
	onMount(() => {
		// Insure html canvas and its context aren't null.
		if (htmlCanvas === null) {
			console.error(gameDefaults.errors.gameCanvNull);
			return;
		} else if (htmlCanvas.getContext('2d') === null) {
			console.error(gameDefaults.errors.gameCanvCtxNull);
			return;
		}

		// Change HTMLCanvas Size to match screen size before drawing anything.
		if (browser) {
			// Initialize gameCanvas with the ready htmlCanvas injected.
			gameLogic = new GameLogic(playerNames, htmlCanvas, gameDefaults.localPvp.width, gameDefaults.localPvp.height, gridY, gridX, winLength, 1);
			setDefaultPlayerName();
			currentPlayer = playerNames[gameLogic.playerTurnNum];

			// Rescale canvas incase the window size is smaller or is changed.
			rescaleCanvas();
			window.addEventListener('resize', rescaleCanvas);
			htmlCanvas.addEventListener('mousedown', gameLogic.handleCanvasMouseDown)
			htmlCanvas.addEventListener('mouseup', gameLogic.handleCanvasMouseUp)
		    htmlCanvas.addEventListener('mouseup', () => {
				if (gameLogic === null) {
					return;
				}
				gameOver = gameLogic.gameOver;
				winner = gameLogic.winnerName;
			})

		}
	});

</script>

<canvas
	id="game-canvas"
	bind:this={htmlCanvas}
></canvas>

<style>
	#game-canvas {
		padding: 0;
		margin: auto;
	}
</style>
