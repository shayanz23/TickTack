<script lang="ts">
	import Canvas from '$lib/components/Canvas.svelte';
</script>

<div id="page-div">
	<div id="canvas-div">
		<Canvas />
	</div>
</div>

<style>
	#page-div {
		display: grid;
		grid-template-rows: auto;
	}
	#canvas-div {
		width: fit-content;
		height: fit-content;
		margin: auto;
	}

</style>
