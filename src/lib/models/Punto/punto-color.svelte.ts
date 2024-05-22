import _ from 'lodash';

export class PuntoColor {
	color = $state() as string;

	constructor(color: string) {
		this.color = color;
	}
}

const colors = ['blue', 'green', 'orange', 'red'].map((i) => new PuntoColor(i));

export function getColors() {
	return _.shuffle([...colors]);
}
