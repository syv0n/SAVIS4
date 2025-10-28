import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';

interface DataPoint {
  x: number;
  y: number;
}

interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

enum ProblemType {
  FIND_SLOPE = 'slope',
  FIND_INTERCEPT = 'intercept',
  FIND_EQUATION = 'equation',
  PREDICT_Y = 'predict_y',
  FIND_RESIDUAL = 'residual',
  FIND_SSR = 'ssr'
}

@Component({
  selector: 'app-user-manual',
  templateUrl: './regression.component.html',
  styleUrls: ['./regression.component.scss']
})
export class RegressionProblemsComponent implements AfterViewInit, OnDestroy {

  @ViewChild('inputChart') inputDataChartRef: ElementRef<HTMLCanvasElement>;

  inputChart!: Chart;

  inputAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  correctAnswer: string = '';
  
  dataPoints: DataPoint[] = [];
  regression: RegressionResult | null = null;
  currentProblem: ProblemType = ProblemType.FIND_SLOPE;
  problemText: string = '';
  predictXValue: number = 0;
  residualPointIndex: number = 0;

  showSolutionModal: boolean = false;
  solutionSteps: string[] = [];

  constructor(
    private translate: TranslateService,
  ) { }

  ngAfterViewInit() {
    this.generateNewProblem();
  }  

  ngOnDestroy(): void {
    if (this.inputChart) {
      this.inputChart.destroy();
    }
  }

  generateNewProblem(): void {
    const numPoints = Math.floor(Math.random() * 6) + 5;
    this.dataPoints = this.generateRandomData(numPoints);
    this.regression = this.calculateRegression(this.dataPoints);
    
    const problemTypes = Object.values(ProblemType);
    this.currentProblem = problemTypes[Math.floor(Math.random() * problemTypes.length)] as ProblemType;
    
    this.generateProblemAndAnswer();
    
    this.inputAnswer = '';
    this.showAnswer = false;
    this.answerIsCorrect = false;
    this.showSolutionModal = false;
    
    if (this.inputChart) {
      this.inputChart.destroy();
    }
    this.createInputChart();
  }

  generateRandomData(numPoints: number): DataPoint[] {
    const points: DataPoint[] = [];
    
    const trueSlope = (Math.random() * 4) + 0.5;
    const trueIntercept = (Math.random() * 20) + 10;
    const noise = 5 + Math.random() * 10;
    
    for (let i = 0; i < numPoints; i++) {
      const x = Math.random() * 50 + 5;
      const yTrue = trueSlope * x + trueIntercept;
      const yNoise = (Math.random() - 0.5) * noise;
      const y = yTrue + yNoise;
      
      points.push({ 
        x: Math.round(x),
        y: Math.round(y)
      });
    }
    
    return points.sort((a, b) => a.x - b.x);
  }

  calculateRegression(points: DataPoint[]): RegressionResult {
    const n = points.length;
    const sumX = points.reduce((sum, p) => sum + p.x, 0);
    const sumY = points.reduce((sum, p) => sum + p.y, 0);
    const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0);
    const sumYY = points.reduce((sum, p) => sum + p.y * p.y, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const yMean = sumY / n;
    const ssTotal = points.reduce((sum, p) => sum + Math.pow(p.y - yMean, 2), 0);
    const ssResidual = points.reduce((sum, p) => {
      const yPred = slope * p.x + intercept;
      return sum + Math.pow(p.y - yPred, 2);
    }, 0);
    const rSquared = 1 - (ssResidual / ssTotal);
    
    return { slope, intercept, rSquared };
  }

