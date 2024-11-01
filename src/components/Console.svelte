<script lang="ts">
	import type { ConsoleData } from '$lib/types';
	import { snapshot } from '$lib/stores/snapshots';
	import { isRunning } from '$lib/stores/store';
	import { clearConsole, consoleOutput } from '$lib/utils/consoleActions';
	import { fade } from 'svelte/transition';

	import {
		formatArray,
		formatObject,
		formatObjectSummary,
		formatValue,
	} from '$lib/utils/logFormat';

	//We probably don't need to pass from lesson data to the console
	export let data: ConsoleData | null;
	console.log('Console data', data);

	// Function to retrieve and return any selected variable from snapshot
	const getVariableToLog = (selectedId: number): Record<string, any> => {
		return $snapshot.find((v) => v.id === selectedId);
	};

	// Function to scroll the console container to the bottom
	let consoleScrollContainer: HTMLDivElement | null = null;
	let consoleContainer: HTMLDivElement | null = null;

	function scrollToBottom() {
		if (consoleScrollContainer) {
			consoleScrollContainer.scrollTop = consoleScrollContainer.scrollHeight;
		}
	}

	$: {
		if ($consoleOutput) {
			scrollToBottom();
		}
	}
</script>

<div bind:this={consoleScrollContainer} class="max-h-[240px] overflow-scroll">
	<div bind:this={consoleContainer} class="rounded-md bg-slate-800 p-4 flex flex-col gap-2 mb-8">
		{#each $consoleOutput as log}
			<p in:fade={{ duration: 300 }}>
				<code>
					{#if log.message && log.message !== ''}
						{log.message}
					{/if}
					{#if log.selectedId && log.selectedType !== 'array' && log.selectedType !== 'object'}
						<!-- Selected variable is string, number, boolean -->
						{@html formatValue(getVariableToLog(log.selectedId).value)}
					{:else if log.selectedId && log.selectedType === 'array' && log.useIndex && log.selectedIndex}
						<!-- Selected variable is array with index -->
						{@html formatValue(getVariableToLog(log.selectedId).value[log.selectedIndex])}
					{:else if log.selectedId && log.selectedType === 'object' && log.useKey && log.selectedKey}
						<!-- Selected variable is object with key -->
						{@html formatValue(getVariableToLog(log.selectedId).value[log.selectedKey])}
					{/if}
				</code>
			</p>
			{#if log.selectedId && log.selectedType === 'array' && !log.useIndex}
				<!-- Selected variable is array without index -->
				<details in:fade={{ duration: 300 }}>
					<summary
						><code>{@html formatArray(getVariableToLog(log.selectedId).value).summary}</code
						></summary
					>
					<pre><code>{@html formatArray(getVariableToLog(log.selectedId).value).details}</code
						></pre>
				</details>
			{/if}
			{#if log.selectedId && log.selectedType === 'object' && !log.useKey}
				<!-- Selected variable is object without key -->
				<details in:fade={{ duration: 300 }}>
					<summary>
						<code>{@html formatObjectSummary(getVariableToLog(log.selectedId).value)}</code>
					</summary>
					<pre><code>{@html formatObject(getVariableToLog(log.selectedId).value)}</code></pre>
				</details>
			{/if}
			<hr class="opacity-50" in:fade={{ duration: 300 }} />
		{/each}
		{#if $consoleOutput.length > 0}
			<div class="flex justify-end">
				<button in:fade={{ duration: 300 }} class="btn" on:click={clearConsole}
					>Clear Console</button
				>
			</div>
		{/if}
	</div>
</div>
