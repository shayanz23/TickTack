<script lang="ts">
	import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
	import { darkTheme } from '$lib/shared/stores/appTheme';
	import { userId, email, username, xp, role } from "$lib/shared/stores/user"
    let subscribedEmail: string | null;
    let subscribedUsername: string | null;
    let subscribedXp: number | null;
    let subscribedRole: string | null;

    email.subscribe((value) => (subscribedEmail = value));
    username.subscribe((value) => (subscribedUsername = value));
    xp.subscribe((value) => (subscribedXp = value));
    role.subscribe((value) => (subscribedRole = value));
	



// "variable" is the variable configured in the stores.ts
	
</script>

<div id="page-div">
	<div id="content-div" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
		<!-- <h1>Welcome to { userInfo?.jsonRes.username }</h1> -->
		<h1>Welcome {subscribedUsername}!</h1>
		<p>Please select a game type from the list below:</p>
		<div id="game-grid">
			<button on:click={() => {
				goto("/local")
			}} class="button">Local</button>
			{#if $userId != null}
			<button on:click={() => {
				goto("/online")
			}} class="button">Online</button>
			{/if}
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
	}

	#game-grid {
		width: 100%;
		display: flex;
	}

	#game-grid * {
		
		margin-left: auto;
		margin-right: auto;
	}

	h1 {
		margin-top: 0px;
	}
</style>
