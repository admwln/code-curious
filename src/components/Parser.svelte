<script lang="ts">
	import { faBolt, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import VariableBlock from './VariableBlock.svelte';

	// Expose the data prop to receive the data from the parent +page.svelte
	export let placeholder: string[];
</script>

{#if placeholder[0] === 'StringModal'}
	<div class="flex flex-col items-start my-4">
		<div class="card p-4 flex flex-col items-start gap-2">
			<label class="label">
				<span>Name</span>
				<input
					class="input"
					type="text"
					value={placeholder[1]}
					name="name"
					autocomplete="off"
					disabled
				/>
			</label>
			<label class="label">
				<span>Value</span>
				<input
					class="input"
					type="text"
					value={placeholder[2]}
					name="value"
					autocomplete="off"
					disabled
				/>
			</label>
		</div>
	</div>
{:else if placeholder[0] === 'VariableButton'}
	<button class="btn btn-sm bg-primary-900 flex gap-2"
		><FontAwesomeIcon icon={faPlus} /> Variable</button
	>
{:else if placeholder[0] === 'VariableBlock'}
	<div class="px-4 flex items-start">
		{#if !placeholder[3]}
			<VariableBlock
				block={{ blockType: 'variable', name: placeholder[1], value: placeholder[2] }}
				showActionButton={false}
				onActivate={() => {}}
			/>
		{:else if placeholder[3] === 'action'}
			<VariableBlock
				block={{ blockType: 'variable', name: placeholder[1], value: placeholder[2] }}
				showActionButton={true}
				onActivate={() => {}}
			/>
		{/if}
	</div>
{:else if placeholder[0] === 'LogBlock'}
	<div class="px-4 flex items-start">
		<div class="p-1 flex border border-secondary-900 text-sm font-normal">
			<div class="flex gap-2 font-bold text-sm items-center px-2 py-1">
				<FontAwesomeIcon icon={faEye} /> Log
			</div>

			{#if placeholder[1]}
				<div class="px-2 py-1 flex gap-2 items-center border-l-[1px] border-secondary-900">
					{`"${placeholder[1]}"`}
				</div>
			{/if}
			{#if placeholder[2]}
				<div class="px-2 py-1 flex gap-2 items-center border-l-[1px] border-secondary-900">
					<span class="badge variant-filled text-md font-bold rounded-none">{placeholder[2]}</span>
				</div>
			{/if}
			{#if placeholder[3]}
				<div class="px-2 py-1 flex gap-2 items-center border-l-[1px] border-secondary-900">
					{`index: ${placeholder[3]}`}
				</div>{/if}
			{#if placeholder[4]}
				<div class="px-2 py-1 flex gap-2 items-center border-l-[1px] border-secondary-900">
					{`key: ${placeholder[4]}`}
				</div>
			{/if}
		</div>
	</div>
{:else if placeholder[0] === 'ActionBlock'}
	<div class="px-4 flex items-start">
		<div class="p-1 flex border border-secondary-900 text-sm font-normal">
			<div class="flex gap-2 font-bold text-sm items-center px-2 py-1">
				<FontAwesomeIcon icon={faBolt} />
				{placeholder[1]}
			</div>
			<div class="px-2 py-1 flex gap-2 items-center border-l-[1px] border-secondary-900">
				<span class="badge variant-filled text-md font-bold rounded-none">
					{placeholder[2]}
				</span>
			</div>
		</div>
	</div>{/if}
