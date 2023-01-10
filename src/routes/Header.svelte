<script>
	import { createEventDispatcher, onMount } from 'svelte';
	let mobileMenuOpen = false;
	let headerClasses = 'bg-gray-900 md:fixed z-50 w-full top-0';
	// Hide header on scroll down
	let prevScrollpos = 0;
	const handleScroll = () => {
		let currentScrollPos = window.pageYOffset;
		if (prevScrollpos > currentScrollPos) {
			headerClasses =
				'bg-gray-900 md:fixed z-50 w-full top-0 shadow-2xl transition duration-500 ease-in-out transform md:translate-y-0';
		} else {
			headerClasses =
				'bg-gray-900 md:fixed z-50 w-full top-0 shadow-2xl transition duration-500 ease-in-out transform md:-translate-y-full';
		}
		// If is at top, remove shadow
		if (currentScrollPos === 0) {
			headerClasses = 'bg-gray-900 md:fixed z-50 w-full top-0';
		}
		prevScrollpos = currentScrollPos;
	};
	onMount(() => {
		window.addEventListener('scroll', handleScroll);
	});
	const handleMobileMenuOpen = () => {
		mobileMenuOpen = !mobileMenuOpen;
		dispatch('menu-open', mobileMenuOpen);
	};
	const handleMobileMenuClose = () => {
		mobileMenuOpen = false;
		dispatch('menu-open', mobileMenuOpen);
	};
	const dispatch = createEventDispatcher();
</script>

<header class={headerClasses}>
	<div class="flex justify-end items-center w-full h-20">
		<nav>
			<ul class="gap-2 hidden md:flex mr-10" aria-label="Navigation">
                <li>
					<div class="item">
						<p class="text-amber-300">01.</p>
						<a href="/pdfInject" class="text-white hover:text-amber-300">Pdf Inject</a>
					</div>
				</li>
				<li>
					<div class="item">
						<p class="text-amber-300">02.</p>
						<a href="/jwtGenerator" class="text-white hover:text-amber-300">Jwt Generation</a>
					</div>
				</li>
				<li>
					<div class="item">
						<p class="text-amber-300">03.</p>
						<a href="/validate" class="text-white hover:text-amber-300">Validation</a>
					</div>
				</li>
			</ul>
		</nav>
		<div class="md:hidden absolute">
			{#if !mobileMenuOpen}
				<button
					class="flex items-center rounded top-0 right-0 text-amber-300"
					on:click={handleMobileMenuOpen}
				>
					<svg
						class="w-12 h-12"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/></svg
					>
				</button>
			{/if}
		</div>
	</div>
	{#if mobileMenuOpen}
		<div class="bg-gray-600/75 w-3/4 absolute h-full top-0 right-0 shadow-2xl z-50">
			<div class="flex flex-row-reverse">
				<button
					class="items-center px-3 py-8 rounded text-amber-300"
					on:click={handleMobileMenuClose}
				>
					<svg
						class="w-12 h-12"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/></svg
					>
				</button>
			</div>
			<nav>
				<ul class="gap-2 flex mr-10 flex-col p-4" aria-label="Navigation">
					<li>
						<div class="item">
							<p class="text-amber-300">01.</p>
							<a
								href="/validate"
								class="text-white hover:text-amber-300"
								on:click={handleMobileMenuClose}>validate</a
							>
						</div>
					</li>
					<li>
						<div class="item">
							<p class="text-amber-300">02.</p>
							<a
								href="/jwtGenerator"
								class="text-white hover:text-amber-300"
								on:click={handleMobileMenuClose}>jwtGenerator</a
							>
						</div>
					</li>
					<li>
						<div class="item">
							<p class="text-amber-300">03.</p>
							<a
								href="/pdfInject"
								class="text-white hover:text-amber-300"
								on:click={handleMobileMenuClose}>pdfInject</a
							>
						</div>
					</li>
				</ul>
			</nav>
		</div>
	{/if}
</header>

<style>
	.item {
		@apply flex items-center px-3 py-2 text-xl font-mono gap-1;
	}
</style>
