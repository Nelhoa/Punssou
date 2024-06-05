<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/utils/supabase-client';

	let { data } = $props();
	let pseudo = $state<string>('');

	async function onclick() {
		const user_id = data.session.safeUser.id;
		if (pseudo.length > 3) await supabase().from('profiles').upsert({ user_id, pseudo });
		goto('/online');
	}
</script>

<div class="h-screen w-full bg-[--surface-color-1]">
	<input placeholder="Pseudo" bind:value={pseudo} />
	<button {onclick}>S’inscrire</button>
</div>
