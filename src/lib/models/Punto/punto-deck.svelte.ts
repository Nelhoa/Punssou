import _ from 'lodash';
import { PuntoCard } from './punto-card.svelte';
import type { PuntoPlayer } from './punto-player.svelte';
import type { PuntoColor } from './punto-color.svelte';
import type { PuntoGamePlayer } from './punto-game-player';

export type DeckConstructor = {
	color: PuntoColor;
	neutral: boolean;
	numbers: number[];
};
export class PuntoDeck {
	player: PuntoGamePlayer;
	cards = $state([]) as PuntoCard[];
	private _playedCards = $state([]) as PuntoCard[];
	readonly everyCards = $derived([...this.cards, ...this._playedCards]);

	constructor(player: PuntoGamePlayer, deckConstructor: DeckConstructor[]) {
		this.player = player;
		this.initCards(deckConstructor);
	}

	initCards(options: DeckConstructor[]) {
		const player = this.player;
		const deck = this;

		function createCards({ color, neutral, numbers }: DeckConstructor) {
			return numbers.map((n) => new PuntoCard(n, color, player, neutral, deck));
		}

		this.cards = [];
		this._playedCards = [];
		const cards = options.map((opt) => createCards(opt)).flat();
		this.cards = _.shuffle(cards);
	}

	pick() {
		const pickedCard = this.cards.pop();
		this.cards = this.cards;
		if (!pickedCard) throw Error('Plus de carte dans le deck');
		this._playedCards.push(pickedCard);
		return pickedCard;
	}
}
