<script lang="ts">
	import { OnlineData } from './online-data.svelte.js';

	let { data, children } = $props();
	$effect(() => {
		OnlineData.user_id = data.profile.user_id;
	});
</script>

{@render children()}
