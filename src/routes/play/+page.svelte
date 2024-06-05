<script lang="ts">
	import PlayerSelection from '$lib/components/Punto/PlayerSelection.svelte';
	import PuntoGame from '$lib/components/Punto/PuntoGame.svelte';
	import type { PuntoPlayer } from '$lib/models/Punto/punto-player.svelte';

	let start = $state(false);
	let players = $state<PuntoPlayer[]>([]);
	let trigger = $state<Symbol>(Symbol());

	function onstart(selected: PuntoPlayer[]) {
		players = selected;
		start = true;
	}

	function restart() {
		trigger = Symbol();
	}
</script>

{#if start}
	{#key trigger}
		<PuntoGame {restart} back={() => (start = false)} {players} />
	{/key}
{:else}
	<PlayerSelection {onstart} {players} />
{/if}
