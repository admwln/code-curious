<script lang="ts">
	import { user } from '$lib/auth';
	import { supabase } from '$lib/supabaseClient';
	import { writable } from 'svelte/store';
	import StringModal from './StringModal.svelte';
	import NumberModal from './NumberModal.svelte';
	import BooleanModal from './BooleanModal.svelte';
	import ObjectModal from './ObjectModal.svelte';
	import ArrayModal from './ArrayModal.svelte';
	import NewVariable from './NewVariable.svelte';
	import LogModal from './LogModal.svelte';
	import NewLog from './NewLog.svelte';
	import VariableBlock from './VariableBlock.svelte';
	import ActionModal from './ActionModal.svelte';

	import { faBolt, faCameraRetro, faEye, faImage, faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	import { page } from '$app/stores';
	import { resetMatterFlag } from '$lib/stores/store';
	import { snapshot, saveSnapshot, loadSnapshot } from '$lib/stores/snapshots';
	import { beforeNavigate } from '$app/navigation';

	export let data;
	const userSnapshot = writable<any[]>([]);

	let lessonSlug: string;

	// Subscribe to the lesson slug from the page store
	$: lessonSlug = $page.params.lessonId;

	// Load snapshot data for the current lesson when the component mounts or lessonSlug changes
	$: {
		if (lessonSlug) {
			loadSnapshot(lessonSlug, data.snapshot);
			fetchUserSnapshot();
		}
	}

	// Save the current snapshot before navigating to another route
	beforeNavigate(() => {
		if (lessonSlug) {
			saveSnapshot(lessonSlug, $snapshot);
		}
	});

	// IDs of currently edited variables
	let activeStringId: number | null = null;
	let activeNumberId: number | null = null;
	let activeBooleanId: number | null = null;
	let activeObjectId: number | null = null;
	let activeArrayId: number | null = null;
	let activeLogId: number | null = null;
	let activeActionId: number | null = null;

	let newAction: boolean = false;

	const handleClose = () => {
		activeStringId = null;
		activeNumberId = null;
		activeBooleanId = null;
		activeObjectId = null;
		activeArrayId = null;
		activeLogId = null;
		activeActionId = null;
		newAction = false;
	};

	// Get name of variable with the given ID
	const getVariableName = (id: number) => {
		const variable = $snapshot.find((v) => v.id === id);
		return variable ? variable.name : '';
	};

	function activateBlock(block: Record<string, any>) {
		if (block.type === 'string') activeStringId = block.id;
		else if (block.type === 'number') activeNumberId = block.id;
		else if (block.type === 'boolean') activeBooleanId = block.id;
		else if (block.type === 'object') activeObjectId = block.id;
		else if (block.type === 'array') activeArrayId = block.id;
	}

	const resetEditor = () => {
		// Ask the user to confirm, then clear the snapshot
		// TODO: The default confirm modal could be replaced by a modal component
		// from Skeleton, or a Confirm button could appear in the editor, next
		// to the Reset button
		if (confirm('Are you sure you want to reset the editor?')) {
			// Check in the fetched lesson data if there is a
			// snapshot for the current lesson, and load it if it exists:
			console.log('check lesson data for snapshot', data);
			if (data.snapshot) {
				$snapshot = data.snapshot;
			} else $snapshot = [];
			// Toggle the flag to reset the Matter.js simulation
			resetMatterFlag.update((flag) => (flag = true));
		}
	};

	const userSnapshotAvailable = writable(false); // Store to track if a snapshot exists

	const fetchUserSnapshot = async () => {
		if ($user) {
			const { data: userSnapshotData, error } = await supabase
				.from('snapshots')
				.select('snapshot_data')
				.eq('user_id', $user.id)
				.eq('lesson_slug', lessonSlug);

			if (error) {
				console.error('Error fetching snapshot:', error);
			} else if (userSnapshotData && userSnapshotData.length > 0) {
				userSnapshot.set(userSnapshotData[0].snapshot_data); // Load the snapshot data
				userSnapshotAvailable.set(true); // Set flag to indicate snapshot availability
			} else {
				userSnapshotAvailable.set(false); // No snapshot available
			}
		}
	};

	async function loadUserSnapshot() {
		if ($user && $userSnapshotAvailable) {
			//$snapshot = $userSnapshot; // Set current editor state to the snapshot data
			snapshot.set($userSnapshot); // Set current editor state to the snapshot data
		}
	}

	async function saveUserSnapshot() {
		if ($user && $snapshot) {
			const { error } = await supabase.from('snapshots').upsert(
				{
					user_id: $user.id,
					lesson_slug: lessonSlug,
					snapshot_data: $snapshot,
				},
				{ onConflict: 'user_id,lesson_slug' },
			);
			if (error) console.error('Error saving snapshot:', error);
			else console.log('Snapshot saved successfully');
			// Fetch the user snapshot data again
			fetchUserSnapshot();
		}
	}
</script>

<div class="min-h-[320px] md:min-h-[360px] lg:min-h-[400px] flex flex-col justify-start gap-4">
	<div class="flex flex-col items-start gap-2">
		<!--- Loop through each object in snapshot -->
		{#if $snapshot.length > 0}
			{#each $snapshot as block (block.id)}
				<!-- Variable block -->
				{#if block.blockType === 'variable'}
					<VariableBlock {block} onActivate={() => activateBlock(block)} showActionButton={true} />
				{/if}
				<!-- Log block -->
				{#if block.blockType === 'log'}
					<button
						on:click={() => {
							activeLogId = block.id;
						}}
						type="button"
					>
						<div class="p-1 flex border border-secondary-900 text-sm font-normal">
							<div class="flex gap-2 font-bold text-sm items-center px-2 py-1">
								<FontAwesomeIcon icon={faEye} /> Log
							</div>

							{#if block.message}
								<div class="px-2 py-1 flex gap-2 items-center border-l-[1px] border-secondary-900">
									{`"${block.message}"`}
								</div>
							{/if}
							{#if block.selectedId}
								<div class="px-2 py-1 flex gap-2 items-center border-l-[1px] border-secondary-900">
									<span class="badge variant-filled text-md font-bold rounded-none"
										>{getVariableName(block.selectedId)}</span
									>
								</div>
							{/if}
							{#if block.useIndex}
								<div class="px-2 py-1 flex gap-2 items-center border-l-[1px] border-secondary-900">
									{block.useIndex ? `index: ${block.selectedIndex}` : ``}
								</div>{/if}
							{#if block.useKey}
								<div class="px-2 py-1 flex gap-2 items-center border-l-[1px] border-secondary-900">
									{block.useKey ? `key: ${block.selectedKey}` : ``}
								</div>
							{/if}
						</div>
					</button>
				{/if}
				<!-- Action block -->
				{#if block.blockType === 'action'}
					<button
						on:click={() => {
							activeActionId = block.id;
						}}
						type="button"
					>
						<div class="p-1 flex border border-secondary-900 text-sm font-normal">
							<div class="flex gap-2 font-bold text-sm items-center px-2 py-1">
								<FontAwesomeIcon icon={faBolt} />
								<!-- {block.action.charAt(0).toUpperCase() + block.action.slice(1)} -->
								{block.action}
							</div>
							<div class="px-2 py-1 flex gap-2 items-center border-l-[1px] border-secondary-900">
								<span class="badge variant-filled text-md font-bold rounded-none">
									{getVariableName(block.variableId)}
								</span>
							</div>
						</div>
					</button>
				{/if}
			{/each}
		{/if}
	</div>

	<!-- Modals for Editing Variables -->
	{#if activeStringId !== null}
		<StringModal
			editMode={true}
			isOpen={activeStringId !== null}
			variableId={activeStringId}
			on:close={handleClose}
		/>
	{/if}

	{#if activeNumberId !== null}
		<NumberModal
			editMode={true}
			isOpen={activeNumberId !== null}
			variableId={activeNumberId}
			on:close={handleClose}
		/>
	{/if}

	{#if activeBooleanId !== null}
		<BooleanModal
			editMode={true}
			isOpen={activeBooleanId !== null}
			variableId={activeBooleanId}
			on:close={handleClose}
		/>
	{/if}

	{#if activeObjectId !== null}
		<ObjectModal
			editMode={true}
			isOpen={activeObjectId !== null}
			variableId={activeObjectId}
			on:close={handleClose}
		/>
	{/if}

	{#if activeArrayId !== null}
		<ArrayModal
			editMode={true}
			isOpen={activeArrayId !== null}
			variableId={activeArrayId}
			on:close={handleClose}
		/>
	{/if}

	{#if activeLogId !== null}
		<LogModal
			editMode={true}
			isOpen={activeLogId !== null}
			variableId={activeLogId}
			on:close={handleClose}
		/>
	{/if}

	{#if activeActionId !== null}
		<ActionModal
			editMode={true}
			isOpen={activeActionId !== null}
			variableId={null}
			actionId={activeActionId}
			on:close={handleClose}
		/>
	{/if}

	{#if newAction}
		<ActionModal
			editMode={false}
			isOpen={newAction}
			variableId={null}
			actionId={null}
			on:close={handleClose}
		/>
	{/if}

	<!-- In the following section, the user can choose to create a new variable,
	 a new console log, etc -->
	<section class="flex flex-col gap-2 items-start">
		<div>
			<NewVariable />
		</div>
		<div>
			<NewLog />
		</div>
		<div>
			<button
				on:click={() => {
					newAction = true;
				}}
				type="button"
				class="btn btn-sm bg-primary-900 flex gap-2"
			>
				<FontAwesomeIcon icon={faPlus} /> Action
			</button>
		</div>

		<div class="w-full flex justify-between">
			<div class="flex items-center">
				{#if $user}
					<!-- Conditionally show "Take Snapshot" button if there is any code in the editor -->
					{#if $snapshot.length > 0}
						<button type="button" class="btn-icon text-2xl" on:click={() => saveUserSnapshot()}>
							<FontAwesomeIcon icon={faCameraRetro} />
							<span class="sr-only">Take Snapshot</span>
						</button>
					{/if}

					<!-- Conditionally show "Load Snapshot" button if a user snapshot exists -->
					{#if $userSnapshotAvailable}
						<button type="button" class="btn-icon text-lg" on:click={() => loadUserSnapshot()}>
							<FontAwesomeIcon icon={faImage} />
							<span class="sr-only">Load Snapshot</span>
						</button>
					{/if}
				{/if}
			</div>

			{#if $snapshot.length > 0}
				<button on:click={resetEditor} type="button" class="btn">Reset Editor</button>
			{/if}
		</div>
	</section>
</div>
