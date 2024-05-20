import type { PuntoBoard } from './punto-board.svelte';
import type { PuntoCard } from './punto-cards.svelte';

type placeState = 'empty' | 'locked' | 'used' | 'too far';

export class PuntoPlace {
	board: PuntoBoard;
	x: number;
	y: number;
	private _card = $state<PuntoCard | undefined>();
	state = $state<placeState>('too far');
	private _neighbours: PuntoPlace[] | undefined;

	get neighbours() {
		if (this._neighbours) return this._neighbours;
		const xPos = this.x;
		const yPos = this.y;
		const xAxis = [xPos - 1, xPos, xPos + 1];
		const yAxis = [yPos - 1, yPos, yPos + 1];
		const neighbours: PuntoPlace[] = [];
		for (const x of xAxis) {
			for (const y of yAxis) {
				const place = this.board.getPlace(x, y);
				if (place) neighbours.push(place);
			}
		}
		this._neighbours = neighbours.filter((i) => i !== this);
		return this._neighbours;
	}

	get card() {
		return this._card;
	}

	constructor(x: number, y: number, board: PuntoBoard) {
		this.x = x;
		this.y = y;
		this.board = board;
	}

	setCard(card: PuntoCard) {
		if (this.state === 'locked') throw Error('Impossible. La place est vérouillée');
		if (this.state === 'too far') throw Error('Impossible, la place est indisponible');
		if (this.state === 'empty') this._card = card;
		if (this.state === 'used' && this._card) {
			if (this._card.number >= card.number)
				throw Error('Seule une carte de niveau supérieure peut être placée');
			this._card = card;
		}
		this.update();
	}

	init(state: placeState) {
		this.state = state;
		this.neighbours.forEach((n) => (n.state = 'locked'));
	}

	private update() {
		const oldState = this.state;
		this.state = this.getNewState();
		if (oldState !== this.state) this.neighbours.forEach((n) => n.update());
	}

	private getNewState(): placeState {
		if (this._card) return 'used';
		const neighbourStates = this.neighbours.map((i) => i.state);
		if (neighbourStates.includes('used')) return 'empty';
		if (neighbourStates.includes('empty')) return 'locked';
		return 'too far';
	}

	log(message: string, value?: any) {
		const x = this.x;
		const y = this.y;
		if (x === 1 && y === 1) console.log(message, value);
	}
}
