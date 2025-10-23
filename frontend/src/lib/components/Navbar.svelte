<script lang="ts">
	import { goto } from '$app/navigation';
	import { userId, username, xp } from '$lib/shared/stores/user';
	import { darkTheme } from '$lib/shared/stores/appTheme';

	let subscribedUsername: string | null;
	let userLetter = '';
	let subscribedXp: number | null;

	username.subscribe((value) => (subscribedUsername = value));

	async function logout() {
		$userId = null;
		goto('/');
	}

	$: if (subscribedUsername !== undefined && subscribedUsername !== null) {
		userLetter = subscribedUsername.charAt(0).toUpperCase();
	}
</script>

<div>
	<nav id="navbar">
		{#if $userId != null}
			<a id="left-end-item" href="/home">Home</a>
			<a href="/select-game">Play</a>
			<a href="/about">About</a>
			<div class="dropdown right-item">
				<button class="dropbtn" class:object-dark={!$darkTheme} class:object-light={$darkTheme}>
					{userLetter}
				</button>
				<div class="dropdown-content" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
					<a href="/profile" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>Profile</a>
					<button on:click={logout} class:object-dark={$darkTheme} class:object-light={!$darkTheme}>Log Out</button>
				</div>
			</div>
		{:else}
			<a id="left-end-item" href="/">Home</a>
			<a href="/select-game">Play</a>
			<a href="/about">About</a>
			<a class="right-item" href="/login">Login</a>
		{/if}
	</nav>
</div>

<style lang="scss">
	#navbar {
		position: fixed;
		top: 0px;
		width: -webkit-calc(100% - 20px);
		width: -moz-calc(100% - 20px);
		width: calc(100% - 20px);
		height: 50px;
		display: flex;
		background-color: rgb(127, 225, 255);
		margin: 10px;
		border-radius: 14px;

        #left-end-item {
            padding-left: 5px;
        }

		* {
			font-size: 12pt;
		}
		a {
			margin: 5px;
			margin-top: auto;
			margin-bottom: auto;
			color: black;
			text-decoration: none;
			height: fit-content;
			background: none;
		}


		.dropbtn {
            margin: 5px;
            margin-left: auto !important;
			height: 40px;
			width: 40px;
			border-radius: 50%;
            font-size: 16pt;
		}
		.dropdown {
			height: 50px !important;
			height: fit-content;
			overflow: hidden;
			display: grid;
			grid-template-rows: 2;
			grid-template-columns: 2;
            padding-right: 5px;
		}

		.dropdown-content {
			display: grid;
			padding: 5px;
			border-radius: 14px;
			grid-template-columns: 1;
			width: fit-content;
			* {
                width: fit-content !important;

				padding: 5px;
				margin: 5px;
			}
			button {
				background: transparent
			};
		}
	}

	#navbar:hover {
		.dropdown:hover {
			overflow: visible !important;
			height: fit-content !important;
		}
	}

	.right-item {
		margin-left: auto !important;
		padding-right: 5px;
	}

</style>
