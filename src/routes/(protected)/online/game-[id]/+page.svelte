<script lang="ts">
	import type { OnlineGamePlayer } from '$lib/models/Listener/game-player.svelte';
	import { games } from '$lib/models/Listener/games.svelte.js';
	import GameRoom from './GameRoom.svelte';

	let { data } = $props();
	const game = $derived(games.getOrCreateGame(data.game));
</script>

{#snippet playerRow(player: OnlineGamePlayer, info: string)}
	{@const accept = player.getAcceptMethod()}
	<div class="px-3 py-1 border rounded">
		{#await player.getUser()}
			Chargement...
		{:then user}
			{user?.pseudo} {info}
		{/await}
		{#if accept.isOwner}
			<button onclick={() => accept.accept()}>Accepter</button>
		{/if}
	</div>
{/snippet}

{#snippet group(players: OnlineGamePlayer[], title: string, info: string)}
	{#if players.length > 0}
		<div class="p-5">
			<div class="font-semibold mb-3">{title}</div>
			{#each players as player}
				{@render playerRow(player, info)}
			{/each}
		</div>
	{/if}
{/snippet}

<!-- <div class="p-5">
	<div class="text-lg font-semibold">
		{game.row.title ?? data.game.title}
	</div>

	<div>{game.row.status ?? data.game.status}</div>

	{#if game.myPlayerRow}
		<div>
			Moi
			{@render playerRow(game.myPlayerRow, game.myPlayerRow.row.status)}
		</div>

		{@render group(
			game.players.filter((i) => i.row.status === 'wanna-join'),
			'Demande de participation',
			'souhaite rejoindre la partie'
		)}

		{@render group(
			game.players.filter((i) => i.row.status === 'owner' || i.row.status === 'accepted'),
			'Joueurs',
			'est prêt à démarrer !'
		)}
	{:else}
		Vous n’êtes pas inscrit
	{/if}
</div> -->

{#if game.myPlayerRow}
	<GameRoom
		{game}
		myProfile={data.profile}
		myRow={game.myPlayerRow}
		isOwner={game.myPlayerRow.row.status === 'owner'}
	/>
{/if}
