<script>
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import Konva from 'konva'; 

  let showDialog = false;
  let hexagonName = '';
  let groupId = '';
  let artifact = '';
  let stage;
  let layer;
  let hexagons = [];
  let arrows = [];
  let arrowObject = writable({});

  // Abbonati agli aggiornamenti di arrowObject
  let unsubscribe = arrowObject.subscribe(value => {
    console.log('arrowObject:', value);
  });

  onMount(() => {
    stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight,
    });

    layer = new Konva.Layer();
    stage.add(layer);
  });

  function createHexagon() {
    // Apri la dialog con tre textarea
    Dialog.show({
      title: 'Inserisci i dettagli dell\'esagono',
      content: `
        <div>
          <label for="hexagonName">Nome:</label>
          <textarea bind:value={hexagonName}></textarea>
        </div>
        <div>
          <label for="groupId">GroupId:</label>
          <textarea bind:value={groupId}></textarea>
        </div>
        <div>
          <label for="artifact">Artifact:</label>
          <textarea bind:value={artifact}></textarea>
        </div>
      `,
      buttons: [
        {
          text: 'Crea Esagono',
          onClick: handleCreateHexagon,
        },
        {
          text: 'Annulla',
          onClick: handleDialogClose,
        },
      ],
    });
  }

  function handleCreateHexagon() {
    if (!hexagonName || !groupId || !artifact) {
      alert('Nessun campo può essere vuoto. Riprova.');
      return;
    }

    const hexagon = new Konva.RegularPolygon({
      x: Math.random() * stage.width(),
      y: Math.random() * stage.height(),
      sides: 6,
      radius: 50,
      fill: getRandomColor(),
      draggable: true,
      name: hexagonName,
      groupId: groupId,
      artifact: artifact,
    });

    layer.add(hexagon);
    hexagons = [...hexagons, hexagon];

    // Aggiorna l'oggetto arrowObject
    arrowObject.update(obj => {
      obj[hexagonName] = { id: hexagonName, link: [], groupId: groupId, artifact: artifact };
      return obj;
    });

    closeDialog();

     // Resetta i campi della dialog
     hexagonName = '';
    groupId = '';
    artifact = '';
    layer.draw();
  }

  function openDialog() {
    showDialog = true;
  }

  function closeDialog() {
    showDialog = false;
  }

  function connectHexagons() {
    const hexagonName1 = prompt('Inserisci il nome del primo esagono:');
    const hexagonName2 = prompt('Inserisci il nome del secondo esagono:');

    const hexagon1 = findHexagonByName(hexagonName1);
    const hexagon2 = findHexagonByName(hexagonName2);

    if (!hexagon1 || !hexagon2) {
      alert('Uno o entrambi gli esagoni con i nomi forniti non sono presenti.');
      return;
    }

    const arrow = new Konva.Arrow({
      points: [hexagon1.x() + hexagon1.width() / 2, hexagon1.y(),
               hexagon2.x() - hexagon2.width() / 2, hexagon2.y()],
      pointerLength: 10,
      pointerWidth: 10,
      fill: 'red',
      stroke: 'red',
      strokeWidth: 2,
    });

    layer.add(arrow);
    arrows = [...arrows, arrow];
    layer.draw();

    // Aggiorna l'oggetto arrowObject con i collegamenti
    arrowObject.update(obj => {
      obj[hexagonName1].link.push({ to: hexagonName2 });
      obj[hexagonName2].link.push({ from: hexagonName1 });
      return obj;
    });
  }

  function findHexagonByName(name) {
    return hexagons.find(hexagon => hexagon.name() === name);
  }

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function handleSendToBackend() {
    const objectsToSend = Object.values($arrowObject);

    // Esegui la richiesta POST al tuo backend con gli oggetti creati
    fetch('http://localhost:8080/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objectsToSend),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Risposta dal backend:', data);
      // Aggiungi qui la logica per gestire la risposta del backend, se necessario
    })
    .catch(error => {
      console.error('Errore durante la richiesta al backend:', error);
    });
  }

  // Pulisci l'abbonamento quando il componente viene distrutto
  onDestroy(() => {
    unsubscribe();
  });
</script>

<style>
  #container {
    border: 1px solid #ccc;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .dialog {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
</style>

<div id="container"></div>
<button on:click={openDialog}>Crea Esagono</button>

{#if showDialog}
  <div class="overlay" on:click={closeDialog}>
    <div class="dialog" on:click={e => e.stopPropagation()}>
      <label for="hexagonName">Nome:</label>
      <textarea bind:value={hexagonName}></textarea>

      <label for="groupId">GroupId:</label>
      <textarea bind:value={groupId}></textarea>

      <label for="artifact">Artifact:</label>
      <textarea bind:value={artifact}></textarea>

      <button on:click={handleCreateHexagon}>Crea Esagono</button>
    </div>
  </div>
{/if}
<button on:click={connectHexagons}>Collega Esagoni</button>
<button on:click={handleSendToBackend}>Invia al Backend</button>
