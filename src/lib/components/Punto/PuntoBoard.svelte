<script lang="ts">
	import { getGame } from '$lib/models/Punto/punto-game.svelte';
	import { flip } from 'svelte/animate';
	import PuntoPlace from './PuntoPlace.svelte';

	const game = getGame();
	const { board } = $derived(game);
</script>

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

<style>
	.board {
		background-color: var(--surface-color-1);
		padding: 10px;
		height: 100%;
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
