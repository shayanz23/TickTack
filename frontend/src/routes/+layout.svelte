<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { darkTheme } from '$lib/shared/stores/appTheme';
    import { getUserInfo } from '$lib';
	import '../app.css';

		let userInfoPromise = getUserInfo();
</script>

<div id="main-div" class:background-dark={$darkTheme}>
	{#await userInfoPromise then}
	{/await}
	<Navbar />

	<slot />

	<Footer />
</div>

<style>
	#main-div {
		display: grid;
		grid-template-rows: 70px auto 150px;
	}

	* {
		font-size: 13pt;
		font-family: Arial;
	}
</style>
