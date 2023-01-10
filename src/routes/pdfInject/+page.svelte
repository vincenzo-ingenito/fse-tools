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
	<div class="relative rounded-md shadow-sm">
		<input
			type="file"
			accept="*/*"
			on:change={handleFileInput}
			class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
		/>
		<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
			<span class="text-gray-500 sm:text-sm sm:leading-5">
				{fileName || 'Choose a file...'}
			</span>
		</div>
	</div>

	<div class="mt-5">
		<button class="btn py-2 px-4 rounded-lg" on:click={handleUpload}> Upload </button>
		<button class="btn-secondary ml-3 py-2 px-4 rounded-lg" on:click={handleCancel}> Cancel </button>
	</div>
</div>

<style>
	.btn {
		@apply text-white bg-blue-500;
	}

	.btn-secondary {
		@apply text-blue-700 bg-white;
	}
</style>
