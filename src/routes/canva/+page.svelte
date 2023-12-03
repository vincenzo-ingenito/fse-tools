<script>
  import Konva from 'konva';
  import { onMount } from 'svelte';

  let stage;
  let layer;
  let groupLeftColumn;
  let groupRightColumn;
  let groupShape;
  let blueShape;
  let redShape;
  let isDraggingToRight = false;
  let isDraggingRed = false;

  let initialShapePosition = { x: 0, y: 0 };
  let initialRedShapePosition = { x: 0, y: 0 };

  onMount(() => {
    const handleDragStart = (shape) => {
      initialShapePosition = { x: shape.x(), y: shape.y() };
      isDraggingToRight = false;
    };

    const handleDragEnd = (shape) => {
      if (isDraggingToRight) {
        const clonedShape = shape.clone({ draggable: true });
        const deleteIcon = new Konva.Text({
          x: 0,
          y: -15,
          text: 'X',
          fontSize: 18,
          fontFamily: 'Arial',
          fill: 'red',
          width: 20,
          align: 'center',
          draggable: false,
          listening: true,
        });
        const group = new Konva.Group({
          draggable: true,
        });

        group.add(clonedShape);
        group.add(deleteIcon);

        groupRightColumn.add(group);
        layer.batchDraw();

        shape.position(initialShapePosition);
        layer.batchDraw();
      } else {
        shape.position(initialShapePosition);
        layer.batchDraw();
      }
    };

    const handleDragMove = (event, shape) => {
      if (shape.x() > window.innerWidth * 0.3) {
        isDraggingToRight = true;
      } else {
        isDraggingToRight = false;
      }
    };

    const handleDeleteIconClick = (event) => {
      const clickedShape = event.target.getParent();
      clickedShape.destroy();
      layer.batchDraw();
    };

    const setupShape = (shape, initialX, group) => {
      shape.on('dragstart', () => handleDragStart(shape));
      shape.on('dragend', () => handleDragEnd(shape));
      shape.on('dragmove', (event) => handleDragMove(event, shape));

      layer.on('click', (event) => {
        const clickedShape = event.target;
        if (clickedShape.getClassName() === 'Text' && clickedShape.text() === 'X') {
          handleDeleteIconClick(event);
        }
      });

      group.add(shape);

      return shape;
    };

    stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight,
    });

    layer = new Konva.Layer();
    stage.add(layer);

    groupLeftColumn = new Konva.Group();
    layer.add(groupLeftColumn);

    const leftRect = new Konva.Rect({
      x: 0,
      y: 0,
      fill: 'gray',
      width: window.innerWidth * 0.3,
      height: window.innerHeight,
    });
    groupLeftColumn.add(leftRect);

    groupRightColumn = new Konva.Group();
    layer.add(groupRightColumn);

    const rightRect = new Konva.Rect({
      x: window.innerWidth * 0.3,
      y: 0,
      fill: 'white',
      width: window.innerWidth * 0.7,
      height: window.innerHeight,
    });
    groupRightColumn.add(rightRect);

    const blueBorder = new Konva.Rect({
      x: window.innerWidth * 0.3,
      y: 0,
      fill: 'blue',
      width: 2,
      height: window.innerHeight,
    });
    layer.add(blueBorder);

    groupShape = new Konva.Group();
    layer.add(groupShape);

    const initialShapeX = window.innerWidth * 0.2; // Different initial X position for hexagon
    const initialShapeY = window.innerHeight / 2;

    blueShape = setupShape(
      new Konva.RegularPolygon({
        x: initialShapeX,
        y: initialShapeY,
        sides: 6,
        fill: 'blue',
        radius: 30,
        draggable: true,
      }),
      initialShapeX,
      groupShape
    );

    // New red triangle shape
    const groupRedShape = new Konva.Group();
    layer.add(groupRedShape);

    const initialRedShapeX = window.innerWidth * 0.25; // Different initial X position for arrow
    const initialRedShapeY = window.innerHeight / 2;

    redShape = setupShape(
      new Konva.RegularPolygon({
        x: initialRedShapeX,
        y: initialRedShapeY,
        sides: 3,
        fill: 'red',
        radius: 30,
        draggable: true,
      }),
      initialRedShapeX,
      groupRedShape
    );
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
