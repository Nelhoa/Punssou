<script lang="ts">
	import PlayerSelection from '$lib/components/Punto/PlayerSelection.svelte';
	import PuntoGame from '$lib/components/Punto/PuntoGame.svelte';
	import type { PuntoPlayer } from '$lib/models/Punto/punto-player.svelte';
	import { signInWithGithub } from '$lib/utils/Auth/sign-in-with-github.js';
	import { signOut } from '$lib/utils/Auth/sign-out';
	import Broadcast from './Broadcast.svelte';

	// export let data;
	let start = $state(false);
	let players = $state<PuntoPlayer[]>([]);
	let trigger = $state<Symbol>(Symbol());

	function onstart(selected: PuntoPlayer[]) {
		players = selected;
		start = true;
	}

	function restart() {
		trigger = Symbol();
	}
</script>

<!-- <div class="flex w-full h-screen items-center justify-center gap-3 flex-col">
	<div class="font-bold text-lg">
		{data.user?.email ?? 'Pas connecté'}
	</div>

	{#if data.user}
		<button onclick={signOut} class="px-3 py-1 border rounded hover:border-black/15"
			>Se déconnecter</button
		>
	{:else}
		<button onclick={signInWithGithub} class="px-3 py-1 border rounded hover:border-black/15"
			>Se connecter</button
		>
	{/if}
	{#if data.supabase && data.user}
		<Broadcast />
	{/if}
</div> -->

{#if start}
	{#key trigger}
		<PuntoGame {restart} back={() => (start = false)} {players} />
	{/key}
{:else}
	<PlayerSelection {onstart} {players} />
{/if}
