import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, Chart, ChartData } from 'chart.js'; // Change this line
import { errorBarsPlugin, movableReferenceLinePlugin } from '../../../Utils/chartjs-plugin';
import { errorSquaresPlugin } from '../../../Utils/chartjs-plugin';
import { BaseChartDirective } from 'ng2-charts';
import { TranslateService } from '@ngx-translate/core';

declare module 'chart.js' {
  interface ChartDataSets {
    errorBarsY1?: boolean;
    errorSquares?: boolean;
  }

  interface ChartOptions {
    referenceLineSlope?: number;
    referenceLineIntercept?: number;
    _draggingRefLine?: boolean;
  }
}

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss']
})
export class ScatterPlotComponent implements OnChanges {
  @Input() dataPoints: { x: number, y: number }[] = [];
  scatterChartData: ChartDataSets[] = [];
  @Input() scatterChartOptions: ChartOptions = {};
  @Input() scatterChartLegend: boolean = true;
  @Input() scatterChartType: ChartType = 'scatter'; // Change this line
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  leastSquares: number = 0;
  private slope: number = 0;
  private intercept: number = 0;
  public regressionFormula: string = '';
  public activeLine: 'regression' | 'reference' = 'regression';

  private refLineDrag = {
    dragging: false,
    initialY: 0
  };
  
  constructor(private translate: TranslateService) {
    Chart.plugins.register(errorBarsPlugin);
    Chart.plugins.register(errorSquaresPlugin);

    this.scatterChartOptions = {
      scales: {
        xAxes: [{ type: 'linear', position: 'bottom', id: 'x-axis-0' }],
        yAxes: [{ type: 'linear', position: 'left', id: 'y-axis-0' }]
    },
    referenceLineSlop: 0,
    referenceLineIntercept: 0
  } as ChartOptions & any;   // 👈 allow scales without TS error


    /*this.scatterChartOptions = {
      referenceLinePosition: 0,
      scales: {
        yAxes: [
          { id: 'y-axis-0', type: 'linear', position: 'left' }
        ],
        xAxes: [
          { id: 'x-axis-0', type: 'linear', position: 'bottom' }
        ]
      }
    } as any;*/
  }

