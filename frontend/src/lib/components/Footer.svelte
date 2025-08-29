<script lang="ts">
	import appTheme, { darkTheme } from '$lib/shared/stores/appTheme';

	const themeOptions = ['system', 'dark', 'light']
	
</script>

<footer id="footer">
	<p id="copyright">2025 - Shayan Zahedanaraki</p>
	<br />
	<p>Theme</p>
	<select class:input-dark={$darkTheme} class:input-light={!$darkTheme} bind:value={$appTheme}>
	{#each themeOptions as option, i}
		<option value={i}>{option}</option>
	{/each}
	</select>
</footer>

<style>
	#footer {
		display: list-item;
	}
</style>
