<script lang="ts">
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	import Modal from '../components/Modal.svelte';
	let showModal = false;

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}
</script>

<!-- Button to open the modal -->
<button on:click={openModal} class="btn btn-sm bg-secondary-900 flex gap-2"
	><FontAwesomeIcon icon={faPlus} /> Variable</button
>
<!-- Modal Component -->
<Modal header="New Variable" isOpen={showModal} on:close={closeModal}>
	<label class="label">
		<span>Name</span>
		<input class="input" type="text" placeholder="Name" />
	</label>

	<label class="label">
		<span>Data type</span>
		<select class="select">
			<option value="1">Text</option>
			<option value="2">Number</option>
			<option value="3">Color</option>
		</select>
	</label>

	<label class="label">
		<span>Value</span>
		<input class="input" type="text" placeholder="Value" />
	</label>
</Modal>
