import type { PuntoColor } from './punto-color.svelte';
import { PuntoDeck } from './punto-deck.svelte';

export class PuntoPlayer {
	name: string;
	deck = $state() as PuntoDeck;
	readonly colors = $derived(
		this.deck.everyCards
			.filter((i) => i.fightFor !== null)
			.reduce((prev, cur) => {
				const color = cur.color;
				if (!prev.includes(color)) return [...prev, color];
				return prev;
			}, [] as PuntoColor[])
	);

	constructor(name: string) {
		this.name = name;
		this.deck = new PuntoDeck(this);
	}
}