  ngAfterViewInit(): void {
    if (!this.chart) return;
    this.chart.update();

    const canvas = this.chart.chart.canvas;

    canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataPoints']) {
      this.updateRegressionParameters();

      this.scatterChartOptions.referenceLineSlope = this.slope;
      this.scatterChartOptions.referenceLineIntercept = this.intercept;

      this.updateChartData();
      this.leastSquares = this.calculateLeastSquares();
    }
  }

  ngOnDestroy(): void {
    Chart.plugins.unregister(errorBarsPlugin);
    Chart.plugins.unregister(errorSquaresPlugin);
  }

  private initializeReferenceLine() {
    if (!this.chart || !this.dataPoints.length) return;
    //const yValues = this.dataPoints.map(p => p.y);
    this.scatterChartOptions.referenceLineSlope = this.slope;
    this.scatterChartOptions.referenceLineIntercept = this.intercept;

    //this.scatterChartOptions.referenceLineIntercept = (Math.min(...yValues) + Math.max(...yValues)) / 2;
  }

  private updateChartData(): void {
    const regressionPoints = this.calculateRegressionPoints();
    const confidenceInterval = this.calculateConfidenceInterval();

    const m = this.scatterChartOptions.referenceLineSlope!;
    const b = this.scatterChartOptions.referenceLineIntercept!;

    // Create dataset for the reference line
    const referenceLineDataset: ChartDataSets = {        
      type: 'line',
      label: 'Reference Line',
      data: this.dataPoints.map(p => ({ x: p.x, y: m * p.x + b})),
      borderColor: 'rgb(99, 255,120)',
      borderWidth: 2,
      borderDash: [5, 5],
      fill: false,
      pointRadius: 0
    };
  
    this.scatterChartData = [
      {
        data: this.dataPoints,
        label: this.translate.instant('lr_scatter_plot')
      },
      // Regression line dataset
      {
        type: 'line',
        label: this.translate.instant('lr_regression_line'),
        data: regressionPoints,
        fill: false,
        borderColor: 'rgba(255, 0, 0, 0.7)',
        cubicInterpolationMode: 'monotone'
      },
      // Upper bound of confidence interval
      {
        type: 'line',
        label: this.translate.instant('lr_upper_bound'),
        data: confidenceInterval.upper,
        fill: '+1',
        borderColor: 'rgba(0, 255, 0, 0.5)',
        cubicInterpolationMode: 'monotone'
      },
      // Lower bound of confidence interval
      {
        type: 'line',
        label: this.translate.instant('lr_lower_bound'),
        data: confidenceInterval.lower,
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.5)',
        cubicInterpolationMode: 'monotone'
      },
      this.calculateErrorBars(),
      this.calculateErrorSquares(),
      referenceLineDataset
    ];
  }

  private onMouseDown(event: MouseEvent) {
    if (!this.chart) return;
    const chartAny = this.chart.chart as any;
    const yAxis = chartAny.scales['y-axis-0'];
    const xAxis = chartAny.scales['x-axis-0'];
//    const yAxis = (this.chart.chart.scales as any)['y-axis-0'];
    const canvasRect = this.chart.chart.canvas.getBoundingClientRect();

    const mouseY = event.clientY - canvasRect.top;
    const mouseX = event.clientX - canvasRect.left;

    const dataX = xAxis.getValueForPixel(mouseX);

    const m = this.scatterChartOptions.referenceLineSlope!;
    const b = this.scatterChartOptions.referenceLineIntercept!;
    const lineYValue = m * dataX + b;

    const lineYPixel = yAxis.getPixelForValue(lineYValue);
    
    if (Math.abs(mouseY - lineYPixel) < 10) {
      this.refLineDrag.dragging = true;
      this.refLineDrag.initialY = mouseY;
    }
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.refLineDrag.dragging || !this.chart) return;
    const chartAny = this.chart.chart as any;
    const yAxis = chartAny.scales['y-axis-0'];
