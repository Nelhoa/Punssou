import { Sound } from 'svelte-sound';
import type { soundConstructor } from './types';
import { settings } from '$lib/models/Punto/punto-settings.svelte';

export class CustomSound {
	readonly sounds: Sound[];
	private index = 0;

	constructor(...args: soundConstructor[]) {
		this.sounds = args.map((arg) => new Sound(arg));
	}

	private upIndex() {
		const index = this.index;
		const max = this.sounds.length;
		const newIndex = index + 1;
		this.index = newIndex < max ? newIndex : 0;
		return this.index;
	}

	play() {
		const i = this.upIndex();
		if (settings.muteSound) return;
		this.sounds[i].play();
	}

	stop() {
		this.sounds.forEach((i) => i.stop());
	}
}
