<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte'
	import {darkTheme} from '$lib/shared/stores/appTheme';
	import '../app.css'
</script>

<div id="main-div" class:background-dark={$darkTheme}>
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
