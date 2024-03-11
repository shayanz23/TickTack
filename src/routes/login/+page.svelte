<script lang="ts">
	import { darkTheme } from '$lib/shared/stores/appTheme';
</script>

<div id="page-div">
	<form action="" id="login-form" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
		<input
			id="username-input"
			class:object-dark={$darkTheme}
			class:object-light={!$darkTheme}
			type="text"
			placeholder="username"
		/>
		<input
			id="password-input"
			class:object-dark={$darkTheme}
			class:object-light={!$darkTheme}
			type="text"
			placeholder="password"
		/>
		<button id="login-button" class="button recommended-button">
			Sign In
		</button>
	</form>
</div>

<style>
	#login-form {
		padding: 20px;
		margin-right: auto;
		margin: auto;
		height: fit-content;
		width: 300px;
		border-radius: 20px;
		display: grid;
	}

	#login-button {
		margin-left: auto !important; 
	margin-right: 0 !important;
	}

	#page-div {
		display: grid;
		grid-template-columns: auto;
		grid-template-rows: auto;
	}

</style>
