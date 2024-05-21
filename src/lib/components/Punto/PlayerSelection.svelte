<script lang="ts">
	import { PuntoPlayer } from '$lib/models/Punto/punto-player.svelte';
	import { wait } from '$lib/utils/wait';
	import _ from 'lodash';

	interface Props {
		onstart?: (players: PuntoPlayer[]) => any;
		players: PuntoPlayer[];
	}

	let { onstart, players: givenPlayers }: Props = $props();

	const players = $state<PuntoPlayer[]>(givenPlayers ?? []);
	const colors = $state(_.shuffle(['blue', 'red', 'orange', 'green']));

	function onchange(e: Event & { currentTarget: HTMLInputElement }) {
		const playerName = e.currentTarget.value;
		if (playerName.length < 2 || playerName.length > 20) return console.log('Min car. 2, Max 20');
		const color = colors.pop() as string;
		e.currentTarget.value = '';
		if (color.length === 0) e.currentTarget.blur();
		newPlayer(playerName, color);
	}

	function newPlayer(name: string, color: string) {
		players.push(new PuntoPlayer(name, color));
	}

	function inputMount(e: HTMLInputElement) {
		wait(200).then(() => e.focus());
	}
</script>

<div class="w-full h-screen flex flex-col gap-3 items-center justify-center">
	<div class="flex flex-col gap-1">
		{#each players as player}
			<input
				class="w-[90%] max-w-[200px] px-3 py-1 bg-[--color] text-white font-semibold rounded"
				style={`--color: ${player.deck?.color}`}
				type="text"
				bind:value={player.name}
			/>
		{/each}
	</div>

	<input
		use:inputMount
		class="border rounded px-3 py-1 focus:outline-none focus-visible:shadow"
		disabled={colors.length === 0}
		type="text"
		{onchange}
	/>

	{#if onstart}
		<button
			class="bg-cyan-600 disabled:bg-gray-300 text-white font-semibold rounded px-3 py-1 transition-transform hover:scale-110 disabled:hover:scale-100"
			disabled={players.length < 2}
			onclick={() => onstart(players)}>Démarrer</button
		>
	{/if}
</div>
