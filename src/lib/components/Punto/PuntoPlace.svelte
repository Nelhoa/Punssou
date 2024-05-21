<script lang="ts">
	import { getGame } from '$lib/models/Punto/punto-game.svelte';
	import type { PuntoPlace } from '$lib/models/Punto/punto-place.svelte';
	import { quintOut } from 'svelte/easing';
	import { fly, scale } from 'svelte/transition';
	import Card from './Card.svelte';
	import { PuntoCard } from '$lib/models/Punto/punto-cards.svelte';
	import Cross from '../Icons/Cross.svelte';

	let { place }: { place: PuntoPlace } = $props();
	const game = getGame();
	const { currentCard } = $derived(game);

	function onclick() {
		if (!currentCard) return;
		hoverCard = undefined;
		place.setCard(currentCard);
	}

	let show = $state(false);
	let hoverCard = $state<PuntoCard | undefined>();
	let forbiden = $state<boolean>();

	$effect(() => {
		show = true;
	});

	function onmouseenter() {
		if (!currentCard) return;
		if (place.state === 'locked' || place.state === 'too far') return;
		if (game.isOver) return;
		if (!place.card || place.card.number < currentCard.number) {
			hoverCard = currentCard;
		} else if (place.card && place.card.number >= currentCard.number) {
			forbiden = true;
		}
	}

	function onmouseleave() {
		hoverCard = undefined;
		forbiden = false;
	}
</script>

<!--  -->

{#if show}
	<button
		disabled={!currentCard || ['locked', 'too far'].includes(place.state)}
		{onclick}
		{onmouseenter}
		{onmouseleave}
		class:isOver={game.isOver}
		class:flash={place.flash}
		class:cardHover={hoverCard}
		class={`place relative ${place.state}`}
		transition:scale={{ start: 0, easing: quintOut }}
		style={`--card-color:${place.card ? place.card.deck.color : currentCard?.deck.color}`}
	>
		{#if place.card}
			<div class="h-full w-full" in:scale={{ start: 2 }}>
				<Card card={place.card} {place} styles="w-full h-full" />
			</div>
		{:else}
			{' '}
		{/if}
		{#if hoverCard}
			<div class="absolute inset-1" in:fly={{ x: -5 }}>
				<Card card={hoverCard} styles="w-full h-full shadow-lg shadow-black/30" />
			</div>
		{/if}
		{#if forbiden}
			<div class="absolute inset-0 flex justify-center items-center animate-pulse">
				<Cross styles="text-red-500/80" width={30} />
			</div>
		{/if}
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

			&.isOver {
				transition-property: opacity;
				transition-duration: 500ms;
				opacity: 0;
			}
		}

		&.used {
			background-color: transparent;
		}

		&.flash {
			transition: all 1s ease-in-out;
			background-color: white;
		}
	}
</style>
