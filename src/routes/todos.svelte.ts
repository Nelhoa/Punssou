import { supabase } from '$lib/utils/supabase-client';
import type { Todo } from '$lib/utils/types';
import type {
	RealtimePostgresChangesPayload,
	RealtimePostgresDeletePayload,
	RealtimePostgresInsertPayload,
	RealtimePostgresUpdatePayload
} from '@supabase/supabase-js';
import _ from 'lodash';

export class TodoList {
	unsubcribe?: () => any;
	private todos = $state<Todo['Row'][]>([]);
	group = $derived(
		_.mapValues(
			_.groupBy(this.todos, (i) => i.done),
			(group, title) => ({
				title: title === 'true' ? 'Terminé' : 'À faire',
				group
			})
		)
	);

	private subscribe() {
		this.unsubcribe?.();
		const channel = supabase().channel('room-1');
		channel
			.on<Todo['Row']>(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'todos' },
				(payload) => this.todosChanged(payload)
			)
			.subscribe(async (status) => {
				if (status !== 'SUBSCRIBED') return;
			});
		console.log('Subcribed');
		this.unsubcribe = () => {
			console.log('Unsubscribed channels');
			supabase().removeAllChannels();
		};
	}

	async loadTodos() {
		const { data } = await supabase().from('todos').select();
		if (!data) return;
		this.todos.push(...data);
		this.subscribe();
	}

	private todosChanged(payload: RealtimePostgresChangesPayload<Todo['Row']>) {
		switch (payload.eventType) {
			case 'INSERT':
				this.insert(payload);
				break;

			case 'UPDATE':
				this.update(payload);
				break;

			case 'DELETE':
				this.del(payload);
				break;
		}
	}

	private insert(payload: RealtimePostgresInsertPayload<Todo['Row']>) {
		this.todos.push(payload.new);
	}

	private update(payload: RealtimePostgresUpdatePayload<Todo['Row']>) {
		const updatedRow = this.todos.find((i) => i.id === payload.new.id)!;
		updatedRow.done = payload.new.done;
		updatedRow.title = payload.new.title;
	}

	private del(payload: RealtimePostgresDeletePayload<Todo['Row']>) {
		const index = this.todos.findIndex((i) => 'id' in payload.old && i.id === payload.old.id);
		if (index < 0) return;
		this.todos.splice(index, 1);
	}
}
