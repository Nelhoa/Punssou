import { supabase } from '$lib/utils/supabase-client';
import type { GameDB, GamePlayerDB, GameWithPlayerRow, UserProfileDB } from '$lib/utils/types';
import { wait } from '$lib/utils/wait';
import type {
	RealtimeChannel,
	RealtimePostgresChangesPayload,
	RealtimePostgresDeletePayload,
	RealtimePostgresInsertPayload,
	RealtimePostgresUpdatePayload
} from '@supabase/supabase-js';
import _ from 'lodash';
import { delList } from './util-del-list.svelte';
import { OnlineGame } from './game.svelte';
import { untrack } from 'svelte';
import { Listener } from './listener.svelte';
import { OnlineData } from '../../../routes/(protected)/online-data.svelte';

export class GameList {
	myUserId = $state<string | undefined>();
	#unsubcribe?: () => any;
	#games = $state<OnlineGame[]>([]);
	users = new Listener<UserProfileDB['Row'], string>(
		(row) => {
			const id = row.user_id;
			if (!id) throw Error('No id found');
			return id;
		},
		async () => {
			const { data } = await supabase().from('profiles').select();
			if (!data) throw Error('No users profile fetched');
			return data;
		}
	);
	#filteredGame = $derived(this.#games.filter((game) => game.row.status === 'creation'));
	#loadingPromise = $state() as Promise<void> | undefined;
	readonly loading = $derived(Boolean(this.#loadingPromise));
	#loaded = $state(false);
	readonly myGames = $derived(
		this.#games.filter((i) => i.players.find((p) => p.user_id === OnlineData.user_id))
	);

	get games() {
		return this.#filteredGame;
	}

	cleanup() {
		untrack(() => {
			this.#unsubcribe?.();
			this.users.reset();
			this.#unsubcribe = undefined;
			this.#loadingPromise = undefined;
			this.#loaded = false;
			this.#games.length = 0;
		});
	}

	async #subscribe() {
		const channel = supabase().channel('room-1');

		channel
			.on<GameDB['Row']>(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'games' },
				this.handleGameChange.bind(this)
			)
			.on<GamePlayerDB['Row']>(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'game_players' },
				this.handlePlayerChange.bind(this)
			)
			.on<UserProfileDB['Row']>(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'game_players'
				},
				(payload) => this.users.handleChange(payload)
			)
			.subscribe(async (status) => {
				console.log('Game changes :', status);
			});

		this.#unsubcribe = () => {
			supabase().removeAllChannels();
		};
	}

	getOrCreateGame(row: GameDB['Row']) {
		let game = this.#games.find((i) => i.id === row.id);
		if (!game) game = new OnlineGame(row);
		return game;
	}

	async load() {
		await untrack(async () => {
			if (this.#loaded) return;
			if (!this.#loadingPromise) this.#loadingPromise = this.#load();
			await this.#loadingPromise;
			this.#loadingPromise = undefined;
		});
	}

	async #load() {
		if (this.#loaded) return;
		await wait(350);
		const { data } = await supabase().from('games').select('*, players: game_players(*)');
		if (!data) return;
		this.#games.push(...data.map((row) => new OnlineGame(row)));
		this.#loaded = true;
		this.#subscribe();
	}

	private handleGameChange(payload: RealtimePostgresChangesPayload<GameDB['Row']>) {
		console.log('Game event');
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

	private handlePlayerChange(payload: RealtimePostgresChangesPayload<GamePlayerDB['Row']>) {
		console.log('Game player event');
		switch (payload.eventType) {
			case 'INSERT':
				this.#insertPlayer(payload);
				break;

			case 'UPDATE':
				this.#updatePlayer(payload);
				break;

			case 'DELETE':
				this.#deletePlayer(payload);
				break;
		}
	}

	#insertPlayer(payload: RealtimePostgresInsertPayload<GamePlayerDB['Row']>) {
		const game = this.games.find((i) => i.id === payload.new.game_id);
		game?.insertPlayer(payload.new);
	}

	#updatePlayer(payload: RealtimePostgresUpdatePayload<GamePlayerDB['Row']>) {
		const game = this.games.find((i) => i.id === payload.new.game_id);
		game?.updatePlayer(payload.new);
	}

	#deletePlayer(payload: RealtimePostgresDeletePayload<GamePlayerDB['Row']>) {
		const playerId = payload.old.id;
		if (!playerId) return;
		this.games.forEach((game) => game.deletePlayer(playerId));
	}

	async createGame(title: string) {
		const newGame: GameDB['Insert'] = { title, status: 'creation' };
		const { data } = await supabase().from('games').insert(newGame).select().maybeSingle();
		if (!data) throw Error('No ame created');
		return data;
	}

	private insert(payload: RealtimePostgresInsertPayload<GameDB['Row']>) {
		const newGameId = payload.new.id;
		if (this.#games.find((i) => i.id === newGameId)) return;
		this.#games.push(new OnlineGame(payload.new));
		console.log(this.#games.length);
	}

	private update(payload: RealtimePostgresUpdatePayload<GameDB['Row']>) {
		const game = this.#games.find((i) => i.id === payload.new.id)!;
		game?.updateGame(payload.new);
	}

	private del(payload: RealtimePostgresDeletePayload<GameDB['Row']>) {
		delList(this.#games, (i) => 'id' in payload.old && i.id === payload.old.id);
	}
}

export const games = new GameList();
