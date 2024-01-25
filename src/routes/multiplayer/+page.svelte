<script lang="ts">
	import Canvas from '$lib/components/LocalPvpCanvas.svelte';
	import GameOverModal from '$lib/components/GameOverModal.svelte';
	import PickPlayerNames from '$lib/components/PickPlayerNames.svelte';
	let gameOver = false;
	let winner = '';
	let restartState = false;
	let currentPlayer: string = '';
	$: showGameOverModal = gameOver;
	let showpickPlayerModal = true;
	let unique = [{}];
	let player1Name = '';
	let player2Name = '';

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

<div id="page-div">
	<p id="player-indicator">
		Current player is {currentPlayer}
	</p>
	{#if !showpickPlayerModal}
		<div id="canvas-div">
			{#each unique as key (key)}
			{/each}
		</div>
	{/if}
	<PickPlayerNames bind:showModal={showpickPlayerModal} bind:restartState>
		<div>
			<h2>Pick Player names</h2>
			<input type="text" placeholder="player 1" bind:value={player1Name} />
			<input type="text" placeholder="player 2" bind:value={player2Name} />
		</div>
	</PickPlayerNames>
	<GameOverModal bind:showModal={showGameOverModal} bind:restartState>
		<div>
			<h2>Game Over!</h2>
			{#if winner === ''}
				<p>Game is a tie...</p>
			{:else}
				<p>Player {winner} wins!</p>
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
		width: fit-content;
		height: fit-content;
		margin: auto;
		margin-top: 0px;
		margin-bottom: 0px;
	}
</style>
