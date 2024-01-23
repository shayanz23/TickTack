<script lang="ts">
    export let id = ""

    export let classes = ["button"];

    function getArrayString(array: string[]):string {
        let value = "";
        for (let index = 0; index < array.length; index++) {
            value = value + " " +array[index];
        }
        return value;
    }
</script>

<button id={id} class={getArrayString(classes)}><slot></slot></button>

<style>
	.button {
		margin: 10px;
		margin-left: auto;
		min-height: fit-content;
		height: 30px;
        border-width: 0px;
        border-radius: 7px;
	}

    .recommended-button {
        background-color: rgb(39, 201, 255);
	}
</style>
