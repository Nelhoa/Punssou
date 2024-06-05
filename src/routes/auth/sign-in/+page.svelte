<script lang="ts">
	import { signInWithGithub } from '$lib/utils/Auth/sign-in-with-github';
	import { signInWithGoogle } from '$lib/utils/Auth/sign-in-with-google';
</script>

<div class="h-screen w-full bg-[--surface-color-1] flex flex-col items-center justify-center">
	<div class="text-lg">Vous n’êtes pas encore connecté !</div>
	<button
		class="font-bold text-white bg-black rounded px-3 py-1 mt-3 hover:scale-105 transition-transform"
		onclick={() => signInWithGithub('/online')}
	>
		Se connecter avec github
	</button>
	<button
		class="font-bold text-white bg-black rounded px-3 py-1 mt-3 hover:scale-105 transition-transform"
		onclick={() => signInWithGoogle('/online')}
	>
		Se connecter avec Google
	</button>
</div>
