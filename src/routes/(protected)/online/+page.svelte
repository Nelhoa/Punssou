<script lang="ts">
	import { goto } from '$app/navigation';
	import GameList from '$lib/components/Online/GameList.svelte';
	import { signOut } from '$lib/utils/Auth/sign-out';

	let { data } = $props();
</script>

{#snippet button(onclick: () => any, title: string)}
	<button
		class="text-[13px] font-bold tracking-wide text-black/50 border px-3 py-1 border-black/20 rounded mt-2 hover:border-black/35 hover:text-black/75"
		{onclick}
	>
		{title}
	</button>
{/snippet}

<div class="h-screen w-full bg-[--surface-color-1] p-5">
	<div class="text-lg font-bold">
		Bienvenue {data.profile.pseudo} !
	</div>
	<div>
		{@render button(() => signOut(), 'Se déconnecter')}
		{@render button(() => goto('/'), 'Page d’accueil')}
	</div>

	<GameList />
</div>
