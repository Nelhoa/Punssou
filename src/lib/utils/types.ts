import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from './types-supabase';

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type SafeSession = Prettify<Omit<Session, 'user'> & { safeUser: User }>;
export type TypedSupabaseClient = SupabaseClient<Database>;
export type Tables = Database['public']['Tables'];
