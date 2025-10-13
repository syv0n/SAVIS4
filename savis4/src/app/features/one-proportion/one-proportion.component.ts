import { AfterViewInit, Component, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { oneProportionDynamicBubbleSize, oneProportionOffset, oneProportionSampleLegendColor } from '../../Utils/chartjs-plugin';
import type { Paragraph, Table } from 'docx';

@Component({
  selector: 'app-one-proportion',
  templateUrl: './one-proportion.component.html',
  styleUrls: ['./one-proportion.component.scss']
})
export class OneProportionComponent implements AfterViewInit, OnChanges{
  /**
   * number of coins to be flipped
   */
  noOfCoin: number = 5
  /**
   * probability of getting a head
   */
  probability: number = 0.5
  /**
   * Chart labels
   */
  labels: string[] = []
  /**
   * Binomial data
   */
  binomialData: number[] = []
  /**
   * Sample data
   */
  samples: number[] = []
  /**
   * Selected area within the data
   */
  selected: number[] = []
  /**
   * Mean of the data
   */
  mean: number = NaN
  /**
   * Standard deviation of the data
   */
  std: number = NaN
  /**
   * Number of selected data
   */
  noOfSelected: number = 0
  /**
   * Total number of samples
   */
  totalSamples: number = 0
  /**
   * Lower range of the selected area
   */
  lowerSelectedRange: number = 0
  /**
   * Upper range of the selected area
   */
  upperSelectedRange: number = 0
  /**
   * Number of samples in each draw
   */
  thisSampleSizes: number = 1
  /**
   * Zoom in or out of the chart
   */
  zoomIn: boolean = false
  /**
   * Interval of data in the selected area
   */
  interval: number = 0

  /**
   * Proportion of the selected area
   */
  proportion: string = '0/0 = NaN'

  /**
   * Chart colors
   */
  colors = {
    sample: "rgba(255, 0, 0, 0.7)",
      binomial: "rgba(0, 0, 255, 0.6)",
      selected: "rgba(0, 255, 0, 0.6)",
      line: "rgba(0, 255, 0, 0.6)",
      box: "rgba(0, 255, 0, 0.1)",
      invisible: "rgba(0, 255, 0, 0.0)"
  }

  /**
   * Chart object
   */
  chart: Chart
  /**
   * Chart canvas (HTML element)
   */
  @ViewChild('chartCanvas') chartCanvas: ElementRef<HTMLCanvasElement>


  constructor(
    private translate: TranslateService,
    ) {
      Chart.pluginService.register(oneProportionOffset)
      
      Chart.pluginService.register(oneProportionSampleLegendColor)
      
      Chart.pluginService.register(oneProportionDynamicBubbleSize)

  }

  /**
   * After the view is initialized, create the chart
   */
  ngAfterViewInit(): void {
      this.createChart()
  }

  /**
   * Create the chart and set the chart settings
   */
  createChart(): void {
    const context = this.chartCanvas.nativeElement.getContext('2d')
    if(context){
      this.chart = new Chart(context, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              label: this.translate.instant('op_bar_sample'),
              data: [],
              borderWidth: 1,
              // id: 'x-axis-1',
              backgroundColor: this.colors.sample,
              hidden: false,
            },
            {
              type: 'line',
              label: this.translate.instant('op_bar_binomial'),
              data: [],
              borderWidth: 1,
              // id: 'x-axis-2',
              borderColor: this.colors.binomial,
              backgroundColor: this.colors.binomial,
              pointRadius: 3,
              pointHoverRadius: 15,
              pointHoverBackgroundColor: this.colors.binomial,
              fill: false,
              hidden: false,
              showLine: false,
            },
            {
              type: 'line',
              label: this.translate.instant('op_bar_selected'),
              data: [],
              borderWidth: 0.1,
              // id: 'x-axis-3',
              backgroundColor: this.colors.selected,
              hidden: false,
              fill: 'end',
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  autoSkip: true,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('op_bar_num_samples'),
                  // fontColor: 'black',
                  // fontSize: 14
                }
              }
            ],
            xAxes: [
              {
                // barPercentage: 1.0,
                scaleLabel: {
                  display: true,
                  labelString: `${this.translate.instant('op_bar_heads')} ` + this.noOfCoin + ` ${this.translate.instant('op_bar_heads2')}`,
                  // fontColor: 'black',
                  // fontSize: 14
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: true,
          tooltips: {
            mode: 'index',
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            callbacks: {
              title: function(tooltipItem, data) {
                if (tooltipItem[0]) {
                  let title = tooltipItem[0].xLabel || ''
                  title += ` heads`;
                  return title.toString(); // Explicitly convert to string
                }
                return '' // Return an empty string if tooltipItem[0] is undefined
              },
              label: (tooltipItem, data) => {
                if (tooltipItem && tooltipItem.datasetIndex !== undefined) {
                  if (tooltipItem.datasetIndex !== 2) {
                    return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${tooltipItem.yLabel}`;
                  } else {
                    return `${data.datasets?.[tooltipItem.datasetIndex]?.label} : ${
                      this.interval
                    }`
                  }
                }
                return '' // Return an empty string if tooltipItem or tooltipItem.datasetIndex is undefined
              }
            }
          }
        }  
      })
    }

    (this.chart as any).mean = this.mean

    // Event listener for double click to zoom in and out
    this.chart.canvas.ondblclick = () => {
      if (this.noOfCoin >= 50) {
          this.zoomIn = !this.zoomIn; // toggle zoomIn
          this.updateChart();
      }
    }
  }

  /**
   * Reset the data and the chart
   */
  reset() {
    this.noOfCoin = 5
    this.probability = 0.5
    this.labels = []
    this.binomialData = []
    this.samples = []
    this.selected = []
    this.mean = NaN
    this.std = NaN
    this.noOfSelected = 0
    this.totalSamples = 0
    this.thisSampleSizes = 1
    this.lowerSelectedRange = 0
    this.upperSelectedRange = 0
    this.zoomIn = false
    this.interval = 0
    this.proportion = '0/0 = NaN'

    this.resetChart()
  }

  /**
   * Reset the chart
   */
  resetChart(): void {
    if(this.chart) {
      this.chart.destroy()
    }
    this.createChart()
    console.log("chart reset")
  }
  
  /**
   * When the draw sample button is clicked, draw the samples and update the chart
   */
  sampleDraw() {
    if(this.zoomIn){
      this.zoomIn = false
    }

    this.totalSamples += this.thisSampleSizes

    const newSamples = this.drawSamples()
    this.binomialData = this.calculateBionomial()
    this.selected = this.generateSelectedArray()

    if(this.samples.length === 0) {
      this.samples = Array(this.noOfCoin + 1).fill(0)
    }
    this.samples = this.addSamples(this.samples, newSamples)

    if (this.chart && this.chart.data && this.chart.data.datasets && this.chart.data.datasets[0] && this.chart.data.datasets[1] && this.chart.data.datasets[2]) {
      this.chart.data.datasets[0].data = this.samples
      this.chart.data.datasets[1].data = this.binomialData
      this.chart.data.datasets[2].data = this.selected
    }

    this.mean = this.calculateMean()
    this.std = this.calculateStd() || 0

    this.generateLabels()
    this.chart.data.labels = this.labels

    this.interval = this.calculateSamplesSelected()
    this.proportion = `${this.interval}/${this.totalSamples} = ${(this.interval / this.totalSamples).toFixed(3)}`

    this.chart.update()
  }

  /**
   * Generate the labels for the chart
   * this is for the x-axis
   */
  generateLabels(): void {
    this.labels = Array(this.noOfCoin + 1)
    for (let i = 0; i < this.noOfCoin + 1; i++) {
      this.labels[i] = i.toString()
    }

    this.chart.data.labels = this.labels
    this.chart.update()
  }

  /**
   * Recalculate the samples and update the chart when the number of coins is changed
   */
  recalculateSamples():void {
    this.samples = []
    this.generateLabels()

    const reSamples = this.drawSamplesWithSameSize()
    
    if(this.samples.length === 0) {
      this.samples = Array(this.noOfCoin + 1).fill(0)
    }
    this.samples = this.addSamples(this.samples, reSamples)

    this.mean = this.calculateMean()
    this.std = this.calculateStd() || 0
    this.interval = this.calculateSamplesSelected()
    this.proportion = `${this.interval}/${this.totalSamples} = ${(this.interval / this.totalSamples).toFixed(3)}`
    this.binomialData = this.calculateBionomial()

    this.chart.data.datasets[0].data = this.samples
    this.chart.data.datasets[1].data = this.binomialData
    this.chart.update()
  }

  /**
   * Update the selected area of the chart
   */
  updateSelected(): void {
    this.binomialData = this.calculateBionomial();
    this.interval = this.calculateSamplesSelected();
    this.proportion = `${this.interval}/${this.totalSamples} = ${(this.interval / this.totalSamples).toFixed(3)}`;

    if (!this.zoomIn) {
        this.generateLabels();
        this.chart.data.labels = this.labels;
        this.chart.data.datasets[1].data = this.binomialData;
        this.chart.data.datasets[2].data = this.generateSelectedArray();
    } else {
        const roundedMean = Math.floor(this.probability * this.noOfCoin);
        const HALF_WIDTH = 25;
        let lowerRange, upperRange;

        if (roundedMean - HALF_WIDTH <= 0) {
            lowerRange = 0;
            upperRange = lowerRange + HALF_WIDTH * 2;
        } else if (roundedMean + HALF_WIDTH >= this.noOfCoin) {
            upperRange = this.noOfCoin + 1;
            lowerRange = upperRange - HALF_WIDTH * 2;
        } else {
            lowerRange = roundedMean - HALF_WIDTH;
            upperRange = roundedMean + HALF_WIDTH;
        }

        upperRange = lowerRange + HALF_WIDTH * 2;

        this.chart.data.datasets[1].data = this.binomialData.slice(lowerRange, upperRange);
        this.chart.data.datasets[2].data = this.generateSelectedArray().slice(lowerRange, upperRange);
    }

    this.chart.update();
}

  /**
   * Generate an array to represent the selected area
   * @returns Array of 0s and NaNs to represent the selected area
   */
  generateSelectedArray(): Array<number> {
    const lower = this.lowerSelectedRange >= 0 ? this.lowerSelectedRange : 0
    const upper = this.upperSelectedRange <= this.noOfCoin + 2 ? this.upperSelectedRange : this.noOfCoin + 2

    const select = Array(this.noOfCoin + 2).fill(NaN)

    return select.map((x, i) => {
      if(i >= lower && i <= upper + 1) {
        return 0
      }
      return x
    })
  }

  /**
   * Calculate the binomial data of each point
   * @returns Array of binomial data
   */
  calculateBionomial(): Array<number> {
    const coeff = Array(this.noOfCoin + 1).fill(0)
    coeff[0] = 1

    const binomialBase = Array(this.noOfCoin + 1)

    binomialBase[0] = Math.pow(1 - this.probability, this.noOfCoin)
    for(let i = 1; i < this.noOfCoin + 1; i++) {
      coeff[i] = (coeff[i - 1] * (this.noOfCoin + 1 - i)) / i

      binomialBase[i] = coeff[i] * Math.pow(1 - this.probability, this.noOfCoin - i) * Math.pow(this.probability, i)
    }
    return binomialBase.map(x => x * this.totalSamples)
  }

  /**
   * Draw the samples using the current sample size
   * @returns Array of samples
   */
  drawSamples() : Array<Array<number>> {
    const drawResults = Array(this.thisSampleSizes)

    for(let i = 0; i < this.thisSampleSizes; i++) {
      const singleDraw = Array(this.noOfCoin).fill(NaN)
      drawResults[i] = singleDraw.map(x => {
        return Math.random() < this.probability ? 1 : 0
      })
    }

    return drawResults
  }

  /**
   * Draw the samples with the same sample size
   * @returns Array of samples
   */
  drawSamplesWithSameSize() : Array<Array<number>> {
    const drawResults = Array(this.totalSamples)

    for(let i = 0; i < this.totalSamples; i++) {
      const singleDraw = Array(this.noOfCoin).fill(NaN)
      drawResults[i] = singleDraw.map(x => {
        return Math.random() < this.probability ? 1 : 0
      })
    }

    return drawResults
  }

  /**
   * Calculate the mean of the samples
   * @returns Mean of the samples
   */
  calculateMean(): number {
    return (
      this.samples.reduce((acc: number, x: number, i: number) => acc + x * i, 0) / this.samples.reduce((acc: any, x: any) => acc+ x, 0)
    )
  }

  /**
   * Calculate the standard deviation of the samples
   * @returns Standard deviation of the samples
   */
  calculateStd(): number {
    const mean = this.calculateMean()

    return Math.sqrt(
      this.samples.reduce((acc: number, x: number, i: number) => acc + (i - mean) * (i - mean) * x, 0) /
      (this.samples.reduce((acc: any, x: any) => acc + x, 0) - 1)
    )
  }

  /**
   * Calculate the number of samples selected
   * @returns Number of samples selected
   */
  calculateSamplesSelected(): number {
    const lower = this.lowerSelectedRange >= 0 ? this.lowerSelectedRange : 0
    const upper = this.upperSelectedRange <= this.samples.length ? this.upperSelectedRange : this.samples.length

    return this.samples.reduce((acc, x, i) => {
      if(i >= lower && i <= upper) {
        return acc + x
      }
      return acc
    }, 0)
  }

  /**
   * Add the new samples to the original samples
   * @param originalSamples Original samples
   * @param drawResults New samples
   * @returns Updated samples
   */ 
  addSamples(originalSamples: any[], drawResults: any[]) {
    const summary = drawResults.reduce((acc, eachDraw) => {
      const noOfHead = eachDraw.reduce((accHeads: any, head: any) => accHeads + head, 0)
      const headsCount = acc[noOfHead] + 1 || 1
      return { ...acc, [noOfHead]: headsCount }
    }, {})

    return originalSamples.map((x, i) => x + (summary[i] || 0))
  }

  /**
   * Update the chart if the zoom in or out is changed
   * This method will trigger when a double click event is involved
   * If the number of coins is less than 50, the zoom in will not work
   * Slice the data to show only the selected area
   */
  updateChart() {
    this.selected = this.generateSelectedArray()
    if(!this.zoomIn) {
      this.chart.data.labels = this.labels
      if (this.chart && this.chart.data && this.chart.data.datasets && this.chart.data.datasets[0] && this.chart.data.datasets[1] && this.chart.data.datasets[2]){
        this.chart.data.datasets[0].data = this.samples
        this.chart.data.datasets[1].data = this.binomialData
        this.chart.data.datasets[2].data = this.selected
      }
    } else {
      const roundedMean = Math.floor(this.probability * this.noOfCoin)
      const HALF_WIDTH = 25
      let lowerRange, upperRange

      if (roundedMean - HALF_WIDTH <= 0) {
        lowerRange = 0
        upperRange = lowerRange + HALF_WIDTH * 2
      } else if (roundedMean + HALF_WIDTH >= this.noOfCoin) {
        upperRange = this.noOfCoin + 1
        lowerRange = upperRange - HALF_WIDTH * 2
      } else {
        lowerRange = roundedMean - HALF_WIDTH
        upperRange = roundedMean + HALF_WIDTH
      }

      upperRange = lowerRange + HALF_WIDTH * 2

      this.chart.data.labels = this.labels.slice(lowerRange, upperRange)
      this.chart.data.datasets[0].data = this.samples.slice(lowerRange, upperRange)
      this.chart.data.datasets[1].data = this.binomialData.slice(lowerRange, upperRange)
      this.chart.data.datasets[2].data = this.selected.slice(lowerRange, upperRange)
    }

    const maxSamples = Math.max(...this.samples)

    if (maxSamples > 10) {
      if(maxSamples <= 100) {
        this.chart.options.scales.yAxes[0].ticks.max = maxSamples + ( 10 - (maxSamples % 10) )
      } else {
        this.chart.options.scales.yAxes[0].ticks.max = maxSamples + ( 100 - (maxSamples % 100) )
      }
    }

    (this.chart as CustomChart).mean = this.mean

    if (this.chart && this.chart.options && this.chart.options.scales && this.chart.options.scales.xAxes && this.chart.options.scales.xAxes[0] && this.chart.options.scales.xAxes[0].scaleLabel) {
      this.chart.options.scales.xAxes[0].scaleLabel.labelString = `${this.translate.instant('op_bar_heads')} ` + this.upperSelectedRange + ` ${this.translate.instant('op_bar_heads2')}`;
    }

    this.chart.update()

  }

  /**
   * Update the chart if any changes are detected
   */
  ngOnChanges() {
    this.updateChart()
  }



  /**
   * @description Helper function to gather and format the chart data for export.
   * It compiles the frequency data and a summary of key statistics.
   * @returns An object containing table headers, data rows, and a statistics string.
   */
  private getExportData(): { headers: string[], rows: (string | number)[][], stats: string } {
    const headers = ['Heads', 'Frequency'];
    const rows = this.samples.map((count, index) => [index, count]).filter(row => row[1] > 0);
    const stats = `Total Samples: ${this.totalSamples}\nMean: ${this.mean.toFixed(3)}\nStd Dev: ${this.std.toFixed(3)}`;
    return { headers, rows, stats };
  }

  /**
   * @description Exports the current chart view and its associated data as a PDF document.
   * This function dynamically imports the required libraries only when called.
   */
  async exportAsPDF(): Promise<void> {
    if (this.totalSamples === 0) return;
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      const { headers, rows, stats } = this.getExportData();

      const doc = new jsPDF();
      doc.setFontSize(16).text('One Proportion Hypothesis Test Export', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

      const imgData = this.chart.toBase64Image();
      const canvas = this.chartCanvas.nativeElement;
      const imgHeight = (canvas.height * 170) / canvas.width;
      doc.addImage(imgData, 'PNG', 15, 25, 170, imgHeight);

      doc.setFontSize(12).text('Summary Statistics', 15, 35 + imgHeight);
      doc.setFontSize(10).text(stats, 15, 42 + imgHeight);
      
      autoTable(doc, {
        startY: 65 + imgHeight,
        head: [headers],
        body: rows,
      });
      doc.save('one-proportion-export.pdf');
    } catch (error) { console.error("Failed to generate PDF:", error); }
  }

  /**
   * @description Exports the current chart view and its associated data as a DOCX document.
   * This function dynamically imports the required libraries only when called.
   */
  async exportAsDOCX(): Promise<void> {
    if (this.totalSamples === 0) return;
    const { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, AlignmentType } = await import('docx');
    const FileSaver = await import('file-saver');
    const { headers, rows, stats } = this.getExportData();

    const children: (Paragraph | Table)[] = [
      new Paragraph({ children: [new TextRun({ text: 'One Proportion Hypothesis Test Export', bold: true, size: 32 })], alignment: AlignmentType.CENTER })
    ];
    
    const imgData = this.chart.toBase64Image();
    children.push(new Paragraph({
      children: [new ImageRun({ type: "png", data: imgData.split(',')[1], transformation: { width: 500, height: 250 } })]
    }));

    children.push(new Paragraph({ children: [new TextRun({ text: 'Summary Statistics', bold: true, size: 24, break: 1 })] }));
    stats.split('\n').forEach(line => {
      children.push(new Paragraph({ children: [new TextRun(line)] }));
    });
    
    const tableHeader = new TableRow({
        children: headers.map(headerText => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: headerText, bold: true })] })] })),
    });
    const dataRows = rows.map(row => new TableRow({
        children: row.map(cellText => new TableCell({ children: [new Paragraph(String(cellText))] })),
    }));
    const docxTable = new Table({ rows: [tableHeader, ...dataRows], width: { size: 100, type: WidthType.PERCENTAGE } });
    children.push(docxTable);

    const doc = new Document({ sections: [{ children }] });
    Packer.toBlob(doc).then(blob => FileSaver.saveAs(blob, 'one-proportion-export.docx'));
  }


  /**
   * Unregister the chart plugins when the component is destroyed
   */
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy() {
    Chart.pluginService.unregister(oneProportionOffset)
    Chart.pluginService.unregister(oneProportionSampleLegendColor)
    Chart.pluginService.unregister(oneProportionDynamicBubbleSize)
  }

}

interface CustomChart extends Chart {
  mean: number
}