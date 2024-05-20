<script lang="ts">
	import { PuntoBoard } from '$lib/models/Punto/punto-board.svelte';
	import { PuntoPlayer } from '$lib/models/Punto/punto-player.svelte';
	import PuntoPlace from './PuntoPlace.svelte';

	const player = new PuntoPlayer('Neil', 'blue');
	const board = new PuntoBoard();
</script>

<div class="h-screen w-full bg-blue-50 p-5">
	<div class="text-lg font-bold text-black/80">Bienvenue sur le Punto</div>
	<div>Joueur : {player.name}</div>
	<div>
		<div class="font-semibold mb-1">Vos cartes</div>
		<div class="flex gap-1">
			{#each player.deck.cards as card}
				<div
					class="font-semibold text-white bg-[--color] size-5 flex place-items-center justify-center rounded"
					style="--color: {player.deck.color}"
				>
					{card.number}
				</div>
			{/each}
		</div>
	</div>
	{#if player.cardInHand}
		<div>
			<div class="font-semibold mb-1">Carte en main</div>
			<div class="flex gap-1">
				<div
					class="font-semibold text-white bg-[--color] size-5 flex place-items-center justify-center rounded"
					style="--color: {player.deck.color}"
				>
					{player.cardInHand.number}
				</div>
			</div>
		</div>
	{/if}
	<div>
		<div class="font-semibold mb-1">Plateau</div>
		<div
			class="board"
			style="
            --y-size: {board.grid.xSize}; 
            --x-size: {board.grid.ySize};
            "
		>
			{#each board.mapToShow as place}
				<PuntoPlace {place} {player} />
			{/each}
		</div>
	</div>
</div>

<style>
	.board {
		--size: 50px;
		display: grid;
		gap: 4px;
		width: fit;
		justify-content: start;
		align-content: center;
		place-items: center;
		grid-template-columns: repeat(var(--x-size), var(--size));
		grid-template-rows: repeat(var(--y-size), var(--size));
	}
</style>
