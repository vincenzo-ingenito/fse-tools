<script>
	import Konva from 'konva';
	import { onMount } from 'svelte';
  
	let stage;
	let layer;
	let groupRed;
	let groupYellow;
	let groupCircle;
	let blueCircle;
  
	onMount(() => {
	  // Function to handle dragend event
	  const handleDragEnd = () => {
		if (blueCircle.x() < window.innerWidth / 2) {
		  blueCircle.position({ x: window.innerWidth / 4, y: window.innerHeight / 2 });
		  layer.batchDraw();
		}
	  };
  
	  // Set up Konva stage and layers
	  stage = new Konva.Stage({
		container: 'container',
		width: window.innerWidth,
		height: window.innerHeight,
	  });
  
	  layer = new Konva.Layer();
	  stage.add(layer);
  
	  // create group for red rectangle (column 1)
	  groupRed = new Konva.Group();
	  layer.add(groupRed);
  
	  const redRect = new Konva.Rect({
		x: 0,
		y: 0,
		fill: 'red',
		width: window.innerWidth / 2,
		height: window.innerHeight,
	  });
	  groupRed.add(redRect);
  
	  // create group for yellow rectangle (column 2)
	  groupYellow = new Konva.Group();
	  layer.add(groupYellow);
  
	  const yellowRect = new Konva.Rect({
		x: window.innerWidth / 2,
		y: 0,
		fill: 'yellow',
		width: window.innerWidth / 2,
		height: window.innerHeight,
	  });
	  groupYellow.add(yellowRect);
  
	  // create group for circle (above both columns)
	  groupCircle = new Konva.Group();
	  layer.add(groupCircle);
  
	  const initialCircleX = window.innerWidth / 4;
	  const initialCircleY = window.innerHeight / 2;
  
	  blueCircle = new Konva.Circle({
		x: initialCircleX,
		y: initialCircleY,
		fill: 'blue',
		radius: 30,
		draggable: true,
	  });
	  groupCircle.add(blueCircle);
  
	  // Event listener for dragend on blueCircle
	  blueCircle.on('dragend', handleDragEnd);
	});
  </script>
  
  <style>
	body {
	  margin: 0;
	  padding: 0;
	  overflow: hidden;
	  background-color: #f0f0f0;
	}
  </style>
  
  <div id="container"></div>
  