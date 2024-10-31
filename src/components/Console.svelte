<script lang="ts">
	import type { ConsoleData } from '$lib/types';
	import { isRunning } from '$lib/stores/store';
	import { snapshot } from '$lib/stores/snapshots';

	import {
		formatArray,
		formatObject,
		formatObjectSummary,
		formatValue,
	} from '$lib/utils/logFormat';

	export let data: ConsoleData | null;

	$: _isRunning = $isRunning;
	$: _snapshot = $snapshot;

	// Function to retrieve and return any selected variable from snapshot
	const getVariableToLog = (selectedId: number): Record<string, any> => {
		return _snapshot.find((v) => v.id === selectedId);
	};
</script>

<div class="rounded-md bg-slate-800 p-4 flex flex-col gap-2">
	{#if _isRunning && data}
		{#each _snapshot as block}
			{#if block.blockType === 'log'}
				<p>
					<code>
						{#if block.message && block.message !== ''}
							{block.message}
						{/if}
						{#if block.selectedId && block.selectedType !== 'array' && block.selectedType !== 'object'}
							<!-- Selected variable is string, number, boolean -->
							{@html formatValue(getVariableToLog(block.selectedId).value)}
						{:else if block.selectedId && block.selectedType === 'array' && block.useIndex}
							<!-- Selected variable is array with index -->
							{@html formatValue(getVariableToLog(block.selectedId).value[block.selectedIndex])}
						{:else if block.selectedId && block.selectedType === 'object' && block.useKey}
							<!-- Selected variable is object with key -->
							{@html formatValue(getVariableToLog(block.selectedId).value[block.selectedKey])}
						{/if}
					</code>
				</p>
				{#if block.selectedId && block.selectedType === 'array' && !block.useIndex}
					<!-- Selected variable is array without index -->
					<details>
						<summary
							><code>{@html formatArray(getVariableToLog(block.selectedId).value).summary}</code
							></summary
						>
						<pre><code>{@html formatArray(getVariableToLog(block.selectedId).value).details}</code
							></pre>
					</details>
				{/if}
				{#if block.selectedId && block.selectedType === 'object' && !block.useKey}
					<!-- Selected variable is object without key -->
					<details>
						<summary>
							<code>{@html formatObjectSummary(getVariableToLog(block.selectedId).value)}</code>
						</summary>
						<pre><code>{@html formatObject(getVariableToLog(block.selectedId).value)}</code></pre>
					</details>
				{/if}
				<hr class="opacity-50" />
			{/if}
		{/each}
	{/if}
</div>
