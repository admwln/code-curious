<script lang="ts">
	import { snapshot } from '$lib/stores/snapshots';
	import { clearConsole, consoleOutput } from '$lib/utils/consoleActions';
	import { fade } from 'svelte/transition';

	import {
		formatArray,
		formatObject,
		formatObjectSummary,
		formatValue,
	} from '$lib/utils/logFormat';

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
	<div
		bind:this={consoleContainer}
		class="rounded-md bg-slate-800 p-4 flex flex-col gap-2 mb-[64px]"
	>
		{#each $consoleOutput as log}
			<p>
				<code>
					{#if log.message && log.message !== ''}
						{log.message}
					{/if}
					<!-- Selected variable is string, number, boolean: -->
					{#if log.selectedId && log.selectedType !== 'array' && log.selectedType !== 'object'}
						{@html formatValue(getVariableToLog(log.selectedId).value)}

						<!-- Selected variable is array of objects with index and key: -->
					{:else if log.selectedId && log.selectedType === 'array' && log.useIndex && log.useKey && log.selectedIndex !== null && log.selectedKey !== null}
						{@html formatValue(
							getVariableToLog(log.selectedId).value[log.selectedIndex][log.selectedKey],
						)}

						<!-- Selected variable is array with index: -->
					{:else if log.selectedId && log.selectedType === 'array' && log.useIndex && !log.useKey && log.selectedIndex !== null}
						<!-- Check that the item is not an object -->
						{#if typeof getVariableToLog(log.selectedId).value[log.selectedIndex] !== 'object'}
							{@html formatValue(getVariableToLog(log.selectedId).value[log.selectedIndex])}
						{/if}
						<!-- Selected variable is object with key: -->
					{:else if log.selectedId && log.selectedType === 'object' && log.useKey && log.selectedKey !== null}
						{@html formatValue(getVariableToLog(log.selectedId).value[log.selectedKey])}
					{/if}
				</code>
			</p>
			{#if log.selectedId && log.selectedType === 'array' && !log.useIndex}
				<!-- Selected variable is array without index -->
				<details>
					<summary
						><code>{@html formatArray(getVariableToLog(log.selectedId).value).summary}</code
						></summary
					>
					<pre><code>{@html formatArray(getVariableToLog(log.selectedId).value).details}</code
						></pre>
				</details>
			{/if}
			<!-- Selected variable is object without key: -->
			{#if log.selectedId && log.selectedType === 'object' && !log.useKey}
				<details>
					<summary>
						<code>{@html formatObjectSummary(getVariableToLog(log.selectedId).value)}</code>
					</summary>
					<pre><code>{@html formatObject(getVariableToLog(log.selectedId).value)}</code></pre>
				</details>
			{/if}
			<!-- Selected variable is object in array with index, without key: -->
			{#if log.selectedId && log.selectedType === 'array' && log.useIndex && !log.useKey && log.selectedIndex !== null}
				<!-- Check that the item is an object -->
				{#if typeof getVariableToLog(log.selectedId).value[log.selectedIndex] === 'object'}
					<details>
						<summary>
							<code
								>{@html formatObjectSummary(
									getVariableToLog(log.selectedId).value[log.selectedIndex],
								)}</code
							>
						</summary>
						<pre><code
								>{@html formatObject(
									getVariableToLog(log.selectedId).value[log.selectedIndex],
								)}</code
							></pre>
					</details>
				{/if}
			{/if}
			<hr class="opacity-50" />
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
