<script lang="ts">
	import { getGame } from '$lib/models/Punto/punto-game.svelte';
	import type { PuntoPlace } from '$lib/models/Punto/punto-place.svelte';
	import { quintOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	let { place }: { place: PuntoPlace } = $props();
	const game = getGame();
	const { currentCard } = $derived(game);

	function onclick() {
		if (!currentCard) return;
		place.setCard(currentCard);
	}

	let show = $state(false);

	$effect(() => {
		show = true;
	});
</script>

<!--  -->

{#if show}
	<button
		disabled={!currentCard || ['locked', 'too far'].includes(place.state)}
		{onclick}
		class:isOver={game.isOver}
		class:hasWinner={Boolean(game.winner)}
		class:win={place.win}
		class:flash={place.flash}
		class={`place ${place.state}`}
		transition:scale={{ start: 0, easing: quintOut }}
		style={`--card-color:${place.card ? place.card.deck.color : currentCard?.deck.color}`}
	>
		{place.card?.number ?? ' '}
	</button>
{/if}

<style>
	.place {
		width: var(--size);
		height: var(--size);
		border-radius: 3px;
		color: white;
		font-weight: 600;
		background-color: transparent;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;

		&.empty {
			background-color: rgba(0, 0, 0, 0.11);

			&:hover {
				background-color: var(--card-color);
				opacity: 30%;
			}

			&.isOver {
				transition-property: opacity;
				transition-duration: 500ms;
				opacity: 0;
			}
		}

		&.used {
			background-color: var(--card-color);

			&.hasWinner:not(.win) {
				transition-property: opacity;
				transition-duration: 500ms;
				opacity: 0.15;
			}

			&.win {
				border: 2px solid rgba(0, 0, 0, 0.2);
				--shadow-strength: 100%;
				box-shadow: var(--shadow-2);
			}
		}

		&.flash {
			background-color: white;
			/* transform: scale(130%); */
		}
	}
</style>
