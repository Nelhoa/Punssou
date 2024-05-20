import _ from 'lodash';
import { PuntoCard } from './punto-cards.svelte';
import type { PuntoPlayer } from './punto-player.svelte';

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export class PuntoDeck {
	player: PuntoPlayer;
	color: string;
	private _cards = $state<PuntoCard[]>([]);
	private _playedCards = $state<PuntoCard[]>([]);

	get cards() {
		return this._cards;
	}

	constructor(color: string, player: PuntoPlayer) {
		this.player = player;
		this.color = color;
		this._cards = [
			...cards.map((i) => new PuntoCard(i, this)),
			...cards.map((i) => new PuntoCard(i, this))
		];
	}

	shuffleCards() {
		this._cards = _.shuffle(this._cards);
	}

	pick() {
		const pickedCard = this._cards.pop();
		if (!pickedCard) throw Error('No more cards');
		this._playedCards.push(pickedCard);
		return pickedCard;
	}
}
