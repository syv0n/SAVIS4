import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { sampleCorrelation } from 'simple-statistics';
import { read } from 'xlsx';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss', '../../scss/base.scss'],
})
export class InputComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  isFileData: boolean = false;
  extension: string | undefined = undefined;
  fileContent: string | null = null;
  headers: string[] | undefined = [];
  fileData: any[] = [];
  select1 = new FormControl();
  select2 = new FormControl();

  chart1: any;
  chart2: any;
  demodata1: any[] = [
    // { x: 10, y: 10 },
    // { x: 11, y: 11 },
  ];
  demodata2: any[] = [
    // { x: 10, y: 10 },
    // { x: 11, y: 11 },
  ];
  datasets = {
    label: 'Correlation Values',
    legend: true,
    backgroundColor: 'orange',
    data: this.demodata1,
  };
  chartOptions = {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: this.datasets.label,
          data: this.datasets.data,
          backgroundColor: this.datasets.backgroundColor,
          pointRadius: 4,
        },
      ],
    },
    options: {
      legend: {
        display: this.datasets.legend,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: 'black',
              fontSize: 16,
              padding: 0,
            },
            scaleLabel: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: 'black',
              fontSize: 16,
              padding: 0,
            },
            scaleLabel: {
              display: true,
            },
          },
        ],
      },

      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: 'rgba(0,0,0,1.0)',
        bodyFontStyle: 'normal',
      },
    },
  };

  correlationValue1: string | null = null;
  correlationValue2: string | null = null;

  formGroupValues: FormGroup = new FormGroup({
    xValues: new FormControl(),
    yValues: new FormControl(),
  });

  get xValues() {
    return this.formGroupValues.get('xValues');
  }

  get yValues() {
    return this.formGroupValues.get('yValues');
  }

  getFormValues() {
    if (
      this.xValues?.value == null ||
      this.yValues?.value == null ||
      this.xValues?.value == '' ||
      this.yValues?.value == ''
    )
      return [[], []];
    let xValuesArray = this.xValues?.value.split(',');
    let yValuesArray = this.yValues?.value.split(',');
    // convert array values to ints
    xValuesArray = xValuesArray.map((x: string) => parseInt(x));
    yValuesArray = yValuesArray.map((x: string) => parseInt(x));
    return [xValuesArray, yValuesArray];
  }

  computeRegressionLine(xValues: number[], yValues: number[]): { x: number; y: number }[] {
    const n = xValues.length;
    const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
    const yMean = yValues.reduce((sum, val) => sum + val, 0) / n;
    
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
      numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
      denominator += Math.pow(xValues[i] - xMean, 2);
    }
    
    const slope = numerator / denominator;
    const intercept = yMean - slope * xMean;
    
    // Define the line using the min and max x values
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    
    return [
      { x: xMin, y: slope * xMin + intercept },
      { x: xMax, y: slope * xMax + intercept }
    ];
  }
    
  //For each point, residual = yᵢ – (m·xᵢ + b).
  computeResiduals(
    xVals: number[],
    yVals: number[],
    regressionData: { x: number; y: number }[]
  ): number[] {
    const [p1, p2] = regressionData;
    const slope = (p2.y - p1.y) / (p2.x - p1.x);
    const intercept = p1.y - slope * p1.x;
    return xVals.map((x, i) =>
      yVals[i] - (slope * x + intercept)
    );
  }

  //Simple density estimator
  computeDensities(
    data: { x: number; y: number }[],
    radius: number = 5
  ): number[] {
    return data.map((pt, _, arr) =>
      arr.reduce((count, other) => {
        const dx = pt.x - other.x;
        const dy = pt.y - other.y;
        return count + (Math.hypot(dx, dy) <= radius ? 1 : 0);
      }, 0)
    );
  }


  calculate(): void {
    let [xValuesArray, yValuesArray] = this.getFormValues();
  
    // Populate demodata1 with scatter points
    this.demodata1 = [];
    xValuesArray.forEach((val: number, idx: number) => {
      this.demodata1.push({ x: val, y: yValuesArray[idx] });
    });
  
    // Validate inputs
    if (xValuesArray.length !== yValuesArray.length || xValuesArray.length < 2) {
      alert('Incorrect Inputs');
      this.xValues?.setErrors({ notEqual: true });
      this.yValues?.setErrors({ notEqual: true });
      return;
    }
  
    // Calculate correlation coefficient (r‑value)
    this.correlationValue1 = sampleCorrelation(xValuesArray, yValuesArray).toFixed(2);
  
    // Decide regression‑line color: green if |r| ≥ 0.7, otherwise red
    const rVal     = parseFloat(this.correlationValue1);
    const lineColor = Math.abs(rVal) >= 0.7 ? 'green' : 'red';
  
    // Compute regression line data
    const regressionData = this.computeRegressionLine(xValuesArray, yValuesArray);
  
    // Update scatter dataset
    this.chart1.data.datasets[0].data = this.demodata1;
  
    // Compute residuals & densities for visual cues
    const residuals = this.computeResiduals(xValuesArray, yValuesArray, regressionData);
    const densities = this.computeDensities(this.demodata1);
  
    // Map residuals → color gradient (red ↑, blue ↓)
    const maxRes = Math.max(...residuals.map(Math.abs));
    const backgroundColors = residuals.map(r => {
      const intensity = Math.abs(r) / maxRes;
      const red  = Math.round(255 * intensity * (r > 0 ? 1 : 0));
      const blue = Math.round(255 * intensity * (r < 0 ? 1 : 0));
      return `rgba(${red},0,${blue},0.7)`;
    });
  
    // Map densities → point radius (3px–10px)
    const maxDen = Math.max(...densities);
    const pointRadii = densities.map(d => 3 + (7 * d / maxDen));
  
    // Apply scatter styles
    const ds = this.chart1.data.datasets[0] as any;
    ds.backgroundColor = backgroundColors;
    ds.pointRadius     = pointRadii;
  
    // Add or update the regression‑line dataset with dynamic color
    if (this.chart1.data.datasets.length < 2) {
      this.chart1.data.datasets.push({
        label: 'Regression Line',
        data: regressionData,
        type: 'line',
        borderColor: lineColor,
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        tension: 0
      });
    } else {
      const lineDs = this.chart1.data.datasets[1] as any;
      lineDs.data        = regressionData;
      lineDs.borderColor = lineColor;
    }
  
    // Render the updated chart
    this.chart1.update();
  
    // Clear for next run
    this.demodata1 = [];
  }  
  
  updateChart(chart: any, data: any) {
    chart!.data.datasets[0].data = data;
    chart!.update();
  }

  calculateFile() {
    // console.log(this.select1.value, this.select2.value);
    let selected1 = this.select1.value;
    let selected2 = this.select2.value;
    let xValuesArray: number[] = [];
    let yValuesArray: number[] = [];
    for (let i = 0; i < this.fileData.length; i++) {
      let data = this.fileData[i];
      xValuesArray.push(data[selected1]);
      yValuesArray.push(data[selected2]);
    }
    xValuesArray.forEach((val: number, idx: number) => {
      this.demodata2.push({ x: val, y: yValuesArray[idx] });
    });
    // console.log(xValuesArray, yValuesArray);
    this.correlationValue2 = sampleCorrelation(
      xValuesArray,
      yValuesArray
    ).toFixed(2);
    // Decide line color: green if R-value ≥ 0.7, otherwise red
    const rValue = parseFloat(this.correlationValue1);
    const lineColor = Math.abs(rValue) >= 0.7 ? 'green' : 'red';
    this.updateChart(this.chart2, this.demodata2);
    this.demodata2 = [];
  }

  readFileMethod(file: File): Promise<string> {
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        resolve(reader.result as string);
      };
    });
    
  }

  async onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (file.size < 0) {
      alert('Incompatible File');
      return;
    }
    const result = await this.readFileMethod(file);
    this.fileContent = result as string;

    // Check the file extension
    this.extension = file.name.split('.').pop()?.toLowerCase();

    switch (this.extension) {
      case 'csv':
        // console.log('CSV File Content (input):', this.fileContent);
        this.isFileData = true;
        this.parseCsv();
        break;
      case 'xlsx':
        // For XLSX files, use the read function from xlsx library
        const workbook = read(this.fileContent, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        this.fileContent = XLSX.utils.sheet_to_csv(sheet);
        // console.log('XLSX File Content (input):', this.fileContent);
        this.isFileData = true;
        this.parseCsv();
        break;

      default:
        alert(
          '❌ ERROR: Unsupported file type. Please upload a CSV or XLSX file.'
        );
        this.isFileData = false;
        break;
    }
  }

  parseCsv() {
    // parse csv manually
    const rows = this.fileContent!.split('\n');
    const headers = rows[0].split(',');
    const data = rows.slice(1).reduce((acc: any[], row) => {
      // row empty skip
      if (row.trim() === '') {
        // console.log(row);
        return acc;
      }
      const values = row.split(',');
      acc.push(
        headers.reduce((obj: { [key: string]: number }, header, i) => {
          obj[header] = parseInt(values[i]);
          return obj;
        }, {})
      );
      return acc;
    }, []);

    this.headers = headers;
    this.fileData = data;
    this.isFileData = true;
  }

  ngOnInit(): void {
    // this.chart1 = new chatClass('data-chart-1', this.datasets[0]);
    this.chart1 = new Chart('data-chart-1', this.chartOptions);
    this.chart2 = new Chart('data-chart-2', this.chartOptions);

    this.xValues?.valueChanges.subscribe({
      next: (e) => {
        this.xValues?.clearValidators();
      },
    });
    this.yValues?.valueChanges.subscribe({
      next: (e) => {
        this.yValues?.clearValidators();
      },
    });
    
  }
 
}
