import { PuntoDeck } from './punto-deck.svelte';

export class PuntoPlayer {
	name: string;
	color: string;
	deck = $state() as PuntoDeck;

	constructor(name: string, color: string) {
		this.name = name;
		this.color = color;
		this.deck = new PuntoDeck(color, this);
	}

	resetDeck() {
		const color = this.color;
		this.deck = new PuntoDeck(color, this);
	}
}
