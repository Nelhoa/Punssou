<script lang="ts">
	import type { PuntoCard } from '$lib/models/Punto/punto-cards.svelte';
	import { fly } from 'svelte/transition';
	import { receive, send } from './crossfade';

	interface Props {
		card: PuntoCard;
	}

	let { card }: Props = $props();
</script>

{#key card}
	<div
		class="font-semibold text-white bg-[--color] size-[80px] text-2xl flex place-items-center justify-center rounded"
		in:receive={{ key: card }}
		out:send={{ key: card }}
		style="--color: {card.color}"
	>
		{card.number}
	</div>
{/key}
