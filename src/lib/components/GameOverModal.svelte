<script lang="ts">
	export let showModal: boolean; // boolean
	export let restartState = false;
	import { goto } from '$app/navigation';

	let dialog: HTMLDialogElement; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();

	function restart() {
		restartState = true;
		dialog.close();
	}

	function toHome() {
		dialog.close();
		routeToPage('', false);
	}

	function routeToPage(route: string, replaceState: boolean) {
		goto(`/${route}`, { replaceState });
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div id="main-div" on:click|stopPropagation>
		<slot name="header" />
		<hr />
		<slot id="slot"/>
		<hr />

		<!-- svelte-ignore a11y-autofocus -->
		<div id="modal-buttons">
			<button id="modal-home-button" autofocus on:click={() => toHome()}>Home</button>
			<button id="modal-restart-button" autofocus on:click={() => restart()}>Play Again</button>
		</div>
	</div>
</dialog>

<style>
	#main-div {
		display: grid;
		grid-template-rows: 5;
		grid-template-columns: 1;
	}

	#modal-buttons {
		display: grid;
		grid-template-rows: 1;
		grid-template-columns: 5;
	}

	#modal-home-button {
		grid-column: 4;
	}
	#modal-restart-button {
		grid-column: 5;
	}
	dialog {
		width: 26em;
		height: 15em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		display: block;
	}
</style>
