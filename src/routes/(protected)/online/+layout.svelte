<script lang="ts">
	import { games } from '$lib/models/Listener/games.svelte';

	let { children, data } = $props();

	$effect(() => {
		games.myUserId = data.profile.user_id;
		games.load();
		return games.cleanup.bind(games);
	});
</script>

{@render children()}
