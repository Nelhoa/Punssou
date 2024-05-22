<script lang="ts">
	import { getGame } from '$lib/models/Punto/punto-game.svelte';
	import type { PuntoPlace } from '$lib/models/Punto/punto-place.svelte';
	import { linear, quintIn, quintOut } from 'svelte/easing';
	import { fly, scale, type TransitionConfig } from 'svelte/transition';
	import Card from './Card.svelte';
	import { PuntoCard } from '$lib/models/Punto/punto-card.svelte';
	import Cross from '../Icons/Cross.svelte';
	import { wait } from '$lib/utils/wait';

	let { place }: { place: PuntoPlace } = $props();
	const game = getGame();
	const { currentCard } = $derived(game);
	let justClicked = $state(false);

	function flyOver(
		element: HTMLElement,
		config: TransitionConfig & { x?: number; y?: number; opacity?: number }
	) {
		element.style.zIndex = '1';
		return fly(element, config);
	}

	async function setHover(card: PuntoCard) {
		hoverCard = card;
		await wait(4000);
		hoverCard = undefined;
	}

	async function setForbiden() {
		forbiden = true;
		await wait(4000);
		forbiden = false;
	}

	async function setJustClicked() {
		justClicked = true;
		await wait(350);
		justClicked = false;
	}

	function onclick() {
		if (!currentCard) return;
		setJustClicked();
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
			setHover(currentCard);
		} else if (place.card && place.card.number >= currentCard.number) {
			setForbiden();
		}
	}

	function onmouseleave() {
		justClicked = false;
		hoverCard = undefined;
		forbiden = false;
	}
</script>

{#if show}
	<button
		disabled={!currentCard || ['locked', 'too far'].includes(place.state)}
		{onclick}
		{onmouseenter}
		{onmouseleave}
		class:isOver={game.isOver}
		class:flash={place.flash}
		class:cardHover={hoverCard}
		class={`place relative ${place.state} grid grid-cols-1`}
		transition:scale={{ start: 0, easing: quintOut }}
		style={`--card-color:${place.card ? place.card.color.color : currentCard?.color.color};
				grid-template-areas: place`}
	>
		{#if place.card}
			<div
				class="h-full w-full absolute"
				style="grid-area: 1/1;"
				in:scale={{ start: 2, delay: 40 }}
				out:flyOver={{ x: 35, duration: 350 }}
			>
				<Card
					card={place.card}
					{place}
					forbiden={forbiden && !justClicked}
					styles="w-full h-full"
				/>
			</div>
		{:else}
			{' '}
		{/if}

		{#if hoverCard && !justClicked}
			<div class="absolute inset-1" in:fly={{ x: -5 }}>
				<Card card={hoverCard} styles="w-full h-full shadow-lg shadow-black/30" />
			</div>
		{/if}
		{#if forbiden && !justClicked}
			<div class="absolute inset-0 flex justify-center items-center animate-pulse">
				<Cross styles="text-red-500" width={30} />
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
			transition: color 300ms ease-in-out;

			&.isOver {
				transition-property: opacity;
				transition-duration: 500ms;
				opacity: 0;
			}

			&.flash {
				background-color: white;
			}
		}

		&.used {
			background-color: transparent;
		}

		/* &.flash {
			transition: all 1s ease-in-out;
			background-color: white;
		} */
	}
</style>
