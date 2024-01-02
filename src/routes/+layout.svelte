<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<div id="main-div">
	<Navbar />

	<slot />

	<Footer />
</div>

<style>
    #main-div {
        display: grid;
        grid-template-rows: 50px auto 100px;
    }
</style>