<script>
	let file;
	let fileName = '';
	let data;

	const handleFileInput = (event) => {
		file = event.target.files[0];
		fileName = file.name;
	};

	const removeExtension = (fileName) => {
		return fileName.replace(/\.[^/.]+$/, '');
	};

	const handleUpload = async () => {
		const formData = new FormData();
		formData.append('cda', file);

		try {
			const response = await fetch('http://localhost:9080/v1/injectPdf', {
				method: 'POST',
				body: formData
			});
			data = await response.arrayBuffer();
			const fileBlob = new Blob([data], { type: 'application/pdf' });
			const link = document.createElement('a');
			link.href = window.URL.createObjectURL(fileBlob);
			link.download = removeExtension(fileName) + '.pdf';

			document.body.appendChild(link);
			link.click();
			link.remove();
			console.log('DATA' + data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleCancel = () => {
		file = null;
		fileName = '';
		const input = document.querySelector('input[type="file"]');
		input.value = '';
	};
</script>

<div class="pt-32">
	<div class="grid p-4 items-center text-center place-content-center content-center">
		<div class="rounded-md shadow-sm bg-gray-300">
			<input
				type="file"
				accept="*/*"
				on:change={handleFileInput}
				class="p-6 rounded-lg font-bold font-mono"
			/>
		</div>
	</div>
	<div class="p-4 text-center grid place-content-center content-center grid-flow-col gap-2">
		<button
			class="rounded-md bg-green-500 text-white font-mono hover:bg-green-600 h-10 w-20"
			on:click={handleUpload}
		>
			Upload
		</button>
		<button class="w-auto h-auto hover:text-red-500 text-end" on:click={handleCancel}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><polyline points="3 6 5 6 21 6" /><path
					d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
				/><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg
			>
		</button>
	</div>
</div>
