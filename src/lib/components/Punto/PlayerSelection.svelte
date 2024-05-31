<script lang="ts">
	import { PuntoPlayer } from '$lib/models/Punto/punto-player.svelte';
	import { settings } from '$lib/models/Punto/punto-settings.svelte';
	import { wait } from '$lib/utils/wait';
	import _ from 'lodash';
	import Card6 from '../Icons/Cards/Card6.svelte';
	import { sound_tock } from '$lib/sounds/sounds.svelte';
	import { music_chill } from '$lib/sounds/musics.svelte';
	import { untrack } from 'svelte';
	import { browser } from '$app/environment';

	interface Props {
		onstart?: (players: PuntoPlayer[]) => any;
		players: PuntoPlayer[];
	}

	let { onstart, players: givenPlayers }: Props = $props();

	let players = $state<PuntoPlayer[]>([...givenPlayers] ?? []);
	let newName = $state<string>('');
	let disableAddPlayer = $derived(players.length >= 4 || newName.length < 1);

	function newPlayer(name: string) {
		sound_tock.play();
		players.push(new PuntoPlayer(name));
	}

	function inputMount(e: HTMLInputElement) {
		wait(200).then(() => e.focus());
	}

	function addPlayer() {
		if (disableAddPlayer) return;
		newPlayer(newName);
		newName = '';
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') addPlayer();
	}

	music_chill.play();

	$effect(() => {
		return () => {
			music_chill.stop();
		};
	});
</script>

<div class="w-full h-screen flex flex-col gap-3 items-center justify-center bg-[--surface-color-1]">
	<div class="bg-[red] rounded p-1 rotate-3 animation">
		<Card6 styles="text-white" width={50} />
	</div>
	<div class="text-3xl mb-3 font-bold">Le Punto !</div>
	<div class="flex flex-col gap-1 w-[90%] max-w-[250px]">
		{#each players as player}
			<div class="grid grid-cols-[1fr_auto] gap-3">
				<input
					class="w-full px-3 py-1 bg-[--surface-color-2] text-black/85 hover:bg-[--surface-color-3] focus:shadow font-semibold rounded"
					type="text"
					bind:value={player.name}
				/>
				<button
					onclick={() => (players = players.filter((p) => p !== player))}
					class="px-3 py-1 bg-red-500/80 hover:bg-red-500 text-white font-semibold rounded text-[13px]"
					>Suppr.</button
				>
			</div>
		{/each}
	</div>
	<div class="grid grid-cols-[1fr_auto] w-[90%] max-w-[250px] gap-3">
		<input
			use:inputMount
			{onkeydown}
			class="border border-black/15 bg-white/80 hover:bg-white focus-visible:bg-white w-full rounded px-3 py-1 focus:outline-none focus-visible:shadow"
			disabled={players.length >= 4}
			bind:value={newName}
			type="text"
		/>

		<button
			disabled={disableAddPlayer}
			onclick={addPlayer}
			class="border w-full border-black/20 bg-[--surface-color-3] px-3 py-1 rounded text-[13px] font-semibold disabled:opacity-30"
			>Ajouter</button
		>
	</div>

	<div class="my-2">
		<div class="flex gap-2">
			<input type="checkbox" bind:checked={settings.showNumber} />
			<div class="font-semibold text-[15px] text-black/70">Montrer les nombres</div>
		</div>
		<div class="flex gap-2 mt-1">
			<input type="checkbox" bind:checked={settings.muteMusic} />
			<div class="font-semibold text-[15px] text-black/70">Sans musique</div>
		</div>
	</div>

	{#if onstart}
		<button
			class:colorAnimate={!(players.length < 2)}
			class="bg-blue-500 text-lg disabled:bg-gray-300 text-white font-semibold rounded px-3 py-1 transition-transform hover:scale-110 disabled:hover:scale-100"
			disabled={players.length < 2}
			onclick={() => onstart(players)}>Démarrer</button
		>
	{/if}
</div>

<style>
	@keyframes bounce {
		50% {
			transform: translateY(-25%);
			animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
		}
		0%,
		100% {
			transform: none;
			animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
		}
	}

	@keyframes colorss {
		0%,
		24.99% {
			background-color: blue;
		}
		25%,
		49.99% {
			background-color: red;
		}
		50%,
		74.99% {
			background-color: green;
		}
		75%,
		100% {
			background-color: orange;
		}
	}

	.colorAnimate {
		animation: colorss 4s infinite;
	}

	.animation {
		animation:
			bounce 1s infinite,
			colorss 4s infinite;
	}
</style>
