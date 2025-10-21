import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';
import { sampleCorrelation } from 'simple-statistics';

@Component({
  selector: 'app-problems',
  templateUrl: './correlation_problems.component.html',
  styleUrls: ['./correlation_problems.component.scss']
})
export class CorrelationProblemsComponent implements AfterViewInit, OnDestroy {

  @ViewChild('inputChart') inputDataChartRef: ElementRef<HTMLCanvasElement>;

  inputChart: Chart;

  // Dataset state
  randomDataset: { x: number, y: number }[] = [];
  correlationCoefficient: number = 0;
  correctCorrelationType: 'positive' | 'negative' | 'none' = 'none';
  correctStrength: 'very-strong' | 'strong' | 'moderate' | 'weak' | 'very-weak' | 'none' = 'none';

  // User input state
  userCorrelationType: string = '';
  userStrength: string = '';
  submittedAnswer: boolean = false;
  showFeedback: boolean = false;

  // Feedback state
  isTypeCorrect: boolean = false;
  isStrengthCorrect: boolean = false;

  constructor(private translate: TranslateService) { }

  ngAfterViewInit() {
    this.createInputChart();
    this.generateNewDataset();
  }

  ngOnDestroy(): void {
    if (this.inputChart) {
      this.inputChart.destroy();
    }
  }

  /**
   * Generate a new random dataset with correlation
   */
  generateNewDataset(): void {
    // Randomly select a correlation pattern
    const patterns = ['strongPositive', 'strongNegative', 'moderate', 'weak', 'none'];
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];

    switch (selectedPattern) {
      case 'strongPositive':
        this.randomDataset = this.generateStrongPositive();
        break;
      case 'strongNegative':
        this.randomDataset = this.generateStrongNegative();
        break;
      case 'moderate':
        this.randomDataset = this.generateModerate();
        break;
      case 'weak':
        this.randomDataset = this.generateWeak();
        break;
      case 'none':
        this.randomDataset = this.generateNone();
        break;
    }

    // Calculate correlation and classify
    this.calculateCorrelation();

    // Update chart
    this.updateChartWithData();

