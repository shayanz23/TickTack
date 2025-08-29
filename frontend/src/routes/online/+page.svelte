<script lang="ts">
	import Canvas from '$lib/components/gameTypes/OnlineCanvas.svelte';
	import GameOverModal from '$lib/components/GameComponents/GameOverModal.svelte';
	import StartGameModal from '$lib/components/GameComponents/LocalPvp/StartGameModal.svelte';
	import { darkTheme } from '$lib/shared/stores/appTheme';
	import gameDefaults from '$lib/shared/gameDefaults.json';
	import { onMount } from 'svelte';
	import { userId } from '$lib/shared/stores/user';
	import { goto } from '$app/navigation';

	let gameOver = false;
	let winner = '';
	let restartState = false;
	let currentPlayer: string = '';
	let showGameOverModal = false;
	let showpickPlayerModal = true;
	let unique = [{}];
	let players: string[] = [];
	let gridX = gameDefaults.gridX;
	let gridY = gameDefaults.gridY;
	let winLength = gameDefaults.winLength;
	let startStr = 'Create';

	for (let index = 0; index < gameDefaults.localPvp.playerNum; index++) {
		if (index < gameDefaults.maxPlayers) {
			players.push('');
		}
	}

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

	$: if (gameOver) {
		setTimeout(() => {
			showGameOverModal = gameOver;
		}, 750);
	} else {
		showGameOverModal = gameOver;
	}

	onMount(() => {
		// This code runs only on the client
		userId.subscribe((value) => {
			if (value == null) {
				goto('/login');
			}
		});
	});
</script>

<div id="page-div" class:background-dark={$darkTheme}>
	<p id="player-indicator">
		Current player is {currentPlayer}
	</p>
	{#if !showpickPlayerModal}
		<div id="canvas-div" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
			{#each unique as key (key)}
				<Canvas
					bind:gameOver
					bind:winner
					bind:currentPlayer
					bind:players
					bind:gridX
					bind:gridY
					bind:winLength
				/>
			{/each}
		</div>
	{/if}
	<StartGameModal bind:showModal={showpickPlayerModal} bind:restartState bind:startStr>
		<div id="input-div" class:background-dark={$darkTheme}>
			<h2 id="input-title">Game Settings</h2>
			{#each players as player, i}
				<input type="text" placeholder={'player ' + (i + 1)} bind:value={player} />
			{/each}
			<input id="modal-row-input" type="number" bind:value={gridY} />
			<input id="modal-column-input" type="number" bind:value={gridX} />
			<input id="modal-winLength-input" type="number" bind:value={winLength} />
		</div>
	</StartGameModal>
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

    #input-div {
		display: grid;
        grid-template-columns: auto auto;
        
	}

    #input-title {
        grid-column: span 2;
    }

    #input-div  input {
        min-height: fit-content;
        height: 17px;
		padding: 3px;
        margin: 3px;
        border-radius: 5px;
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
