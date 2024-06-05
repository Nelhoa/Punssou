<script lang="ts">
	import type { OnlineGamePlayer } from '$lib/models/Listener/game-player.svelte';
	import type { OnlineGame } from '$lib/models/Listener/game.svelte';
	import type { getCompletedProfile } from '$lib/utils/Auth/is-user-registered';
	import { cn } from '$lib/utils/cn';

	interface Props {
		game: OnlineGame;
		myRow: OnlineGamePlayer;
		myProfile: Awaited<ReturnType<typeof getCompletedProfile>>;
		isOwner: boolean;
	}

	let { game, myRow, isOwner }: Props = $props();

	const players = $derived(game.players);
	const request = $derived(players.filter((i) => i.row.status === 'wanna-join'));
</script>

{#snippet pseudo(player: OnlineGamePlayer)}
	{#await player.getUser()}
		...
	{:then user}
		{user.pseudo}
	{/await}
{/snippet}

<div class="p-5 bg-orange-100 h-screen">
	<div class="font-semibold text-lg">
		{game.row.title}
	</div>
	<div class="text-sm text-black/50 mb-5">
		Statut : {game.row.status}
	</div>
	<div>
		Votre statut : {myRow.row.status}
	</div>
	{#if isOwner && request.length > 0}
		<div class="my-3 mb-6">
			{#each request as playerReq}
				<div class="p-2 px-5 border rounded border-black/20 my-1">
					{@render pseudo(playerReq)} souhaite rejoindre la partie
					<button onclick={() => playerReq.updateRemote({ status: 'accepted' })}>Accepter</button>
					<button onclick={() => playerReq.updateRemote({ status: 'rejected' })}>Refuser</button>
				</div>
			{/each}
		</div>
	{/if}
	<div class="mt-5">
		Joueurs : {#each players.filter((i) => i.row.status === 'accepted' || i.row.status === 'owner') as player}
			<div
				class={cn(
					'px-2 w-fit rounded bg-black/5 my-2',
					player === myRow && 'bg-blue-500 text-white'
				)}
			>
				{@render pseudo(player)}
				<span class="text-sm text-current/50">({player.row.status})</span>
			</div>
		{/each}
	</div>
</div>
