import { writable } from 'svelte/store';
import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

// User store to track the current user's session
export const user = writable<User | null>(null);

// Set the initial user session when the app starts
async function initializeUserSession() {
	const { data } = await supabase.auth.getSession();
	user.set(data.session?.user || null);
}
initializeUserSession(); // Call the session initializer

// Function to register a new user
export async function register(email: string, password: string) {
	const { data, error } = await supabase.auth.signUp({ email, password });
	if (data.user) user.set(data.user); // Set user on successful registration
	return error;
}

// Function to log in an existing user
export async function signIn(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (data.user) user.set(data.user); // Set user if successfully signed in
	return error;
}

// Function to sign out the user
export async function signOut() {
	await supabase.auth.signOut();
	user.set(null);
}

// Auth state listener for real-time session updates
supabase.auth.onAuthStateChange((event, session) => {
	user.set(session?.user || null);
});
