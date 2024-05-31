<script lang="ts">
	import { PuntoPlayer } from '$lib/models/Punto/punto-player.svelte';
	import { newGame } from '$lib/models/Punto/punto-game.svelte';
	import PuntoBoard from './PuntoBoard.svelte';
	import GameInfo from './GameInfo.svelte';
	import { sound_egyptian_them, sound_win_music } from '$lib/sounds/sounds.svelte';

	interface Props {
		players: PuntoPlayer[];
		back: () => any;
		restart: () => any;
	}

	let { players, back, restart }: Props = $props();
	let game = $state(newGame(players, restart));

	$effect(() => {
		sound_win_music.stop();
		sound_egyptian_them.play();

		return () => {
			sound_egyptian_them.stop();
			sound_win_music.stop();
		};
	});
</script>

<div class="h-screen w-full grid grid-rows-[50px_1fr]">
	<div class="flex gap-3 items-center justify-between px-4 bg-[--surface-color-3]">
		<div class="text-xl font-bold text-black/80">Punto</div>
		<button
			class="border border-black/10 px-3 py-[2px] rounded hover:bg-black/5"
			onclick={() => back?.()}>Retour</button
		>
	</div>
	<div class="grid grid-rows-[200px_1fr] sm:grid-rows-1 sm:grid-cols-[250px_1fr]">
		{#key game}
			<GameInfo />
			<PuntoBoard />
		{/key}
	</div>
</div>

<style>
	:global(:root) {
		--surface-color-1: hsl(30, 90%, 93%);
		--surface-color-2: hsl(30, 80%, 88%);
		--surface-color-3: hsl(30, 70%, 80%);
	}
</style>
