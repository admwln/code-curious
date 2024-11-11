<script lang="ts">
	import { register } from '$lib/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let errorMsg = '';

	async function handleRegister() {
		const error = await register(email, password);
		if (error) {
			errorMsg = error.message;
		} else {
			goto('/login');
		}
	}
</script>

<div class="h-full w-full flex justify-center">
	<div class="card mt-12">
		<header class="card-header">
			<h2 class="h2">Register</h2>
		</header>
		<hr class="opacity-50 mt-2" />
		<section class="p-4">
			<form on:submit|preventDefault={handleRegister} class="flex flex-col gap-4">
				<label class="label"
					><span>Email</span><input
						class="input"
						name="email"
						bind:value={email}
						type="email"
						autocomplete="email"
						required
					/></label
				>
				<label class="label"
					><span>Password</span><input
						class="input"
						name="password"
						bind:value={password}
						type="password"
						autocomplete="current-password"
						required
					/></label
				>
				<button type="submit">Register</button>
				<p>{errorMsg}</p>
			</form>
		</section>
	</div>
</div>