    // Reset user input and feedback
    this.userCorrelationType = '';
    this.userStrength = '';
    this.submittedAnswer = false;
    this.showFeedback = false;
  }

  /**
   * Generate strong positive correlation (r ≈ 0.85-0.95)
   */
  generateStrongPositive(): Array<{ x: number, y: number }> {
    const points: Array<{ x: number, y: number }> = [];
    const numPoints = 15 + Math.floor(Math.random() * 11); // 15-25 points
    const slope = 0.8 + Math.random() * 0.4; // 0.8-1.2
    const intercept = 10 + Math.random() * 20; // 10-30

    for (let i = 0; i < numPoints; i++) {
      const x = 10 + Math.random() * 80; // 10-90
      const y = slope * x + intercept + (Math.random() - 0.5) * 10; // small noise
      points.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }

    return points;
  }

  /**
   * Generate strong negative correlation (r ≈ -0.85 to -0.95)
   */
  generateStrongNegative(): Array<{ x: number, y: number }> {
    const points: Array<{ x: number, y: number }> = [];
    const numPoints = 15 + Math.floor(Math.random() * 11);
    const slope = -(0.8 + Math.random() * 0.4); // -0.8 to -1.2
    const intercept = 70 + Math.random() * 20; // 70-90

    for (let i = 0; i < numPoints; i++) {
      const x = 10 + Math.random() * 80;
      const y = slope * x + intercept + (Math.random() - 0.5) * 10; // small noise
      points.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }

    return points;
  }

  /**
   * Generate moderate correlation (r ≈ ±0.5 to ±0.7)
   */
  generateModerate(): Array<{ x: number, y: number }> {
    const points: Array<{ x: number, y: number }> = [];
    const numPoints = 15 + Math.floor(Math.random() * 11);
    const isPositive = Math.random() > 0.5;
    const slope = (isPositive ? 1 : -1) * (0.6 + Math.random() * 0.3);
    const intercept = isPositive ? 20 : 70;

    for (let i = 0; i < numPoints; i++) {
      const x = 10 + Math.random() * 80;
      const y = slope * x + intercept + (Math.random() - 0.5) * 25; // medium noise
      points.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }

    return points;
  }

  /**
   * Generate weak correlation (r ≈ ±0.3 to ±0.5)
   */
  generateWeak(): Array<{ x: number, y: number }> {
    const points: Array<{ x: number, y: number }> = [];
    const numPoints = 15 + Math.floor(Math.random() * 11);
    const isPositive = Math.random() > 0.5;
    const slope = (isPositive ? 1 : -1) * (0.3 + Math.random() * 0.3);
    const intercept = 40;

    for (let i = 0; i < numPoints; i++) {
      const x = 10 + Math.random() * 80;
      const y = slope * x + intercept + (Math.random() - 0.5) * 40; // high noise
      points.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }

    return points;
  }

  /**
   * Generate no correlation (|r| < 0.3)
   */
  generateNone(): Array<{ x: number, y: number }> {
    const points: Array<{ x: number, y: number }> = [];
    const numPoints = 15 + Math.floor(Math.random() * 11);

    for (let i = 0; i < numPoints; i++) {
      const x = 10 + Math.random() * 80;
      const y = 20 + Math.random() * 60; // completely random
      points.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }

    return points;
  }

  /**
   * Calculate correlation coefficient and classify type & strength
   */
  calculateCorrelation(): void {
    if (this.randomDataset.length < 2) return;

    // Extract x and y arrays
    const xValues = this.randomDataset.map(point => point.x);
    const yValues = this.randomDataset.map(point => point.y);

    // Calculate correlation coefficient
    this.correlationCoefficient = sampleCorrelation(xValues, yValues);

    // Determine correlation type
    if (this.correlationCoefficient > 0.3) {
      this.correctCorrelationType = 'positive';
    } else if (this.correlationCoefficient < -0.3) {
      this.correctCorrelationType = 'negative';
    } else {
      this.correctCorrelationType = 'none';
    }

    // Determine correlation strength
    const absR = Math.abs(this.correlationCoefficient);
    if (absR >= 0.9) {
      this.correctStrength = 'very-strong';
    } else if (absR >= 0.7) {
      this.correctStrength = 'strong';
    } else if (absR >= 0.5) {
      this.correctStrength = 'moderate';
    } else if (absR >= 0.3) {
      this.correctStrength = 'weak';
    } else {
      this.correctStrength = 'very-weak';
    }

    // Special case: if type is 'none', strength should be 'very-weak' or 'none'
    if (this.correctCorrelationType === 'none') {
      this.correctStrength = 'very-weak';
    }
  }

  /**
   * Submit user's answer and validate
   */
  submitAnswer(): void {
    if (!this.userCorrelationType || !this.userStrength) {
      alert('Please select both correlation type and strength.');
      return;
    }

    this.submittedAnswer = true;
    this.showFeedback = true;

    // Check if type is correct
    this.isTypeCorrect = this.userCorrelationType === this.correctCorrelationType;

    // Check if strength is correct
    this.isStrengthCorrect = this.userStrength === this.correctStrength;

    // Add regression line to visualize the correlation
    this.addRegressionLine();
  }

  /**
   * Hide feedback
   */
  hideFeedback(): void {
    this.showFeedback = false;
  }

  /**
   * Create scatter chart
   */
  createInputChart(): void {
    const ctx = this.inputDataChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.inputChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Data Points',
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              data: [],
              pointRadius: 6,
              pointHoverRadius: 8
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
                  padding: 5,
                  min: 0,
                  max: 100,
                },
                scaleLabel: {
                  display: false
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  padding: 5,
                  min: 0,
                  max: 100,
                },
                scaleLabel: {
                  display: false
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            bodyFontSize: 14,
            callbacks: {
              label: (tooltipItem: any) => {
                return `(${tooltipItem.xLabel.toFixed(1)}, ${tooltipItem.yLabel.toFixed(1)})`;
              }
            }
          },
          legend: {
            display: false
          }
        }
      });
    }
  }

  /**
   * Update chart with new dataset
   */
  updateChartWithData(): void {
    if (this.inputChart && this.randomDataset.length > 0) {
      this.inputChart.data.datasets[0].data = this.randomDataset;
      
      // Remove regression line if it exists (when generating new dataset)
      if (this.inputChart.data.datasets.length > 1) {
        this.inputChart.data.datasets.splice(1, 1);
      }
      
      this.inputChart.update();
    }
  }

  /**
   * Add regression line to chart after submission
   */
  addRegressionLine(): void {
    if (!this.inputChart || this.randomDataset.length < 2) return;

    const xValues = this.randomDataset.map(point => point.x);
    const yValues = this.randomDataset.map(point => point.y);

    // Compute regression line
    const regressionData = this.computeRegressionLine(xValues, yValues);

    // Determine line color based on correlation strength
    const absR = Math.abs(this.correlationCoefficient);
    const lineColor = absR >= 0.7 ? 'green' : 'red';

    // Add or update regression line dataset
    if (this.inputChart.data.datasets.length > 1) {
      // Update existing regression line
      this.inputChart.data.datasets[1].data = regressionData;
      this.inputChart.data.datasets[1].borderColor = lineColor;
    } else {
      // Add new regression line
      this.inputChart.data.datasets.push({
        label: 'Regression Line',
        data: regressionData,
        type: 'line',
        fill: false,
        borderColor: lineColor,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 0,
        showLine: true
      } as any);
    }

    this.inputChart.update();
  }

  /**
   * Compute regression line data points
   */
  computeRegressionLine(xValues: number[], yValues: number[]): Array<{ x: number, y: number }> {
    const n = xValues.length;
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

    // Calculate slope and intercept
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate line points from min to max x
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);

    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];
  }

  /**
   * Get correlation strength label for display
   */
  getStrengthLabel(strength: string): string {
    const labels: { [key: string]: string } = {
      'very-strong': 'Very Strong',
      'strong': 'Strong',
      'moderate': 'Moderate',
      'weak': 'Weak',
      'very-weak': 'Very Weak'
    };
    return labels[strength] || strength;
  }

  /**
   * Get correlation type label for display
   */
  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'positive': 'Positive',
      'negative': 'Negative',
      'none': 'None/Very Weak'
    };
    return labels[type] || type;
  }
}
