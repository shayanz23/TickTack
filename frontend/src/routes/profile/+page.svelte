<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { darkTheme } from '$lib/shared/stores/appTheme';
	import { userId, email, username, xp, role } from '$lib/shared/stores/user';
	import { getUserGames } from '$lib';
	import type { Game } from '$lib/components/models/game';
	let subscribedEmail: string | null;
	let subscribedUsername: string | null;
	let subscribedXp: number | null;
	let subscribedRole: string | null;
	let games: null | Game[] = null;

	email.subscribe((value) => (subscribedEmail = value));
	username.subscribe((value) => (subscribedUsername = value));
	xp.subscribe((value) => (subscribedXp = value));
	role.subscribe((value) => (subscribedRole = value));

	onMount(async () => {
		// This code runs only on the client
		userId.subscribe((value) => {
			if (value == null) {
				goto('/login');
			}
		});
		games = await getUserGames();
		console.log(games);
	});

	// "variable" is the variable configured in the stores.ts
</script>

<div id="page-div">
	<div id="content-div" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
		<!-- <h1>Welcome to { userInfo?.jsonRes.username }</h1> -->
		<div id="title-div">
			<h1 id="title">Welcome {subscribedUsername}!</h1>
		</div>
		<div id="game-history-div">
			<div id="game-history-title-div">
				<h2 id="game-history-title">Game history</h2>
			</div>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Type</th>
						<th>Players</th>
						<th>Winner</th>
						<th>Date</th>
					</tr>
				</thead>
				<tbody>
					{#if games != null}
						{#each games as game}
						<tr>
							<td>{game.id}</td>
							<td>{game.}</td>
						</tr>
						{/each}
					{/if}
				</tbody>
			</table>
			<div>
				{#if subscribedXp != undefined}
					<p>Xp: {subscribedXp}</p>
				{/if}
			</div>
		</div>
		<div id="edit-profile-div">
			<h2 id="edit-profile-title">Edit profile</h2>
		</div>
	</div>
</div>

<style>
	#content-div {
		padding: 20px;
		margin-right: auto;
		margin-left: auto;
		margin-top: 20px;
		height: fit-content;
		width: 50%;
		border-radius: 20px;
		display: grid;
		grid-template-columns: 55% 45%;
	}

	h1 {
		margin-top: 0px;
	}

	#title-div {
		display: flex;
		grid-column: 1 / span 2;
		grid-row: 1;
		width: 100%;
	}

	#title {
		margin-right: auto;
		margin-left: auto;
		text-align: center;
	}

	#game-history-title-div {
		grid-row: 1;
		display: flex;
		width: 100%;
	}

	#game-history-title {
		display: flex;
		margin-right: auto;
		margin-left: auto;
		text-align: center;
	}

	#game-history-div {
		grid-row: 2;
		display: grid;
		width: 100%;
		grid-template-columns: 100%;
		grid-template-columns: auto;
	}

	#edit-profile-div {
		display: grid;
		grid-template-columns: 100%;
		width: 100%;
		grid-column: 2;
		grid-row: 2;
	}

	#edit-profile-title {
		display: flex;
		margin-right: auto;
		margin-left: auto;
		text-align: center;
	}
</style>
