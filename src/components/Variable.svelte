<script lang="ts">
	import type { VariableType } from '$lib/types';

	import { faPencil } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	// Props, data holds the variable object
	export let data: VariableType;
</script>

<div class="flex rounded-full border border-secondary-900 text-sm">
	<div class="bg-secondary-900 rounded-l-full px-2 py-1">{data.name}</div>
	<button type="button" class="btn btn-sm">{data.value}</button>
</div>
