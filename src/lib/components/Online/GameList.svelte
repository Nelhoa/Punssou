<script lang="ts">
	import { slide } from 'svelte/transition';
	import { games } from '$lib/models/Listener/games.svelte';
	import { goto } from '$app/navigation';

	let newGameTitle = $state('');

	async function createGame() {
		if (newGameTitle.length < 2) return;
		const newGamePromise = games.createGame(newGameTitle);

		newGameTitle = '';
		const newGame = await newGamePromise;
		if (!newGame) return;
		goto(`/online/game-${newGame.id}`);
	}
</script>

{#if games.myGames && games.myGames.length > 0}
	<div class="mt-5">
		<div class="my-3 font-bold">Reprendre une partie en cours</div>
		{#each games.myGames as game (game)}
			<button
				class="border rounded px-3 py-1 border-black/10 hover:border-black/20 text-sm font-semibold tracking-wide text-black/70"
				transition:slide
				onclick={() => game.join()}
				>{game.row.title} | {game.accepted.length} / 5
			</button>
		{/each}
	</div>
{/if}

<div class="border p-5 mt-5 bg-white rounded-lg">
	{#if games.loading}
		<div class="text-black/50" transition:slide>Chargement des parties...</div>
	{:else if games.games.length > 0}
		<div class="font-semibold">Rejoindre une partie</div>
		<div class="flex flex-col gap-y-[6px] items-start mt-3">
			{#each games.games.filter((i) => !games.myGames.includes(i)) as game}
				<button
					class="border rounded px-3 py-1 border-black/10 hover:border-black/20 text-sm font-semibold tracking-wide text-black/70"
					transition:slide
					onclick={() => game.join()}
					>{game.row.title} | {game.accepted.length} / 5
				</button>
			{/each}
		</div>
	{:else}
		<div>Aucune partie en cours !</div>
	{/if}
</div>

<div class="mt-5">
	<div class="font-semibold mb-2">Créer une partie</div>
	<input class="rounded px-3 py-1 border border-black/10" bind:value={newGameTitle} />
	<button onclick={createGame}>Créer la partie</button>
</div>
