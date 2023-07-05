<script>
	import { subject_role_enum } from './subject_role.js';
	import { purpose_of_use_enum } from './purpose_of_use.js';
	import { action_id_enum } from './action_id.js';
	import { subj_app_id } from './subj_app_id.js';
	let selectedOption;

	let action_id = 'CREATE';
	let purpose_of_use = 'TREATMENT';
	let subject_role = 'AAS';
	let selectedOptionSistema = 'Gateway';

	let p12Alias = '';
	$: isValidP12Alias = true;
	/**
	 * @param {string | any[]} p12Alias
	 */
	function validateP12Alias(p12Alias) {
		return p12Alias.length > 0;
	}

	let p12PWD = '';
	$: isValidP12PWD = true;
	/**
	 * @param {string | any[]} p12PWD
	 */
	function validateP12PWD(p12PWD) {
		return p12PWD.length > 0;
	}

	/**
	 * @type {string | Blob}
	 */
	let pdf;
	let fileNamePdf = '';

	/**
	 * @type {string | Blob}
	 */
	let p12;
	let fileNameP12 = '';

	/**
	 * @type {string | Blob}
	 */
	let pem;
	let fileNamePem = '';

	//DATA JSON START
	let sub = 'SSSMNN75B01F257L^^^&amp;2.16.840.1.113883.2.9.4.3.2&amp;ISO';
	$: isValidSub = true;
	/**
	 * @param {string | any[]} sub
	 */
	function validateSub(sub) {
		return sub.length > 0;
	}

	let iss = 'S1#190201234567XX';
	$: isValidIssuer = true;
	/**
	 * @param {string | any[]} iss
	 */
	function validateIssuer(iss) {
		return iss.length > 0;
	}

	let locality = '201123456';
	$: isValidLocality = true;
	/**
	 * @param {string | any[]} locality
	 */
	function validateLocality(locality) {
		return locality.length > 0;
	}

	let subject_application_id = 'GTW';
	$: isValidSubAppId = true;
	/**
	 * @param {string | any[]} subject_application_id
	 */
	function validateSubjAppId(subject_application_id) {
		return subject_application_id.length > 0;
	}
	let subject_application_vendor = 'GATEWAY';
	$: isValidSubAppVendor = true;
	/**
	 * @param {string | any[]} subject_application_vendor
	 */
	function validateSubjAppVendor(subject_application_vendor) {
		return subject_application_vendor.length > 0;
	}
	let subject_application_version = 'R2';
	$: isValidSubAppVersion = true;
	/**
	 * @param {string | any[]} subject_application_version
	 */
	function validateSubjAppVersion(subject_application_version) {
		return subject_application_version.length > 0;
	}
	let subject_organization_id = '120';
	let subject_organization = 'Regione Lazio';

	let aud = 'https://modipa-val.fse.salute.gov.it/govway/rest/in/FSE/gateway/v1';
	$: isValidAud = true;
	/**
	 * @param {string | any[]} aud
	 */
	function validateAud(aud) {
		return aud.length > 0;
	}
	let patient_consent = true;

	let jti = '';
	$: isValidJTI = true;
	/**
	 * @param {string | any[]} jti
	 */
	function validateJTI(jti) {
		return jti.length > 0;
	}

	function handleChangeSistema(event) {
		selectedOptionSistema = event.target.value;
	}

	//DATA JSON END

	const handleFilePdf = (/** @type {{ target: { files: (string | Blob)[]; }; }} */ event) => {
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
		isValidP12Alias = validateP12Alias(p12Alias);
		isValidP12PWD = validateP12PWD(p12PWD);
		isValidSub = validateSub(sub);
		isValidLocality = validateLocality(locality);
		isValidIssuer = validateIssuer(iss);
		isValidSubAppId = validateSubjAppId(subject_application_id);
		isValidSubAppVendor = validateSubjAppVendor(subject_application_vendor);
		isValidSubAppVersion = validateSubjAppVersion(subject_application_version);
		isValidAud = validateAud(aud);
		isValidJTI = validateJTI(jti);
		console.log(action_id);
		let isValidForm =
			isValidSub &&
			isValidLocality &&
			isValidIssuer &&
			isValidSubAppId &&
			isValidSubAppVendor &&
			isValidSubAppVersion &&
			isValidAud &&
			isValidJTI;
		const formData = new FormData();

		if (isValidForm) {
			formData.append('pdf', pdf);
			formData.append('fileP12', p12);
			formData.append('filePEM', pem);
			formData.append(
				'request',
				JSON.stringify({
					sub,
					subject_role,
					purpose_of_use,
					iss,
					locality,
					subject_application_id,
					subject_application_vendor,
					subject_application_version,
					subject_organization_id,
					subject_organization,
					aud,
					patient_consent,
					jti,
					action_id
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
			bearer = deserializedJson.Bearer;
			signature = deserializedJson.Signature;
		}

		isLoading = false;
	}
</script>

<div>
	{#if isLoading}
		<div
			class="overflow-hidden w-full h-full absolute bg-gray-800/40 p-0 z-50 grid items-center content-center"
		>
			<div class="spin">
				<div />
				<div />
				<div />
				<div />
			</div>
		</div>
	{/if}

	<div class="p-4 pt-20 md:w-3/4 mx-auto">
		<h1 class="pt-4 text-gray-700 text-2xl font-mono font-extrabold text-center mb-5">
			JWT Generation
		</h1>
		<form on:submit|preventDefault={handleSubmit}>
			<div class="grid grid-cols-2 gap-2">
				<div class="rounded-lg shadow-md px-4 font-mono border">
					<h2 class="text-xl font-mono text-center mt-2">Certificato di Firma</h2>
					<label
						>P12 Signature:
						<input
							required
							type="file"
							accept="*/*"
							on:change={handleFileInputP12}
							class="py-2 px-3 block w-full leading-5 rounded-md sm:text-sm sm:leading-5 col-span-2"
						/>
					</label>
					<br />
					<label
						>P12 Password:
						<input
							type="password"
							bind:value={p12PWD}
							class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300"
							style="border-color:{!isValidP12PWD ? 'red' : 'black'}"
						/>
					</label>
				</div>
				<div class="grid grid-rows-3 grid-cols-3 rounded-lg shadow-md px-4 pb-4 font-mono border">
					<h2 class="text-xl font-mono text-center mt-4 col-span-3">Sistema Target</h2>

					<span class="col-span-1 flex items-center">Select Option:</span>
					<select
						bind:value={selectedOptionSistema}
						on:change={handleChangeSistema}
						class="py-2 px-3 block w-full leading-5 rounded-md sm:text-sm sm:leading-5 col-span-2"
					>
						<option value="Gateway">Gateway</option>
						<option value="Terminology">Terminology</option>
					</select>
				</div>

				<div
					class="mt-10 col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2 rounded-lg shadow-md px-4 pb-4 font-mono border items-center place-content-center"
				>
					<h2 class="text-xl font-mono text-center mt-4 col-span-full">Data Json</h2>

					<label for="sub">Subject</label>
					<input
						type="text"
						id="sub"
						bind:value={sub}
						style="border-color:{!isValidSub ? 'red' : 'black'}"
					/>

					{#if selectedOptionSistema == 'Gateway'}
						<label for="subject_role_enum">Subject Role</label>
						<select
							bind:value={subject_role}
							class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300"
						>
							{#each subject_role_enum as { value, text }}
								<option {value}>{value} - {text}</option>
							{/each}
						</select>
					{/if}

					<label for="locality">Locality</label>
					<input
						type="text"
						id="locality"
						bind:value={locality}
						style="border-color:{!isValidLocality ? 'red' : 'black'}"
					/>

					{#if selectedOptionSistema == 'Gateway'}
						<label for="subject_application_vendor">Subject application vendor</label>
						<input
							type="text"
							id="subject_application_vendor"
							bind:value={subject_application_vendor}
							style="border-color:{!isValidSubAppVendor ? 'red' : 'black'}"
						/>
					{/if}

					<label for="subject_organization">Subject organization</label>
					<select
						bind:value={selectedOption}
						class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300"
					>
						{#each subj_app_id as { value, text, organization, organization_id }}
							<option value={{ organization_id, organization }}>{value} - {text}</option>
						{/each}
					</select>

					<label for="patient_consent">Patient consent</label>
					<input type="checkbox" id="patient_consent" bind:value={patient_consent} />

					<label for="action_id_enum">Action id</label>
					<select
						bind:value={action_id}
						class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300"
					>
						{#each action_id_enum as { value, text }}
							<option {value}>{text}</option>
						{/each}
					</select>

					<label for="purpose_of_use_enum">Purpose of use</label>
					<select
						bind:value={purpose_of_use}
						class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300"
					>
						{#each purpose_of_use_enum as { value, text }}
							<option {value}>{value} - {text}</option>
						{/each}
					</select>

					<label for="iss">Issuer</label>
					<input
						type="text"
						id="iss"
						bind:value={iss}
						style="border-color:{!isValidIssuer ? 'red' : 'black'}"
					/>

					{#if selectedOptionSistema == 'Gateway'}
						<label for="subject_application_id">Subject application id</label>
						<input
							type="text"
							id="subject_application_id"
							bind:value={subject_application_id}
							style="border-color:{!isValidSubAppId ? 'red' : 'black'}"
						/>

						<label for="subject_application_version">Subject application version</label>
						<input
							type="text"
							id="subject_application_version"
							bind:value={subject_application_version}
							style="border-color:{!isValidSubAppVersion ? 'red' : 'black'}"
						/>
					{/if}

					<label for="aud">aud</label>
					<input
						type="text"
						id="aud"
						bind:value={aud}
						style="border-color:{!isValidAud ? 'red' : 'black'}"
					/>

					<label for="jti">jti</label>
					<input
						type="text"
						id="jti"
						bind:value={jti}
						style="border-color:{!isValidJTI ? 'red' : 'black'}"
					/>

					{#if selectedOptionSistema == 'Terminology'}
						<label for="file_hash">file_hash</label>
						<input
							id="file_hash"
							required
							type="file"
							accept="*/*"
							class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300"
						/>

						<label for="oid">oid</label>
						<input type="text" id="oid" />

						<label for="version">version</label>
						<input type="text" id="version" />
					{/if}

					{#if selectedOptionSistema == 'Gateway'}
						<label for="pdf">pdf</label>
						<input
							id="pdf"
							required
							type="file"
							accept="*/*"
							on:change={handleFilePdf}
							class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300"
						/>
					{/if}
				</div>

				<div
					class="col-span-full p-4 text-center grid place-content-center content-center grid-flow-col gap-2"
				>
					<button
						type="submit"
						class="rounded-md bg-green-500 text-white font-extrabold font-mono hover:bg-green-600 h-10 w-40 m-4"
					>
						GENERA JWT
					</button>
				</div>
			</div>
		</form>

		<div class="grid grid-cols-3">
			<span class="col-span-1">Bearer</span>

			<input
				type="text"
				bind:value={bearer}
				class="h-10 border-2 border-gray-300 rounded-md py-2 px-4 block w-full leading-5 col-span-2"
			/>

			<span class="col-span-1">Signature</span>
			<input
				type="text"
				bind:value={signature}
				class="h-10 border-2 border-gray-300 rounded-md py-2 px-4 block w-full leading-5 col-span-2"
			/>
		</div>
	</div>
</div>

<style>
	input[type='text'] {
		@apply border-2 border-gray-300 rounded-md py-2 px-4 block w-full leading-5;
	}

	input[type='checkbox'] {
		@apply text-amber-600 h-10 w-10 accent-amber-400 border-gray-300;
	}
</style>
