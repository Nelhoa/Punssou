import type { PuntoCard } from './punto-cards.svelte';
import { PuntoDeck } from './punto-deck.svelte';

export class PuntoPlayer {
	name: string;
	deck: PuntoDeck;
	cardInHand = $state<PuntoCard | undefined>();

	constructor(name: string, color: string) {
		this.name = name;
		this.deck = new PuntoDeck(color, this);
		this.cardInHand = this.deck.pick();
	}
}
