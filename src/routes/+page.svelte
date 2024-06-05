<script lang="ts">
	import PlayerSelection from '$lib/components/Punto/PlayerSelection.svelte';
	import PuntoGame from '$lib/components/Punto/PuntoGame.svelte';
	import type { PuntoPlayer } from '$lib/models/Punto/punto-player.svelte';
	import { signInWithGithub } from '$lib/utils/Auth/sign-in-with-github.js';
	import { signOut } from '$lib/utils/Auth/sign-out';
	import Broadcast from './Broadcast.svelte';

	// let {data} = $props()
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

{#snippet link(href: string, title: string, color: string)}
	<a
		class="bg-blue-500 text-white rounded px-3 py-1 hover:outline hover:outline-1 hover:outline-black hover:scale-105 transition-transform font-bold text-lg"
		style="background-color: {color};"
		{href}>{title}</a
	>
{/snippet}

<div class="h-screen w-full bg-[--surface-color-1] flex flex-col gap-2 items-center justify-center">
	<h1 class="text-2xl font-semibold text-center mb-6">
		Bienvenue sur le <br /> <span class="font-bold">Punssou !</span>
	</h1>
	{@render link('/play', 'Jouer en local', 'blue')}
	{@render link('/online', 'Jouer en ligne', 'red')}
</div>

<!-- {#if start}
	{#key trigger}
		<PuntoGame {restart} back={() => (start = false)} {players} />
	{/key}
{:else}
	<PlayerSelection {onstart} {players} />
{/if} -->
