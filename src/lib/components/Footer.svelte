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
	<p>2024 - Shayan Zahedanaraki</p>

	<button class="button" on:click={changeTheme}>Toggle dark mode</button>
	<p>Theme: {theme}</p>
</footer>

<style>
	#footer {
		display: grid;
	}
</style>
