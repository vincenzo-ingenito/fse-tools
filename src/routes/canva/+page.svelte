<script> 
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import Konva from 'konva';


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
    const hexagonName = prompt('Inserisci il nome per l\'esagono:');
    if (!hexagonName) {
      alert('Il nome non può essere vuoto. Riprova.');
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
    });

    layer.add(hexagon);
    hexagons = [...hexagons, hexagon];

    // Aggiorna l'oggetto arrowObject
    arrowObject.update(obj => {
      obj[hexagonName] = { id: hexagonName, link: [] };
      return obj;
    });

    layer.draw();
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

  // Pulisci l'abbonamento quando il componente viene distrutto
  onDestroy(() => {
    unsubscribe();
  });
</script>

<style>
  #container {
    border: 1px solid #ccc;
  }
</style>

<div id="container"></div>
<button on:click={createHexagon}>Crea Esagono</button>
<button on:click={connectHexagons}>Collega Esagoni</button>