  generateProblemAndAnswer(): void {
    if (!this.regression) return;
    
    const { slope, intercept } = this.regression;
    
    switch (this.currentProblem) {
      case ProblemType.FIND_SLOPE:
        this.problemText = 'Find the slope (m) of the least squares regression line. Round to 2 decimal places.';
        this.correctAnswer = slope.toFixed(2);
        break;
        
      case ProblemType.FIND_INTERCEPT:
        this.problemText = 'Find the y-intercept (b) of the least squares regression line. Round to 2 decimal places.';
        this.correctAnswer = intercept.toFixed(2);
        break;
        
      case ProblemType.FIND_EQUATION:
        this.problemText = 'Write the regression equation in the form: y = mx + b (e.g., y = 2.34x + 5.67). Round coefficients to 2 decimal places.';
        this.correctAnswer = `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`;
        break;
        
      case ProblemType.PREDICT_Y:
        this.predictXValue = Math.round((Math.random() * 40 + 10) * 10) / 10;
        const predictedY = slope * this.predictXValue + intercept;
        this.problemText = `Using the regression line, predict the y-value when x = ${this.predictXValue}. Round to 2 decimal places.`;
        this.correctAnswer = predictedY.toFixed(2);
        break;
        
      case ProblemType.FIND_RESIDUAL:
        this.residualPointIndex = Math.floor(Math.random() * this.dataPoints.length);
        const point = this.dataPoints[this.residualPointIndex];
        const predictedYForResidual = slope * point.x + intercept;
        const residual = point.y - predictedYForResidual;
        this.problemText = `Calculate the residual for the point (${point.x}, ${point.y}). Round to 2 decimal places. (Residual = Actual Y - Predicted Y)`;
        this.correctAnswer = residual.toFixed(2);
        break;
        
      case ProblemType.FIND_SSR:
        const ssr = this.dataPoints.reduce((sum, p) => {
          const yPred = slope * p.x + intercept;
          return sum + Math.pow(p.y - yPred, 2);
        }, 0);
        this.problemText = 'Calculate the Sum of Squared Residuals (SSR). Round to 2 decimal places.';
        this.correctAnswer = ssr.toFixed(2);
        break;
    }
  }

