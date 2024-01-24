<script lang="ts">
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { GameCanvas } from './GameCanvas';
	import { Component0, Component1 } from './BoxComponents';
	import { TickTackGame } from './TickTackGame';

	export let winner = '';
	export let gameOver = false;
	export let currentPlayer: string = '';
	export let player1Name: string;
	export let player2Name: string;

	let height = 600;
	let width = 600;
	let left = 0;
	let top = 0;
	let htmlCanvas: HTMLCanvasElement;
	let gameCanvas: GameCanvas;
	let game: TickTackGame;
	let playerTurn = 0;

	const player1DefaultName = 'Player 1';
	const player2DefaultName = 'Player 2';
	const maxPlayers = 2;

	export const screens = {
		sm: 640,
		md: 768,
		lg: 1024,
		xl: 1280
	};

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
			if (window.outerWidth <= screens.md) {
				gameCanvas.scale = 0.5;
			}
			setDefaultPlayerName();
			game = new TickTackGame(gameCanvas, [player1Name, player2Name]);
			currentPlayer = game.getCurrentPlayer();
		}
	});

	function setDefaultPlayerName() {
		if (player1Name === '') {
			player1Name = player1DefaultName;
		}
		if (player2Name === '') {
			player2Name = player2DefaultName;
		}
	}

	/**
	 *
	 * @param event
	 */
	function handleCanvasClick(event: MouseEvent) {
		if (!gameOver) {
			if (htmlCanvas === null) {
				console.error('game Canvas is null');
				return;
			}
			if (gameCanvas.context === null) {
				console.error('context is null');
				return;
			}
			left = htmlCanvas.getBoundingClientRect().left;
			top = htmlCanvas.getBoundingClientRect().top;
			console.log("Left, Top: ",left, ", ", top)

			// Set the mouse x, y coordinates relative to the canvas\
			const x = event.clientX - left;
			const y = event.clientY - top;
			const boxPos = gameCanvas.findBox(x, y);
			console.log("X, Y: ", x, ", ", y);
			console.log("Boxpos: " + boxPos.boxCol, ", ", boxPos.boxRow); 
			game.replaceEmptyBox(boxPos, playerTurn);
			playerTurn++;
			if (playerTurn >= maxPlayers) {
				playerTurn = 0;
			}
			currentPlayer = game.getCurrentPlayer();
			game.findWinner();
			winner = game.winnerName;
			console.log('winner: ' + game.winnerName);
			winner !== '' ? (gameOver = true) : null;
			const tie = game.checkCanvasFull();
			tie === true ? (gameOver = true) : null;
		}
	}

</script>

<canvas id="game-canvas" bind:this={htmlCanvas} on:click={handleCanvasClick}></canvas>

<style>
	#game-canvas {
		margin: auto;
	}
</style>
