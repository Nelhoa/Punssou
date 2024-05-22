<script lang="ts">
	import { getGame } from '$lib/models/Punto/punto-game.svelte';
	import { fly } from 'svelte/transition';
	import CardItem from './Card.svelte';

	const game = getGame();
	const { currentCard } = $derived(game);
</script>

<div class="p-4 pt-6 bg-[--surface-color-2] flex flex-col gap-3">
	{#if currentCard}
		<div>
			<div class="font-semibold mb-1 mt-5 leading-none">{currentCard.player.name}</div>
			<div class="mb-3 mt-2 font-semibold text-black/70">À ton tour !</div>

			<div class="grid grid-cols-1 size-[80px]" style="grid-template-areas: card;">
				{#key currentCard}
					<div in:fly={{ x: -10 }}>
						<CardItem width={70} card={currentCard} />
					</div>
				{/key}
			</div>
		</div>

		<div>
			<div class="font-semibold mb-1 mt-5">Tes cartes</div>
			<div class="flex gap-1 flex-wrap">
				{#each currentCard.deck.cards as card}
					<div
						class="font-semibold text-white bg-[--color] size-5 flex place-items-center justify-center rounded"
						style="--color: {currentCard.color}"
					>
						{card.number}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	{#if game.winner}
		<div in:fly={{ x: -10 }}>
			<div
				class="font-semibold text-white bg-[--color] px-3 py-1 text-lg flex place-items-center justify-center rounded"
				style="--color: {game.winner.color}"
			>
				{game.winner.name} a gagné !
			</div>
			<div class="mt-3">
				<div class="font-bold text-sm tracking-wide text-black/65">Liste des loosers :</div>
				<div>
					{#each game.players.filter((p) => p !== game.winner) as looser}
						<div
							class="font-bold text-white bg-[--color] w-fit px-3 rounded mt-1"
							style="--color: {looser.color}"
						>
							{looser.name}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
	{#if game.isOver}
		<div>{game.endMessage}</div>
		<button
			class="w-fit mt-3 border border-black/10 rounded px-3 py-[2px] hover:bg-black/5"
			onclick={() => game.restart()}
		>
			Recommencer !
		</button>
	{/if}
</div>
