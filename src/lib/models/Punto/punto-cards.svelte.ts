import type { PuntoDeck } from './punto-deck.svelte';
import type { PuntoPlayer } from './punto-player.svelte';

export class PuntoCard {
	player: PuntoPlayer;
	color: string;
	deck: PuntoDeck;
	number: number;

	constructor(number: number, deck: PuntoDeck) {
		this.number = number;
		this.deck = deck;
		this.color = deck.color;
		this.player = deck.player;
	}
}
