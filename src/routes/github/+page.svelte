<script>
	let files = [];
	let selectedFile = '';
	let fileContent = '';
	let expandedNodes = {};
  
	async function fetchFiles(path) {
	  try {
		const response = await fetch(`https://api.github.com/repos/ministero-salute/it-fse-catalogs/contents/${path}`);
		const data = await response.json();
		files = data.map(item => ({
		  name: item.name,
		  type: item.type,
		  path: item.path
		}));
	  } catch (error) {
		console.error('Errore durante il recupero dei file:', error);
	  }
	}
  
	async function fetchFileContent(path) {
	  try {
		const response = await fetch(`https://raw.githubusercontent.com/ministero-salute/it-fse-catalogs/main/${path}`);
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
  
  <main>
	<div class="container">
	  <div class="sidebar">
		<h1>Elenco dei file nella cartella</h1>
		<table>
		  <thead>
			<tr>
			  <th>Nome File</th>
			</tr>
		  </thead>
		  <tbody>
			{#each files as file}
			  {#if file.type === 'dir'}
				<tr>
				  <td>
					<strong on:click={() => handleNodeClick(file)}>
					  {isNodeExpanded(file) ? '-' : '+'} {file.name}
					</strong>
				  </td>
				</tr>
				{#if isNodeExpanded(file)}
				  {#each files.filter(subFile => subFile.path.startsWith(file.path + '/') && subFile.path !== file.path) as subFile}
					<tr on:click={() => handleNodeClick(subFile)}>
					  <td>{subFile.name}</td>
					</tr>
				  {/each}
				{/if}
			  {:else}
				<tr on:click={() => handleNodeClick(file)}>
				  <td>{file.name}</td>
				</tr>
			  {/if}
			{/each}
		  </tbody>
		</table>
	  </div>
	  <div class="content">
		{#if selectedFile}
		  <div>
			<h2>Contenuto del file "{selectedFile}"</h2>
			<pre>{fileContent}</pre>
			<button on:click={clearFileContent}>Chiudi</button>
		  </div>
		{/if}
	  </div>
	</div>
  </main>
  
  <style>
	.container {
	  display: flex;
	  align-items: flex-start; /* Allinea gli elementi in alto */
	}
  
	.sidebar {
	  flex: 1;
	  margin-right: 1rem;
	  order: 1; /* Modifica l'ordine degli elementi nella visualizzazione */
	}
  
	.content {
	  flex: 2;
	  order: 2; /* Modifica l'ordine degli elementi nella visualizzazione */
	}
  
	/* Stili CSS per la visualizzazione */
	main {
	  margin: 1rem;
	}
  
	h1 {
	  margin-bottom: 0.5rem;
	}
  
	table {
	  border-collapse: collapse;
	  width: 100%;
	}
  
	th,
	td {
	  border: 1px solid #ddd;
	  padding: 8px;
	}
  
	tr:nth-child(even) {
	  background-color: #f2f2f2;
	}
  
	tr:hover {
	  background-color: #ddd;
	  cursor: pointer;
	}
  
	h2 {
	  margin-bottom: 0.5rem;
	}
  
	pre {
	  white-space: pre-wrap;
	}
  </style>
  