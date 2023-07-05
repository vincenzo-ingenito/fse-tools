<script>
	/**
	 * @type {any[]}
	 */
	let files = [];
	let selectedFile = '';
	let fileContent = '';
	let expandedNodes = {};

	async function fetchFiles(path) {
		try {
			const response = await fetch(
				`https://api.github.com/repos/ministero-salute/it-fse-catalogs/contents/${path}`
			);
			const data = await response.json();
			// Remove files having name: LOINC_short_license.txt, README.md, UCUM_short_license.txt, container, mongo-dump
			files = data
				.filter(
					(/** @type {{ name: string; }} */ item) =>
						![
							'LOINC_short_license.txt',
							'README.md',
							'UCUM_short_license.txt',
							'container',
							'mongo-dump'
						].includes(item.name)
				)
				.map((/** @type {{ name: any; type: any; path: any; }} */ item) => ({
					name: item.name,
					type: item.type,
					path: item.path
				}));
		} catch (error) {
			console.error('Errore durante il recupero dei file:', error);
		}
	}

	/**
	 * @param {string} path
	 */
	async function fetchFileContent(path) {
		try {
			const response = await fetch(
				`https://raw.githubusercontent.com/ministero-salute/it-fse-catalogs/main/${path}`
			);
			fileContent = await response.text();
			selectedFile = path;
		} catch (error) {
			console.error('Errore durante il recupero del contenuto del file:', error);
		}
	}

	function clearFileContent() {
		fileContent = '';
		selectedFile = '';
	}

	function toggleNode(node) {
		expandedNodes[node.path] = !expandedNodes[node.path];
		if (!expandedNodes[node.path]) {
			clearFileContent();
		}
	}

	function isNodeExpanded(node) {
		return expandedNodes[node.path];
	}

	async function handleNodeClick(node) {
		if (node.type === 'dir') {
			toggleNode(node);
			if (isNodeExpanded(node)) {
				await fetchFiles(node.path);
			}
		} else {
			fetchFileContent(node.path);
		}
	}

	fetchFiles('');
</script>

<main class="p-4">
	<div class="p-3 flex flex-col md:flex-row gap-4 mt-16 overflow-hidden justify-between">
		<div class="prose font-mono">
			<table>
				<thead>
					<tr>
						<th>Configuration Items</th>
					</tr>
				</thead>
				<tbody>
					{#each files as file}
						{#if file.type === 'dir'}
							<tr class="hover:bg-gray-100 hover:cursor-pointer">
								<td>
									<strong
										on:click={() => handleNodeClick(file)}
										on:keydown={(event) => {
											if (event.key === 'Enter') {
												handleNodeClick(file);
											}
										}}
									>
										{isNodeExpanded(file) ? '-' : '+'}
										{file.name}
									</strong>
								</td>
							</tr>
							{#if isNodeExpanded(file)}
								{#each files.filter((subFile) => subFile.path.startsWith(file.path + '/') && subFile.path !== file.path) as subFile}
									<tr
										class="hover:bg-gray-100 hover:cursor-pointer"
										on:click={() => handleNodeClick(subFile)}
									>
										<td>{subFile.name}</td>
									</tr>
								{/each}
								<!-- Button to go up a level -->
								<tr
									class="hover:bg-gray-100 hover:cursor-pointer"
									on:click={() => handleNodeClick(file)}
								>
									<td>..</td>
								</tr>
							{/if}
						{:else}
							<tr
								class="hover:bg-gray-100 hover:cursor-pointer"
								on:click={() => handleNodeClick(file)}
							>
								<td>{file.name}</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>

		{#if selectedFile}
			<div class="prose">
				<h2>{selectedFile}</h2>
				<pre
					class="border-2 shadow-sm scroll-auto overflow-auto p-4 max-h-28 md:max-h-96 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">{fileContent}</pre>
			</div>
		{/if}
	</div>
</main>

<style>
</style>
