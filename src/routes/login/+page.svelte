<script lang="ts">
	import { darkTheme } from '$lib/shared/stores/appTheme';
</script>

<div id="page-div">
	<form action="" id="login-form" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
		<h1>Sign in</h1>

		<input
			id="username-input"
			class:input-dark={$darkTheme}
			class:input-light={!$darkTheme}
			type="text"
			placeholder="Username"
		/>
		<input
			id="password-input"
			class:input-dark={$darkTheme}
			class:input-light={!$darkTheme}
			type="password"
			placeholder="Password"
		/>
		<p id="forgot-pw">Forgot Password? <a href="">Reset</a></p>
		<button id="login-button" class="button recommended-button"> Sign In </button>
	</form>
</div>

<style>
	h1 {
		padding-top: 10px;
		margin: 0;
	}

	#forgot-pw {
		margin-top: auto;
		margin-bottom: auto;
	}

	#login-form {
		padding: 20px;
		margin-right: auto;
		margin: auto;
		min-height: fit-content;
		height: 275px;
		width: 275px;
		border-radius: 20px;
		display: grid;
	}

	#login-form input {
		width: 275px;
		margin: auto;
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

	input:focus:hover {
		border: 2px solid rgb(39, 201, 255) !important;
		border-radius: 10px;
	}
</style>
