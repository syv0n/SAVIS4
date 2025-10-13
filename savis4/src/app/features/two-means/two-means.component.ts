import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChartDataSets, ChartType, Chart } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { chatClass } from 'src/app/Utils/stacked-dot';
import { Sampling } from 'src/app/Utils/sampling';
import { TailchartService } from 'src/app/Utils/tailchart.service';
import * as XLS from 'xlsx';

import { TranslateService } from '@ngx-translate/core'; 
import { SharedService } from '../../services/shared.service';
import { MathService } from '../../Utils/math.service';
import type { Paragraph, Table } from 'docx';

@Component({
  selector: 'app-two-means',
  templateUrl: './two-means.component.html',
  styleUrls: ['./two-means.component.scss']
})
export class TwoMeansComponent implements OnInit, AfterViewInit, OnDestroy {
  activateSim: boolean = false
  dataSize1: number = 0
  dataSize2: number = 0
  datamean2: number = 0
  datamean1: number = 0
  mean_diff: number = 0
  numofSem: number = 1
  samDisActive = false
  lastSummary: any
  chart1: any
  chart2: any
  chart3: any
  chart4: any
  minmax: any
  csvraw: any
  csv: any
  sections: any = {
    sectionOne: true,
    sectionTwo: true,
    sectionThree: true
  }
  simsummary: any = {
    sampleMean1: NaN,
    sampleMean2: NaN,
    sampleMeanDiff: NaN,
  }
  demodata: any = [
  ]
  datasets = [
    { label: "Group 1", legend: true, backgroundColor: 'orange', data: this.demodata },
    { label: "Group 2", legend: true, backgroundColor: 'rebeccapurple', data: this.demodata },
    { label: "Group 3", legend: false, backgroundColor: 'rebeccapurple', data: this.demodata },
    { label: "Group 3", legend: false, backgroundColor: 'rebeccapurple', data: this.demodata },
  ];

  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = [];
  chartColors: Color[] = [
    {
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ];
  chartType: ChartType = 'scatter';

  summaryData: ChartDataSets[] = [];

  numberOfSimulations: number;

  minTailValInput: number = 0
  maxTailValInput: number = 0

  includeValMin: any
  includeValMax: any

  @ViewChild('diffChart') chart5Ref: ElementRef<HTMLCanvasElement>

  chart5: Chart

  simulations: any[] = []

  total: string = ''
  chosen: string = ''
  proportion: string = ''
  stdDev: string = ''

  CIdisabled: boolean = true


  constructor(
    private smp: Sampling, 
    private tail: TailchartService, 
    private translate: TranslateService,
    private sharedService: SharedService
  ) {

  }
  toggleSection(e: any, sec: string) {
    this.sections[sec] = e.target.checked
  }
  dataTextArea: string = '';
  data: any
  updateData(csvData: number[][] | null) {
    if (csvData){
      this.dataSize1 = this.csv[0].length
      this.dataSize2 = this.csv[1].length
      this.datamean1 = Number(this.calculateMean(this.csv[0]).toFixed(3))
      this.datamean2 = Number(this.calculateMean(this.csv[1]).toFixed(3))
      this.mean_diff = Number((this.datamean1 - this.datamean2).toFixed(3))
      let dataValues = this.csv[0].concat(this.csv[1]);
      let min = Math.min.apply(undefined, dataValues);
      let max = Math.max.apply(undefined, dataValues);
      this.minmax = {
        "min": min,
        "max": max,
      }
      let rData = {
        "minmax": this.minmax,
        "data": [this.csv[0]],
        "label": "Group 1",
        "backgroundColor": "orange"
      }
      let rData2 = {
        "minmax": this.minmax,
        "data": [this.csv[1]],
        "label": "Group 2",
        "backgroundColor": "rebeccapurple"
      }

      this.chart1.setScale(min, max)
      this.chart2.setScale(min, max)
      this.chart1.setDataFromRaw(rData)
      this.chart2.setDataFromRaw(rData2)
      this.chart1.chart.update(0)
      this.chart2.chart.update(0)
      this.activateSim = true
    }
    else{
      this.csv = []; // Or set to null if appropriate
      this.dataSize1 = 0;
      this.dataSize2 = 0;
      this.datamean2 = null;
      this.mean_diff = null;
    }
  }

  calculateMean(data: number[]) {
    if (data.length === 0) {
      return 0;
    }
    const sum = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const mean = sum / data.length;
    return mean;
  }
  onResetChart() {
    this.chart1.clear()
    this.chart2.clear()
    this.chart3.clear()
    this.chart4.clear()
    this.chart1.chart.update(0)
    this.chart2.chart.update(0)
    this.chart3.chart.update(0)
    this.chart4.chart.update(0)
    this.csvraw = ''
    this.simulations = []
    this.numofSem = 1
    this.includeValMax = false
    this.includeValMin = false
    this.activateSim = false
    this.samDisActive = false
    this.simsummary = {
      sampleMean1: NaN,
      sampleMean2: NaN,
      sampleMeanDiff: NaN,
    }
    this.minTailValInput = 0
    this.maxTailValInput = 0
    this.total = ''
    this.chosen = ''
    this.proportion = ''
    this.stdDev = ''
    this.dataSize1 = 0
    this.dataSize2 = 0
    this.datamean2 = 0
    this.datamean1 = 0
    this.mean_diff = 0
    this.CIdisabled = true
    console.log("chart reset")
  }

  async ngOnInit() {
    this.chart1 = new chatClass("data-chart-1", this.datasets[0]);
    this.chart2 = new chatClass("data-chart-2", this.datasets[1]);
    this.chart3 = new chatClass("data-chart-3", this.datasets[3]);
    this.chart4 = new chatClass("data-chart-4", this.datasets[3]);

    this.chart1.chart.data.datasets[0].label = this.translate.instant('tm_group1')
    this.chart2.chart.data.datasets[0].label = this.translate.instant('tm_group2')

    this.chart1.chart.update(0)
    this.chart2.chart.update(0)
   
    this.sharedService.currentData.subscribe(data => this.csvraw = data)
  }

  ngAfterViewInit() {
    this.createChart5()
  }

  createChart5() {
    const ctx = this.chart5Ref.nativeElement.getContext('2d')
    if (ctx) {
      this.chart5 = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: `0 < ${this.translate.instant('tm_differences')} < 1`,
              backgroundColor: 'green',
              data: [],
            },
            {
              label: `${this.translate.instant('tm_differences')} ≤ 0 ∪ 1 ≤ ${this.translate.instant('tm_differences')}`,
              backgroundColor: 'red',
              data: [],
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('tm_diff_mean'),
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 0,
                  min: 0,
                  stepSize: 1,
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('tm_freq'),
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontSize: 16,
          },
          animation: {
            duration: 0,
          }
        }
      })
    }
  }

  loadData(): void {
    this.csv = this.parseData(this.csvraw.trim());
    console.log(this.csv);
    this.updateData(this.csv)
    this.CIdisabled = false

  }
  

  updateChart(data: string): void {
    
    const rows = data.split('\n');
    const parsedData = rows.map(row => {
      const [group, value] = row.split(',').map(Number);
      return { x: value, y: group };
    });

    this.chartData = [
      {
        data: parsedData,
        label: 'Original Data',
        pointRadius: 6,
      },
    ];

    this.chartLabels = parsedData.map((_, index) => `Data Point ${index + 1}`);
  }
  updateSummaryChart(data: string): void {
    const rows = data.split('\n');
    const group1Data = rows.map(row => (parseFloat(row.split(',')[1])) as number).filter(value => !isNaN(value));
    const group2Data: number[] = []; // Empty array for Group 2 data
  
    const sizeGroup1 = group1Data.length;
    const meanGroup1 = sizeGroup1 > 0 ? group1Data.reduce((acc, val) => acc + val, 0) / sizeGroup1 : NaN;
  
    const sizeGroup2 = group2Data.length;
    const meanGroup2 = sizeGroup2 > 0 ? group2Data.reduce((acc, val) => acc + val, 0) / sizeGroup2 : NaN;
  
    const diffOfMeans = isNaN(meanGroup1) || isNaN(meanGroup2) ? NaN : meanGroup1 - meanGroup2;
  
    this.summaryData = [
      { data: [sizeGroup1, meanGroup1, sizeGroup2, meanGroup2, diffOfMeans], label: 'Summary Statistics' },
    ];
  }

  sampleSelect(e: any) {
    this.csv = null
    let link = ""
    if (e.target.value == "sample1") {
      link = "../../../assets/twomean_sample1.csv"
    } else {
      link = "../../../assets/twomean_sample2.csv"

    }
    fetch(link).then(data => data.text())
      .then((data) => {
        this.csvraw = data
        this.csv = this.parseData(data.trim());

      })
  }

  parseData(dataText: any) {
    let items = dataText
      .split(/[\r\n]+/)
      .filter((line: any) => line.length)
      .map((line: any) => {
        let [group, value] = line.split(',');
        return [group, value * 1.0];
      });
    let faceted: any = {};
    for (let [group, value] of items) {
      if (!faceted[group]) {
        faceted[group] = [];
      }
      faceted[group].push(value);
    }
    return Object.values(faceted);
  }

  runSim() {
    let numSims = this.numofSem * 1;
    let results = [];
    for (let simIdx = 0; simIdx < numSims; simIdx++) {
      let allData = [];
      for (let item of this.csv[0]) {
        allData.push({ datasetId: 0, value: item });
      }
      for (let item of this.csv[1]) {
        allData.push({ datasetId: 1, value: item });
      }
      if (allData.length === 0) {
        return;
      }
      let { chosen, unchosen } = this.smp.randomSubset(allData, this.csv[0].length);
      this.chart3.setDataFromRaw(this.addSimulationSample(chosen));
      this.chart4.setDataFromRaw(this.addSimulationSample(unchosen));
      this.chart3.chart.update();
      this.chart4.chart.update();

      // TODO(matthewmerrill): This is very unclear.
      let sampleValues = [chosen.map(a => a.value), unchosen.map(a => a.value)];
      let mean0 = this.calculateMean(sampleValues[0]);
      let mean1 = this.calculateMean(sampleValues[1]);
      let sampleDiffOfMeans = mean1 - mean0;
      this.simulations.push(sampleDiffOfMeans)
      results.push(sampleDiffOfMeans);

      this.simsummary = {
        sampleMean1: Number(mean0.toFixed(3)),
        sampleMean2: Number(mean1.toFixed(3)),
        sampleMeanDiff: Number(sampleDiffOfMeans.toFixed(3))
      };
      this.tail.addAllResults(results)
    }
    this.samDisActive = true
    // this.charts.tailChart.addAllResults(results);
    // this.updateSimResults();

    this.buildci()
  }

  buildci() {
    const confidenceLevel = 95

    const [lower, upper] = MathService.getCutOffInterval(confidenceLevel, this.simulations.length)
    const temp = this.simulations.map(val => val)

    temp.sort((a, b) => a - b)

    this.minTailValInput = temp[lower]
    this.maxTailValInput = temp[upper >= temp.length ? upper - 1: upper]

    const dataCustomChart = this.splitByPredicate(
      this.simulations,
      this.predicateForTail(this.minTailValInput, this.maxTailValInput)
    )

    this.chart5.data.datasets[0].label = `${this.minTailValInput} < ${this.translate.instant('tm_differences')} < ${this.maxTailValInput}`
    this.chart5.data.datasets[1].label = `${this.translate.instant('tm_differences')} ≤ ${this.minTailValInput} ∪ ${this.maxTailValInput} ≤ ${this.translate.instant('tm_differences')}`

    this.setDataFromRaw(this.chart5, [dataCustomChart.chosen, dataCustomChart.unchosen])
    this.scaleToStackDots(this.chart5)
    this.chart5.update()

    this.updateInfoSampleMeans(dataCustomChart.chosen.length, dataCustomChart.unchosen.length)
  }

  updateInfoSampleMeans(totalChosen: number, totalUnchosen: number) {
    const proportionChosen = MathService.roundToPlaces(totalChosen / this.simulations.length, 4)
    const proportionUnchosen = MathService.roundToPlaces(totalUnchosen / this.simulations.length, 4)

    this.total = this.simulations.length.toString()
    this.stdDev = MathService.stddev(this.simulations).toFixed(4).toString()
    this.chosen = `${totalChosen} / ${this.simulations.length} = ${proportionChosen}`
    this.proportion = `${totalUnchosen} / ${this.simulations.length} = ${proportionUnchosen}`
  }

  splitByPredicate(itr:any, fn:any) {
    const chosen: any[] = []
    let unchosen = []

    if (fn === null) unchosen = itr
    else {
      itr.forEach((x: any) => {
        if (fn(x)) chosen.push(x)
        else unchosen.push(x)
      })
    }
    return { chosen, unchosen }
  }

  predicateForTail(left: any, right: any) {
    const limits = {min: this.includeValMin, max: this.includeValMax}
    if (limits.min && limits.max) {
      return function (x: any) {
        return x >= left && x <= right
      }
    } else if (limits.min && !limits.max) {
      return function (x: any) {
        return x >= left && x < right
      }
    } else if (!limits.min && limits.max) {
      return function (x: any) {
        return x > left && x <= right
      }
    } else if (!limits.min && !limits.max) {
      return function (x: any) {
        return x > left && x < right
      }
    } else return null
  }

  setDataFromRaw(chart: Chart, rawDataArrays: any) {
    let scatterArrays = this.rawToScatter(rawDataArrays)
    for(let idx = 0; idx < rawDataArrays.length; idx++) {
      chart.data.datasets[idx].data = scatterArrays[idx]
    }
    let max = 1
    for (let dataset of scatterArrays) {
      for (let item of dataset) {
        max = Math.max(max, item.y)
      }
    }
  }

  rawToScatter(arrs: any[]) {
    let faceted = [];
    let counts: { [key: string]: number } = {}; // Add type annotation
    for (let arr of arrs) {
      let scatter = [];
      for (let item of arr) {
        let y = (counts[item] = (counts[item] || 0) + 1);
        scatter.push({ x: item, y: y });
      }
      faceted.push(scatter);
    }
    return faceted;
  }

  scaleToStackDots(chart: any) {
    let max = 1
    for (let dataset of chart.data.datasets) {
      for (let item of dataset.data) {
        max = Math.max(max, item.y)
      }
    }

    chart.options.scales.yAxes[0].ticks.stepSize = (max > 10) ? Math.ceil(max * 0.2) : 1


    if(max > 1000) {
      chart.options.scales.yAxes[0].ticks.min = 0
    }

    for (let datasets of chart.data.datasets) {
      datasets.pointRadius = 8
    }

    return chart
  }

  addSimulationSample(sample: any[]) {
    let a: any = []
    let b: any = []
    let facetedArrays = [a, b];
    for (let item of sample) {
      facetedArrays[item.datasetId].push(item.value);
    }
    let rData2 = {
      "minmax": this.minmax,
      "data": facetedArrays
    }
    return rData2
  }

  onFileSelected(e: any) {
    const files = e.target.files || e.dataTransfer?.files;
    if (files.length) {
      const file = files[0]
      const filereader = new FileReader();
      filereader.readAsBinaryString(file)
      filereader.onload = () => {
        const wb = XLS.read(filereader.result, { type: 'binary' })
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const row = XLS.utils.sheet_to_csv(wb.Sheets[sheets[0]])
          this.csvraw = row
          this.csv = this.parseData(this.csvraw.trim())
        }
      }
    }

  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.onFileSelected(event)
  }



  /**
   * @description Helper function to create a DOCX table from headers and data rows.
   * @param headers An array of strings for the table header.
   * @param rows A 2D array of strings or numbers for the table body.
   * @returns A Promise that resolves to a DOCX Table object.
   */
  private async createDocxTable(headers: string[], rows: (string | number)[][]): Promise<Table> {
    const { Table, TableRow, TableCell, Paragraph, TextRun, WidthType } = await import('docx');
    
    const header = new TableRow({
        children: headers.map(headerText => new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: headerText, bold: true })] })]
        })),
    });

    const dataRows = rows.map(row => new TableRow({
        children: row.map(cellText => new TableCell({ children: [new Paragraph(String(cellText))] })),
    }));
    
    return new Table({ rows: [header, ...dataRows], width: { size: 100, type: WidthType.PERCENTAGE } });
  }

  // --- Section 1: Original Data Exports ---

  /**
   * @description Exports the original data charts (Group 1 and Group 2) and summary table as a PDF document.
   */
  async exportDataAsPDF(): Promise<void> {
    if (!this.activateSim) return;
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF();
      
      doc.setFontSize(16).text('Two Means Significance Test - Data Export', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      
      // --- Add Charts ---
      doc.setFontSize(12).text('Group 1 Data', 15, 25);
      const img1Data = this.chart1.chart.toBase64Image();
      const img1Height = (this.chart1.chart.canvas.height * 170) / this.chart1.chart.canvas.width;
      doc.addImage(img1Data, 'PNG', 15, 30, 170, img1Height);
      
      const chart2YPos = 40 + img1Height;
      doc.setFontSize(12).text('Group 2 Data', 15, chart2YPos);
      const img2Data = this.chart2.chart.toBase64Image();
      const img2Height = (this.chart2.chart.canvas.height * 170) / this.chart2.chart.canvas.width;
      doc.addImage(img2Data, 'PNG', 15, chart2YPos + 5, 170, img2Height);

      // --- ADDED: Create and add summary data table ---
      const tableBody = [
        ['Size n (Group 1)', this.dataSize1],
        ['Mean 1 (Group 1)', this.datamean1],
        ['Size n (Group 2)', this.dataSize2],
        ['Mean 2 (Group 2)', this.datamean2],
        ['Difference of Means (Mean 1 - Mean 2)', this.mean_diff]
      ];
      
      autoTable(doc, {
        startY: chart2YPos + img2Height + 15,
        head: [['Statistic', 'Value']],
        body: tableBody,
      });
      
      doc.save('two-means-data-export.pdf');
    } catch (error) { console.error("Failed to generate PDF:", error); }
  }

  /**
   * @description Exports the original data charts (Group 1 and Group 2) and summary table as a DOCX document.
   */
  async exportDataAsDOCX(): Promise<void> {
    if (!this.activateSim) return;
    const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Table } = await import('docx');
    const FileSaver = await import('file-saver');

    // --- ADDED: Create summary data table ---
    const tableHeaders = ['Statistic', 'Value'];
    const tableRows = [
        ['Size n (Group 1)', this.dataSize1],
        ['Mean 1 (Group 1)', this.datamean1],
        ['Size n (Group 2)', this.dataSize2],
        ['Mean 2 (Group 2)', this.datamean2],
        ['Difference of Means (Mean 1 - Mean 2)', this.mean_diff]
    ];
    const summaryTable = await this.createDocxTable(tableHeaders, tableRows);

    const children: (Paragraph | Table)[] = [
      new Paragraph({ children: [new TextRun({ text: 'Two Means Significance Test - Data Export', bold: true, size: 32 })], alignment: AlignmentType.CENTER }),
      new Paragraph({ children: [new TextRun({ text: 'Group 1 Data', bold: true, size: 24, break: 1 })] }),
      new Paragraph({ children: [new ImageRun({ type: "png", data: this.chart1.chart.toBase64Image().split(',')[1], transformation: { width: 500, height: 250 } })] }),
      new Paragraph({ children: [new TextRun({ text: 'Group 2 Data', bold: true, size: 24, break: 1 })] }),
      new Paragraph({ children: [new ImageRun({ type: "png", data: this.chart2.chart.toBase64Image().split(',')[1], transformation: { width: 500, height: 250 } })] }),
      new Paragraph({ children: [new TextRun({ text: 'Summary Statistics', bold: true, size: 24, break: 1 })] }),
      summaryTable // Add table to document
    ];

    const doc = new Document({ sections: [{ children }] });
    Packer.toBlob(doc).then(blob => FileSaver.saveAs(blob, 'two-means-data-export.docx'));
  }

  // --- Section 2: Simulation Exports ---

  /**
   * @description Exports the charts and summary table from the most recent simulation run as a PDF document.
   */
  async exportSimulationAsPDF(): Promise<void> {
    if (!this.samDisActive) return;
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF();
      doc.setFontSize(16).text('Two Means Significance Test - Simulation Export', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      
      // --- Add Charts ---
      doc.setFontSize(12).text('Resampled Group 1', 15, 25);
      const img3Data = this.chart3.chart.toBase64Image();
      const img3Height = (this.chart3.chart.canvas.height * 170) / this.chart3.chart.canvas.width;
      doc.addImage(img3Data, 'PNG', 15, 30, 170, img3Height);
      
      const chart4YPos = 40 + img3Height;
      doc.setFontSize(12).text('Resampled Group 2', 15, chart4YPos);
      const img4Data = this.chart4.chart.toBase64Image();
      const img4Height = (this.chart4.chart.canvas.height * 170) / this.chart4.chart.canvas.width;
      doc.addImage(img4Data, 'PNG', 15, chart4YPos + 5, 170, img4Height);
      
      // --- ADDED: Create and add summary data table ---
      const tableBody = [
        ['Mean (Resampled Group 1)', this.simsummary.sampleMean1],
        ['Mean (Resampled Group 2)', this.simsummary.sampleMean2],
        ['Difference of Means', this.simsummary.sampleMeanDiff]
      ];
      
      autoTable(doc, {
        startY: chart4YPos + img4Height + 15,
        head: [['Statistic', 'Value']],
        body: tableBody,
      });

      doc.save('two-means-simulation-export.pdf');
    } catch (error) { console.error("Failed to generate PDF:", error); }
  }

  /**
   * @description Exports the charts and summary table from the most recent simulation run as a DOCX document.
   */
  async exportSimulationAsDOCX(): Promise<void> {
    if (!this.samDisActive) return;
    const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Table } = await import('docx');
    const FileSaver = await import('file-saver');

    // --- ADDED: Create summary data table ---
    const tableHeaders = ['Statistic', 'Value'];
    const tableRows = [
      ['Mean (Resampled Group 1)', this.simsummary.sampleMean1],
      ['Mean (Resampled Group 2)', this.simsummary.sampleMean2],
      ['Difference of Means', this.simsummary.sampleMeanDiff]
    ];
    const summaryTable = await this.createDocxTable(tableHeaders, tableRows);

    const children: (Paragraph | Table)[] = [
      new Paragraph({ children: [new TextRun({ text: 'Two Means Significance Test - Simulation Export', bold: true, size: 32 })], alignment: AlignmentType.CENTER }),
      new Paragraph({ children: [new TextRun({ text: 'Resampled Group 1', bold: true, size: 24, break: 1 })] }),
      new Paragraph({ children: [new ImageRun({ type: "png", data: this.chart3.chart.toBase64Image().split(',')[1], transformation: { width: 500, height: 250 } })] }),
      new Paragraph({ children: [new TextRun({ text: 'Resampled Group 2', bold: true, size: 24, break: 1 })] }),
      new Paragraph({ children: [new ImageRun({ type: "png", data: this.chart4.chart.toBase64Image().split(',')[1], transformation: { width: 500, height: 250 } })] }),
      new Paragraph({ children: [new TextRun({ text: 'Summary Statistics', bold: true, size: 24, break: 1 })] }),
      summaryTable // Add table to document
    ];

    const doc = new Document({ sections: [{ children }] });
    Packer.toBlob(doc).then(blob => FileSaver.saveAs(blob, 'two-means-simulation-export.docx'));
  }

  // --- Section 3: Distribution Exports ---

  /**
   * @description Exports the sampling distribution chart and its data table as a PDF document.
   */
  async exportDistributionAsPDF(): Promise<void> {
    if (this.simulations.length === 0) return;
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      const doc = new jsPDF();
      
      doc.setFontSize(16).text('Two Means Significance Test - Sampling Distribution Export', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      
      const imgData = this.chart5.toBase64Image();
      const canvas = this.chart5Ref.nativeElement;
      const imgHeight = (canvas.height * 170) / canvas.width;
      doc.addImage(imgData, 'PNG', 15, 25, 170, imgHeight);
      
      const tableRows = this.simulations.map((mean, index) => [index + 1, mean.toFixed(4)]);
      autoTable(doc, {
        startY: 35 + imgHeight,
        head: [['Simulation #', 'Difference of Means']],
        body: tableRows,
      });
      doc.save('two-means-distribution-export.pdf');
    } catch (error) { console.error("Failed to generate PDF:", error); }
  }

  /**
   * @description Exports the sampling distribution chart and its data table as a DOCX document.
   */
  async exportDistributionAsDOCX(): Promise<void> {
    if (this.simulations.length === 0) return;
    const { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Table } = await import('docx');
    const FileSaver = await import('file-saver');

    const children: (Paragraph | Table)[] = [
      new Paragraph({ children: [new TextRun({ text: 'Two Means Significance Test - Sampling Distribution Export', bold: true, size: 32 })], alignment: AlignmentType.CENTER })
    ];
    
    const imgData = this.chart5.toBase64Image();
    children.push(new Paragraph({ children: [new ImageRun({ type: "png", data: imgData.split(',')[1], transformation: { width: 500, height: 250 } })] }));
    
    const tableRows = this.simulations.map((mean, index) => [index + 1, mean.toFixed(4)]);
    const docxTable = await this.createDocxTable(['Simulation #', 'Difference of Means'], tableRows);
    children.push(docxTable);

    const doc = new Document({ sections: [{ children }] });
    Packer.toBlob(doc).then(blob => FileSaver.saveAs(blob, 'two-means-distribution-export.docx'));
  }


  ngOnDestroy(): void {
    this.sharedService.changeData('')
  }
}
