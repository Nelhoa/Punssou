import _ from 'lodash';
import { CustomSound } from './custom-sound.svelte';
import prrroh from './sounds/prrroh.mp3';
import yaaa from './sounds/yaa.mp3';
import shhho from './sounds/shhh-ho.mp3';
import drum_start from './sounds/drum_start_age_of.mp3';
import dirt1 from './sounds/Rooted_Dirt_step1.ogg';
import dirt2 from './sounds/Rooted_Dirt_step2.ogg';
import dirt3 from './sounds/Rooted_Dirt_step3.ogg';
import dirt4 from './sounds/Rooted_Dirt_step4.ogg';
import explosion1 from './sounds/Explosion1.ogg';
import explosion2 from './sounds/Explosion2.ogg';
import explosion3 from './sounds/Explosion3.ogg';
import explosion4 from './sounds/Explosion4.ogg';
import tock from './sounds/toc.mp3';
import chickenHirt1 from './sounds/Chicken_hurt1.ogg';
import chickenHirt2 from './sounds/Chicken_hurt2.ogg';
import tock2 from './sounds/toc2.mp3';
import tock3 from './sounds/toc3.mp3';

export const sound_tock = new CustomSound([tock], [tock2], [tock3], [tock2]);
export const sound_smooth = new CustomSound([dirt1], [dirt2], [dirt3], [dirt4]);
export const sound_conversion = new CustomSound([prrroh]);
export const sound_yaaaa = new CustomSound([yaaa]);
export const sound_shhho = new CustomSound([shhho]);
export const sound_drum_start = new CustomSound([drum_start]);
export const sound_explosion = new CustomSound(
	[explosion1],
	[explosion2],
	[explosion3],
	[explosion4]
);
export const sound_hurt = new CustomSound([chickenHirt1], [chickenHirt2]);
