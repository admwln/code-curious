<script lang="ts">
	import type { ConsoleData } from '$lib/types';
	// import { isRunning } from '$lib/stores/store';
	import { snapshot } from '$lib/stores/snapshots';
	import { clearConsole, consoleOutput } from '$lib/utils/consoleActions';

	import {
		formatArray,
		formatObject,
		formatObjectSummary,
		formatValue,
	} from '$lib/utils/logFormat';

	export let data: ConsoleData | null;

	// Function to retrieve and return any selected variable from snapshot
	const getVariableToLog = (selectedId: number): Record<string, any> => {
		return $snapshot.find((v) => v.id === selectedId);
	};
</script>

<div class="rounded-md bg-slate-800 p-4 flex flex-col gap-2">
	{#each $consoleOutput as log}
		<p>
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
			<details>
				<summary
					><code>{@html formatArray(getVariableToLog(log.selectedId).value).summary}</code></summary
				>
				<pre><code>{@html formatArray(getVariableToLog(log.selectedId).value).details}</code></pre>
			</details>
		{/if}
		{#if log.selectedId && log.selectedType === 'object' && !log.useKey}
			<!-- Selected variable is object without key -->
			<details>
				<summary>
					<code>{@html formatObjectSummary(getVariableToLog(log.selectedId).value)}</code>
				</summary>
				<pre><code>{@html formatObject(getVariableToLog(log.selectedId).value)}</code></pre>
			</details>
		{/if}
		<hr class="opacity-50" />
	{/each}
	{#if $consoleOutput.length > 0}
		<div class="flex justify-end">
			<button class="btn" on:click={clearConsole}>Clear Console</button>
		</div>
	{/if}
</div>
