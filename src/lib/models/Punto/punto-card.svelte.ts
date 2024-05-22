import type { PuntoColor } from './punto-color.svelte';
import type { PuntoDeck } from './punto-deck.svelte';
import type { PuntoPlayer } from './punto-player.svelte';

export class PuntoCard {
	player: PuntoPlayer;
	fightFor: null | PuntoPlayer;
	color: PuntoColor;
	deck: PuntoDeck;
	number: number;

	constructor(
		number: number,
		color: PuntoColor,
		player: PuntoPlayer,
		neutral: boolean,
		deck: PuntoDeck
	) {
		this.number = number;
		this.deck = deck;
		this.player = player;
		this.fightFor = neutral ? null : player;
		this.color = color;
	}
}
