<script lang="ts">
	import type { PuntoCard } from '$lib/models/Punto/punto-card.svelte';
	import type { PuntoPlace } from '$lib/models/Punto/punto-place.svelte';
	import { settings } from '$lib/models/Punto/punto-settings.svelte';

	import { cn } from '$lib/utils/cn';
	import CardIcon from '../Icons/Cards/CardIcon.svelte';

	interface Props {
		card: PuntoCard;
		place?: PuntoPlace;
		styles?: string;
		width?: number;
		forbiden?: boolean;
	}

	let { card, styles, place, width, forbiden }: Props = $props();
</script>

<div
	class:isOver={place?.board.game.isOver}
	class:hasWinner={Boolean(place?.board.game.winner)}
	class:win={place?.win}
	class:flash={place?.flash}
	class:forbiden
	class={cn('card size-[80px] text-2xl', styles)}
	style="--color: {card.fightFor !== null ? card.color.color : 'hsl(0,0%,20%'}"
>
	<CardIcon {width} number={card.number} />
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

		&.forbiden {
			opacity: 35%;
		}

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
			transition: transform 350ms cubic-bezier(0.57, -1.09, 0.57, 1.8);
			background-color: white;
			color: var(--color);
			transform: scale(80%);
		}
	}
</style>
