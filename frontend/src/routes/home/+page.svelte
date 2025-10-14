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
	

	onMount(() => {
		// This code runs only on the client
		userId.subscribe((value) => {
			if (value == null) {
				goto('/login');
			}
		});
	});

// "variable" is the variable configured in the stores.ts
	
</script>

<div id="page-div">
		<div id="content-div" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
			<!-- <h1>Welcome to { userInfo?.jsonRes.username }</h1> -->
			<h1>Welcome {subscribedUsername}!</h1>
            <p>To start playing a local 2 player game, navigate to the Local PvP from the navbar.</p>
			<p>
				Visit <a href="https://github.com/shayanz23">my GitHub page </a> to look at more of my projects.
			</p>
			<br />
			<p>Select between system, light, and dark theme from the bottom left dropdown.</p>
		</div>
</div>

<style>
	#content-div {
		padding: 20px;
		margin-right: auto;
		margin-left: auto;
		margin-top: 20px;
		height: fit-content;
		width: fit-content;
		border-radius: 20px;
	}

	h1 {
		margin-top: 0px;
	}
</style>
