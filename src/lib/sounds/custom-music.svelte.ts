import { Sound } from 'svelte-sound';
import type { soundConstructor } from './types';
import { settings } from '$lib/models/Punto/punto-settings.svelte';
import { untrack } from 'svelte';

export let playingMusic: undefined | CustomMusic = undefined;

export class CustomMusic {
	readonly music: Sound;

	constructor(...args: soundConstructor) {
		this.music = new Sound(...args);
	}

	play() {
		playingMusic?.stop();
		playingMusic = this;
		if ($state.snapshot(settings).muteMusic) return;
		try {
			this.music.play();
		} catch (err) {}
	}

	stop() {
		this.music.stop();
	}
}
