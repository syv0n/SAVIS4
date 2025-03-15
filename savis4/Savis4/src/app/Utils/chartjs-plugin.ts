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