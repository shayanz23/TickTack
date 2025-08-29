<script lang="ts">
    import { goto } from '$app/navigation';
    import { userId } from "$lib/shared/stores/user"

    async function logout() {
        $userId = null;
        goto('/');
    }
</script>

<div>
    <nav id="navbar">
        {#if $userId != null}
            <a id="left-end-item" href="/home">Home</a>
            <a href="/local">Local PvP</a>
            <a href="/local">Local PvE</a>
            <a href="/online">Online PvP</a>
            <a href="/about">About</a>
            <button class="right-item" on:click={logout}>Log Out</button>
        {:else}
            <a id="left-end-item" href="/">Home</a>
            <a href="/local">Local PvP</a>
            <a href="/local">Local PvE</a>
            <a href="/about">About</a>
            <a class="right-item" href="/login">Login</a>
        {/if}
        
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
        border-radius: 14px;
    }

    #navbar * {
        margin: 5px;
        margin-top: auto;
        margin-bottom: auto;
        color: black;
        text-decoration: none;
        height: fit-content;
        background: none;
    }

    .right-item {
        margin-left: auto !important;
        padding-right: 10px;
        cursor: pointer;
        font-size: 12pt;
    }

    #left-end-item {
        margin-left: 20px;
    }
</style>
