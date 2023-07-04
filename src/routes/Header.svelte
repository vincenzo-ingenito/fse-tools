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
	<div class="w-full h-20">
		<nav>
			<div class="hidden md:grid grid-cols-6 items-center h-20">
				<div class="flex justify-start col-span-1">
					<ul class="hidden md:flex ml-5">
						<li>
							<div class="item">
								<a href="/" class="text-white hover:text-amber-300 font-extrabold">Home</a>
							</div>
						</li>
					</ul>
				</div>
				<div class="col-span-5 flex justify-end">
					<ul class="gap-2 md:flex mr-10" aria-label="Navigation">
						<li>
							<div class="item">
								<p class="text-amber-300">00.</p>
								<a href="/github" class="text-white hover:text-amber-300">Git</a>
							</div>
						</li>
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
					</ul>
				</div>
			</div>
		</nav>
		<div class="md:hidden absolute w-full flex flex-row-reverse right-5 top-3">
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
								href="/github"
								class="text-white hover:text-amber-300"
								on:click={handleMobileMenuClose}>github</a
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
