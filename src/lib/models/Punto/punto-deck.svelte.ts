import _ from 'lodash';
import { PuntoCard } from './punto-card.svelte';
import type { PuntoPlayer } from './punto-player.svelte';
import type { PuntoColor } from './punto-color.svelte';

// const cards = [1, 2, 3] as const;
// const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

type cardTypeOptions = {
	color: PuntoColor;
	neutral: boolean;
	numbers: number[];
};
export class PuntoDeck {
	player: PuntoPlayer;
	cards = $state<PuntoCard[]>([]);
	private _playedCards = $state<PuntoCard[]>([]);
	readonly everyCards = $derived([...this.cards, ...this._playedCards]);

	constructor(player: PuntoPlayer) {
		this.player = player;
	}

	initCards(options: cardTypeOptions[]) {
		const player = this.player;
		const deck = this;

		function createCards({ color, neutral, numbers }: cardTypeOptions) {
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
