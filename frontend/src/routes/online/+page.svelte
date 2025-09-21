<script lang="ts">
	import GameOverModal from '$lib/components/GameComponents/GameOverModal.svelte';
	import StartGameModal from '$lib/components/GameComponents/LocalPvp/StartGameModal.svelte';
	import { darkTheme } from '$lib/shared/stores/appTheme';
	import gameDefaults from '$lib/shared/gameDefaults.json';
	import { onMount } from 'svelte';
	import { GameLogic } from '$lib/components/GameComponents/GameLogic';
	import { browser } from '$app/environment';
	import { GameLogicLocalPvp } from '$lib/components/GameComponents/GameLogicLocalPvp';
	import { writable } from 'svelte/store';

	let gameOver = false;
	let winner = '';
	let restartState = false;
	let currentPlayer: string = '';
	let showGameOverModal = writable(false);
	let showStartGameModal = true;
	let unique = [{}];
	let playerNames: string[] = [];
	let playerNum = gameDefaults.localPvp.playerNum;
	let fakeplayerNum = playerNum;
	let gridX = gameDefaults.gridX;
	let gridY = gameDefaults.gridY;
	let winLength = gameDefaults.winLength;
	let startStr = 'Play';


	let htmlCanvas: HTMLCanvasElement | null;
	let gameLogic: GameLogic | null = null;

	function setPlayerArray() {
		playerNames = [];
		for (let index = 0; index < playerNum; index++) {
			if (index < gameDefaults.maxPlayers) {
				playerNames.push('');
			}
		}
	}

	function ensurePlayerNum() {
		while (playerNum > gameDefaults.maxPlayers) {
			playerNum--;
		}
		while (playerNum <= 1) {
			playerNum++;
		}
	}

	function playerFakeToReal() {
		if (fakeplayerNum <= 400) {
			playerNum = fakeplayerNum;
		}
	}

	setPlayerArray();

	$: (fakeplayerNum, playerFakeToReal());
	$: (playerNum, ensurePlayerNum());
	$: (playerNum, setPlayerArray());

	function restart() {
		unique = [{}];
		showStartGameModal = true;
	}

	$: if (restartState) {
		restart();
		restartState = false;
		winner = '';
		gameOver = false;
	}

	$: if (gameOver) {
		setTimeout(() => {
			$showGameOverModal = gameOver;
		}, 750);
	}

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
		if (
			window.outerWidth <= gameDefaults.screens.md ||
			window.innerHeight <= gameDefaults.screens.md
		) {
			gameLogic.scale = gameDefaults.halfScale;
		} else {
			gameLogic.scale = 1;
		}
	}

	$: if (!showStartGameModal) {
		if (browser && htmlCanvas != undefined && htmlCanvas != null) {
			// Initialize gameCanvas with the ready htmlCanvas injected.
			gameLogic = new GameLogicLocalPvp (
				playerNames,
				htmlCanvas,
				gameDefaults.localPvp.width,
				gameDefaults.localPvp.height,
				gridY,
				gridX,
				winLength,
				1
			);
			setDefaultPlayerName();
			currentPlayer = playerNames[gameLogic.playerTurnNum];

			// Rescale canvas incase the window size is smaller or is changed.
			rescaleCanvas();
			window.addEventListener('resize', rescaleCanvas);
			htmlCanvas.addEventListener('mousedown', gameLogic.handleCanvasMouseDown);
			htmlCanvas.addEventListener('mouseup', gameLogic.handleCanvasMouseUp);
			htmlCanvas.addEventListener('mouseup', () => {
				if (gameLogic === null) {
					return;
				}
				gameOver = gameLogic.gameOver;
				winner = gameLogic.winnerName;
			});
		}
	}

</script>

<div id="page-div" class:background-dark={$darkTheme}>
	<p id="player-indicator">
		Current player is {currentPlayer}
	</p>
	{#if !showStartGameModal}
		<div id="canvas-div" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
			{#each unique as key (key)}
				<canvas id="game-canvas" bind:this={htmlCanvas}></canvas>
			{/each}
		</div>
	{/if}
	<StartGameModal bind:showModal={showStartGameModal} bind:restartState bind:startStr>
		<div id="input-div" class:background-dark={$darkTheme}>
			<h2 id="input-title">Game Settings</h2>
			<label id="modal-num-players" class="modal-label"
				>Number of Players:
				<input
					id="modal-num-players-input"
					class:input-dark={$darkTheme}
					class:input-light={!$darkTheme}
					type="number"
					bind:value={fakeplayerNum}
				/>
			</label>
			<label id="modal-players" class="modal-label-players"
				>Players:
				<p></p>
				{#each playerNames as player, i}
					<input
						type="text"
						placeholder={'player ' + (i + 1)}
						id={'name-input-' + (i + 1)}
						bind:value={player}
						class:input-dark={$darkTheme}
						class:input-light={!$darkTheme}
					/>
				{/each}</label
			>

			<label id="modal-row" class="modal-label"
				>Rows:
				<input
					id="modal-row-input"
					class:input-dark={$darkTheme}
					class:input-light={!$darkTheme}
					type="number"
					bind:value={gridY}
				/>
			</label>
			<label id="modal-column" class="modal-label"
				>Columns:
				<input
					id="modal-column-input"
					class:input-dark={$darkTheme}
					class:input-light={!$darkTheme}
					type="number"
					bind:value={gridX}
				/>
			</label>
			<label id="modal-winLength" class="modal-label"
				>Winning Length:
				<input
					id="modal-winLength-input"
					class:input-dark={$darkTheme}
					class:input-light={!$darkTheme}
					type="number"
					bind:value={winLength}
				/>
			</label>
		</div>
	</StartGameModal>
	<GameOverModal bind:showModal={$showGameOverModal} bind:restartState>
		<div>
			<h2>Game Over!</h2>
			{#if winner === ''}
				<p>Game is a tie...</p>
			{:else}
				<p>{winner} wins!</p>
			{/if}
		</div>
	</GameOverModal>
</div>

<style>
	#game-canvas {
		padding: 0;
		margin: auto;
	}

	h2 {
		margin: 0%;
		margin-bottom: 10px;
	}

	p {
		margin: 5px;
	}

	#player-indicator {
		height: fit-content;
		grid-row: 1;
		margin-left: 20%;
		margin-right: 20%;
		margin-top: 50px;
	}

	#page-div {
		display: grid;
		grid-template-rows: auto;
	}
	#canvas-div {
		width: 700px;
		height: 700px;
		min-width: fit-content;
		min-height: fit-content;
		margin: auto;
		margin-top: 0px;
		margin-bottom: 0px;
		display: grid;
		border-radius: 50px;
	}

	#input-div {
		display: grid;
		grid-template-columns: auto auto;
		height: fit-content;
	}

	#input-title {
		grid-column: span 2;
	}

	#input-div input {
		min-height: fit-content;
		height: 17px;
		padding: 3px;
		margin: 3px;
		border-radius: 5px;
		min-width: fit-content;
	}

	#input-div label {
		margin-top: 5px;
	}

	.modal-label {
		display: grid;
		grid-template-rows: auto auto;
	}

	.modal-label-players {
		display: grid;
		grid-template-columns: auto auto;
		grid-column: span 2;
	}

	@media (width <= 768px) {
		#canvas-div {
			width: 350px;
			height: 350px;
			border-radius: 25px;
		}
	}

	@media (height <= 768px) {
		#canvas-div {
			width: 350px;
			height: 350px;
			border-radius: 25px;
		}
	}
</style>
