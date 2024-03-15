<script lang="ts">
	import Canvas from '$lib/components/LocalPvpCanvas.svelte';
	import GameOverModal from '$lib/components/GameOverModal.svelte';
	import PickPlayerNames from '$lib/components/StartLocalGame.svelte';
	import {darkTheme} from '$lib/shared/stores/appTheme';

	let gameOver = false;
	let winner = '';
	let restartState = false;
	let currentPlayer: string = '';
	$: showGameOverModal = gameOver;
	let showpickPlayerModal = true;
	let unique = [{}];
	let player1Name = '';
	let player2Name = '';
	let gridColumns = 5;
	let gridRows = 5;
	let winLength = 4;

	function restart() {
		unique = [{}];
		showpickPlayerModal = true;
	}

	$: if (restartState) {
		restart();
		restartState = false;
		winner = '';
		gameOver = false;
	}
</script>

<div id="page-div" class:background-dark={$darkTheme}>
	<p id="player-indicator">
		Current player is {currentPlayer}
	</p>
	{#if !showpickPlayerModal}
		<div id="canvas-div" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
			{#each unique as key (key)}
				<Canvas bind:gameOver bind:winner bind:currentPlayer bind:player1Name bind:player2Name bind:gridColumns bind:gridRows bind:winLength/>
			{/each}
		</div>
	{/if}
	<PickPlayerNames bind:showModal={showpickPlayerModal} bind:restartState>
		<div class:background-dark={$darkTheme}>
			<h2>Pick Player names</h2>
			<input type="text" placeholder="player 1" bind:value={player1Name} />
			<input type="text" placeholder="player 2" bind:value={player2Name} />
			<input id="modal-row-input" type="number" bind:value={gridRows}/>
			<input id="modal-column-input" type="number" bind:value={gridColumns}/>
			<input id="modal-winLength-input" type="number" bind:value={winLength}/>
		</div>
	</PickPlayerNames>
	<GameOverModal bind:showModal={showGameOverModal} bind:restartState>
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
