import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType, Chart, ChartData, ChartLegendItem, ChartLegendLabelItem } from 'chart.js'; // Change this line
import { errorBarsPlugin, errorSquaresPlugin, movableReferenceLinePlugin } from '../../../Utils/chartjs-plugin';
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
  private keyboardListener?: (event: KeyboardEvent) => void;
  public regressionFormula: string = '';

  public activeLine: 'regression' | 'reference' = 'reference';

  private refLineDrag = {
    dragging: false,
    rotating: false,
    initialY: 0,
    initialX: 0,
    // if you use slope instead of this, it will have an issue when it approaches 0
    lastMouseX: 0, 
    lastMouseY: 0, 
    pivotX: 0,
    pivotY: 0
  };
  
  constructor(private translate: TranslateService) {
    Chart.plugins.register(errorBarsPlugin);
    Chart.plugins.register(errorSquaresPlugin);
    
    const defaultLegendClick = Chart.defaults.global.legend.onClick;

    this.scatterChartOptions = {
      scales: {
        xAxes: [{ type: 'linear', position: 'bottom', id: 'x-axis-0' }],
        yAxes: [{ type: 'linear', position: 'left', id: 'y-axis-0' }]
    },
    referenceLineSlop: 0,
    referenceLineIntercept: 0,
    legend: {
      onClick: (e: MouseEvent, legendItem: ChartLegendLabelItem) => {
        const label = legendItem.text;

        if (label === this.translate.instant('lr_regression_line') ||
          label === 'Reference Line'
        ) {
          this.activeLine = label === 'Reference Line' ? 'reference' : 'regression';
          this.updateActiveLineVisibility();
          this.updateDependentData();
          this.chart.update();
        } else {
          defaultLegendClick.call(this.chart.chart, e, legendItem);
        }

        this.updateActiveLineVisibility();
        this.updateDependentData();
        this.chart.update();
      }
    }
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

    this.keyboardListener = this.onKeyDown.bind(this);
    window.addEventListener('keydown', this.keyboardListener);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataPoints']) {
      this.updateRegressionParameters();

      this.scatterChartOptions.referenceLineSlope = this.slope;
      this.scatterChartOptions.referenceLineIntercept = this.intercept;

      this.updateChartData();
      this.leastSquares = this.calculateLeastSquares();
      this.updateActiveLineVisibility()

    }
  }

  ngOnDestroy(): void {
    Chart.plugins.unregister(errorBarsPlugin);
    Chart.plugins.unregister(errorSquaresPlugin);
    if (this.keyboardListener) {
      window.removeEventListener('keydown', this.keyboardListener);
    }
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
        cubicInterpolationMode: 'monotone',
        hidden: true
      },
      // Lower bound of confidence interval
      {
        type: 'line',
        label: this.translate.instant('lr_lower_bound'),
        data: confidenceInterval.lower,
        fill: '-1',
        borderColor: 'rgba(0, 0, 255, 0.5)',
        cubicInterpolationMode: 'monotone',
        hidden: true
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
    const canvasRect = this.chart.chart.canvas.getBoundingClientRect();

    const mouseY = event.clientY - canvasRect.top;
    const mouseX = event.clientX - canvasRect.left;

    const dataX = xAxis.getValueForPixel(mouseX);

    const m = this.scatterChartOptions.referenceLineSlope!;
    const b = this.scatterChartOptions.referenceLineIntercept!;
    const lineYValue = m * dataX + b;

    const lineYPixel = yAxis.getPixelForValue(lineYValue);
    
    if (Math.abs(mouseY - lineYPixel) < 10) {
      if (event.shiftKey) {
        // Rotation mode
        this.refLineDrag.rotating = true;
        const xValues = this.dataPoints.map(p => p.x);
        const pivotX = (Math.min(...xValues) + Math.max(...xValues)) / 2;
        this.refLineDrag.pivotX = pivotX;
        this.refLineDrag.pivotY = m * pivotX + b;
      } else {
        // Translation mode
        this.refLineDrag.dragging = true;
      }
      this.refLineDrag.initialY = mouseY;
      this.refLineDrag.initialX = mouseX;
      this.refLineDrag.lastMouseX = mouseX; 
      this.refLineDrag.lastMouseY = mouseY; 
    }
  }

  private onMouseMove(event: MouseEvent) {
    if ((!this.refLineDrag.dragging && !this.refLineDrag.rotating) || !this.chart) return;
    if (this.activeLine !== 'reference') return;
    
    const chartAny = this.chart.chart as any;
    const yAxis = chartAny.scales['y-axis-0'];
    const xAxis = chartAny.scales['x-axis-0'];
    const canvasRect = this.chart.chart.canvas.getBoundingClientRect();
    const mouseY = event.clientY - canvasRect.top;
    const mouseX = event.clientX - canvasRect.left;

    if (this.refLineDrag.rotating) {
      const lastX = this.refLineDrag.lastMouseX;
      const lastY = this.refLineDrag.lastMouseY;
      
      const dataX1 = xAxis.getValueForPixel(lastX);
      const dataX2 = xAxis.getValueForPixel(mouseX);
      const dataY1 = yAxis.getValueForPixel(lastY);
      const dataY2 = yAxis.getValueForPixel(mouseY);
      
      const deltaXData = dataX2 - dataX1;
      const deltaYData = dataY2 - dataY1;
      
      if (Math.abs(deltaXData) > 0.001 || Math.abs(deltaYData) > 0.001) {
        const sensitivity = 0.5;
        
        let slopeChange = 0;
        const magnitude = Math.sqrt(deltaXData * deltaXData + deltaYData * deltaYData);
        if (magnitude > 0.001) {
          slopeChange = (deltaYData - deltaXData * this.scatterChartOptions.referenceLineSlope!) * sensitivity;
        }
        
        const currentSlope = this.scatterChartOptions.referenceLineSlope!;
        const newSlope = currentSlope + slopeChange;
        
        const pivotX = this.refLineDrag.pivotX;
        const pivotY = this.refLineDrag.pivotY;
        const newIntercept = pivotY - newSlope * pivotX;
        
        this.scatterChartOptions.referenceLineSlope = newSlope;
        this.scatterChartOptions.referenceLineIntercept = newIntercept;
        
        this.refLineDrag.lastMouseX = mouseX;
        this.refLineDrag.lastMouseY = mouseY;
      }
    } else if (this.refLineDrag.dragging) {
      const initialY = this.refLineDrag.initialY;
      const deltaYValue = yAxis.getValueForPixel(mouseY) - yAxis.getValueForPixel(initialY);
      this.scatterChartOptions.referenceLineIntercept! += deltaYValue;
      this.refLineDrag.initialY = mouseY;
    }
    this.updateReferenceLineData();
  }

  private onMouseUp() {
    this.refLineDrag.dragging = false;
    this.refLineDrag.rotating = false;
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (this.activeLine !== 'reference') return;
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (!arrowKeys.includes(event.key)) return;
    // prevent default scrolling
    event.preventDefault();
    
    if (!this.chart || !this.dataPoints.length) return;

    const m = this.scatterChartOptions.referenceLineSlope!;
    const b = this.scatterChartOptions.referenceLineIntercept!;
    
    // Calculate step sizes based on data range
    const yValues = this.dataPoints.map(p => p.y);
    const yRange = Math.max(...yValues) - Math.min(...yValues);
    const interceptStep = yRange * 0.02; 
    
    const xValues = this.dataPoints.map(p => p.x);
    const pivotX = (Math.min(...xValues) + Math.max(...xValues)) / 2;
    const slopeStep = 0.1; 
    
    switch (event.key) {
      case 'ArrowUp':
        // Move line up (increase intercept)
        this.scatterChartOptions.referenceLineIntercept = b + interceptStep;
        break;
        
      case 'ArrowDown':
        // Move line down (decrease intercept)
        this.scatterChartOptions.referenceLineIntercept = b - interceptStep;
        break;
        
      case 'ArrowLeft':
        // Rotate counter-clockwise (decrease slope)
        const newSlopeLeft = m - slopeStep;
        this.scatterChartOptions.referenceLineSlope = newSlopeLeft;
        // Adjust intercept to keep pivot point fixed
        this.scatterChartOptions.referenceLineIntercept = (m * pivotX + b) - newSlopeLeft * pivotX;
        break;
        
      case 'ArrowRight':
        // Rotate clockwise (increase slope)
        const newSlopeRight = m + slopeStep;
        this.scatterChartOptions.referenceLineSlope = newSlopeRight;
        // Adjust intercept to keep pivot point fixed
        this.scatterChartOptions.referenceLineIntercept = (m * pivotX + b) - newSlopeRight * pivotX;
        break;
    }
    this.updateReferenceLineData();
  }

  private updateReferenceLineData(): void {
    const m = this.scatterChartOptions.referenceLineSlope!;
    const b = this.scatterChartOptions.referenceLineIntercept!;

    const refLineDataset = this.scatterChartData.find(ds => ds.label === 'Reference Line');
    if (refLineDataset) {
      refLineDataset.data = this.dataPoints.map(p => ({
        x: p.x,
        y: m * p.x + b
      }));
    }

    const errorBarsDataset = this.scatterChartData.find(ds => ds.label === this.translate.instant('lr_error_bars'));
    if (errorBarsDataset) {
      errorBarsDataset.data = this.dataPoints.map(p => ({
        x: p.x,
        y: m * p.x + b,
        y1: p.y
      }));
    }

    const errorSquaresDataset = this.scatterChartData.find(ds => ds.label === 'Residual Squares');
    if (errorSquaresDataset) {
      errorSquaresDataset.data = this.dataPoints.map(p => ({
        x: p.x,
        y: m * p.x + b,
        y1: p.y
      }));
    }

    this.leastSquares = this.calculateLeastSquaresForReferenceLine(m, b);
    this.regressionFormula = `y = ${m.toFixed(2)}x ${b >= 0 ? '+' : '-'} ${Math.abs(b).toFixed(2)}`;
    
    this.chart.update();
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

    // Calculate regression points - only need two points for a straight line
    const xValues = this.dataPoints.map(p => p.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);

    return [
      { x: minX, y: m * minX + b },
      { x: maxX, y: m * maxX + b }
    ];
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

  private updateActiveLineVisibility(): void {
    const regressionLine = this.scatterChartData.find(ds => ds.label === this.translate.instant('lr_regression_line'));
    const referenceLine = this.scatterChartData.find(ds => ds.label === 'Reference Line');
    
    if (regressionLine) regressionLine.hidden = this.activeLine !== 'regression';
    if (referenceLine) referenceLine.hidden = this.activeLine !== 'reference';
  }

  public toggleActiveLine(): void {
    this.activeLine = this.activeLine === 'regression' ? 'reference' : 'regression';
    this.updateActiveLineVisibility();
    this.updateDependentData();
    this.chart.update();
  }

  private updateDependentData(): void {
    const isRegression = this.activeLine === 'regression';
    const m = isRegression ? this.slope : this.scatterChartOptions.referenceLineSlope!;
    const b = isRegression ? this.intercept : this.scatterChartOptions.referenceLineIntercept!;

    const errorSquaresDataset = this.scatterChartData.find(ds => ds.label === 'Residual Squares');
    if (errorSquaresDataset) {
      errorSquaresDataset.data = this.dataPoints.map(p => ({
        x: p.x,
        y: m * p.x + b,
        y1: p.y
      }));
    }

    const errorBarsDataset = this.scatterChartData.find(ds => ds.label === this.translate.instant('lr_error_bars'));
    if (errorBarsDataset) {
      errorBarsDataset.data = this.dataPoints.map(p => ({
        x: p.x,
        y: m * p.x + b,
        y1: p.y
      }));
    }

    this.leastSquares = this.calculateLeastSquaresForReferenceLine(m, b);
    this.regressionFormula = `y = ${m.toFixed(2)}x ${b >= 0 ? '+' : '-'} ${Math.abs(b).toFixed(2)}`;
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
