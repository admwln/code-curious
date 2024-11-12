<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { user, signOut } from '$lib/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { writable } from 'svelte/store';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCheck } from '@fortawesome/free-solid-svg-icons';

	interface Snapshot {
		lesson_id: string;
		snapshot_data: any;
	}

	const snapshots = writable<Snapshot[]>([]);

	let displayName = ''; // Variable to store the reactive display name
	let displayNameStatic = ''; // Variable to store the static display name on mount
	let displayNameError = ''; // Variable to store any error messages for the display name update

	let loading = true;
	let authLoading = true;

	onMount(async () => {
		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			if (session?.user) {
				user.set(session.user);
				loadSnapshots();
				getDisplayName().then((displayName) => {
					displayName = displayName || '';
					displayNameStatic = displayName;
				});
			} else {
				user.set(null);
				goto('/sign-in');
			}
		});

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
			snapshots.set(snapshotsData || []);
		}
	};

	const getDisplayName = async () => {
		// Get display name from user
		try {
			const { data, error } = await supabase.auth.getUser();
			if (error) throw error;
			const displayName = data.user.user_metadata.display_name || data.user.email;
			return displayName;
		} catch (error: any) {
			console.error('Error fetching display name:', error.message);
			return null;
		}
	};

	// Update display name in Supabase
	async function updateDisplayName() {
		try {
			const { data, error } = await supabase.auth.updateUser({
				data: {
					display_name: displayName,
				},
			});

			if (error) throw error;

			// Refresh the user session to reflect changes immediately
			const { data: updatedUser, error: refreshError } = await supabase.auth.getUser();

			if (refreshError) throw refreshError;

			console.log(
				'Display name updated successfully:',
				updatedUser.user.user_metadata.display_name,
			);

			// You can also update any UI components here to show the new display name
		} catch (error: any) {
			console.error('Error updating display name:', error.message);
			// Handle the error appropriately (e.g., show an error message to the user)
		}
	}

	// Define saveSnapshot, updateSnapshot, and deleteSnapshot functions
	async function saveSnapshot(lessonId: number, snapshotData: Record<string, any>) {
		if ($user) {
			const { data, error } = await supabase
				.from('snapshots')
				.insert([{ user_id: $user.id, lesson_id: lessonId, snapshot_data: snapshotData }]);
			if (error) console.error(error);
		}
	}

	async function updateSnapshot(snapshotId: number, newSnapshotData: Record<string, any>) {
		const { error } = await supabase
			.from('snapshots')
			.update({ snapshot_data: newSnapshotData })
			.eq('id', snapshotId);
		if (error) console.error(error);
	}

	async function deleteSnapshot(snapshotId: number) {
		const { error } = await supabase.from('snapshots').delete().eq('id', snapshotId);
		if (error) console.error(error);
	}
	$: if (!$user && !authLoading) {
		goto('/sign-in');
	}
</script>

{#if authLoading || loading}
	<p>Loading...</p>
{:else}
	<div class="h-full w-full flex justify-center">
		<div class="card mt-4 md:mt-12 md:w-1/2">
			{#if $user}
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
								<button type="submit" class="btn bg-initial">
									<span><FontAwesomeIcon icon={faCheck} /></span>
									<span>Update</span>
								</button>
							</div>
						</label>

						{#if displayNameError}
							<p class="error">{displayNameError}</p>
						{/if}
					</form>
				</section>
				<section class="p-4 flex flex-col items-start">
					<h2>Your Snapshots</h2>
					{#each $snapshots as snapshot}
						<div>
							<p>Lesson: {snapshot.lesson_id}</p>
							<pre>{JSON.stringify(snapshot.snapshot_data, null, 2)}</pre>
						</div>
					{/each}
				</section>
				<hr class="opacity-50 my-4" />
				<footer class="card-footer">
					<button class="btn bg-primary-700" type="button" on:click={signOut}>Sign Out</button>
				</footer>
			{:else}
				<p>Please log in to view your dashboard.</p>
			{/if}
		</div>
	</div>
{/if}
