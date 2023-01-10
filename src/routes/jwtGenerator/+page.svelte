<script>
	let p12Alias = '';
	let p12PWD = '';
	let pdf;
	let fileNamePdf = '';
	let p12;
	let fileNameP12 = '';
	let pem;
	let fileNamePem = '';

	//DATA JSON START
	let sub = 'SSSMNN75B01F257L^^^&amp;2.16.840.1.113883.2.9.4.3.2&amp;ISO';
	let subject_role = 'AAS';
	let purpose_of_use = 'TREATMENT';
	let iss = 'S1#190201234567XX';
	let locality = '201123456';
	let subject_application_id = 'GTW';
	let subject_application_vendor = 'GATEWAY';
	let subject_application_version = 'R2';
	let subject_organization_id = '120';
	let subject_organization = 'Regione Lazio';
	let aud = 'https://modipa-val.fse.salute.gov.it/govway/rest/in/FSE/gateway/v1';
	let patient_consent = 'true';
	let jti;
	let action_id = '1234';
	let resource_hl7_type;
	let person_id;
	//DATA JSON END

	const handleFilePdf = (event) => {
		pdf = event.target.files[0];
		fileNamePdf = pdf.name;
	};
	const handleFileInputP12 = (event) => {
		p12 = event.target.files[0];
		fileNameP12 = p12.name;
	};
	const handleFileInputPem = (event) => {
		pem = event.target.files[0];
		fileNamePem = pem.name;
	};
	let bearer = '';
    let signature = '';
	let isLoading = false;
	async function handleSubmit() {
		const formData = new FormData();
		formData.append('pdf', pdf);
		formData.append('fileP12', p12);
		formData.append('filePEM', pem);
		formData.append(
			'request',
			JSON.stringify({
				sub,
				subject_role,
				purpose_of_use
				// other fields go here
			})
		);
		isLoading = true;
		const response = await fetch(
			'http://localhost:9080/v1/generateToken?p12Alias=' + p12Alias + '&p12PWD=' + p12PWD,
			{
				method: 'POST',
				body: formData
			}
		);

		let apiResponse = await response.text();
		let deserializedJson = JSON.parse(apiResponse);
        console.log(deserializedJson);
		bearer = deserializedJson.Bearer;
        signature = deserializedJson.Signature;
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
	<h1 class="py-4 prose">GENERAZIONE JWT</h1>
	<div>
		<form on:submit|preventDefault={handleSubmit} class="rounded-lg shadow-md p-4">
			<div class="grid grid-cols-1 gap-4">
				<label class="block mb-2">
					P12 Alias:
					<input
						type="text"
						bind:value={p12Alias}
						class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300"
					/>
				</label>
				<br />
				<label class="block mb-2">
					P12 Pwd:
					<input
						type="password"
						bind:value={p12PWD}
						class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300"
					/>
				</label>
			</div>
			<div class="grid grid-cols-3 gap-4">
				<label class="block mb-2">
					PDF
					<input
						type="file"
						accept="*/*"
						on:change={handleFilePdf}
						class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
					/>
				</label>
				<label class="block mb-2">
					P12
					<input
						type="file"
						accept="*/*"
						on:change={handleFileInputP12}
						class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
					/>
				</label>
				<label class="block mb-2">
					PEM
					<input
						type="file"
						accept="*/*"
						on:change={handleFileInputPem}
						class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
					/>
				</label>
			</div>
            <h4>DATA JSON</h4>
			<div class="grid grid-cols-4 gap-4">
				<label for="sub">sub</label>
				<input
					type="text"
					id="sub"
					bind:value={sub}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="subject_role">subject_role</label>
				<input
					type="text"
					id="subject_role"
					bind:value={subject_role}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="purpose_of_use">purpose_of_use</label>
				<input
					type="text"
					id="purpose_of_use"
					bind:value={purpose_of_use}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="iss">iss</label>
				<input
					type="text"
					id="iss"
					bind:value={iss}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="locality">locality</label>
				<input
					type="text"
					id="locality"
					bind:value={locality}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="subject_application_id">subject_application_id</label>
				<input
					type="text"
					id="subject_application_id"
					bind:value={subject_application_id}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="subject_application_vendor">subject_application_vendor</label>
				<input
					type="text"
					id="subject_application_vendor"
					bind:value={subject_application_vendor}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="subject_application_version">subject_application_version</label>
				<input
					type="text"
					id="subject_application_version"
					bind:value={subject_application_version}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="subject_organization_id">subject_organization_id</label>
				<input
					type="text"
					id="subject_organization_id"
					bind:value={subject_organization_id}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="subject_organization">subject_organization</label>
				<input
					type="text"
					id="subject_organization"
					bind:value={subject_organization}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="aud">aud</label>
				<input
					type="text"
					id="aud"
					bind:value={aud}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="patient_consent">patient_consent</label>
				<input
					type="text"
					id="patient_consent"
					bind:value={patient_consent}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="jti">jti</label>
				<input
					type="text"
					id="jti"
					bind:value={jti}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="action_id">action_id</label>
				<input
					type="text"
					id="action_id"
					bind:value={action_id}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="resource_hl7_type">resource_hl7_type</label>
				<input
					type="text"
					id="resource_hl7_type"
					bind:value={resource_hl7_type}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
				<label for="person_id">person_id</label>
				<input
					type="text"
					id="person_id"
					bind:value={person_id}
					class="form-input py-2 px-3 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
				/>
			</div>
			<button type="submit" class="w-full py-2 px-4 mb-4    rounded-md bg-green-500 text-white"
				>Submit</button
			>
            
		</form>

        <div class="grid grid-cols-2">
			<input
				type="text"
				bind:value={bearer}
				class="h-10 border-2 border-gray-300 rounded-md py-2 px-4 block w-full leading-5"
			/>
		</div>

        <div class="grid grid-cols-2">
			<input
				type="text"
				bind:value={signature}
				class="h-10 border-2 border-gray-300 rounded-md py-2 px-4 block w-full leading-5"
			/>
		</div>
       
	</div>
</div>
