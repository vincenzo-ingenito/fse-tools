<script>
    
	let url = 'http://localhost:8010/v1/documents/validation';

	let selectedOption = 'LDO';
	const options = [
		{ value: 'LAB', text: 'LAB' },
		{ value: 'RAD', text: 'RAD' },
		{ value: 'PSS', text: 'PSS' },
		{ value: 'LDO', text: 'LDO' },
		{ value: 'RSA', text: 'RSA' },
		{ value: 'CERT_VACC', text: 'CERT_VACC' },
		{ value: 'SIN_VACC', text: 'SIN_VACC' },
		{ value: 'VPS', text: 'VPS' }
	];

	let workflowInstanceId = '';
	let isLoading = false;
	async function handleSubmit() {
		isLoading = true;
		const response = await fetch(
			'http://localhost:9080/v1/validate?tipoDocumentoEnum=' + selectedOption + '&url=' + url,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		let apiResponse = await response.text();
		let deserializedJson = JSON.parse(apiResponse);
		workflowInstanceId = deserializedJson.workflowInstanceId;
		isLoading = false;
	}
 
</script>


	{#if isLoading}
		<div
			class="overflow-hidden w-screen h-screen  absolute bg-gray-800/40 p-0 z-50 grid place-content-center items-center content-center"
		>
			<div class="spin">
				<div />
				<div />
				<div />
				<div />
			</div>
		</div>
	{/if}
	<div class="prose m-auto p-4 pt-20 w-full">
		<h1 class="py-4 prose">VALIDAZIONE</h1>
		<div>
			<form on:submit|preventDefault={handleSubmit} class="rounded-lg shadow-md p-4">
				<label class="block mb-2">
					Tipo Documento:
					<select
						bind:value={selectedOption}
						class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300"
					>
						{#each options as { value, text }}
							<option {value}>{text}</option>
						{/each}
					</select>
				</label>

				<br />
				<label class="block mb-2">
					Url:
					<input
						type="text"
						bind:value={url}
						class="w-full py-2 px-4 mb-4   rounded-md border border-gray-300"
					/>
				</label>
				<br />
				<button type="submit" class="w-full py-2 px-4 mb-4    rounded-md bg-green-500 text-white"
					>Submit</button
				>
			</form>
		</div>
		<h1 class="prose py-4">WORKFLOW INSTANCE ID</h1>
		<div class="grid grid-cols-2">
			<input
				type="text"
				bind:value={workflowInstanceId}
				class="h-10 border-2 border-gray-300 rounded-md py-2 px-4 block w-full leading-5"
			/>
		</div>
	</div>