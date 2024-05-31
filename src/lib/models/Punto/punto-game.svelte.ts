import { getContext, setContext } from 'svelte';
import { PuntoBoard } from './punto-board.svelte';
import { PuntoPlayer } from './punto-player.svelte';
import type { PuntoCard } from './punto-card.svelte';
import _ from 'lodash';
import type { PuntoPlace } from './punto-place.svelte';
import { wait } from '$lib/utils/wait';
import { PuntoColor, getColors } from './punto-color.svelte';
import { settings } from './punto-settings.svelte';
import { music_win } from '$lib/sounds/musics.svelte';

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

function getDeckNumbers() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const deck = [...numbers, ...numbers];
	return _.shuffle(deck);
}

function getSliceOfDeck(numbers: number[], part: number, parts: number) {
	const partSize = Math.floor(numbers.length / parts);
	const remainder = numbers.length % parts;
	let start = partSize * (part - 1) + Math.min(remainder, part - 1);
	if (part > remainder) {
		start += remainder;
	} else {
		start += part - 1;
	}
	let end = start + partSize + (part <= remainder ? 1 : 0);
	return numbers.slice(start, end);
}

export class PuntoGame {
	private _winAt = 5;
	private _winner = $state<{ player: PuntoPlayer; color: PuntoColor } | undefined>();
	private _isOver = $state(false);
	readonly phoneMode = $derived(settings.layoutWidth < 400);
	endMessage = $state<string>('');
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

	get winAt() {
		return this._winAt;
	}

	get isOver() {
		return this._isOver;
	}

	constructor(players: PuntoPlayer[], restart: () => any) {
		this.restart = restart;
		this.board = new PuntoBoard(6, this);
		this.players = _.shuffle(players);
		this.init(players);
		this.setNextCard();
	}

	init(players: PuntoPlayer[]) {
		this.players = players;
		const nb = players.length;
		if (nb === 2) return this.initFor2Players(players);
		if (nb === 3) return this.initFor3Players(players);
		if (nb === 4) return this.initFor4Players(players);
		throw Error('Le punto se joue de 2 à 4 joueurs uniquement');
	}

	private initFor2Players(players: PuntoPlayer[]) {
		this._winAt = 5;
		const colors = getColors();
		players.forEach((player) =>
			player.deck.initCards([
				{
					numbers: getDeckNumbers(),
					color: colors.pop()!,
					neutral: false
				},
				{
					numbers: getDeckNumbers(),
					color: colors.pop()!,
					neutral: false
				}
			])
		);
	}

	private initFor3Players(players: PuntoPlayer[]) {
		this._winAt = 4;
		const colors = getColors();
		const neutralColor = colors.pop()!;
		const neutralDeck = getDeckNumbers();

		players.forEach((player, index) =>
			player.deck.initCards([
				{
					numbers: getDeckNumbers(),
					color: colors.pop()!,
					neutral: false
				},
				{
					numbers: getSliceOfDeck(neutralDeck, index + 1, 3),
					color: neutralColor,
					neutral: true
				}
			])
		);
	}

	private initFor4Players(players: PuntoPlayer[]) {
		this._winAt = 4;
		const colors = getColors();

		players.forEach((player) =>
			player.deck.initCards([
				{
					numbers: getDeckNumbers(),
					color: colors.pop()!,
					neutral: false
				}
			])
		);
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

	private getNextPlayer(player: PuntoPlayer) {
		const newIndex = this.playingPlayers.indexOf(player) + 1;
		const index = newIndex >= this.playingPlayers.length ? 0 : newIndex;
		return this.playingPlayers[index];
	}
}

function random() {
	const number = Math.random() * 1.5;
	return [0 - number, 1.5 - number];
}
