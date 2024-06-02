<script lang="ts">
	import { getGame } from '$lib/models/Punto/punto-game.svelte';
	import { fly } from 'svelte/transition';
	import CardItem from './Card.svelte';
	import { cn } from '$lib/utils/cn';

	const game = getGame();
	const { currentCard } = $derived(game);
</script>

<div class="p-4 pt-0 bg-[--surface-color-2] flex flex-col gap-3">
	{#if currentCard}
		<div class="flex gap-x-10 gap-y-5 items-start sm:flex-wrap justify-items-center mt-4">
			<div class="max-w-[50%] sm:max-w-full">
				<div>
					{#each game.players as player (player)}
						<div
							class={cn(
								'grid grid-cols-[auto_1fr] items-center gap-[6px]',
								player.colors.length > 1 && 'grid-cols-[auto_auto_1fr]'
							)}
						>
							{#each player.colors as color (color)}
								<div class="size-[14px] bg-[--color] rounded" style="--color: {color.color}"></div>
							{/each}
							<div class="font-semibold text-black/85 truncate">{player.player.name}</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="min-w-[150px]">
				<div class="font-bold mb-1 leading-tight text-lg text-balance">
					{currentCard.player.player.name}
				</div>
				<div class="mb-3 -mt-[2px] font-semibold text-black/70">À ton tour !</div>

				<div class="grid grid-cols-1 size-[80px]" style="grid-template-areas: card;">
					{#key currentCard}
						<div in:fly={{ x: -10 }}>
							<CardItem width={70} card={currentCard} />
						</div>
					{/key}
				</div>
			</div>

			<!-- <div>
				<div class="font-semibold mb-1 mt-5">Tes cartes</div>
				<div class="flex gap-1 flex-wrap">
					{#each currentCard.deck.cards as card}
						<div
							class="font-semibold text-white bg-[--color] size-5 flex place-items-center justify-center rounded"
							style="--color: {card.color.color}"
						>
							{card.number}
						</div>
					{/each}
				</div>
			</div> -->
		</div>
	{/if}

	{#if game.isOver}
		<div class="">
			<div class="mt-5">
				<div class="font-bold text-sm tracking-wide text-black/65 mb-3" in:fly={{ x: -10 }}>
					Liste des loosers
				</div>
				<div class="">
					{#each game.players.filter((p) => p !== game.winner?.player) as looser, index (looser)}
						<div
							class="font-bold text-white bg-[--color] w-fit px-3 rounded mt-1"
							in:fly={{ x: -10, delay: 200 + index * 200 }}
							style="--color: {looser.colors[0].color}"
						>
							{looser.player.name}
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