  generateSolutionSteps(): void {
    if (!this.regression) return;
    
    this.solutionSteps = [];
    const { slope, intercept } = this.regression;
    const n = this.dataPoints.length;
    const sumX = this.dataPoints.reduce((sum, p) => sum + p.x, 0);
    const sumY = this.dataPoints.reduce((sum, p) => sum + p.y, 0);
    const sumXY = this.dataPoints.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = this.dataPoints.reduce((sum, p) => sum + p.x * p.x, 0);
    
    switch (this.currentProblem) {
      case ProblemType.FIND_SLOPE:
        this.solutionSteps = [
          'Step 1: Use the least squares formula for slope:',
          'm = (n·Σ(xy) - Σx·Σy) / (n·Σ(x²) - (Σx)²)',
          '',
          'Step 2: Calculate the necessary sums:',
          `n = ${n} (number of data points)`,
          `Σx = ${sumX}`,
          `Σy = ${sumY}`,
          `Σ(xy) = ${sumXY}`,
          `Σ(x²) = ${sumXX}`,
          '',
          'Step 3: Plug values into the formula:',
          `m = (${n} × ${sumXY} - ${sumX} × ${sumY}) / (${n} × ${sumXX} - ${sumX}²)`,
          `m = (${n * sumXY} - ${sumX * sumY}) / (${n * sumXX} - ${sumX * sumX})`,
          `m = ${n * sumXY - sumX * sumY} / ${n * sumXX - sumX * sumX}`,
          `m = ${slope.toFixed(4)}`,
          '',
          `Step 4: Round to 2 decimal places: ${slope.toFixed(2)}`
        ];
        break;
        
      case ProblemType.FIND_INTERCEPT:
        this.solutionSteps = [
          'Step 1: First, calculate the slope (see "Find Slope" solution for details):',
          `m = ${slope.toFixed(4)}`,
          '',
          'Step 2: Use the least squares formula for intercept:',
          'b = (Σy - m·Σx) / n',
          '',
          'Step 3: Calculate the necessary sums:',
          `n = ${n}`,
          `Σx = ${sumX}`,
          `Σy = ${sumY}`,
          `m = ${slope.toFixed(4)}`,
          '',
          'Step 4: Plug values into the formula:',
          `b = (${sumY} - ${slope.toFixed(4)} × ${sumX}) / ${n}`,
          `b = (${sumY} - ${(slope * sumX).toFixed(4)}) / ${n}`,
          `b = ${(sumY - slope * sumX).toFixed(4)} / ${n}`,
          `b = ${intercept.toFixed(4)}`,
          '',
          `Step 5: Round to 2 decimal places: ${intercept.toFixed(2)}`
        ];
        break;
        
      case ProblemType.FIND_EQUATION:
        this.solutionSteps = [
          'Step 1: Calculate the slope using:',
          'm = (n·Σ(xy) - Σx·Σy) / (n·Σ(x²) - (Σx)²)',
          `m = ${slope.toFixed(4)} ≈ ${slope.toFixed(2)}`,
          '',
          'Step 2: Calculate the intercept using:',
          'b = (Σy - m·Σx) / n',
          `b = ${intercept.toFixed(4)} ≈ ${intercept.toFixed(2)}`,
          '',
          'Step 3: Write the equation in the form y = mx + b:',
          `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`
        ];
        break;
        
      case ProblemType.PREDICT_Y:
      const predictedY = slope * this.predictXValue + intercept;
      this.solutionSteps = [
        'Step 1: Find the regression equation (y = mx + b):',
        '',
        'First, calculate the slope (m):',
        'm = (n·Σ(xy) - Σx·Σy) / (n·Σ(x²) - (Σx)²)',
        `m = ${slope.toFixed(2)}`,
        '',
        'Then, calculate the y-intercept (b):',
        'b = (Σy - m·Σx) / n',
        `b = ${intercept.toFixed(2)}`,
        '',
        `Equation: y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
        '',
        'Step 2: Substitute the given x-value into the equation:',
        `y = ${slope.toFixed(2)} × ${this.predictXValue} + ${intercept.toFixed(2)}`,
        `y = ${(slope * this.predictXValue).toFixed(2)} + ${intercept.toFixed(2)}`,
        `y = ${predictedY.toFixed(2)}`
      ];
      break;
        
      case ProblemType.FIND_RESIDUAL:
      const point = this.dataPoints[this.residualPointIndex];
      const predictedYForResidual = slope * point.x + intercept;
      const residual = point.y - predictedYForResidual;
      this.solutionSteps = [
        'Step 1: Find the regression equation (y = mx + b):',
        '',
        'Calculate the slope (m):',
        'm = (n·Σ(xy) - Σx·Σy) / (n·Σ(x²) - (Σx)²)',
        `m = ${slope.toFixed(2)}`,
        '',
        'Calculate the y-intercept (b):',
        'b = (Σy - m·Σx) / n',
        `b = ${intercept.toFixed(2)}`,
        '',
        `Equation: y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
        '',
        `Step 2: Calculate the predicted y-value for x = ${point.x}:`,
        `ŷ = ${slope.toFixed(2)} × ${point.x} + ${intercept.toFixed(2)}`,
        `ŷ = ${predictedYForResidual.toFixed(2)}`,
        '',
        'Step 3: Calculate the residual:',
        'Residual = Actual Y - Predicted Y',
        `Residual = ${point.y} - ${predictedYForResidual.toFixed(2)}`,
        `Residual = ${residual.toFixed(2)}`
      ];
      break;
        
      case ProblemType.FIND_SSR:
      this.solutionSteps = [
        'Step 1: Find the regression equation (y = mx + b):',
        '',
        'Calculate the slope (m):',
        'm = (n·Σ(xy) - Σx·Σy) / (n·Σ(x²) - (Σx)²)',
        `m = ${slope.toFixed(2)}`,
        '',
        'Calculate the y-intercept (b):',
        'b = (Σy - m·Σx) / n',
        `b = ${intercept.toFixed(2)}`,
        '',
        `Equation: y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
        '',
        'Step 2: For each data point, calculate (Actual Y - Predicted Y)²:',
        ''
      ];
        
        let ssrSum = 0;
        this.dataPoints.forEach((p, i) => {
          const yPred = slope * p.x + intercept;
          const residual = p.y - yPred;
          const squaredResidual = Math.pow(residual, 2);
          ssrSum += squaredResidual;
          this.solutionSteps.push(
            `Point ${i + 1}: (${p.x}, ${p.y})`,
            `  Predicted Y = ${slope.toFixed(2)} × ${p.x} + ${intercept.toFixed(2)} = ${yPred.toFixed(2)}`,
            `  Residual = ${p.y} - ${yPred.toFixed(2)} = ${residual.toFixed(2)}`,
            `  Squared Residual = (${residual.toFixed(2)})² = ${squaredResidual.toFixed(2)}`,
            ''
          );
        });
        
        this.solutionSteps.push(
          'Step 3: Sum all squared residuals:',
          `SSR = ${this.dataPoints.map((p, i) => {
            const yPred = slope * p.x + intercept;
            return Math.pow(p.y - yPred, 2).toFixed(2);
          }).join(' + ')}`,
          `SSR = ${ssrSum.toFixed(2)}`
        );
        break;
    }
  }

  submitAnswer(): void {
    const userAnswer = this.inputAnswer.trim().toLowerCase();
    const correctAnswerLower = this.correctAnswer.toLowerCase();
    
    if (this.currentProblem === ProblemType.FIND_EQUATION) {
      const cleanedUser = userAnswer.replace(/\s/g, '');
      const cleanedCorrect = correctAnswerLower.replace(/\s/g, '');
      this.answerIsCorrect = cleanedUser === cleanedCorrect;
    } else {
      const userNum = parseFloat(userAnswer);
      const correctNum = parseFloat(this.correctAnswer);
      
      if (!isNaN(userNum) && !isNaN(correctNum)) {
        this.answerIsCorrect = Math.abs(userNum - correctNum) < 0.02;
      } else {
        this.answerIsCorrect = userAnswer === correctAnswerLower;
      }
    }
    
    this.showAnswer = true;
  }

  hideAnswer(): void {
    this.showAnswer = false;
  }

  openSolutionModal(): void {
    this.generateSolutionSteps();
    this.showSolutionModal = true;
  }

  closeSolutionModal(): void {
    this.showSolutionModal = false;
  }

  createInputChart(): void {
    const ctx = this.inputDataChartRef.nativeElement.getContext('2d');
    if (!ctx || !this.regression) return;
    
    const minX = Math.min(...this.dataPoints.map(p => p.x));
    const maxX = Math.max(...this.dataPoints.map(p => p.x));
    const regressionLine = [
      { x: minX, y: this.regression.slope * minX + this.regression.intercept },
      { x: maxX, y: this.regression.slope * maxX + this.regression.intercept }
    ];
    
    this.inputChart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Data Points',
            backgroundColor: 'orange',
            borderColor: 'orange',
            data: this.dataPoints.map(p => ({ x: p.x, y: p.y })),
            pointRadius: 6,
            pointHoverRadius: 8
          },
          {
            label: 'Regression Line (for reference)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderColor: 'rgba(54, 162, 235, 0.8)',
            data: regressionLine,
            type: 'line',
            fill: false,
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom',
            ticks: {
              fontColor: 'black',
              fontSize: 14
            },
            scaleLabel: {
              display: true,
              labelString: 'X',
              fontStyle: 'bold',
              fontColor: 'black',
              fontSize: 16
            }
          }],
          yAxes: [{
            ticks: {
              fontColor: 'black',
              fontSize: 14
            },
            scaleLabel: {
              display: true,
              labelString: 'Y',
              fontStyle: 'bold',
              fontColor: 'black',
              fontSize: 16
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          bodyFontSize: 14,
          callbacks: {
            label: function(tooltipItem: any, data: any) {
              return `(${Math.round(tooltipItem.xLabel)}, ${Math.round(tooltipItem.yLabel)})`;
            }
          }
        },
        legend: {
          display: true,
          position: 'top'
        }
      }
    });
  }
}