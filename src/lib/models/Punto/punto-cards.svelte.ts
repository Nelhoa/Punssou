import type { PuntoDeck } from './punto-deck.svelte';

export class PuntoCard {
	deck: PuntoDeck;
	number: number;

	constructor(number: number, deck: PuntoDeck) {
		this.number = number;
		this.deck = deck;
	}
}
