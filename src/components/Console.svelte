<script lang="ts">
	import type { ConsoleData, VariableType } from '$lib/types';
	import { isRunning } from '$lib/stores/store';
	import { snapshot } from '$lib/stores/snapshots';

	export let data: ConsoleData | null;

	$: running = $isRunning;

	// Function to retrieve and return any selected variable from snapshot
	const getVariableToLog = (selectedId: number): Record<string, any> => {
		return $snapshot.find((v) => v.id === selectedId);
	};

	// Format an object to styled HTML content
	const formatObject = (obj: Record<string, any>): string => {
		return Object.entries(obj)
			.map(([key, value]) => {
				const colorKey = `<span style="color: lightblue;">${key}</span>`;
				let colorValue = formatValue(value);
				return `<div class="px-6">${colorKey}: ${colorValue}</div>`;
			})
			.join('');
	};

	// Generate a one-line summary for an object
	const formatObjectSummary = (obj: Record<string, any>): string => {
		const entries = Object.entries(obj);
		if (entries.length === 0) return '';

		const [firstKey, firstValue] = entries[0];
		const colorKey = `<span style="color: lightblue;">${firstKey}</span>`;
		const colorValue = formatValue(firstValue);

		return `&lcub;${colorKey}: ${colorValue}, ...&rcub;`;
	};

	// Helper to format individual values based on type
	const formatValue = (value: any): string => {
		if (typeof value === 'string') {
			return `<span style="color: lightgreen;">'${value}'</span>`;
		} else if (typeof value === 'number') {
			return `<span style="color: orange;">${value}</span>`;
		} else if (typeof value === 'boolean') {
			return `<span style="color: violet;">${value}</span>`;
		} else if (Array.isArray(value)) {
			return `<span style="color: lightblue;">Array(${value.length})</span>`;
		} else if (typeof value === 'object' && value !== null) {
			return formatObject(value);
		} else {
			return `<span>${value}</span>`;
		}
	};

	// Format an array for a summary and details view
	const formatArray = (arr: any[]): { summary: string; details: string } => {
		const summary = `(${arr.length}) ${arr
			.map((item, index) => {
				if (index === 0) {
					return formatObjectSummary(item);
				} else {
					return `&lcub;...&rcub;`;
				}
			})
			.join(', ')}`;

		const details = arr
			.map((item, index) => {
				const formattedValue = formatValue(item);
				//Check for object in array
				if (typeof item === 'object') {
					return `<div class="px-4">${index}: ${formatObject(item)}</div>`;
				}
				return `<div>${index}: ${formattedValue}</div>`;
			})
			.join('');
		return { summary, details };
	};
</script>

<div class="rounded-md bg-slate-800 p-4 flex flex-col gap-2">
	{#if running && data}
		{#each $snapshot as block}
			{#if block.blockType === 'log'}
				<p>
					<code>
						{#if block.message && block.message !== ''}
							{block.message}
						{/if}
						{#if block.selectedId && block.selectedType !== 'array' && block.selectedType !== 'object'}
							{getVariableToLog(block.selectedId).value}
						{/if}
					</code>
				</p>
				{#if block.selectedId && block.selectedType === 'array'}
					<details>
						<summary
							><code>{@html formatArray(getVariableToLog(block.selectedId).value).summary}</code
							></summary
						>
						<pre><code>{@html formatArray(getVariableToLog(block.selectedId).value).details}</code
							></pre>
					</details>
				{/if}
				{#if block.selectedId && block.selectedType === 'object'}
					<details>
						<summary>
							<code>{@html formatObjectSummary(getVariableToLog(block.selectedId).value)}</code>
						</summary>
						<pre><code>{@html formatObject(getVariableToLog(block.selectedId).value)}</code></pre>
					</details>
				{/if}
			{/if}
			<hr class="opacity-50" />
		{/each}
	{/if}
</div>
