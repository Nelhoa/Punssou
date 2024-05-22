import type { PuntoCard } from './punto-cards.svelte';
import type { PuntoGame } from './punto-game.svelte';
import { PuntoPlace } from './punto-place.svelte';

export class PuntoBoard {
	game: PuntoGame;
	maxMapSize: number;
	cleanup: () => any;
	private map = $state<PuntoPlace[]>([]);
	private mapFiltered = $derived(
		this.map.filter((i) => i.state !== 'too far' && i.state !== 'locked')
	);
	mapToShow = $derived(this.map.filter((p) => isInSize(p, this.grid)));
	grid = $derived(getSize(this.mapFiltered));

	get fullmap() {
		return this.map;
	}

	constructor(maxMapSize: number, game: PuntoGame) {
		this.game = game;
		this.maxMapSize = maxMapSize;
		const size = this.maxMapSize * 2 - 1;
		const resize = this.maxMapSize - 1;
		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				this.map.push(new PuntoPlace(x - resize, y - resize, this));
			}
		}
		this.getPlace(0, 0)?.init('empty');

		this.cleanup = $effect.root(() => {
			$effect(() => {
				const mapSize = getSize(this.map.filter((p) => p.state === 'used'));
				let x: [number, number] | undefined;
				let y: [number, number] | undefined;
				if (mapSize.xSize >= this.maxMapSize) x = [mapSize.minX, mapSize.maxX];
				if (mapSize.ySize >= this.maxMapSize) y = [mapSize.minY, mapSize.maxY];
				if (x || y)
					this.map.forEach((place) => {
						place.outOfLimits = !placeInLimits(place, x, y);
					});
			});
		});
	}

	getPlace(x: number, y: number) {
		const place = this.map.find((p) => p.x === x && p.y === y);
		return place;
	}

	canPlay(card: PuntoCard) {
		const freePlaces = this.map.filter(
			(i) => (i.card && i.card.number < card.number) || i.state === 'empty'
		);
		if (freePlaces.length > 0) return true;
		return false;
	}

	getAllSeries() {
		const colStarts = getColsStart(this);
		const colSeries = colStarts
			.map((index) => getSeries(this, index, 'col'))
			.flat()
			.map((serie) => ({ size: serie.length, type: 'col', deck: serie[0].card.deck, serie }));

		const rowStarts = getRowsStart(this);
		const rowSeries = rowStarts
			.map((index) => getSeries(this, index, 'row'))
			.flat()
			.map((serie) => ({ size: serie.length, type: 'row', deck: serie[0].card.deck, serie }));

		const diagStarts = [...colStarts.slice(1, colStarts.length - 1), ...rowStarts];
		const diagSeries = diagStarts
			.map((index) => getSeries(this, index, 'dia'))
			.flat()
			.map((serie) => ({ size: serie.length, type: 'dia', deck: serie[0].card.deck, serie }));

		const mirrordiagStarts = [...colStarts.slice(0, colStarts.length - 1), ...getRowsEnds(this)];
		const mirrordiagSeries = mirrordiagStarts
			.map((index) => getSeries(this, index, 'dia-mirror'))
			.flat()
			.map((serie) => ({
				size: serie.length,
				type: 'dia-mirror',
				deck: serie[0].card.deck,
				serie
			}));
		const series = [...colSeries, ...rowSeries, ...diagSeries, ...mirrordiagSeries];
		return series;
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

function getColsStart(board: PuntoBoard) {
	const grid = getSize(board.fullmap);
	const starts: { x: number; y: number }[] = [];
	for (let y = grid.minY; y <= grid.maxY; y++) {
		starts.push({ y, x: grid.minX });
	}
	return starts;
}

function getRowsStart(board: PuntoBoard) {
	const grid = getSize(board.fullmap);
	const starts: { x: number; y: number }[] = [];
	for (let x = grid.minX; x <= grid.maxX; x++) {
		starts.push({ x, y: grid.minY });
	}
	return starts;
}

function getRowsEnds(board: PuntoBoard) {
	const grid = getSize(board.fullmap);
	const starts: { x: number; y: number }[] = [];
	for (let x = grid.minX; x <= grid.maxX; x++) {
		starts.push({ x, y: grid.maxY });
	}
	return starts;
}

function getSeries(
	board: PuntoBoard,
	{ x, y }: { x: number; y: number },
	direction: 'col' | 'row' | 'dia' | 'dia-mirror'
) {
	type PlaceWithCard = { place: PuntoPlace; card: PuntoCard };
	const addx = ['col', 'dia', 'dia-mirror'].includes(direction) ? 1 : 0;
	const addy = ['row', 'dia'].includes(direction) ? 1 : direction === 'dia-mirror' ? -1 : 0;
	const series: PlaceWithCard[][] = [];
	let currentSerie: PlaceWithCard[] | undefined;

	function createSerie(first: PlaceWithCard) {
		const newSerie: PlaceWithCard[] = [first];
		series.push(newSerie);
		return newSerie;
	}

	function setPlaceInSerie(place: PuntoPlace) {
		if (!place.card) return (currentSerie = undefined);
		const item = { place, card: place.card };
		if (!currentSerie) return (currentSerie = createSerie(item));
		const firstElement = currentSerie[0];
		if (!firstElement) throw Error('Une série a nécessaire un élément');
		if (item.card.deck === firstElement.card.deck) return currentSerie.push(item);
		currentSerie = createSerie(item);
	}

	while (true) {
		const place = board.getPlace(x, y);
		if (!place) break;
		setPlaceInSerie(place);
		x += addx;
		y += addy;
	}

	return series;
}

function placeInLimits(
	{ x, y }: PuntoPlace,
	xLimits?: readonly [number, number],
	yLimits?: readonly [number, number]
) {
	return inLimits(x, xLimits) && inLimits(y, yLimits);
}

function inLimits(value: number, limits?: readonly [number, number]) {
	if (!limits) return true;
	const [min, max] = limits;
	if (value < min) return false;
	if (value > max) return false;
	return true;
}
