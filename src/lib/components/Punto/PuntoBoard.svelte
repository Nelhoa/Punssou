<script lang="ts">
	import { getGame } from '$lib/models/Punto/punto-game.svelte';
	import { flip } from 'svelte/animate';
	import PuntoPlace from './PuntoPlace.svelte';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';

	const game = getGame();
	const { board, winner } = $derived(game);
</script>

<div class="container overflow-hidden">
	<div
		class="board"
		style="
    --max-size: 6;
    --y-size: {game.board.grid.xSize}; 
    --x-size: {game.board.grid.ySize};
    "
	>
		{#each board.mapToShow as place (place)}
			<div animate:flip>
				<PuntoPlace {place} />
			</div>
		{/each}
	</div>

	{#if game.isOver}
		<div class={cn('flex flex-col items-center justify-center', 'mt-5')} in:slide>
			{#if game.winner}
				<div class="text-lg font-bold" in:slide>
					{game.winner.player.player.name} à gagné
				</div>
			{:else}{/if}

			<div>{game.endMessage}</div>
			<button
				class="w-fit mt-3 font-semibold text-white hover:outline hover:outline-1 hover:outline-black rounded px-3 py-[2px] bg-[--color]"
				style="--color: {game.winner?.color.color ?? 'grey'}"
				onclick={() => game.restart()}
			>
				Recommencer !
			</button>
		</div>
	{/if}
</div>

<style>
	.container {
		background-color: var(--surface-color-1);
		padding: 10px;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.board {
		--size: 55px;
		--gap: 4px;

		@media (max-width: 700px) {
			--size: 50px;
			--gap: 4px;
		}

		@media (max-width: 500px) {
			--size: 45px;
			--gap: 4px;
		}

		@media (max-width: 360px) {
			--size: 38px;
			--gap: 4px;
		}

		@media (max-width: 300px) {
			--size: 30px;
			--gap: 4px;
		}

		display: grid;
		gap: var(--gap);
		width: fit;
		justify-content: center;
		align-content: center;
		place-items: center;
		grid-template-columns: repeat(var(--x-size), var(--size));
		grid-template-rows: repeat(var(--y-size), var(--size));
	}
</style>
