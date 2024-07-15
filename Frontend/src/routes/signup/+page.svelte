<script lang="ts">
	import { darkTheme } from '$lib/shared/stores/appTheme';
</script>

<div id="page-div">
	<form action="" id="signup-form" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
		<h1>Sign Up</h1>
		<input
			id="email-input"
			class:input-dark={$darkTheme}
			class:input-light={!$darkTheme}
			type="email"
			placeholder="Email"
		/>
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
		<input
			id="conf-password-input"
			class:input-dark={$darkTheme}
			class:input-light={!$darkTheme}
			type="password"
			placeholder="Confirm Password"
		/>
		<button id="signup-button" class="button recommended-button"> Sign Up </button>
	</form>
	<p id="account" class:object-dark={$darkTheme}>Already have an account? <a href="/login">Sign in</a></p>
</div>

<style>
	h1 {
		padding-top: 0px;
		margin: 0;
		padding-bottom: 10px;
	}

	#account {
		margin-top: 0;
		margin-bottom: auto;
		font-size: 10pt;
		margin-left: auto;
		margin-right: auto;
	}

	#signup-form {
		padding: 20px;
		margin-right: auto;
		margin: auto;
		margin-bottom: 12px;
		height: fit-content;
		width: 275px;
		border-radius: 20px;
		display: grid;
	}

	#signup-form input {
		width: 275px;
		margin: auto;
	}

	#signup-button {
		margin-left: auto !important;
		margin-right: 0 !important;
		margin-top: 10px !important;
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
		margin: 6px 0 !important;
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

	/* input:focus:hover {
		border: 2px solid rgb(39, 201, 255) !important;
		border-radius: 10px;
	} */
</style>
