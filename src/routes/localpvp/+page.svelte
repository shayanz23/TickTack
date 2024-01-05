<script lang="ts">
	import Canvas from '$lib/components/Canvas.svelte';
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
		<h2 slot="header">Game Over!</h2>
		<p>player {winner} wins!</p>
	</GameOverModal>
</div>

<style>
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
