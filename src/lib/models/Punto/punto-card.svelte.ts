import type { PuntoColor } from './punto-color.svelte';
import type { PuntoDeck } from './punto-deck.svelte';
import type { PuntoGamePlayer } from './punto-game-player';

export class PuntoCard {
	player: PuntoGamePlayer;
	fightFor: null | PuntoGamePlayer;
	color: PuntoColor;
	deck: PuntoDeck;
	number: number;

	constructor(
		number: number,
		color: PuntoColor,
		player: PuntoGamePlayer,
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
