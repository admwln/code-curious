<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { user, signOut } from '$lib/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';
	import { fetchLesson } from '$lib/utils/fetchLesson';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faFloppyDisk,
		faExclamationTriangle,
		faImage,
		faTrashCan,
	} from '@fortawesome/free-solid-svg-icons';

	interface Snapshot {
		id: string;
		lesson_slug: string;
		snapshot_data: any;
		lesson_title?: string;
	}

	const snapshots = writable<Snapshot[]>([]);
	const msg = writable<string | null>(null); // Initialize msg as writable
	let msgTimeout: ReturnType<typeof setTimeout> | undefined; // Declare a timeout for clearing msg

	let displayName = '';
	let displayNameError = '';

	let loading = true;
	let authLoading = true;

	onMount(async () => {
		// Existing authentication and load setup
		await checkUserAuthentication();
		authLoading = false;
	});

	async function checkUserAuthentication() {
		const { data: authData, error } = await supabase.auth.getUser();
		if (error) console.error('Error fetching auth state:', error.message);
		if (authData.user) {
			user.set(authData.user);
			await loadSnapshots();
			displayName = (await getDisplayName()) || '';
		} else {
			user.set(null);
			goto('/sign-in');
		}
		loading = false;
	}

	const loadSnapshots = async () => {
		if ($user) {
			const { data: snapshotsData, error } = await supabase
				.from('snapshots')
				.select('*')
				.eq('user_id', $user.id);
			if (error) console.error(error);
			else if (snapshotsData) {
				const snapshotsWithTitles = await Promise.all(
					snapshotsData.map(async (snapshot) => {
						const lesson = await fetchLesson(snapshot.lesson_slug);
						return {
							...snapshot,
							lesson_title: lesson?.title,
						};
					}),
				);
				snapshots.set(snapshotsWithTitles);
			}
		}
	};

	const getDisplayName = async () => {
		try {
			const { data, error } = await supabase.auth.getUser();
			if (error) throw error;
			return data.user.user_metadata.display_name || '';
		} catch (error: any) {
			console.error('Error fetching display name:', error.message);
			return null;
		}
	};

	// Display message utility function
	function displayMessage(message: string, duration: number = 5000) {
		msg.set(message); // Set the message
		clearTimeout(msgTimeout); // Clear any existing timeout
		msgTimeout = setTimeout(() => msg.set(null), duration); // Clear message after duration
	}

	async function updateDisplayName() {
		try {
			const { data, error } = await supabase.auth.updateUser({
				data: {
					display_name: displayName,
				},
			});
			if (error) throw error;

			const { data: updatedUser, error: refreshError } = await supabase.auth.getUser();
			if (refreshError) throw refreshError;

			displayMessage('Username updated successfully!');
		} catch (error: any) {
			console.error('Error updating display name:', error.message);
			displayMessage('Error updating display name.');
		}
	}

	async function deleteSnapshot(snapshotId: string) {
		console.log('Deleting snapshot:', snapshotId);
		const { error } = await supabase.from('snapshots').delete().eq('id', snapshotId);
		if (error) {
			console.error(error);
			displayMessage('Error deleting snapshot.');
		} else {
			const updatedSnapshots = $snapshots.filter((snapshot) => snapshot.id !== snapshotId);
			snapshots.set(updatedSnapshots);
			displayMessage('Snapshot deleted successfully!');
		}
	}

	$: if (!$user && !authLoading) {
		goto('/sign-in');
	}
</script>

<div class="h-full w-full flex flex-col items-center">
	<div class="card mt-4 md:mt-12 md:w-1/2">
		{#if authLoading || loading}
			<header class="card-header">
				<h2>Loading...</h2>
			</header>
			<section class="p-4">
				<p>Please wait while we load your dashboard.</p>
			</section>
		{:else if $user}
			<header class="card-header">
				<h2 class="h2">Dashboard</h2>
			</header>
			<hr class="opacity-50 mt-4" />
			<section class="p-4 flex flex-col items-start">
				<form on:submit|preventDefault={updateDisplayName}>
					<label class="label">
						<span>Username</span>
						<div class="flex">
							<input
								id="displayName"
								class="input"
								type="text"
								bind:value={displayName}
								placeholder="Choose a username"
							/>
							<button type="submit" class="btn-icon bg-initial">
								<FontAwesomeIcon icon={faFloppyDisk} />
								<span class="sr-only">Save Username</span>
							</button>
						</div>
					</label>

					{#if displayNameError}
						<p class="error">{displayNameError}</p>
					{/if}
				</form>
			</section>
			<hr class="opacity-50" />
			<section class="p-4 flex flex-col items-start">
				<h3 class="text-xl">Your Snapshots</h3>
				{#each $snapshots as snapshot}
					<div>
						<p class="flex gap-2 items-center">
							<FontAwesomeIcon icon={faImage} />

							<a class="anchor" href={`/tutorial/${snapshot.lesson_slug}`}>
								<span>{snapshot.lesson_title}</span>
							</a>
							<button
								class="btn-icon btn-sm bg-initial"
								on:click={() => deleteSnapshot(snapshot.id)}
							>
								<FontAwesomeIcon icon={faTrashCan} />
								<span class="sr-only">Delete Snapshot</span>
							</button>
						</p>
					</div>
				{/each}
			</section>
			<hr class="opacity-50 mb-4" />
			<footer class="card-footer">
				<button class="btn bg-primary-700" type="button" on:click={signOut}>Sign Out</button>
			</footer>
		{:else}
			<section class="p-4">Please log in to view your dashboard.</section>
		{/if}
	</div>
	<!-- Display the message if it exists -->
	{#if $msg}
		<aside class="alert variant-ghost-success mt-4">
			<div><FontAwesomeIcon icon={faExclamationTriangle} /></div>
			<div class="alert-message">
				<p>{$msg}</p>
			</div>
		</aside>
	{/if}
</div>
