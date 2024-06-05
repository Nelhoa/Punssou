import { z } from 'zod';
import type { OnlineGame } from './game.svelte';
import type { GamePlayerDB, UserProfileDB } from '$lib/utils/types';
import { supabase } from '$lib/utils/supabase-client';

const playerDeckSchema = z
	.object({
		color: z.number(),
		cards: z.array(z.number())
	})
	.optional()
	.nullable();

const users = [] as UserProfileDB['Row'][];
async function getUser(user_id: string) {
	let user = users.find((i) => i.user_id === user_id);
	if (user) return user;
	const { data } = await supabase().from('profiles').select().eq('user_id', user_id).maybeSingle();
	if (!data) throw Error('No profile found for given user');
	users.push(data);
	return data;
}

export class OnlineGamePlayer {
	readonly game: OnlineGame;
	readonly id: number;
	readonly user_id: string;
	#row = $state() as GamePlayerDB['Row'];
	deck: typeof playerDeckSchema._type = $state(null);

	get row() {
		return this.#row;
	}

	getUser() {
		return getUser(this.user_id);
	}

	constructor(game: OnlineGame, row: GamePlayerDB['Row']) {
		this.game = game;
		this.id = row.id;
		this.user_id = row.user_id;
		this.#row = row;
		this.deck = playerDeckSchema.parse(row.deck);
	}

	async updateRemote(row: GamePlayerDB['Update']) {
		await supabase().from('game_players').update(row).eq('id', this.id);
	}

	update(row: GamePlayerDB['Row']) {
		this.#row = row;
		this.deck = playerDeckSchema.parse(row.deck);
	}

	getAcceptMethod() {
		const rowid = this.row.id;
		const isOwner = $derived(this.game.myPlayerRow?.row.status === 'owner');

		async function accept() {
			if (!isOwner) return;
			await supabase().from('game_players').update({ status: 'accepted' }).eq('id', rowid);
		}

		return {
			get isOwner() {
				return isOwner;
			},
			accept
		};
	}
}
