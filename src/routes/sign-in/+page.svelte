<script lang="ts">
	import { signIn } from '$lib/auth';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let errorMsg = '';

	async function handleSignIn() {
		const error = await signIn(email, password);
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
			<h2 class="h2">Sign In</h2>
		</header>
		<hr class="opacity-50 mt-2" />
		<section class="p-4">
			<form on:submit|preventDefault={handleSignIn} class="flex flex-col gap-4 items-start">
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
				<button type="submit" class="btn bg-primary-700">Sign In</button>
				<p>{errorMsg}</p>
			</form>
			<p>
				Don't have an account? <a href="/register" class="anchor">Register</a>
			</p>
		</section>
	</div>
</div>
