import { CustomMusic } from './custom-music.svelte';
import chill from './music/chill.mp3';
import egyptian from './music/egyptian.mp3';
import victory from './music/victory.mp3';

export const music_chill = new CustomMusic(chill, { volume: 0.3 });
export const music_win = new CustomMusic(victory);
export const music_egyptian = new CustomMusic(egyptian, { volume: 0.5 });