//    const yAxis = (this.chart.chart.scales as any)['y-axis-0'];
    const canvasRect = this.chart.chart.canvas.getBoundingClientRect();
    const mouseY = event.clientY - canvasRect.top;
    const initialY  = this.refLineDrag.initialY;

    const deltaYValue = yAxis.getValueForPixel(mouseY) - yAxis.getValueForPixel(initialY);
    //const newValue = yAxis.getValueForPixel(mouseY);
    this.scatterChartOptions.referenceLineIntercept += deltaYValue;

    this.refLineDrag.initialY = mouseY;

    const m = this.scatterChartOptions.referenceLineSlope!;
    const b = this.scatterChartOptions.referenceLineIntercept!;

    const refLineDataset = this.scatterChartData.find(ds => ds.label === 'Reference Line');
    if (refLineDataset) {
      refLineDataset.data = this.dataPoints.map(p => ({
        x: p.x,
        y: m * p.x + b
      }));
    }

    this.chart.update();

    this.leastSquares = this.calculateLeastSquaresForReferenceLine(m, b);
  }

  private onMouseUp() {
    this.refLineDrag.dragging = false;
  }

  private calculateLeastSquaresForReferenceLine(m: number, b: number): number {
    return this.dataPoints.reduce((sum, p) => sum + Math.pow(p.y - (m * p.x +b), 2), 0);
  }

  private calculateRegressionPoints(): { x: number, y: number }[] {
    const n = this.dataPoints.length;

    if (n < 2) {
      // Linear regression requires at least two points
      return [];
    }
  
    // Calculate the mean of x and y
    const meanX = this.dataPoints.reduce((sum, point) => sum + point.x, 0) / n;
    const meanY = this.dataPoints.reduce((sum, point) => sum + point.y, 0) / n;
  
    // Calculate the slope (m) and y-intercept (b)
    const numerator = this.dataPoints.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
    const denominator = this.dataPoints.reduce((sum, point) => sum + Math.pow(point.x - meanX, 2), 0);
  
    const m = numerator / denominator;
    const b = meanY - m * meanX;
  
    // Calculate regression points
    return this.dataPoints.map(point => ({ x: point.x, y: m * point.x + b }));
  }

  private calculateConfidenceInterval(): { upper: { x: number, y: number }[], lower: { x: number, y: number }[] } {
    const regressionPoints = this.calculateRegressionPoints();
  
    // Calculate standard error of the regression coefficients (slope and intercept)
    const n = this.dataPoints.length;
    const meanX = this.dataPoints.reduce((sum, point) => sum + point.x, 0) / n;
    const meanY = this.dataPoints.reduce((sum, point) => sum + point.y, 0) / n;
  
    const numerator = this.dataPoints.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0);
    const denominator = this.dataPoints.reduce((sum, point) => sum + Math.pow(point.x - meanX, 2), 0);
  
    const m = numerator / denominator;
    const b = meanY - m * meanX;
  
    const residuals = this.dataPoints.map(point => point.y - (m * point.x + b));
    const sumSquaredResiduals = residuals.reduce((sum, residual) => sum + Math.pow(residual, 2), 0);
  
    const stdErrorM = Math.sqrt(sumSquaredResiduals / ((n - 2) * denominator)); // Standard error of the slope
    const tValue = 2.447; // For a 95% confidence interval with (n-2) degrees of freedom
  
    const upper = regressionPoints.map(point => ({ x: point.x, y: point.y + tValue * stdErrorM }));
    const lower = regressionPoints.map(point => ({ x: point.x, y: point.y - tValue * stdErrorM }));
  
    return { upper, lower };
  }

  private calculateLeastSquares(): number {
    const regressionPoints = this.calculateRegressionPoints();
    
    // Calculate the sum of squared residuals
    let sumSquaredResiduals = 0;
    for (let i = 0; i < this.dataPoints.length; i++) {
      const actualY = this.dataPoints[i].y;
      const predictedY = regressionPoints[i].y;
      sumSquaredResiduals += Math.pow(actualY - predictedY, 2);
    }
  
    return sumSquaredResiduals;
  }
  
  private calculateErrorSquares(): ChartDataSets {
    return {
      type: 'scatter', // Changed from 'line' to 'scatter'
      label: 'Residual Squares',
      data: this.dataPoints.map(point => ({
        x: point.x,
        y: this.calculateRegressionY(point.x),
        y1: point.y
      })),
      showLine: false,
      pointRadius: 0,
      borderColor: 'rgba(23, 12, 233, 1)',
      borderWidth: 1,
      errorSquares: true
    };
  }

  private calculateErrorBars(): ChartDataSets {
    const errorBarsData = this.dataPoints.map(point => {
      const regressionY = this.calculateRegressionY(point.x)
      const errorMargin = Math.abs(point.y - regressionY)

      return {
        x: point.x,
        y: regressionY,
        y1: point.y
      }
    })

    return {
      type: 'line',
      label: this.translate.instant('lr_error_bars'),
      data: errorBarsData,
      showLine: false,
      pointRadius: 0,
      borderColor: 'rgba(23, 12, 233, 1)',
      borderWidth: 2,
      errorBarsY1: true
    }
  }

  private updateRegressionParameters(): void {
    const n = this.dataPoints.length
    const meanX = this.mean(this.dataPoints.map(p => p.x))
    const meanY = this.mean(this.dataPoints.map(p => p.y))

    const numerator = this.dataPoints.reduce((sum, point) => sum + (point.x - meanX) * (point.y - meanY), 0)
    const denominator = this.dataPoints.reduce((sum, point) => sum + Math.pow(point.x - meanX, 2), 0)

    this.slope = numerator / denominator
    this.intercept = meanY - this.slope * meanX

    this.regressionFormula = `y = ${this.slope.toFixed(2)}x ${this.intercept >= 0 ? '+' : '-'} ${Math.abs(this.intercept).toFixed(2)}`;
  }

  private calculateRegressionY(x: number): number {
    return this.slope * x + this.intercept
  }

  private mean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length
  }
}
