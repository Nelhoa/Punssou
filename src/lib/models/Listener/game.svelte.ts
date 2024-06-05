import { goto } from '$app/navigation';
import { supabase } from '$lib/utils/supabase-client';
import type { GameDB, GamePlayerDB, GameWithPlayerRow } from '$lib/utils/types';
import { OnlineData } from '../../../routes/(protected)/online-data.svelte';
import { OnlineGamePlayer } from './game-player.svelte';
import { delList } from './util-del-list.svelte';

export class OnlineGame {
	readonly id: number;
	#row = $state() as GameDB['Row'];
	players: OnlineGamePlayer[] = $state([]);
	readonly myPlayerRow = $derived(
		this.players.find((player) => player.user_id === OnlineData.user_id)
	);
	accepted = $derived(
		this.players.filter((i) => i.row.status === 'accepted' || i.row.status === 'owner')
	);

	get row() {
		return this.#row;
	}

	constructor(row: GameWithPlayerRow) {
		this.id = row.id;
		this.#row = row;
		this.players = row.players?.map((playerRow) => new OnlineGamePlayer(this, playerRow)) ?? [];
	}

	updateGame(row: GameWithPlayerRow) {
		this.#row = row;
	}

	insertPlayer(playerRow: GamePlayerDB['Row']) {
		if (playerRow.game_id !== this.id) return;
		if (this.players.find((i) => i.id === playerRow.id)) return;
		this.players.push(new OnlineGamePlayer(this, playerRow));
	}

	updatePlayer(playerRow: GamePlayerDB['Row']) {
		const player = this.players.find((i) => i.id === playerRow.id);
		if (!player) return;
		player.update(playerRow);
	}

	deletePlayer(playerId: number) {
		delList(this.players, (i) => i.id === playerId);
	}

	async join() {
		const user_id = OnlineData.user_id;
		if (!user_id) return;

		if (this.myPlayerRow) {
			if (this.myPlayerRow.row.status === 'rejected') return;
		} else {
			await supabase()
				.from('game_players')
				.insert({ user_id, game_id: this.id, status: 'wanna-join' });
		}
		this.goToRoom();
	}

	goToRoom() {
		goto(`/online/game-${this.id}`);
	}
}
