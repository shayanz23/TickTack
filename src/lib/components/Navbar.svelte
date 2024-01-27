<script>
</script>

<div>
	<nav id="navbar">
		<a id="left-end-item" href="/">Home</a>
		<a href="/localpvp">Local PvP</a>
		<a href="/multiplayer">Multiplayer</a>
		<a href="/about">About</a>
		<a id="right-item" href="/login">Login</a>
		<a id="right-end-item" href="/signup">Sign Up</a>
	</nav>
</div>

<style>
	#navbar {
		position: fixed;
		top: 0px;
		width: -webkit-calc(100% - 20px);
		width: -moz-calc(100% - 20px);
		width: calc(100% - 20px);
		height: 50px;
		display: flex;
		background-color: rgb(127, 225, 255);
		margin: 10px;
		border-radius: 17px;
	}

	#navbar * {
		margin: 5px;
		margin-top: auto;
		margin-bottom: auto;
		color: black;
		text-decoration: none;
		height: fit-content;
	}

	#right-item {
		margin-left: auto !important;
	}

	#right-end-item {
		margin-right: 20px;
	}

	#left-end-item {
		margin-left: 20px;
	}
</style>
