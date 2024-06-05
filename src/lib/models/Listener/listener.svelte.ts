import type {
	RealtimePostgresChangesPayload,
	RealtimePostgresDeletePayload,
	RealtimePostgresInsertPayload,
	RealtimePostgresUpdatePayload
} from '@supabase/supabase-js';
import { delList } from './util-del-list.svelte';

type idGetter<T, id> = (i: Partial<T>) => id;

export class Listener<T extends Record<string, any>, id> {
	#list = $state([]) as { row: T }[];
	#getId: idGetter<T, id>;
	#loader: () => Promise<T[]>;
	loaded = $state(false);
	loading = $state() as Promise<T[]> | undefined;

	get list() {
		return this.#list;
	}

	constructor(getId: idGetter<T, id>, loader: () => Promise<T[]>) {
		this.#getId = getId;
		this.#loader = loader;
	}

	async load() {
		if (this.loaded) return;
		if (!this.loading) this.loading = this.#loader();
		const rows = await this.loading;
		this.#list.push(...rows.map((row) => ({ row })));
	}

	handleChange(payload: RealtimePostgresChangesPayload<T>) {
		switch (payload.eventType) {
			case 'INSERT':
				this.#insert(payload);
				break;

			case 'UPDATE':
				this.#update(payload);
				break;

			case 'DELETE':
				this.#del(payload);
				break;
		}
	}

	reset() {
		this.loaded = false;
		this.#list.length = 0;
	}

	#insert(payload: RealtimePostgresInsertPayload<T>) {
		const item = this.#list.find((i) => this.#finder(i, payload.new));
		if (item) return;
		this.#list.push({ row: payload.new });
	}

	#update(payload: RealtimePostgresUpdatePayload<T>) {
		const item = this.#list.find((i) => this.#finder(i, payload.new));
		if (!item) return;
		item.row = payload.new;
	}

	#del(payload: RealtimePostgresDeletePayload<T>) {
		delList(this.#list, (i) => this.#finder(i, payload.old));
	}

	#finder(listItem: { row: T }, searched: Partial<T>) {
		return this.#getId(listItem.row) === this.#getId(searched);
	}
}
