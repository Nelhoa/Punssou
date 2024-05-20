<script lang="ts">
	import type { PuntoPlace } from '$lib/models/Punto/punto-place.svelte';
	import type { PuntoPlayer } from '$lib/models/Punto/punto-player.svelte';

	let { place, player }: { place: PuntoPlace; player: PuntoPlayer } = $props();

	function onclick() {
		if (!player.cardInHand) return;
		place.setCard(player.cardInHand);
	}
</script>

<button
	{onclick}
	class={`place ${place.state}`}
	style={`--card-color:${place.card ? place.card.deck.color : player.cardInHand?.deck.color}`}
>
	{place.x} | {place.y}
</button>

<style>
	.place {
		width: var(--size);
		height: var(--size);
		border-radius: 3px;
		color: white;
		font-weight: 600;
		background-color: transparent;
		font-size: 14px;

		&.empty {
			background-color: rgba(0, 0, 0, 0.2);

			&:hover {
				background-color: var(--card-color);
				opacity: 30%;
			}
		}

		&.used {
			background-color: var(--card-color);
		}
	}
</style>
