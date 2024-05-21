<script lang="ts">
	import type { PuntoCard } from '$lib/models/Punto/punto-cards.svelte';
	import type { PuntoPlace } from '$lib/models/Punto/punto-place.svelte';

	import { cn } from '$lib/utils/cn';

	interface Props {
		card: PuntoCard;
		place?: PuntoPlace;
		styles?: string;
	}

	let { card, styles, place }: Props = $props();
	$inspect(Boolean(place?.board.game.winner));
</script>

<div
	class:isOver={place?.board.game.isOver}
	class:hasWinner={Boolean(place?.board.game.winner)}
	class:win={place?.win}
	class:flash={place?.flash}
	class={cn('card size-[80px] text-2xl', styles)}
	style="--color: {card.color}"
>
	{card.number}
</div>

<style>
	.card {
		display: flex;
		font-weight: 600;
		border-radius: 4px;
		justify-content: center;
		place-items: center;
		background-color: var(--color);
		color: white;

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

		&.flash {
			transition: transform 1s ease-in-out;
			background-color: white;
			transform: scale(50%);
		}
	}
</style>
