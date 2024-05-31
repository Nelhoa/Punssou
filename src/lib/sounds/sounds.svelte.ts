import { Sound } from 'svelte-sound';
import proooh from './prrroh.mp3';
import yaaa from './schwarzenegger.mp3';
import shhhha from './shhh-ho.mp3';
import winFanfar from './Age of Empires 3 Victory Fanfare.mp3';
import egyptian from './egyptian_theme_end.mp3';
import drum_start from './drum_start_age_of.mp3';
import chill_age_of from './Age of mythologie chill theme.mp3';
import dirt1 from './Rooted_Dirt_step1.ogg';
import dirt2 from './Rooted_Dirt_step2.ogg';
import dirt3 from './Rooted_Dirt_step3.ogg';
import dirt4 from './Rooted_Dirt_step4.ogg';
import explosion1 from './Explosion1.ogg';
import explosion2 from './Explosion2.ogg';
import explosion3 from './Explosion3.ogg';
import explosion4 from './Explosion4.ogg';
import tock from './toc.mp3';
import tock2 from './toc2.mp3';
import tock3 from './toc3.mp3';
import { settings } from '$lib/models/Punto/punto-settings.svelte';
import _ from 'lodash';

type soundConstructor = ConstructorParameters<typeof Sound>;
export let playingMusic: undefined | CustomMusic = undefined;
class CustomMusic {
	readonly music: Sound;

	constructor(...args: soundConstructor) {
		this.music = new Sound(...args);
	}

	play() {
		playingMusic?.stop();
		playingMusic = this;
		if (settings.muteMusic) return;
		this.music.play();
	}

	stop() {
		this.music.stop();
	}
}

class CustomSound {
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

export const sound_tic = new CustomSound(
	[tock, { volume: 0.0 }],
	[tock2, { volume: 0.03 }],
	[tock3, { volume: 0.06 }],
	[tock2, { volume: 0.07 }]
);
export const sound_smooth = new CustomSound([dirt1], [dirt2], [dirt3], [dirt4]);
export const sound_conversion = new CustomSound([proooh]);
export const sound_yaaaa = new CustomSound([yaaa]);
export const sound_shhho = new CustomSound([shhhha]);
export const sound_drum_start = new CustomSound([drum_start]);
export const sound_canon_explosion = new CustomSound(
	[explosion1],
	[explosion2],
	[explosion3],
	[explosion4]
);

export const sound_age_of_mythology_chill = new CustomMusic(chill_age_of, { volume: 0.3 });
export const sound_win_music = new CustomMusic(winFanfar);
export const sound_egyptian_them = new CustomMusic(egyptian, { volume: 0.5 });
