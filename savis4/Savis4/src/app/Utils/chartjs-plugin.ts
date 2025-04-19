export const errorBarsPlugin = {
    afterDatasetsDraw: function(chart: any) {
      const ctx = chart.ctx;
      const yAxis = chart.scales['y-axis-0'];
      if (!yAxis) {
        console.error('Y-axis not found');
        return;
      }
  
      chart.data.datasets.forEach((dataset: any, i: any) => {
        const meta = chart.getDatasetMeta(i);
        if (!meta.hidden && dataset.errorBarsY1) {
          dataset.data.forEach((datapoint: any, index: any) => {
            const element = meta.data[index];
            if (element && typeof element.getCenterPoint === 'function') {
              const { x } = element.getCenterPoint();
              const y = yAxis.getPixelForValue(datapoint.y);
              const y1 = yAxis.getPixelForValue(datapoint.y1);
  
              // Draw the error bar if y and y1 are different
              if (y !== y1) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y1);
                ctx.strokeStyle = dataset.borderColor;
                ctx.lineWidth = dataset.borderWidth;
                ctx.stroke();
                ctx.restore();
              }
            }
          });
        }
      });
    }
};

export const errorSquaresPlugin = {
  id: 'errorSquares',
  afterDatasetsDraw(chart: any) {
    const ctx = chart.ctx;
    const yAxis = chart.scales['y-axis-0'];
    const xAxis = chart.scales['x-axis-0'];
    const chartArea = chart.chartArea;

    if (!yAxis || !xAxis || !chartArea) return;

    const rightBoundary = chartArea.right;
    const leftBoundary = chartArea.left;
    const padding = 10; // pixels from edge to switch direction

    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      if (dataset.errorSquares) {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (meta.hidden) return;

        meta.data.forEach((element: any, index: number) => {
          const point = dataset.data[index];
          if (!point) return;

          const {x: centerX} = element.getCenterPoint();
          const regressY = yAxis.getPixelForValue(point.y);
          const dataY = yAxis.getPixelForValue(point.y1);
          let squareSize = Math.abs(dataY - regressY);

          // Ensure minimum size for visibility
          squareSize = Math.max(squareSize, 5);

          // Determine drawing direction
          let leftX, rightX;
          if (centerX + squareSize > rightBoundary - padding) {
            // Extend left when near right edge
            leftX = Math.max(centerX - squareSize, leftBoundary);
            rightX = centerX;
          } else {
            // Default to right extension
            leftX = centerX;
            rightX = Math.min(centerX + squareSize, rightBoundary);
          }

          // Draw the filled square
          ctx.save();
          
          // Semi-transparent fill (same color as border but with 20% opacity)
          ctx.fillStyle = dataset.borderColor 
            ? dataset.borderColor.replace(/[\d\.]+\)$/, '0.2)') 
            : 'rgba(255, 0, 0, 0.2)';
          ctx.fillRect(leftX, Math.min(regressY, dataY), 
                      rightX - leftX, squareSize);

          // Border
          ctx.strokeStyle = dataset.borderColor || 'rgba(255, 0, 0, 0.7)';
          ctx.lineWidth = dataset.borderWidth || 1;
          ctx.strokeRect(leftX, Math.min(regressY, dataY), 
                        rightX - leftX, squareSize);
          
          ctx.restore();
        });
      }
    });
  }
};

// Could be used to generate squares on linear regression chart in the future?
export const squareDemo = {
  afterDatasetsDraw: function(chartInstance: any) {
    const ctx = chartInstance.ctx;
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 50, 50); // This should draw a small red square at the top-left corner of the chart
    ctx.restore();
  }
};

