import type { PuntoColor } from './punto-color.svelte';
import { PuntoDeck, type DeckConstructor } from './punto-deck.svelte';
import type { PuntoGame } from './punto-game.svelte';
import type { PuntoPlayer } from './punto-player.svelte';

export class PuntoGamePlayer {
	readonly game: PuntoGame;
	readonly player: PuntoPlayer;
	readonly deck: PuntoDeck;
	readonly colors: PuntoColor[];

	constructor(game: PuntoGame, player: PuntoPlayer, deckConstructor: DeckConstructor[]) {
		this.game = game;
		this.player = player;
		this.deck = new PuntoDeck(this, deckConstructor);
		this.colors = deckConstructor.filter((i) => !i.neutral).map((i) => i.color);
	}
}
