import _ from 'lodash';
import { PuntoCard } from './punto-cards.svelte';
import type { PuntoPlayer } from './punto-player.svelte';

// const cards = [1, 2, 3] as const;
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export class PuntoDeck {
	player: PuntoPlayer;
	color: string;
	cards = $state<PuntoCard[]>([]);
	private _playedCards = $state<PuntoCard[]>([]);

	constructor(color: string, player: PuntoPlayer) {
		this.player = player;
		this.color = color;
		this.cards = [
			...cards.map((i) => new PuntoCard(i, this)),
			...cards.map((i) => new PuntoCard(i, this))
		];
		this.shuffleCards();
	}

	shuffleCards() {
		this.cards = _.shuffle(this.cards);
	}

	pick() {
		const pickedCard = this.cards.pop();
		this.cards = this.cards;
		if (!pickedCard) throw Error('No more cards');
		this._playedCards.push(pickedCard);
		return pickedCard;
	}
}
