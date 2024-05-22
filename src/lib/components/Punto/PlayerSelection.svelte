<script lang="ts">
	import { PuntoPlayer } from '$lib/models/Punto/punto-player.svelte';
	import { settings } from '$lib/models/Punto/punto-settings.svelte';
	import { wait } from '$lib/utils/wait';
	import _ from 'lodash';

	interface Props {
		onstart?: (players: PuntoPlayer[]) => any;
		players: PuntoPlayer[];
	}

	let { onstart, players: givenPlayers }: Props = $props();

	let players = $state<PuntoPlayer[]>([...givenPlayers] ?? []);
	let newName = $state<string>('');

	function onchange(e: Event & { currentTarget: HTMLInputElement }) {
		const playerName = e.currentTarget.value;
		if (playerName.length < 2 || playerName.length > 20) return console.log('Min car. 2, Max 20');
		e.currentTarget.value = '';
		newPlayer(playerName);
	}

	function newPlayer(name: string) {
		players.push(new PuntoPlayer(name));
	}

	function inputMount(e: HTMLInputElement) {
		wait(200).then(() => e.focus());
	}
</script>

<div class="w-full h-screen flex flex-col gap-3 items-center justify-center">
	<div class="flex flex-col gap-1">
		{#each players as player}
			<div class="grid grid-cols-[1fr_auto]">
				<input
					class="w-[90%] max-w-[200px] px-3 py-1 bg-blue-500 text-white font-semibold rounded"
					type="text"
					bind:value={player.name}
				/>
				<button
					onclick={() => (players = players.filter((p) => p !== player))}
					class="px-3 py-1 bg-red-500 text-white font-semibold rounded">Suppr.</button
				>
			</div>
		{/each}
	</div>

	<div>
		<input
			use:inputMount
			class="border rounded px-3 py-1 focus:outline-none focus-visible:shadow"
			disabled={players.length >= 4}
			bind:value={newName}
			type="text"
		/>

		<button
			onclick={() => {
				newPlayer(newName);
				newName = '';
			}}
			class="border px-3 py-1 rounded text-sm font-semibold">Ajouter</button
		>
	</div>

	<div>
		<input type="checkbox" bind:checked={settings.showNumber} />
		Montrer les nombres
	</div>

	{#if onstart}
		<button
			class="bg-cyan-600 disabled:bg-gray-300 text-white font-semibold rounded px-3 py-1 transition-transform hover:scale-110 disabled:hover:scale-100"
			disabled={players.length < 2}
			onclick={() => onstart(players)}>Démarrer</button
		>
	{/if}
</div>
