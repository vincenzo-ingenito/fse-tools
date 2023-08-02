<script>
	import { subject_role_enum } from './subject_role.js';
	import { purpose_of_use_enum } from './purpose_of_use.js';
	import { action_id_enum } from './action_id.js';
	import { subj_app_id } from './subj_app_id.js';
	import * as jose from 'jose';

	let selectedOption;

	/**
	 * @type {any}
	 */
	let pemContent;
	let privKeyContent;
	let action_id = 'CREATE';
	let purpose_of_use = 'TREATMENT';
	let subject_role = 'AAS';
	let selectedOptionSistema = 'Gateway';
	let selectedOptionOpProvisioning = 'Creazione';

	/**
	 * @type {string | Blob}
	 */
	let pdf;
	let fileNamePdf = '';

	//DATA JSON START
	let sub = 'PROVAX00X00X000Y^^^&amp;2.16.840.1.113883.2.9.4.3.2&amp;ISO';
	$: isValidSub = true;
	/**
	 * @param {string | any[]} sub
	 */
	function validateSub(sub) {
		return sub.length > 0;
	}

	let iss = 'S1#190201123456XX';
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

	let oid = '';
	$: isValidOid = true;
	/**
	 * @param {string | any[]} oid
	 */
	function validateOid(oid) {
		console.log("Valido OID:" + oid.length)
		return oid.length > 0;
	}

	let version = '';
	$: isValidVersion = true;
	/**
	 * @param {string | any[]} version
	 */
	function validateVersion(version) {
		return version.length > 0;
	}

	let uuidToRevoke = '';
	$: isValidUuidToRevoke = true;
	/**
	 * @param {string | any[]} uuidToRevoke
	 */
	function validateUuidToRevoke(uuidToRevoke) {
		return uuidToRevoke.length > 0;
	}

	/**
	 * @param {{ target: { value: string; }; }} event
	 */
	function handleChangeSistema(event) {
		selectedOptionSistema = event.target.value;

		sub = "PROVAX00X00X000Y";
		if(selectedOptionSistema === "Terminology"){
			aud = "https://modipa-val.fse.salute.gov.it/govway/rest/in/FSE/terminology/v1";
		} else if(selectedOptionSistema === "Provisioning"){
			aud = "https://modipa-val.fse.salute.gov.it/govway/rest/in/FSE/provisioning/v1";
		} else if(selectedOptionSistema === "Gateway"){
			aud = "https://modipa-val.fse.salute.gov.it/govway/rest/in/FSE/gateway/v1";
			sub += "^^^&amp;2.16.840.1.113883.2.9.4.3.2&amp;ISO";
		}

	}


	//DATA JSON END

	const handleFilePdf = (/** @type {{ target: { files: (string | Blob)[]; }; }} */ event) => {
		pdf = event.target.files[0];
		fileNamePdf = pdf.name;
	};

	let fileTerminology;
  let fileNameTerminology = '';
  let file_hash_terminology = '';

  const handleFileTerminology = async (event) => {
    fileTerminology = event.target.files[0];
    fileNameTerminology = fileTerminology.name;
    file_hash_terminology = await calculateSHA256(fileTerminology);
  };

  const vector_hash_csr = [];

  const handleFilesCSR = async (event) => {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
        const fileCSR = files[i];
        const fileHashCSR = await calculateSHA256(fileCSR);

		vector_hash_csr.push(fileHashCSR);
      
    }
};

  const calculateSHA256 = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };
	

	/**
	 * @param {{ target: { files: any[]; }; }} event
	 */
	function handleFileInputPem(event) {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onload = function (event) {
			pemContent = cleanPem(event.target.result);
		};

		reader.onerror = function (event) {
			console.error('Error reading the file');
		};

		reader.readAsText(file);
	}

	/**
	 * @param {{ target: { files: any[]; }; }} event
	 */
	function handlePrivateKey(event) {
		const file = event.target.files[0];
		const reader = new FileReader();

		reader.onload = function (event) {
			privKeyContent = event.target.result;
		};

		reader.onerror = function (event) {
			console.error('Error reading the file');
		};

		reader.readAsText(file);
	}
	let bearer = '';
	let signature = '';
	let isLoading = false;

	async function handleSubmit() {
		let isValidForm = generalFormValidation() && gatewayFormValidation() && terminologyFormValidation();

		if (isValidForm) {
			const alg = 'RS256';
			const typ = 'JWT';
			const x5c = [pemContent];
			bearer = await authToken(alg, typ, x5c);
			signature = await businessToken(alg, typ, x5c);
		}

		isLoading = false;
	}

	function generalFormValidation() {
		isValidSub = validateSub(sub);
		isValidIssuer = validateIssuer(iss);
		isValidAud = validateAud(aud);
		isValidJTI = validateJTI(jti);
		return isValidSub && isValidIssuer && isValidAud && isValidJTI;
	}

	function gatewayFormValidation() {
		let output = true;
		if (selectedOptionSistema == 'Gateway') {
			isValidLocality = validateLocality(locality);
			isValidSubAppId = validateSubjAppId(subject_application_id);
			isValidSubAppVendor = validateSubjAppVendor(subject_application_vendor);
			isValidSubAppVersion = validateSubjAppVersion(subject_application_version);
			output = isValidLocality && isValidSubAppId && isValidSubAppVendor && isValidSubAppVersion;
		}
		return output;
	}

	function terminologyFormValidation() {
		let output = true;
		if (selectedOptionSistema == 'Terminology') {
			isValidOid = validateOid(oid);
			isValidVersion = validateVersion(version);
			output = isValidOid && isValidVersion;
			console.log(output);
		}
		return output;
	}

	function cleanPem(pem) {
		const cleanedPem = pem
			.replace('-----BEGIN PUBLIC KEY-----', '')
			.replace(/\r?\n|\r/g, '')
			.replace('-----END PUBLIC KEY-----', '')
			.replace('-----BEGIN CERTIFICATE-----', '')
			.replace(/\r?\n|\r/g, '')
			.replace('-----END CERTIFICATE-----', '')
			.replace('\n', '');

		return cleanedPem;
	}

	async function rsaSHA256Old(privateKeyPem) {
		const alg = 'RS256';
		const typ = 'JWT';
		const x5c = [pemContent];
		const privateKey1 = await jose.importPKCS8(privateKeyPem, alg);
		const jwt = await new jose.SignJWT({})
			.setProtectedHeader({ alg, typ, x5c })
			.setSubject('PROVAX00X00X000Y')
			.setAudience('https://modipa-val.fse.salute.gov.it/govway/rest/in/FSE/gateway/v1')
			.setIssuedAt()
			.setIssuer('auth:S1#Prova')
			.setExpirationTime('24h')
			.setJti('1234')
			.sign(privateKey1);
		console.log(jwt.toString());
		return jwt.toString();
	}

	function authToken(alg, typ, x5c) {
		return new Promise((resolve, reject) => {
			jose
				.importPKCS8(privKeyContent, alg)
				.then((privateKey1) => {
					return new jose.SignJWT({})
						.setProtectedHeader({ alg, typ, x5c })
						.setSubject(sub)
						.setAudience(aud)
						.setIssuedAt()
						.setIssuer("auth:"+iss)
						.setExpirationTime('24h')
						.setJti(jti)
						.sign(privateKey1);
				})
				.then((jwt) => {
					resolve(jwt.toString());
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				});
		});
	}

	function businessToken(alg, typ, x5c) {
		let dataJson = [];
		if (selectedOptionSistema == 'Gateway') {
			dataJson = { sub, subject_role, purpose_of_use, iss, locality, subject_application_id,
				subject_application_vendor, subject_application_version, aud, patient_consent, jti, action_id
			};
		} else if (selectedOptionSistema == 'Terminology') {
			dataJson = { oid,version, file_hash_terminology };
		} else if (selectedOptionSistema == 'Provisioning') {
			if(selectedOptionOpProvisioning==="Revoca"){
				const vector_id = uuidToRevoke === '' ? null : uuidToRevoke;
				dataJson = { vector_id};	
			} else if((selectedOptionOpProvisioning==="Creazione" || selectedOptionOpProvisioning==="Rinnovo")){
				dataJson = { vector_hash_csr};
			}
			
		}

		return new Promise((resolve, reject) => {
			jose
				.importPKCS8(privKeyContent, alg)
				.then((privateKey1) => {
					return new jose.SignJWT(dataJson)
						.setProtectedHeader({ alg, typ, x5c })
						.setSubject(sub)
						.setAudience(aud)
						.setIssuedAt()
						.setIssuer("integrity:"+iss)
						.setExpirationTime('24h')
						.setJti(jti)
						.sign(privateKey1);
				})
				.then((jwt) => {
					resolve(jwt.toString());
				})
				.catch((error) => {
					console.error(error);
					reject(error);
				});
		});
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
						>PEM Signature:
						<input
							required
							type="file"
							accept="*/*"
							on:change={handleFileInputPem}
							class="py-2 px-3 block w-full leading-5 rounded-md sm:text-sm sm:leading-5 col-span-2"
						/>
					</label>
					<br />
					<label
						>Private Key:
						<input
							required
							type="file"
							accept="*/*"
							on:change={handlePrivateKey}
							class="py-2 px-3 block w-full leading-5 rounded-md sm:text-sm sm:leading-5 col-span-2"
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
						<option value="Provisioning">Provisioning</option>
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

					<label for="iss">Issuer</label>
					<input
						type="text"
						id="iss"
						bind:value={iss}
						style="border-color:{!isValidIssuer ? 'red' : 'black'}"
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

						<label for="locality">Locality</label>
						<input
							type="text"
							id="locality"
							bind:value={locality}
							style="border-color:{!isValidLocality ? 'red' : 'black'}"
						/>

						<label for="subject_application_vendor">Subject application vendor</label>
						<input type="text" id="subject_application_vendor" bind:value={subject_application_vendor} style="border-color:{!isValidSubAppVendor ? 'red' : 'black'}" />

						<label for="subject_application_id">Subject application id</label>
						<input
							type="text"
							id="subject_application_id"
							bind:value={subject_application_id}
							style="border-color:{!isValidSubAppId ? 'red' : 'black'}"
						/>

						<label for="subject_application_version">Subject application version</label>
						<input type="text" id="subject_application_version" bind:value={subject_application_version} style="border-color:{!isValidSubAppVersion ? 'red' : 'black'}" />

						<label for="patient_consent">Patient consent</label>
						<input type="checkbox" id="patient_consent" bind:value={patient_consent} />

						<label for="subject_organization">Subject organization</label>
						<select
							bind:value={selectedOption}
							class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300"
						>
							{#each subj_app_id as { value, text, organization, organization_id }}
								<option value={{ organization_id, organization }}>{value} - {text}</option>
							{/each}
						</select>

						<label for="action_id_enum">Action id</label>
						<select bind:value={action_id} class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300" >
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

						<label for="pdf">pdf</label>
						<input id="pdf" type="file" accept="application/pdf" on:change={handleFilePdf} class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300" />
					{/if}

					{#if selectedOptionSistema == 'Terminology'}
						<label for="oid">oid</label>
						<input type="text" bind:value={oid} style="border-color:{!isValidOid ? 'red' : 'black'}" id="oid" />

						<label for="version">version</label>
						<input type="text" bind:value={version} style="border-color:{!isValidVersion ? 'red' : 'black'}" id="version" />
 
						<label for="file_terminology">File</label>
						<input id="file_terminology" type="file" accept="*/*" on:change={handleFileTerminology} class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300" />
					{/if}

					{#if selectedOptionSistema==="Provisioning"}
					<span class="col-span-1 flex items-center">Operazione</span>
					<select bind:value={selectedOptionOpProvisioning} class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300" >
						<option value="Creazione">Creazione</option>
						<option value="Rinnovo">Rinnovo</option>
						<option value="Revoca">Revoca</option>
					</select>
					{/if}

					{#if selectedOptionSistema==="Provisioning" && (selectedOptionOpProvisioning==="Creazione" || selectedOptionOpProvisioning==="Rinnovo")}
						<label for="file_csr">CSR</label>
						<input id="file_csr" multiple type="file" accept="*/*" on:change={handleFilesCSR} class="w-full py-2 px-4 mb-4 rounded-md border border-gray-300" />
					{/if}

					{#if selectedOptionSistema==="Provisioning" && selectedOptionOpProvisioning==="Revoca"}
					<label for="uuid_to_revoke">uuid</label>
					<input type="text" id="uuid_to_revoke" bind:value={uuidToRevoke} style="border-color:{!isValidUuidToRevoke ? 'red' : 'black'}" />
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
			<span class="col-span-1">Authorization</span>

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
