import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class InputComponent implements OnInit, OnDestroy {
  constructor(private translate: TranslateService) {}

  isFileData: boolean = false;
  extension: string | undefined = undefined;
  fileContent: string | null = null;
  headers: string[] | undefined = [];
  fileData: any[] = [];
  select1 = new FormControl();
  select2 = new FormControl();

  chart1: any;
  demodata1: any[] = [
    // { x: 10, y: 10 },
    // { x: 11, y: 11 },
  ];

  // ------- draggable reference-line support -------
  canvasEl: HTMLCanvasElement | null = null;
  dragging = { active: false, pointIndex: -1 };
  regressionText: string = '';
  controlDatasetIndex: number = 2; // 0=scatter, 1=line, 2=controls
  // internal stored bound handlers for add/remove listener correctness
  private _boundOnPointerDown: any;
  private _boundOnPointerMove: any;
  private _boundOnPointerUp: any;
  // -------------------------------------------------

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

  // --- pointer & conversion helpers (support Chart.js v2 & v3) ---
  private getScale(nameHint: 'x' | 'y') {
    if (!this.chart1 || !this.chart1.scales) return null;
    const scales = this.chart1.scales;
    if (scales[nameHint]) return scales[nameHint];
    const keys = Object.keys(scales);
    for (const k of keys) if (k.toLowerCase().includes(nameHint)) return scales[k];
    return null;
  }

  private clientToData(evt: PointerEvent) {
    if (!this.canvasEl || !this.chart1) return null;
    const rect = this.canvasEl.getBoundingClientRect();
    const px = evt.clientX - rect.left;
    const py = evt.clientY - rect.top;

    const xScale: any = this.getScale('x');
    const yScale: any = this.getScale('y');
    if (!xScale || !yScale) return null;

    let xVal: number | null = null;
    let yVal: number | null = null;

    if (typeof xScale.getValueForPixel === 'function') {
      xVal = xScale.getValueForPixel(px);
    } else {
      const left = xScale.left ?? this.chart1.chartArea.left;
      const right = xScale.right ?? this.chart1.chartArea.right;
      const min = xScale.min ?? xScale.ticks[0];
      const max = xScale.max ?? xScale.ticks[xScale.ticks.length - 1];
      xVal = min + ((px - left) / (right - left)) * (max - min);
    }

    if (typeof yScale.getValueForPixel === 'function') {
      yVal = yScale.getValueForPixel(py);
    } else {
      const top = yScale.top ?? this.chart1.chartArea.top;
      const bottom = yScale.bottom ?? this.chart1.chartArea.bottom;
      const min = yScale.min ?? yScale.ticks[0];
      const max = yScale.max ?? yScale.ticks[yScale.ticks.length - 1];
      yVal = max - ((py - top) / (bottom - top)) * (max - min);
    }

    return { x: xVal, y: yVal, px, py };
  }

  private findNearestControlPoint(px: number, py: number, threshold = 12) {
    if (!this.chart1) return -1;
    const controlDs = this.chart1.data.datasets[this.controlDatasetIndex];
    if (!controlDs || !controlDs.data) return -1;
    let nearest = -1;
    let bestDist = threshold;
    for (let i = 0; i < controlDs.data.length; i++) {
      const pt = controlDs.data[i];
      const xScale: any = this.getScale('x');
      const yScale: any = this.getScale('y');
      let xPixel = px, yPixel = py;
      if (xScale && typeof xScale.getPixelForValue === 'function') {
        xPixel = xScale.getPixelForValue(pt.x);
        yPixel = yScale.getPixelForValue(pt.y);
      } else {
        const left = xScale.left ?? this.chart1.chartArea.left;
        const right = xScale.right ?? this.chart1.chartArea.right;
        const top = yScale.top ?? this.chart1.chartArea.top;
        const bottom = yScale.bottom ?? this.chart1.chartArea.bottom;
        const xMin = xScale.min ?? xScale.ticks[0];
        const xMax = xScale.max ?? xScale.ticks[xScale.ticks.length - 1];
        const yMin = yScale.min ?? yScale.ticks[0];
        const yMax = yScale.max ?? yScale.ticks[yScale.ticks.length - 1];
        xPixel = left + ((pt.x - xMin) / (xMax - xMin)) * (right - left);
        yPixel = top + ((yMax - pt.y) / (yMax - yMin)) * (bottom - top);
      }

      const dist = Math.hypot(px - xPixel, py - yPixel);
      if (dist <= bestDist) {
        bestDist = dist;
        nearest = i;
      }
    }
    return nearest;
  }

  onPointerDown(evt: PointerEvent) {
    if (!this.canvasEl) return;
    const d = this.clientToData(evt);
    if (!d) return;
    const nearest = this.findNearestControlPoint(d.px, d.py);
    if (nearest >= 0) {
      this.dragging.active = true;
      this.dragging.pointIndex = nearest;
      try { (evt.target as Element).setPointerCapture(evt.pointerId); } catch (_) {}
    }
  }

  onPointerMove(evt: PointerEvent) {
    if (!this.dragging.active || this.dragging.pointIndex < 0) return;
    const d = this.clientToData(evt);
    if (!d) return;
    
    // Get current control point position
    const controlDs = this.chart1.data.datasets[this.controlDatasetIndex] as any;
    const currentPoint = controlDs.data[this.dragging.pointIndex];
    
    // Apply damping factor to reduce sensitivity (0.3 = 30% of mouse movement)
    const dampingFactor = 0.3;
    const dampedX = currentPoint.x + (d.x - currentPoint.x) * dampingFactor;
    const dampedY = currentPoint.y + (d.y - currentPoint.y) * dampingFactor;
    
    // Update control point with damped position
    controlDs.data[this.dragging.pointIndex] = { x: dampedX, y: dampedY };
    const p1 = controlDs.data[0];
    const p2 = controlDs.data[1];
    const lineDs = this.chart1.data.datasets[1] as any;
    lineDs.data = [{ x: p1.x, y: p1.y }, { x: p2.x, y: p2.y }];
    this.updateRegressionTextFromEndpoints(p1, p2);
    try { this.chart1.update('none'); } catch { this.chart1.update(); }
  }

  onPointerUp(evt: PointerEvent) {
    if (this.dragging.active) {
      this.dragging.active = false;
      this.dragging.pointIndex = -1;
      try { (evt.target as Element).releasePointerCapture(evt.pointerId); } catch (_) {}
      this.chart1.update();
    }
  }

  private updateRegressionTextFromEndpoints(p1: {x:number,y:number}, p2: {x:number,y:number}) {
    const dx = p2.x - p1.x;
    if (Math.abs(dx) < 1e-12) {
      this.regressionText = `x = ${p1.x.toFixed(2)}`;
      return;
    }
    const slope = (p2.y - p1.y) / dx;
    const intercept = p1.y - slope * p1.x;
    this.regressionText = `y = ${slope.toFixed(2)}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept).toFixed(2)}`;
  }
  // ---------------------------------------------------------

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
  
    // Calculate correlation coefficient (r-value)
    this.correlationValue1 = sampleCorrelation(xValuesArray, yValuesArray).toFixed(2);
  
    // Decide regression-line color: green if |r| ≥ 0.7, otherwise red
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
  
    // Add or update the regression-line dataset with dynamic color
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
  
    // create/update control points dataset for dragging endpoints
    const controlPoints = regressionData.map(p => ({ x: p.x, y: p.y }));
    if (this.chart1.data.datasets.length <= this.controlDatasetIndex) {
      this.chart1.data.datasets.push({
        label: 'Line Controls',
        type: 'scatter',
        data: controlPoints,
        backgroundColor: 'rgba(0,0,0,0.8)',
        pointRadius: 6,
        showLine: false,
        order: 3
      });
    } else {
      const controlDs = this.chart1.data.datasets[this.controlDatasetIndex] as any;
      controlDs.data = controlPoints;
    }
  
    // update regressionText from current endpoints
    const cp = controlPoints;
    if (cp && cp.length >= 2) {
      this.updateRegressionTextFromEndpoints(cp[0], cp[1]);
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
    
    // Populate demodata1 with scatter points from file
    this.demodata1 = [];
    xValuesArray.forEach((val: number, idx: number) => {
      this.demodata1.push({ x: val, y: yValuesArray[idx] });
    });
    
    // Validate inputs
    if (xValuesArray.length !== yValuesArray.length || xValuesArray.length < 2) {
      alert('Incorrect Inputs');
      return;
    }
    
    // Calculate correlation coefficient (r-value)
    this.correlationValue1 = sampleCorrelation(xValuesArray, yValuesArray).toFixed(2);
    
    // Decide regression-line color: green if |r| ≥ 0.7, otherwise red
    const rVal = parseFloat(this.correlationValue1);
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
    
    // Add or update the regression-line dataset with dynamic color
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
    
    // create/update control points dataset for dragging endpoints
    const controlPoints = regressionData.map(p => ({ x: p.x, y: p.y }));
    if (this.chart1.data.datasets.length <= this.controlDatasetIndex) {
      this.chart1.data.datasets.push({
        label: 'Line Controls',
        type: 'scatter',
        data: controlPoints,
        backgroundColor: 'rgba(0,0,0,0.8)',
        pointRadius: 6,
        showLine: false,
        order: 3
      });
    } else {
      const controlDs = this.chart1.data.datasets[this.controlDatasetIndex] as any;
      controlDs.data = controlPoints;
    }
    
    // update regressionText from current endpoints
    const cp = controlPoints;
    if (cp && cp.length >= 2) {
      this.updateRegressionTextFromEndpoints(cp[0], cp[1]);
    }
    
    // Render the updated chart
    this.chart1.update();
    
    // Clear for next run
    this.demodata1 = [];
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
    this.chart1 = new Chart('data-chart-1', this.chartOptions);

    // Format scatter/control point tooltips to two decimals
    if (this.chart1) {
      // Chart.js v2 style
      if ((this.chart1.options as any).tooltips !== undefined) {
        (this.chart1.options as any).tooltips.callbacks = {
          label: function (tooltipItem: any, data: any) {
            // v2 uses xLabel/yLabel sometimes; fall back to parsed/raw for v3 shape
            const x = tooltipItem.xLabel ?? tooltipItem.x ?? (tooltipItem.parsed && tooltipItem.parsed.x) ?? (tooltipItem.raw && tooltipItem.raw.x);
            const y = tooltipItem.yLabel ?? tooltipItem.y ?? (tooltipItem.parsed && tooltipItem.parsed.y) ?? (tooltipItem.raw && tooltipItem.raw.y);
            return `(${Number(x).toFixed(2)}, ${Number(y).toFixed(2)})`;
          },
        };
      } else if ((this.chart1.options as any).plugins && (this.chart1.options as any).plugins.tooltip) {
        // Chart.js v3+ style
        (this.chart1.options as any).plugins.tooltip.callbacks = {
          label: function (context: any) {
            const x = context.parsed?.x ?? context.raw?.x;
            const y = context.parsed?.y ?? context.raw?.y;
            return `(${Number(x).toFixed(2)}, ${Number(y).toFixed(2)})`;
          },
        };
      }
      try { this.chart1.update(); } catch { /* no-op */ }
    }

    // save canvas element and attach pointer listeners (bound handlers stored for clean removal)
    this.canvasEl = document.getElementById('data-chart-1') as HTMLCanvasElement;
    if (this.canvasEl) {
      this._boundOnPointerDown = this.onPointerDown.bind(this);
      this._boundOnPointerMove = this.onPointerMove.bind(this);
      this._boundOnPointerUp = this.onPointerUp.bind(this);
      this.canvasEl.addEventListener('pointerdown', this._boundOnPointerDown);
      this.canvasEl.addEventListener('pointermove', this._boundOnPointerMove);
      this.canvasEl.addEventListener('pointerup', this._boundOnPointerUp);
      this.canvasEl.addEventListener('pointercancel', this._boundOnPointerUp);
    }

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

  ngOnDestroy(): void {
    // Remove listeners if we attached them
    if (this.canvasEl) {
      if (this._boundOnPointerDown) this.canvasEl.removeEventListener('pointerdown', this._boundOnPointerDown);
      if (this._boundOnPointerMove) this.canvasEl.removeEventListener('pointermove', this._boundOnPointerMove);
      if (this._boundOnPointerUp) this.canvasEl.removeEventListener('pointerup', this._boundOnPointerUp);
      if (this._boundOnPointerUp) this.canvasEl.removeEventListener('pointercancel', this._boundOnPointerUp);
    }
  }
 
}
