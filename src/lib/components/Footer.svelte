<script>
	import darkTheme from '$lib/shared/stores/darkTheme';

	function changeTheme() {
		darkTheme.set(!$darkTheme);
	}

</script>
<footer id="footer" >
	<p>2024 - Shayan Zahedanaraki</p>

	<button class="button" on:click={changeTheme}>Toggle dark mode</button>
</footer>

<style>
	#footer {
		display: flex;
	}

</style>
