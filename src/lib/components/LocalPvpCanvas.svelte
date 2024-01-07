<script lang="ts">
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { GameCanvas } from './GameCanvas';
	import { XComponent, OComponent } from './BoxComponent';
	$: height = 600;
	$: width = 600;
	let left = 0;
	let top = 0;
	let isSmallDevice = false;
	export let winner = 0;
	export let gameOver = false;

	let htmlCanvas: HTMLCanvasElement;

	export const screens = {
		sm: 640,
		md: 768,
		lg: 1024,
		xl: 1280
	};

	class LocalPvpCanvas extends GameCanvas {
		public drawBox(boxPos: { boxCol: number | null; boxRow: number | null }) {
			if (boxPos.boxCol === null || boxPos.boxRow === null) {
				return new Error('');
			}
			let box = this.boxes[boxPos.boxCol][boxPos.boxRow];
			if (box !== null && !box.drawn) {
				if (this.playerTurn === 1) {
					box = new XComponent(box.AreaXBegin, box.AreaYBegin, this);
					this.playerTurn = 2;
				} else if (this.playerTurn === 2) {
					box = new OComponent(box.AreaXBegin, box.AreaYBegin, this);
					this.playerTurn = 1;
				}
			}
			this.boxes[boxPos.boxCol][boxPos.boxRow] = box;
		}
	}

	let gameCanvas: LocalPvpCanvas;

	onMount(() => {
		if (htmlCanvas === null) {
			console.error('game Canvas is null');
			return;
		} else if (htmlCanvas.getContext('2d') === null) {
			console.error('game Canvas context is null');
			return;
		}
		if (browser) {
			if (window.outerWidth <= screens.md) {
				width = 300;
				height = 300;
			}
			console.log(width);
			gameCanvas = new LocalPvpCanvas(htmlCanvas,htmlCanvas.getContext('2d')!, 5, 5, 4, width, height);

		}
	});

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
			const x = event.clientX - left;
			const y = event.clientY - top;
			const boxPos = gameCanvas.findBox(x, y);

			gameCanvas.drawBox(boxPos);
			gameCanvas.findWinner();
			winner = gameCanvas.winner;
			winner !== 0 ? (gameOver = true) : null;
		}
	}
</script>

<canvas id="game-canvas" {width} {height} bind:this={htmlCanvas} on:click={handleCanvasClick}
></canvas>

<style>
	#game-canvas {
		margin: auto;
	}
</style>
