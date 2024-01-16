<script lang="ts">
	import Canvas from '$lib/components/LocalPvpCanvas.svelte';
	import GameOverModal from '$lib/components/GameOverModal.svelte';
	let gameOver = false;
	let winner = 0;
	let restartState = false;
	$: showModal = gameOver;
	let unique = [{}];

	function restart() {
		unique = [{}];
	}

	$: if (restartState) {
		restart();
		restartState = false;
		winner = 0;
		gameOver = false;
	}
</script>

<div id="page-div">
	<div id="canvas-div">
		{#each unique as key (key)}
			<Canvas bind:gameOver bind:winner />
		{/each}
	</div>
	<GameOverModal bind:showModal bind:restartState>
		<div>
			<h2>Game Over!</h2>
			{#if winner === 0}
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

	#page-div {
		display: grid;
		grid-template-rows: auto;
	}
	#canvas-div {
		width: fit-content;
		height: fit-content;
		margin: auto;
	}
</style>
