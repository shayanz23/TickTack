<script>
	import { darkTheme } from '$lib/shared/stores/appTheme';
</script>

<div id="page-div" >
	<div id="content-div" class:object-dark={$darkTheme} class:object-light={!$darkTheme}>
		<h1>Welcome to TickTack</h1>
		<p>To start playing a local 2 player game, navigate to the Local PvP from the navbar.</p>
		<p>
			Visit <a href="https://github.com/shayanz23">my GitHub page </a> to look at more of my projects.
		</p>
		<br>
		<p>Select between system, light, and dark theme from the bottom right button.</p>
	</div>
</div>

<style>
	#content-div {
		padding: 20px;
		margin-right: auto;
		margin-left: auto;
		margin-top: 20px;
		height: fit-content;
		width: fit-content;
		border-radius: 20px;
	}

	h1 {
		margin-top: 0px;
	}
</style>
