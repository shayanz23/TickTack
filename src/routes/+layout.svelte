<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte'
	import darkTheme from '$lib/shared/stores/darkTheme';

	$: darkTheme2 = $darkTheme;
</script>

<div id="main-div" class:background-dark={darkTheme2}>
	<Navbar />

	<slot />

	<Footer />
</div>

<style>
	#main-div {
		display: grid;
		grid-template-rows: 70px auto 100px;
	}

	* {
		font-size: 13pt;
		font-family: Arial;
	}

</style>
