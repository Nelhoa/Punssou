<script lang="ts">
	import type { Todo } from '$lib/utils/types';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import _ from 'lodash';
	import { TodoList } from './todos.svelte';
	import { supabase } from '$lib/utils/supabase-client';

	const todos = new TodoList();
	$effect(() => {
		todos.loadTodos();
		return () => todos.unsubcribe?.();
	});

	async function sendMessage(title: string) {
		await supabase().from('todos').insert({ title }).select();
	}

	function onchange(e: Event & { currentTarget: HTMLInputElement }) {
		sendMessage(e.currentTarget.value);
		e.currentTarget.value = '';
	}

	async function deleteTodo(todo: Todo['Row']) {
		await supabase().from('todos').delete().eq('id', todo.id);
	}

	async function updateTodo(e: Event & { currentTarget: HTMLInputElement }, todo: Todo['Row']) {
		const newValue = e.currentTarget.checked;
		const previousValue = todo.done;
		try {
			todo.done = newValue;
			const { error } = await supabase().from('todos').update({ done: newValue }).eq('id', todo.id);
			if (error) throw error;
		} catch (err) {
			console.error(err);
			todo.done = previousValue;
		}
	}

	async function updateTitle(e: Event & { currentTarget: HTMLInputElement }, todo: Todo['Row']) {
		const newValue = e.currentTarget.value;
		const previousValue = todo.title;
		try {
			todo.title = newValue;
			const { error } = await supabase()
				.from('todos')
				.update({ title: newValue })
				.eq('id', todo.id);
			if (error) throw error;
			e.currentTarget.blur();
		} catch (err) {
			console.error(err);
			todo.title = previousValue;
		}
	}
</script>

<div class="flex flex-col">
	<input
		class="border rounded px-3 py-[1px] hover:bg-black/[.03] focus:shadow focus:outline-none"
		type="text"
		placeholder="Ajouter une tâche"
		{onchange}
	/>
</div>

{#snippet list(todoList: Todo['Row'][], title)}
	{#if todoList.length > 0}
		<div class="text-lg font-semibold">{title}</div>
		{#each todoList as todo (todo.id)}
			<div
				animate:flip
				transition:slide
				class="grid grid-cols-[auto_1fr_auto] items-center gap-2 w-[300px] border rounded px-3 py-[1px] group hover:bg-black/[.03] focus-within:shadow has-[input:checked]:text-black/40"
			>
				<input type="checkbox" checked={todo.done} onchange={(e) => updateTodo(e, todo)} />
				<input
					class="focus:outline-none bg-transparent"
					value={todo.title}
					onchange={(e) => updateTitle(e, todo)}
				/>
				<button
					class="text-sm font-semibold text-white bg-black/20 hover:bg-black/30 rounded px-1 tracking-[0.05em]"
					onclick={() => deleteTodo(todo)}>Suppr.</button
				>
			</div>
		{/each}
	{/if}
{/snippet}

{#each Object.keys(todos.group) as key}
	{@render list(todos.group[key].group, todos.group[key].title)}
{/each}
