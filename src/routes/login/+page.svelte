<script lang="ts">
	import { login } from '$lib/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let errorMsg = '';

	async function handleLogin() {
		const error = await login(email, password);
		if (error) {
			errorMsg = error.message;
		} else {
			goto('/dashboard');
		}
	}
</script>

<div class="h-full w-full flex justify-center">
	<div class="card mt-12">
		<header class="card-header">
			<h2 class="h2">Login</h2>
		</header>
		<hr class="opacity-50 mt-2" />
		<section class="p-4">
			<form on:submit|preventDefault={handleLogin} class="flex flex-col gap-4">
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
				<button type="submit">Login</button>
				<p>{errorMsg}</p>
			</form>
		</section>
	</div>
</div>
