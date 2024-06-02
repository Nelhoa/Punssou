import { getContext, setContext } from 'svelte';
import { PuntoBoard } from './punto-board.svelte';
import { PuntoPlayer } from './punto-player.svelte';
import type { PuntoCard } from './punto-card.svelte';
import _ from 'lodash';
import type { PuntoPlace } from './punto-place.svelte';
import { wait } from '$lib/utils/wait';
import { PuntoColor } from './punto-color.svelte';
import { settings } from './punto-settings.svelte';
import { music_win } from '$lib/sounds/musics.svelte';
import type { PuntoGamePlayer } from './punto-game-player';
import { initGameDecks } from './game-initialiser';

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

type winner = { player: PuntoGamePlayer; color: PuntoColor } | undefined;

export class PuntoGame {
	readonly winAt: number;
	private _winner = $state() as winner;
	private _isOver = $state(false);
	readonly phoneMode = $derived(settings.layoutWidth < 400);
	endMessage = $state('') as string;
	board = $state() as PuntoBoard;
	players = $state([]) as PuntoGamePlayer[];
	playingPlayers = $derived(this.players.filter((i) => i.deck.cards.length));
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
		const init = initGameDecks(this, players);
		this.players = init.players;
		this.winAt = init.winAt;
		this.setNextCard();
	}

	played() {
		const series = this.board.getAllSeries();
		const winningSeries = series.filter((serie) => serie.size >= this.winAt);
		if (winningSeries.length > 0) return this.win(winningSeries);
		if (this.playingPlayers.length === 0) return this.stop('Plus aucun joueur n’a de carte');
		const currentCard = this.setNextCard();
		if (!currentCard) return this.stop('Plus aucun joueur n’a de carte');
		if (!this.board.canPlay(currentCard)) return this.stop('Impossible de poser la carte');
	}

	private stop(message: string) {
		this.end(message);
	}

	private end(message: string) {
		this.endMessage = message;
		this._currentCard = undefined;
		this._isOver = true;
	}

	private async win(series: ReturnType<typeof this.board.getAllSeries>) {
		this.end(`Bravo. Tu es très fort.`);

		await wait(350);
		const promises = series.map((s) => this.flashPlaces(s.serie.map((i) => i.place)));
		await Promise.all(promises);
		music_win.play();
		this._winner = { player: series[0].player, color: series[0].serie[0].card.color };
	}

	private async flashPlaces(places: PuntoPlace[]) {
		for (const place of places) {
			place.flashFor(300, 0, true);
			place.win = true;
			place.confettis.push({
				x: random(),
				y: random(),
				colorArray: [place.card?.color.color, 'white'],
				size: 12,
				duration: _.shuffle([1000, 1200, 800, 600])[0]
			});
			await wait(170);
		}
	}

	private setNextCard() {
		if (!this._currentCard) return (this._currentCard = this.players[0].deck?.pick());
		return (this._currentCard = this.getNextPlayer(this._currentCard.deck.player).deck?.pick());
	}

	private getNextPlayer(player: PuntoGamePlayer) {
		const newIndex = this.playingPlayers.indexOf(player) + 1;
		const index = newIndex >= this.playingPlayers.length ? 0 : newIndex;
		return this.playingPlayers[index];
	}
}

function random() {
	const number = Math.random() * 1.5;
	return [0 - number, 1.5 - number];
}
