import { getContext, setContext } from 'svelte';
import { PuntoBoard } from './punto-board.svelte';
import { PuntoPlayer } from './punto-player.svelte';
import type { PuntoCard } from './punto-cards.svelte';
import _ from 'lodash';
import type { PuntoPlace } from './punto-place.svelte';
import { wait } from '$lib/utils/wait';

const key = 'Game';

export function newGame(...args: ConstructorParameters<typeof PuntoGame>) {
	const game = new PuntoGame(...args);
	setContext(key, game);
	return game;
}

export function getGame() {
	const game = getContext(key) as PuntoGame;
	return game;
}

export class PuntoGame {
	readonly winAt: number;
	private _winner = $state<PuntoPlayer | undefined>();
	private _isOver = $state(false);
	board = $state() as PuntoBoard;
	players = $state<PuntoPlayer[]>([]);
	playingPlayers = $derived(this.players.filter((i) => i.deck?.cards.length));
	private _currentCard = $state<PuntoCard>();
	restart: () => any;

	get currentCard() {
		return this._currentCard;
	}

	get winner() {
		return this._winner;
	}

	get isOver() {
		return this._isOver;
	}

	constructor(players: PuntoPlayer[], restart: () => any) {
		this.restart = restart;
		this.board = new PuntoBoard(6, this);
		this.players = _.shuffle(players);
		this.winAt = 5;
		if (players.length < 2) throw Error('Le punto se joue à 2 au minimum');
		if (players.length > 4) throw Error('Le punto se joue à 4 au maximum');
		if (players.length > 2) this.winAt = 4;
		this.setNextCard();
	}

	played() {
		const series = this.board.getAllSeries();
		const winningSeries = series.filter((serie) => serie.size >= this.winAt);
		if (winningSeries.length > 0) return this.win(winningSeries);
		if (this.playingPlayers.length === 0) throw this.null();
		this.setNextCard();
	}

	private null() {
		this.end();
	}

	private end() {
		this._currentCard = undefined;
		this._isOver = true;
	}

	private async win(series: ReturnType<typeof this.board.getAllSeries>) {
		this.end();
		await wait(350);
		const promises = series.map((s) => this.flashPlaces(s.serie.map((i) => i.place)));
		await Promise.all(promises);
		this._winner = series[0].deck.player;
	}

	private async flashPlaces(places: PuntoPlace[]) {
		for (const place of places) {
			place.flashFor(300);
			place.win = true;
			await wait(80);
		}
	}

	private setNextCard() {
		if (!this._currentCard) return (this._currentCard = this.players[0].deck?.pick());
		this._currentCard = this.getNextPlayer(this._currentCard.deck.player).deck?.pick();
	}

	private getNextPlayer(player: PuntoPlayer) {
		const newIndex = this.playingPlayers.indexOf(player) + 1;
		const index = newIndex >= this.playingPlayers.length ? 0 : newIndex;
		return this.playingPlayers[index];
	}
}
