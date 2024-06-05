import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from './types-supabase';

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type SafeSession = Prettify<Omit<Session, 'user'> & { safeUser: User }>;
export type TypedSupabaseClient = SupabaseClient<Database>;
export type Tables = Database['public']['Tables'];
export type Todo = Tables['todos'];
export type GameDB = Tables['games'];
export type GameWithPlayerRow = Prettify<
	Tables['games']['Row'] & { players?: Tables['game_players']['Row'][] }
>;
export type GamePlayerDB = Tables['game_players'];
export type UserProfileDB = Tables['profiles'];
