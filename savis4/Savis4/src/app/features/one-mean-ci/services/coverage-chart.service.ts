import { Chart } from 'chart.js';

export class CoverageChartService {
  chart: any
  axis: any
  orientation: any

  constructor(canvasElement: CanvasRenderingContext2D, data: any[], orientation: any) {
    
    this.orientation = {
      horizontal: {
        h: 'x',
        v: 'y'
      },
      vertical: {
        h: 'y',
        v: 'x'
      }
    }

    this.axis = orientation['horizontal' || orientation]

    this.chart = new Chart(canvasElement, {
      type: 'scatter',
      data: {
        datasets: data
      },
      options: {
        animation: {
          duration: 0
        },
        elements: {
          line: {
            fill: false
          }
        },
        responsive: true,
        scales: {
          xAxes: [
            {
              ticks: {
                min: 0,
                suggestedMax: 100,
                stepSize: 1,
              },
              scaleLabel: {
                display: true,
                labelString: ''
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                stepSize: 1,
              },
              scaleLabel: {
                display: true,
                labelString: ''
              }
            }
          ]
        },
        showLines: true,
      }
    })
  }

  round(number: any) {
    return Math.ceil(number * 1000) / 1000
  }

  setScales(config: any) {
    const hMin = config.x_init || 0
    const hMax = config.x_term || 100
    const vMin = config.y_init || 0
    const vMax = config.y_term || 100

    const hDiff = hMax - hMin
    const vDiff = vMax - vMin
    
    const hStep = hDiff ? Math.floor(hDiff * 0.1) : 1
    const vStep = vDiff ? Math.floor(vDiff * 0.2) : 1

    this.chart.options.scales['yAxes'][0].ticks.stepSize = hStep
    this.chart.options.scales['xAxes'][0].ticks.stepSize = vStep
  }

  setAxisLabels(xLabel: any, yLabel: any){
    this.chart.options.scales.xAxes[0].scaleLabel.labelString = xLabel;
    this.chart.options.scales.yAxes[0].scaleLabel.labelString = yLabel;
  }

  clear() {
    for (let dataset of this.chart.data.datasets) {
      dataset.data = []
    }

    this.setScales({})
  }

  updateChartData(rawDataArrays: any) {
    for (let idx = 0; idx < rawDataArrays.length; idx++) {
      this.chart.data.datasets[idx].data = rawDataArrays[idx]
    }
  }
}