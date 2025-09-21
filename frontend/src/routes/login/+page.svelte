<script lang="ts">
	import { darkTheme } from '$lib/shared/stores/appTheme';
	import backendRoutes from '$lib/shared/backendRoutes.json';
    import { goto } from '$app/navigation';
    import { userId } from "$lib/shared/stores/user"
	import { getUserInfo } from '$lib';

	const url = backendRoutes.login;
	let username = '';
	let password = '';

	async function login() {
		const reqBody = JSON.stringify({
			username: username,
			password: password
		});
		let response: Response;
		try {
			response = await fetch(url, {
				method: 'POST',
				mode: 'cors',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
					Accept: 'application/json'
				},
				body: reqBody
			});
            $userId = (await response!.json()).id;
			await getUserInfo();
            goto('/home');
        } catch (error) {
			console.log('error:', error);
		}
	}
</script>

<div id="page-div">
	<form id="login-form" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
		<h1>Sign in</h1>

		<input
			id="username-input"
			name="usernameInput"
			class:input-dark={$darkTheme}
			class:input-light={!$darkTheme}
			type="text"
			placeholder="Username"
			bind:value={username}
		/>
		<input
			id="password-input"
			name="passwordInput"
			class:input-dark={$darkTheme}
			class:input-light={!$darkTheme}
			type="password"
			placeholder="Password"
			bind:value={password}
		/>
		<p id="forgot-pw">Forgot Password? <a href="/reset-password">Reset</a></p>
		<button id="login-button" class="button recommended-button" on:click={login}> Sign In </button>
	</form>
	<p id="no-account" class:object-dark={$darkTheme}>
		Don't have an account? <a href="/signup">Sign up</a>
	</p>
</div>

<style>
	h1 {
		padding-top: 10px;
		margin: 0;
	}

	#forgot-pw {
		margin-top: auto;
		margin-bottom: auto;
		font-size: 10pt;
	}

	#no-account {
		margin-top: 0;
		margin-bottom: auto;
		font-size: 10pt;
		margin-left: auto;
		margin-right: auto;
	}

	#login-form {
		padding: 20px;
		margin-right: auto;
		margin: auto;
		margin-bottom: 12px;
		min-height: fit-content;
		height: 275px;
		width: 275px;
		border-radius: 20px;
		display: grid;
	}

	#login-form input {
		width: 275px;
		margin: auto;
		height: 40px;
	}

	#login-button {
		margin-left: auto !important;
		margin-right: 0 !important;
		margin-top: auto !important;
		margin-bottom: 0 !important;
	}

	#page-div {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto;
	}

	input {
		width: 100%;
		padding: 12px 20px;
		margin: 8px 0;
		box-sizing: border-box;
		border-color: #00000000;
		border-width: 2px;
		-webkit-transition: 0.5s;
		transition: 0.5s;
		outline: none;
		border-radius: 10px;
	}

	input:focus {
		border: 2px solid rgb(39, 201, 255) !important;
		border-radius: 10px;
	}
</style>
