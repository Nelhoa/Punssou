<script lang="ts">
	import { signInWithGithub } from '$lib/utils/Auth/sign-in-with-github.js';
	import { signOut } from '$lib/utils/Auth/sign-out';

	export let data;
</script>

<div class="flex w-full h-screen items-center justify-center gap-3 flex-col">
	<div class="font-bold text-lg">
		{data.user?.email ?? 'Pas connecté'}
	</div>

	{#if data.user}
		<button onclick={signOut} class="px-3 py-1 border rounded hover:border-black/15"
			>Se déconnecter</button
		>
	{:else}
		<button onclick={signInWithGithub} class="px-3 py-1 border rounded hover:border-black/15"
			>Se connecter</button
		>
	{/if}
</div>
