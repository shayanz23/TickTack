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

<button id={id} class={getArrayString(classes)} ><slot></slot></button>

<style>

</style>
