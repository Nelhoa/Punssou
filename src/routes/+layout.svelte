<script>
	import '../app.css';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { settings } from '$lib/models/Punto/punto-settings.svelte';

	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				setTimeout(() => {
					goto('/', { invalidateAll: true });
				});
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:window bind:innerWidth={settings.layoutWidth} />

<svelte:head>
	<title>Punssou</title>
	<meta name="description" content="Jouer entre 2 et 4 joueurs. Aligner vos cartes pour gagner." />

	<!-- Open Graph Meta Tags -->
	<meta property="og:url" content="https://www.punto.planhead.fr" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Punssou" />
	<meta
		property="og:description"
		content="Jouer entre 2 et 4 joueurs. Aligner vos cartes pour gagner."
	/>
	<meta property="og:image" content="/og-punssou.jpg" />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="punto.planhead.fr" />
	<meta property="twitter:url" content="https://www.punto.planhead.fr" />
	<meta name="twitter:title" content="Punssou" />
	<meta
		name="twitter:description"
		content="Jouer entre 2 et 4 joueurs. Aligner vos cartes pour gagner."
	/>
	<meta name="twitter:image" content="/og-punssou.jpg" />
</svelte:head>

<slot />
