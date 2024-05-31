import { playingMusic } from '$lib/sounds/custom-music.svelte';

export const settings = $state({
	showNumber: false,
	layoutWidth: 0,
	muteMusic: false,
	muteSound: false
});

export const cleanup = $effect.root(() => {
	$effect(() => {
		if (!settings.muteMusic) playingMusic?.play();
		if (settings.muteMusic) playingMusic?.stop();
	});
});
