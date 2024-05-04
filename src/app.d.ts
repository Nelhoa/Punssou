import type { SafeSession, TypedSupabaseClient } from '$lib/utils/types';
import type { SupabaseClient } from '@supabase/supabase-js';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: TypedSupabaseClient;
			getSession: () => Promise<SafeSession | null>;
			session: SafeSession | null;
			user: User | null;
		}
		interface PageData {
			supabase: TypedSupabaseClient;
			session: SafeSession | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