export const oneProportionOffset = {
  id: 'offsetBar', 
  afterUpdate: function(chart: any) {
    const dataset = chart.config.data.datasets[2]
    let offset

    const meta: any = Object.values(dataset._meta)[0]
    if(meta.data.length > 0) {
      offset = -(meta.data[1]._model.x - meta.data[0]._model.x) / 2
    }

    // For every data in the dataset ...
    for (var i = 0; i < meta.data.length; i++) {
      // We get the model linked to this data
      var model = meta.data[i]._model
      
      // And add the offset to the 'x' property
      model.x += offset

      // .. and also to these two properties
      // to make the bezier curve fits the new data
      model.controlPointNextX += offset
      model.controlPointPreviousX += offset
    }
  }
}

export const oneProportionSampleLegendColor = {
  id: 'fixedSamplelegendColor',
  afterUpdate: function(chart: any) {
    chart.legend.legendItems[0].fillStyle = 'rgba(255, 0, 0, 0.8)'
  }
}

export const oneProportionDynamicBubbleSize = {
  id: 'dynamicBubbleSize',
  beforeUpdate: function(chart: any) {
    if(chart.mean) {
      const chartData = chart.config.data
      const dynamicSize = 50 / chartData.labels.length
      const minSize = 2
      chartData.datasets[1].radius = dynamicSize > minSize ? dynamicSize : minSize
    }
  }
}



export const movableReferenceLinePlugin = {
  id: 'ReferenceLine',
  dragging: false,
  initialY: 0,

  afterDraw: function (chart: any) {
    const refLineY = chart.options.referenceLinePosition;

    if (refLineY == null) return;

    const ctx = chart.chart.ctx;
    const yAxis = chart.scales['y-axis-0'];

    if (!yAxis) return;

    // Convert data value to pixel
    const y = yAxis.getPixelForValue(refLineY);

    // Draw reference line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(chart.chartArea.left, y);
    ctx.lineTo(chart.chartArea.right, y);
    ctx.strokeStyle = 'rgb(99, 255, 120)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.restore();
  },
  
  beforeInit: function (chart: any) {
    console.log('Plugin initialized, adding event listeners');
    const canvas = chart.chart.canvas;

    // Add mousedown event listener
    canvas.addEventListener('mousedown', function (event: MouseEvent) {
      const refLineY = chart.options.referenceLinePosition;
      const yAxis = chart.scales['y-axis-0'];

      if (yAxis) {
        // Get the canvas position relative to the screen
        const canvasRect = chart.chart.canvas.getBoundingClientRect();
        const mouseY = event.clientY - canvasRect.top;  // Correct mouse Y position relative to canvas

        const y = yAxis.getPixelForValue(refLineY);
        console.log('Mouse Y:', mouseY);  // Log mouse Y position
        console.log('Reference Line Y:', y);  // Log reference line Y position
        console.log('Difference:', Math.abs(mouseY - y));  // Log the difference
        console.log('refLineY value:', refLineY);

        // Check if the click is near the reference line
        if (Math.abs(mouseY - y) < 10) {
          console.log('Dragging started');
          movableReferenceLinePlugin.dragging = true;
          movableReferenceLinePlugin.initialY = mouseY;
          chart.options._draggingRefLine = true;
        }
      }
    });

    // Add mousemove event listener for dragging functionality
    canvas.addEventListener('mousemove', function (event: MouseEvent) {
      if (movableReferenceLinePlugin.dragging) {
        // Get the canvas position relative to the screen
        const canvasRect = chart.chart.canvas.getBoundingClientRect();
        const mouseY = event.clientY - canvasRect.top;  // Correct mouse Y position relative to canvas

        // Convert mouse position back to chart's data value
        const yAxis = chart.scales['y-axis-0'];
        const refLineValue = yAxis.getValueForPixel(mouseY);

        // Update the reference line position in chart's options
        chart.options.referenceLinePosition = refLineValue;
        chart.update();
      }
    });

    // Add mouseup event listener to stop dragging
    canvas.addEventListener('mouseup', function () {
      movableReferenceLinePlugin.dragging = false;
      chart.options._draggingRefLine = false;
      console.log('Dragging stopped');
    });
  }
};
