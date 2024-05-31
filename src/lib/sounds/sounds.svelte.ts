import { Sound } from 'svelte-sound';
import ticSound from './319227__worthahep88__single-rock-hitting-wood-4.wav';
import proooh from './prrroh.mp3';
import drumpapapa from './drumpapappa.mp3';
import yaaa from './schwarzenegger.mp3';
import shhhha from './shhh-ho.mp3';
import winFanfar from './Age of Empires 3 Victory Fanfare.mp3';
import egyptian from './egyptian_theme_end.mp3';
import drum_start from './drum_start_age_of.mp3';
import canon_shoot from './canon_explosion.mp3';
import chill_age_of from './Age of mythologie chill theme.mp3';
import smooth_sound from './smooth song.mp3';
import { settings } from '$lib/models/Punto/punto-settings.svelte';
import _ from 'lodash';

type soundType = 'sound' | 'music';

class CustomSound {
	type: soundType;
	sound: Sound;

	constructor(type: soundType, ...args: ConstructorParameters<typeof Sound>) {
		this.sound = new Sound(...args);
		this.type = type;
	}

	play() {
		if (this.type === 'music' && !settings.muteMusic) this.sound.play();
		if (this.type === 'sound' && !settings.muteSound) this.sound.play();
	}

	stop() {
		this.sound.stop();
	}
}

export const sound_tic = new CustomSound('sound', ticSound, { volume: 0.3 });

const sound_drum = new CustomSound('sound', drumpapapa);
const sound_smooth = new CustomSound('sound', smooth_sound);
const placeSonuds = [sound_drum, sound_smooth];

export function getSimplePlaceSound() {
	const sounds = _.shuffle(placeSonuds);
	return sounds[0];
}

export const sound_conversion = new CustomSound('sound', proooh);
export const sound_yaaaa = new CustomSound('sound', yaaa);
export const sound_shhho = new CustomSound('sound', shhhha);
export const sound_drum_start = new CustomSound('sound', drum_start);
export const sound_canon_explosion = new CustomSound('sound', canon_shoot);

export const sound_age_of_mythology_chill = new CustomSound('music', chill_age_of, { volume: 0.5 });
export const sound_win_music = new CustomSound('music', winFanfar);
export const sound_egyptian_them = new CustomSound('music', egyptian, { volume: 0.5 });

const everyMusics = [sound_age_of_mythology_chill, sound_win_music, sound_egyptian_them];
