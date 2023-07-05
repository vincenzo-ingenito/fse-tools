<script>
	import { PDFDocument } from 'pdf-lib';

	let file = null;

	const handleCancel = () => {
		file = null;
		const fileInput = document.querySelector('input[type="file"]');
		fileInput.value = '';
	};

	const handleFileInput = (event) => {
		file = event.target.files[0];
	};

	async function generatePDF() {
		if (file) {
			const reader = new FileReader();

			reader.onload = async (event) => {
				const xmlContent = event.target.result;

				try {
					const pdfDoc = await PDFDocument.create();
					const page = pdfDoc.addPage();

					// Estrai il nome del file dall'input dell'utente
					const fileName = file.name;

					// Aggiungi il file XML come allegato
					const decoder = new TextDecoder();

					const xmlString = decoder.decode(new Uint8Array(xmlContent));
					console.log(xmlString);

					const attachment = await pdfDoc.attach(xmlContent, 'cda.xml', {
						mimeType: 'application/xml'
					});

					const pdfBytes = await pdfDoc.save();

					const blob = new Blob([pdfBytes], { type: 'application/pdf' });
					const url = URL.createObjectURL(blob);

					// Creazione del link per il download del PDF
					const link = document.createElement('a');
					link.href = url;
					link.download = 'output.pdf';
					link.click();

					URL.revokeObjectURL(url);
				} catch (error) {
					console.error('Errore nella generazione del PDF', error);
				}
			};

			reader.readAsArrayBuffer(file);
		}
	}
</script>

<div class="pt-32">
	<div class="grid p-4 items-center text-center place-content-center content-center">
		<div class="rounded-md shadow-sm bg-gray-300">
			<input
				type="file"
				accept=".xml"
				on:change={handleFileInput}
				class="p-6 rounded-lg font-bold font-mono"
			/>
		</div>
	</div>
	<div class="p-4 text-center grid place-content-center content-center grid-flow-col gap-2">
		<button
			class="rounded-md bg-green-500 text-white font-mono hover:bg-green-600 h-10 w-20"
			on:click={generatePDF}
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
			>
				<polyline points="3 6 5 6 21 6" />
				<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
				<line x1="10" y1="11" x2="10" y2="17" />
				<line x1="14" y1="11" x2="14" y2="17" />
			</svg>
		</button>
	</div>
</div>
