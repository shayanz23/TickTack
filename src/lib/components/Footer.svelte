<script lang="ts">
	import appTheme from '$lib/shared/stores/appTheme';
	
	let theme: string;

	$: if ($appTheme === 0) {
		theme = 'default';
	} else if ($appTheme === 1) {
		theme = 'dark';
	} else {
		theme = 'light';
	}

	function changeTheme() {
		if ($appTheme >= 2) {
			$appTheme = 0;
		} else {
			$appTheme += 1;
		}
	}
</script>

<footer id="footer">
	<p id="copyright" >2024 - Shayan Zahedanaraki</p>

	<button id="theme-switch" class="button" on:click={changeTheme}>Toggle dark mode</button>
	<p id="theme-indicator">Theme: {theme}</p>
</footer>

<style>
	#footer {
		display: grid;
		padding-bottom: 10px;
		padding-left: 10px;
		padding-right: 10px;
	}
</style>
