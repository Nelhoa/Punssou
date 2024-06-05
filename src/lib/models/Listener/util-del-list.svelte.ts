export function delList<T>(list: T[], finder: (i: T) => boolean) {
	const index = list.findIndex(finder);
	if (index < 0) return;
	list.splice(index, 1);
}
