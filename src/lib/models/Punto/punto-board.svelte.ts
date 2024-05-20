import type { PuntoCard } from './punto-cards.svelte';
import { PuntoPlace } from './punto-place.svelte';

const maxMapSize = 6;

export class PuntoBoard {
	private map = $state<PuntoPlace[]>([]);
	private mapFiltered = $derived(
		this.map.filter((i) => i.state !== 'too far' && i.state !== 'locked')
	);
	limits = $derived.by(() => {
		const size = getSize(this.map.filter((p) => p.state === 'used'));
		return {
			minX: size.xSize === maxMapSize ? size.minX : undefined,
			maxX: size.xSize === maxMapSize ? size.maxX : undefined,
			minY: size.ySize === maxMapSize ? size.minY : undefined,
			maxY: size.ySize === maxMapSize ? size.maxY : undefined
		};
	});
	mapToShow = $derived(this.map.filter((p) => isInSize(p, this.grid)));
	grid = $derived(getSize(this.mapFiltered));

	constructor() {
		const size = maxMapSize * 2 - 1;
		const resize = maxMapSize - 1;
		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				this.map.push(new PuntoPlace(x - resize, y - resize, this));
			}
		}
		this.getPlace(0, 0)?.init('empty');
	}

	getPlace(x: number, y: number) {
		const place = this.map.find((p) => p.x === x && p.y === y);
		return place;
	}

	placeCard(x: number, y: number, card: PuntoCard) {
		const place = this.getPlace(x, y);
		if (!place) throw Error(`Pas de place aux coordonnés [${x}, ${y}]`);
		place.setCard(card);
	}
}

type gridSize = ReturnType<typeof getSize>;

function isInSize({ x, y }: PuntoPlace, { minX, minY, maxX, maxY }: gridSize) {
	return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

function getSize(places: PuntoPlace[]) {
	const ys = places.map((i) => i.y);
	const xs = places.map((i) => i.x);
	const minY = Math.min(...ys);
	const maxY = Math.max(...ys);
	const minX = Math.min(...xs);
	const maxX = Math.max(...xs);
	const ySize = maxY - minY + 1;
	const xSize = maxX - minX + 1;
	return { minY, maxY, minX, maxX, ySize, xSize };
}
