import _ from 'lodash';
import { PuntoGamePlayer } from './punto-game-player';
import type { PuntoGame } from './punto-game.svelte';
import type { PuntoPlayer } from './punto-player.svelte';
import { getColors } from './punto-color.svelte';

type gameInitiliser = { winAt: number; players: PuntoGamePlayer[] };

export function initGameDecks(game: PuntoGame, players: PuntoPlayer[]): gameInitiliser {
	players = _.shuffle(players);
	const nb = players.length;
	if (nb === 2) return initFor2Players(game, players);
	if (nb === 3) return initFor3Players(game, players);
	if (nb === 4) return initFor4Players(game, players);
	throw Error('Le punto se joue de 2 à 4 joueurs uniquement');
}

function initFor2Players(game: PuntoGame, players: PuntoPlayer[]): gameInitiliser {
	const colors = getColors();
	const gamePlayers = players.map((player) => {
		const deckConstructor = [
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
		];
		return new PuntoGamePlayer(game, player, deckConstructor);
	});
	return { winAt: 5, players: gamePlayers };
}

function initFor3Players(game: PuntoGame, players: PuntoPlayer[]): gameInitiliser {
	const colors = getColors();
	const neutralColor = colors.pop()!;
	const neutralDeck = getDeckNumbers();
	const gamePlayers = players.map((player, index) => {
		const deckConstructor = [
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
		];
		return new PuntoGamePlayer(game, player, deckConstructor);
	});
	return { winAt: 4, players: gamePlayers };
}

function initFor4Players(game: PuntoGame, players: PuntoPlayer[]): gameInitiliser {
	const colors = getColors();
	const gamePlayers = players.map((player) => {
		const deckConstructor = [
			{
				numbers: getDeckNumbers(),
				color: colors.pop()!,
				neutral: false
			}
		];
		return new PuntoGamePlayer(game, player, deckConstructor);
	});
	return { winAt: 4, players: gamePlayers };
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
