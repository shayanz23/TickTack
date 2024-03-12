<script lang="ts">
	import { darkTheme } from '$lib/shared/stores/appTheme';
</script>

<div id="page-div">
	<form action="" id="login-form" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
		<h1>Sign in</h1>
		<br>
		<input
			id="username-input"
			class:input-dark={$darkTheme}
			class:input-light={!$darkTheme}
			type="text"
			placeholder="username"
		/>
		<input
			id="password-input"
			class:input-dark={$darkTheme}
			class:input-light={!$darkTheme}
			type="text"
			placeholder="password"
		/>
		<button id="login-button" class="button recommended-button">
			Sign In
		</button>
	</form>
</div>

<style>
h1 {
	padding-top: 10px;
	margin: 0;
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

</style>
