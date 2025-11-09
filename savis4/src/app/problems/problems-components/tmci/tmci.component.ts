import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartPoint, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-tmci-problems',
  templateUrl: './tmci.component.html',
  styleUrls: ['./tmci.component.scss']
})
export class TMCIProblemsComponent implements AfterViewInit, OnInit, OnDestroy {

  // A reference to the <canvas> element in the template
  @ViewChild('inputChart') inputDataChartRef: ElementRef<HTMLCanvasElement>;
  // The Chart.js instance
  problemChart!: Chart;

  // --- State & Properties ---

  // Sample 1 stats
  sample1Mean: number = 0;
  sample1StdDev: number = 0;
  sample1Size: number = 0;
  // Sample 2 stats
  sample2Mean: number = 0;
  sample2StdDev: number = 0;
  sample2Size: number = 0;

  // User input fields
  userPointEstimate: string = '';
  userStdErrorDiff: string = '';
  userMarginOfErrorDiff: string = '';
  userLowerBound: string = '';
  userUpperBound: string = '';
  userMuDiff: string = ''; // For sampling_dist_diff problem

  // Feedback and UI state
  feedback: string = '';
  isCorrect: boolean = false;
  showAnswer: boolean = false;

  // Flags for step-by-step validation
  isStep1Correct: boolean = true;
  isStep2Correct: boolean = true;
  isStep3Correct: boolean = true;
  isStep4Correct: boolean = true;
  isStep5Correct: boolean = true;

  // Population parameters (used for simulation)
  population1Mean: number = 0;
  private population1StdDev: number = 0;
  population2Mean: number = 0;
  private population2StdDev: number = 0;

  // Simulation data
  private sampleMeanDifferencesDist: number[] = [];
  private simulationCount: number = 1000;

  // Problem state
  problemType: string = 'ci_diff'; // e.g., 'ci_diff', 'se_diff', 'me_diff'
  trueDifferenceInMeans: number = 0; // μ₁ - μ₂
  differenceInSampleMeans: number = 0; // x̄₁ - x̄₂

  // Correct answers
  correctStdErrorDiff: number = 0;
  correctMarginOfErrorDiff: number = 0;
  correctLowerBound: number = 0;
  correctUpperBound: number = 0;

  // Confidence level and critical value (fixed for this component)
  confLevel: number = 95;
  criticalValue: number = 1.96; // z* for 95%

  constructor(private translate: TranslateService) { }

  /**
   * Angular lifecycle hook. Called once after the component is initialized.
   */
  ngOnInit(): void {
    this.generateProblem();
  }

  /**
   * Angular lifecycle hook. Called once after the component's view has been initialized.
   * Used to create the chart instance.
   */
  ngAfterViewInit() {
    this.createChart();
    this.drawGraph(); // Initial draw
  }

  /**
   * Angular lifecycle hook. Called just before the component is destroyed.
   * Used to clean up the chart instance.
   */
  ngOnDestroy(): void {
    if (this.problemChart) {
      this.problemChart.destroy();
    }
  }

  /**
   * Generates a new problem, resets state, and redraws the graph.
   */
  generateProblem(): void {
    // Reset all user inputs and feedback
    this.userPointEstimate = '';
    this.userStdErrorDiff = '';
    this.userMarginOfErrorDiff = '';
    this.userLowerBound = '';
    this.userUpperBound = '';
    this.userMuDiff = '';
    this.hideAnswer(); // Resets feedback and correctness flags

    // Select a random problem type
    const problemTypes = ['ci_diff', 'find_point_estimate', 'sampling_dist_diff', 'se_diff', 'me_diff'];
    this.problemType = problemTypes[this.getRandomInt(0, problemTypes.length - 1)];

    // Generate random population and sample parameters
    this.population1Mean = this.getRandomInt(100, 150);
    this.population1StdDev = this.getRandomInt(15, 30);
    this.population2Mean = this.getRandomInt(160, 210);
    this.population2StdDev = this.getRandomInt(15, 30);
    this.trueDifferenceInMeans = this.population1Mean - this.population2Mean; // μ₁ - μ₂

    this.sample1Size = this.getRandomInt(30, 60);
    this.sample2Size = this.getRandomInt(30, 60);

    // Generate sample data based on population parameters
    const s1Data = this.generateSampleData(this.population1Mean, this.population1StdDev, this.sample1Size);
    const s2Data = this.generateSampleData(this.population2Mean, this.population2StdDev, this.sample2Size);

    // Calculate sample statistics
    this.sample1Mean = this.calculateMean(s1Data);
    this.sample1StdDev = this.calculateStdDev(s1Data, true); // Use sample std dev (n-1)
    this.sample2Mean = this.calculateMean(s2Data);
    this.sample2StdDev = this.calculateStdDev(s2Data, true); // Use sample std dev (n-1)

    // Calculate all correct answers for the problem
    this.differenceInSampleMeans = this.sample1Mean - this.sample2Mean; // x̄₁ - x̄₂
    this.correctStdErrorDiff = Math.sqrt((this.sample1StdDev ** 2 / this.sample1Size) + (this.sample2StdDev ** 2 / this.sample2Size));
    // Handle potential division by zero or invalid sqrt
    if (!isFinite(this.correctStdErrorDiff)) {
      this.correctStdErrorDiff = 0;
    }
    this.correctMarginOfErrorDiff = this.criticalValue * this.correctStdErrorDiff;
    this.correctLowerBound = this.differenceInSampleMeans - this.correctMarginOfErrorDiff;
    this.correctUpperBound = this.differenceInSampleMeans + this.correctMarginOfErrorDiff;

    // Simulate the sampling distribution of the difference in means
    this.sampleMeanDifferencesDist = [];
    for (let i = 0; i < this.simulationCount; i++) {
      const sim1 = this.generateSampleData(this.population1Mean, this.population1StdDev, this.sample1Size);
      const sim2 = this.generateSampleData(this.population2Mean, this.population2StdDev, this.sample2Size);
      this.sampleMeanDifferencesDist.push(this.calculateMean(sim1) - this.calculateMean(sim2));
    }

    // Redraw the graph with the new data
    if (this.problemChart) {
      this.drawGraph();
    } else {
      // Fallback if chart wasn't ready during ngAfterViewInit
      setTimeout(() => {
        if (!this.problemChart) this.createChart();
        this.drawGraph();
      }, 0);
    }
  }

  /**
   * Checks the user's answer against the correct values based on the problem type.
   */
  submitAnswer(): void {
    this.showAnswer = true;
    let feedbackMessages: string[] = [];

    switch (this.problemType) {
      case 'ci_diff':
        // Full confidence interval problem
        const ansPE = parseFloat(this.userPointEstimate);
        const ansSE = parseFloat(this.userStdErrorDiff);
        const ansME = parseFloat(this.userMarginOfErrorDiff);
        const ansLower = parseFloat(this.userLowerBound);
        const ansUpper = parseFloat(this.userUpperBound);

        // Check each step
        this.isStep1Correct = this.isCloseEnough(ansPE, this.differenceInSampleMeans, 0.1);
        this.isStep2Correct = this.isCloseEnough(ansSE, this.correctStdErrorDiff, 0.01);
        this.isStep3Correct = this.isCloseEnough(ansME, this.correctMarginOfErrorDiff, 0.1);
        this.isStep4Correct = this.isCloseEnough(ansLower, this.correctLowerBound, 0.5); // Wider tolerance for final bounds
        this.isStep5Correct = this.isCloseEnough(ansUpper, this.correctUpperBound, 0.5); // Wider tolerance for final bounds

        // Final correctness depends on the interval bounds
        this.isCorrect = this.isStep4Correct && this.isStep5Correct;

        if (this.isCorrect) {
          feedbackMessages.push(`Correct! The 95% CI is (${this.correctLowerBound.toFixed(2)}, ${this.correctUpperBound.toFixed(2)}).`);
          // Add a note if intermediate steps were slightly off (e.g., due to rounding)
          if (!this.isStep1Correct || !this.isStep2Correct || !this.isStep3Correct) {
            feedbackMessages.push(`Your final interval is right, but check the steps below for rounding differences.`);
          }
        } else {
          feedbackMessages.push(`Incorrect. The correct interval is (${this.correctLowerBound.toFixed(2)}, ${this.correctUpperBound.toFixed(2)}).`);
          feedbackMessages.push(`Check your steps against the correct values shown below.`);
        }
        break;

      case 'find_point_estimate':
        // Only check the point estimate
        const ansPointEst = parseFloat(this.userPointEstimate);
        this.isCorrect = this.isCloseEnough(ansPointEst, this.differenceInSampleMeans, 0.1);
        this.isStep1Correct = this.isCorrect;
        feedbackMessages.push(this.isCorrect ? `Correct! The point estimate is ${this.differenceInSampleMeans.toFixed(2)}.` : `Incorrect. The correct point estimate is ${this.differenceInSampleMeans.toFixed(2)}.`);
        break;

      case 'sampling_dist_diff':
        // Check the center of the sampling distribution (true difference)
        const ansMuDiff = parseFloat(this.userMuDiff);
        this.isCorrect = this.isCloseEnough(ansMuDiff, this.trueDifferenceInMeans, 0.1);
        this.isStep1Correct = this.isCorrect;
        feedbackMessages.push(this.isCorrect ? `Correct! The center is ${this.trueDifferenceInMeans.toFixed(2)}.` : `Incorrect. The correct center is ${this.trueDifferenceInMeans.toFixed(2)}.`);
        break;

      case 'se_diff':
        // Check the standard error
        const ansSEDiff = parseFloat(this.userStdErrorDiff);
        this.isCorrect = this.isCloseEnough(ansSEDiff, this.correctStdErrorDiff, 0.01);
        this.isStep1Correct = this.isCorrect;
        feedbackMessages.push(this.isCorrect ? `Correct! The standard error is ${this.correctStdErrorDiff.toFixed(2)}.` : `Incorrect. The correct standard error is ${this.correctStdErrorDiff.toFixed(2)}.`);
        feedbackMessages.push(`The blue line on the graph shows the interval <strong style='color:red;'>μ<sub>diff</sub> &plusmn; SE</strong>.`);
        break;

      case 'me_diff':
        // Check standard error and margin of error
        const ansME_step1 = parseFloat(this.userStdErrorDiff);
        const ansME_step2 = parseFloat(this.userMarginOfErrorDiff);
        this.isStep1Correct = this.isCloseEnough(ansME_step1, this.correctStdErrorDiff, 0.01);
        this.isStep2Correct = this.isCloseEnough(ansME_step2, this.correctMarginOfErrorDiff, 0.1);
        this.isCorrect = this.isStep2Correct; // Final answer is the margin of error

        if (this.isCorrect) {
          feedbackMessages.push(`Correct! The margin of error is ${this.correctMarginOfErrorDiff.toFixed(2)}.`);
          if (!this.isStep1Correct) {
            feedbackMessages.push(`Your final answer is right, but check the Standard Error step below.`);
          }
        } else {
          feedbackMessages.push(`Incorrect. The correct margin of error is ${this.correctMarginOfErrorDiff.toFixed(2)}.`);
          feedbackMessages.push(`Check your steps against the correct values shown below.`);
        }
        feedbackMessages.push(`The blue line on the graph shows the interval <strong style='color:green;'>x̄<sub>diff</sub> &plusmn; ME</strong>.`);
        break;

      default:
        break;
    }

    // Combine all feedback messages and draw the graph with solution elements
    this.feedback = feedbackMessages.join('<br>');
    this.drawGraph(true); // Show solution elements
  }

  /**
   * Resets the feedback, correctness flags, and user inputs.
   */
  hideAnswer(): void {
    this.showAnswer = false;
    this.isCorrect = false;
    this.feedback = '';
    // Reset all step correctness flags
    this.isStep1Correct = true;
    this.isStep2Correct = true;
    this.isStep3Correct = true;
    this.isStep4Correct = true;
    this.isStep5Correct = true;
    // Clear user inputs
    this.userPointEstimate = '';
    this.userStdErrorDiff = '';
    this.userMarginOfErrorDiff = '';
    this.userLowerBound = '';
    this.userUpperBound = '';
    this.userMuDiff = '';
    // Redraw the graph without solution elements
    if (this.problemChart) {
      this.drawGraph(false);
    }
  }

  /**
   * Main function to draw/redraw the chart.
   * @param showSolutionElements - If true, shows answer lines (CI, ME, etc.).
   */
  drawGraph(showSolutionElements: boolean = false): void {
    // Guard clause: Don't draw if the chart or data isn't ready
    if (!this.problemChart || !this.sampleMeanDifferencesDist || this.sampleMeanDifferencesDist.length === 0) {
      return;
    }

    const title = `Simulated Sampling Distribution (1000 simulations)`;
    const xAxisLabel = 'Difference in Sample Means (x̄₁ - x̄₂)';

    // Clear existing data
    this.problemChart.data.datasets = [];

    // 1. Add the scatter plot of simulated sample mean differences
    const scatterData = this.rawToScatter(this.sampleMeanDifferencesDist);
    this.problemChart.data.datasets.push({
      label: title,
      backgroundColor: 'purple',
      data: scatterData,
      type: 'scatter'
    });

    // Find the max frequency from the scatter plot to scale the theoretical curve
    let maxFreq = scatterData.reduce((max: number, p: ChartPoint) => Math.max(max, typeof p.y === 'number' ? p.y : 0), 0);
    if (maxFreq === 0 && scatterData.length > 0) maxFreq = 1;
    if (scatterData.length === 0) maxFreq = 10;

    // 2. Add the theoretical normal distribution curve
    const curvePoints = this.addTheoreticalCurve(maxFreq);

    // Re-check maxFreq in case the theoretical curve is taller
    const curveDataset = this.problemChart.data.datasets.find(d => d.label === 'Theoretical Sampling Distribution');
    if (curveDataset?.data) {
      maxFreq = Math.max(maxFreq, (curveDataset.data as ChartPoint[]).reduce((max: number, p: ChartPoint) => Math.max(max, typeof p.y === 'number' ? p.y : 0), 0));
    }
    if (maxFreq === 0) maxFreq = 10;

    // Set Y-axis max and the Y-position for interval lines
    let yAxisMax = Math.ceil((maxFreq * 1.2) / 5) * 5;
    if (yAxisMax === 0) yAxisMax = 10;
    const intervalLineY = maxFreq + (maxFreq * 0.1); // Position lines near the top

    // 3. Add Solution Lines
    // Add the "True Difference" line (μ₁ - μ₂)
    // Show this unless it's the specific problem *asking* for it (sampling_dist_diff)
    if (showSolutionElements || this.problemType !== 'sampling_dist_diff') {
      this.addTrueDifferenceLine(yAxisMax);
    }

    // If showing solutions, add the problem-specific lines
    if (showSolutionElements) {
      // Show the green "Observed Difference" line only for the 'find_point_estimate' problem.
      // For 'ci_diff' and 'me_diff', the interval line is centered on this, so it's redundant.
      if (this.problemType === 'find_point_estimate') {
        this.addObservedDifferenceLine(yAxisMax);
      }

      // Show the calculated 95% CI line
      if (this.problemType === 'ci_diff') {
        this.addDifferenceCILine(intervalLineY);
      }

      // Show the SE interval line (centered on the true mean)
      if (this.problemType === 'se_diff') {
        this.addMetricIntervalLine(
          `SE Interval (μ₁-μ₂) ± SE`,
          this.trueDifferenceInMeans - this.correctStdErrorDiff,
          this.trueDifferenceInMeans + this.correctStdErrorDiff,
          intervalLineY,
          'blue'
        );
      }

      // Show the ME interval line (centered on the sample mean difference)
      if (this.problemType === 'me_diff') {
        this.addMetricIntervalLine(
          `ME Interval (x̄₁-x̄₂) ± ME`,
          this.differenceInSampleMeans - this.correctMarginOfErrorDiff,
          this.differenceInSampleMeans + this.correctMarginOfErrorDiff,
          intervalLineY,
          'blue'
        );
      }
    }

    // 4. Calculate Axis Bounds
    
    // 4a. Calculate the theoretical Standard Error for the difference in means
    const theoreticalSE = Math.sqrt((this.population1StdDev ** 2 / this.sample1Size) + (this.population2StdDev ** 2 / this.sample2Size));

    // 4b. Define a base range around the true mean difference (4 SEs)
    const baseMin = this.trueDifferenceInMeans - (4 * theoreticalSE);
    const baseMax = this.trueDifferenceInMeans + (4 * theoreticalSE);

    // 4c. Collect all relevant x-values to determine the final min/max
    let bounds = [
      ...scatterData.map(p => p.x as number),
      baseMin,
      baseMax
    ];
    
    if (curvePoints.length > 0) {
      bounds.push(...curvePoints.map(p => p.x as number));
    }
    
    // Add solution lines to bounds if they are visible
    if (showSolutionElements || this.problemType !== 'sampling_dist_diff') {
      bounds.push(this.trueDifferenceInMeans);
    }
    if (showSolutionElements) {
      if (this.problemType !== 'sampling_dist_diff' && this.problemType !== 'se_diff') {
        bounds.push(this.differenceInSampleMeans); // Add sample mean
      }
      if (this.problemType === 'ci_diff') {
        bounds.push(this.correctLowerBound, this.correctUpperBound);
      }
      if (this.problemType === 'se_diff') {
        bounds.push(this.trueDifferenceInMeans - this.correctStdErrorDiff, this.trueDifferenceInMeans + this.correctStdErrorDiff);
      }
      if (this.problemType === 'me_diff') {
        bounds.push(this.differenceInSampleMeans - this.correctMarginOfErrorDiff, this.differenceInSampleMeans + this.correctMarginOfErrorDiff);
      }
    }
    
    // 4d. Filter, find min/max, and handle edge cases
    const finiteBounds = bounds.filter(isFinite);
    let min = finiteBounds.length > 0 ? Math.min(...finiteBounds) : -10;
    let max = finiteBounds.length > 0 ? Math.max(...finiteBounds) : 10;

    if (min === max) {
      min -= 5;
      max += 5;
    }

    // 5. Update Chart Axes
    // Add 5% padding
    const padding = (max - min) * 0.05 || 1;
    const scales = this.problemChart.options?.scales;
    
    if (scales?.xAxes?.[0]?.ticks) {
      // *Suggest* the min/max to Chart.js to get "nice" numbers
      scales.xAxes[0].ticks.min = undefined; // Clear old forced min
      scales.xAxes[0].ticks.max = undefined; // Clear old forced max
      scales.xAxes[0].ticks.suggestedMin = min - padding;
      scales.xAxes[0].ticks.suggestedMax = max + padding;
    }

    // 5. Update Chart Axes
    if (scales?.xAxes?.[0]?.scaleLabel) {
      scales.xAxes[0].scaleLabel.labelString = xAxisLabel;
    }
    if (scales?.yAxes?.[0]?.ticks) {
      scales.yAxes[0].ticks.min = 0;
      scales.yAxes[0].ticks.max = yAxisMax;
    }

    // 6. Redraw the chart
    this.problemChart.update();
  }

  // --- Graph Helper Functions ---

  /**
   * Adds a vertical red dashed line for the True Difference in Means (μ₁ - μ₂).
   */
  private addTrueDifferenceLine(maxY: number): void {
    if (!this.problemChart) return;
    this.problemChart.data.datasets.push({
      label: `True Difference (μ₁ - μ₂ = ${this.trueDifferenceInMeans.toFixed(2)})`,
      data: [{ x: this.trueDifferenceInMeans, y: 0 }, { x: this.trueDifferenceInMeans, y: maxY }],
      type: 'line',
      borderColor: 'red',
      borderDash: [5, 5],
      borderWidth: 2,
      pointRadius: 0,
      fill: false
    });
  }

  /**
   * Adds a vertical green dashed line for the Observed Difference in Sample Means (x̄₁ - x̄₂).
   */
  private addObservedDifferenceLine(maxY: number): void {
    if (!this.problemChart) return;
    this.problemChart.data.datasets.push({
      label: `Observed Difference (x̄₁ - x̄₂ = ${this.differenceInSampleMeans.toFixed(2)})`,
      data: [{ x: this.differenceInSampleMeans, y: 0 }, { x: this.differenceInSampleMeans, y: maxY }],
      type: 'line',
      borderColor: 'green',
      borderDash: [5, 5],
      borderWidth: 2,
      pointRadius: 0,
      fill: false
    });
  }

  /**
   * Adds the horizontal 95% Confidence Interval line.
   * Color-coded based on whether it captured the true mean.
   */
  private addDifferenceCILine(yPosition: number): void {
    if (!this.problemChart) return;
    // Check if the CI captured the true parameter
    const didCapture = (this.correctLowerBound <= this.trueDifferenceInMeans) && (this.correctUpperBound >= this.trueDifferenceInMeans);
    
    // Main color for line and points (more opaque)
    const mainColor = didCapture ? 'rgba(0, 0, 255, 0.7)' : 'rgba(255, 0, 0, 0.7)';
    // Fill color (much more transparent)
    const fillColor = didCapture ? 'rgba(0, 0, 255, 0.2)' : 'rgba(255, 0, 0, 0.2)'; 
    
    this.problemChart.data.datasets.push({
      label: `95% CI (${didCapture ? 'captured' : 'missed'} μ₁-μ₂)`,
      data: [
        { x: this.correctLowerBound, y: yPosition },
        { x: this.correctUpperBound, y: yPosition }
      ],
      type: 'line',
      borderColor: mainColor,      // Use main color for border
      backgroundColor: fillColor, // Use transparent color for fill
      borderWidth: 3,
      pointRadius: 6,
      pointBackgroundColor: mainColor, // Use main color for points
      fill: 'origin', 
    });
  }

  /**
   * Adds a generic horizontal interval line for SE or ME.
   */
  private addMetricIntervalLine(label: string, lowerBound: number, upperBound: number, yPosition: number, color: string): void {
    if (!this.problemChart) return;

    // Use a transparent version of the passed-in color for the fill
    // This is a simple way to get a fill color; 'blue' becomes 'rgba(0, 0, 255, 0.2)'
    // We'll default to a light gray if the color name is unknown
    let fillColor = 'rgba(128, 128, 128, 0.2)';
    let mainColor = color; // The original color for the line/points
    
    if (color === 'blue') {
      fillColor = 'rgba(0, 0, 255, 0.2)';
      mainColor = 'rgba(0, 0, 255, 0.7)';
    } else if (color === 'green') {
      fillColor = 'rgba(0, 128, 0, 0.2)';
      mainColor = 'rgba(0, 128, 0, 0.7)';
    }

    this.problemChart.data.datasets.push({
      label: label,
      data: [
        { x: lowerBound, y: yPosition },
        { x: upperBound, y: yPosition }
      ],
      type: 'line',
      borderColor: mainColor,
      backgroundColor: fillColor, // Use transparent color for fill
      borderWidth: 3,
      pointRadius: 6,
      pointBackgroundColor: mainColor,
      fill: 'origin', // <-- This is the key change to create the shading
    });
  }

  /**
   * Calculates and adds the theoretical normal distribution curve to the chart.
   */
  private addTheoreticalCurve(maxFrequency: number): ChartPoint[] {
    if (!this.problemChart || maxFrequency <= 0) return [];

    // Parameters for the theoretical sampling distribution
    const thMean = this.trueDifferenceInMeans;
    const thSE = Math.sqrt((this.population1StdDev ** 2 / this.sample1Size) + (this.population2StdDev ** 2 / this.sample2Size));

    if (thSE <= 0) return []; // Cannot draw curve if SE is zero

    const curve: ChartPoint[] = [];
    const minX = thMean - 4 * thSE; // +/- 4 standard errors
    const maxX = thMean + 4 * thSE;
    const step = (maxX - minX) / 100; // 100 points for the curve

    // Calculate the peak of the PDF to scale it to the histogram frequency
    const peak = this.normalPdf(thMean, thMean, thSE);
    if (peak <= 0) return [];

    const scale = maxFrequency / peak; // Scale factor

    for (let x = minX; x <= maxX; x += step) {
      if (!isFinite(x)) continue;
      const y = this.normalPdf(x, thMean, thSE) * scale;
      if (isFinite(y)) {
        curve.push({ x, y });
      }
    }

    // Add the curve dataset to the chart
    if (curve.length > 0) {
      this.problemChart.data.datasets.push({
        label: 'Theoretical Sampling Distribution',
        data: curve,
        type: 'line',
        borderColor: 'black',
        borderWidth: 2,
        fill: false,
        pointRadius: 0
      });
    }
    return curve;
  }

  // --- Math Helper Functions ---

  /**
   * Generates an array of n random numbers from a normal distribution.
   */
  private generateSampleData(mean: number, stddev: number, n: number): number[] {
    const data: number[] = [];
    for (let i = 0; i < n; i++) {
      data.push(this.getNormallyDistributedRandom(mean, stddev));
    }
    return data;
  }

  /**
   * Calculates the probability density function (PDF) for a normal distribution.
   */
  private normalPdf(x: number, mean: number, stdDev: number): number {
    if (stdDev <= 0) return 0;
    const exp = -((x - mean) ** 2) / (2 * (stdDev ** 2));
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exp);
  }

  /**
   * Checks if two numbers are within a given tolerance.
   */
  private isCloseEnough(v1: number, v2: number, tol: number): boolean {
    // Check for NaN and Infinity
    return !isNaN(v1) && isFinite(v1) && !isNaN(v2) && isFinite(v2) &&
      Math.abs(v1 - v2) <= tol;
  }

  /**
   * Converts a raw array of numbers into a Chart.js scatter plot format (x, y=frequency).
   * This "stacks" the dots visually.
   */
  private rawToScatter(arr: number[]): ChartPoint[] {
    const fin = arr.filter(isFinite);
    if (fin.length === 0) return [];

    const sc: ChartPoint[] = [];
    const p = 10; // Precision (1 decimal place)
    const counts = new Map<number, number>();
    
    // Round values to group them for stacking
    const rnd = fin.map(v => Math.round(v * p) / p);

    rnd.forEach(rV => {
      const c = counts.get(rV) || 0;
      counts.set(rV, c + 1);
      sc.push({ x: rV, y: c + 1 }); // y is the 1-based count
    });

    sc.sort((a, b) => (a.x as number) - (b.x as number));
    return sc;
  }

  /**
   * Calculates the mean of a number array, ignoring non-finite values.
   */
  private calculateMean(data: number[]): number {
    const fin = data.filter(isFinite);
    if (fin.length === 0) return NaN;
    const sum = fin.reduce((a, v) => a + v, 0);
    return sum / fin.length;
  }

  /**
   * Calculates the standard deviation of a number array.
   * @param useSample - If true, use sample standard deviation (n-1 denominator).
   */
  private calculateStdDev(data: number[], useSample: boolean = false): number {
    const fin = data.filter(isFinite);
    const n = fin.length;
    if (n <= 1) return NaN; // Cannot calculate std dev with 0 or 1 point

    const mean = this.calculateMean(fin);
    if (isNaN(mean)) return NaN;

    const sqDiff = fin.reduce((a, v) => a + (v - mean) ** 2, 0);
    const den = useSample ? n - 1 : n; // Denominator
    if (den <= 0) return NaN;

    return Math.sqrt(sqDiff / den);
  }

  /**
   * Generates a random integer within a specified range (inclusive).
   */
  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generates a normally distributed random number (Box-Muller transform).
   */
  private getNormallyDistributedRandom(mean: number, stddev: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Excluding 0
    while (v === 0) v = Math.random();
    
    // Box-Muller transform
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    const res = z * stddev + mean;

    // Fallback if result is not finite
    return isFinite(res) ? res : mean;
  }

  /**
   * Selects a random subset of size n from an array.
   */
  private randomSubset(itr: number[], n: number): number[] {
    const res = new Array(n);
    let len = itr.length;
    const taken = new Array(len);

    if (n > len || len === 0) return [];
    if (n === 0) return [];

    let count = n;
    while (count--) {
      if (len <= 0) break;
      const x = Math.floor(Math.random() * len);
      res[count] = itr[x in taken ? taken[x] : x];
      len--;
      taken[x] = len in taken ? taken[len] : len;
    }
    // Handle cases where loop broke early
    return res.slice(0, n - (count + 1));
  }

  /**
   * Initializes the Chart.js instance.
   */
  createChart(): void {
    // Destroy the old chart if it exists
    if (this.problemChart) {
      this.problemChart.destroy();
      this.problemChart = undefined;
    }
    // Ensure the canvas element is available
    if (!this.inputDataChartRef?.nativeElement) {
      return;
    }
    const ctx = this.inputDataChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.problemChart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: [] },
        options: {
          elements: { point: { radius: 4 } }, // Default point size
          scales: {
            xAxes: [{
              ticks: { fontColor: 'black', fontSize: 16, padding: 0, autoSkip: true, maxTicksLimit: 20 },
              scaleLabel: { display: true, fontStyle: 'bold', fontColor: 'black' } // Label set in drawGraph
            }],
            yAxes: [{
              ticks: { fontColor: 'black', fontSize: 16, padding: 0, min: 0, autoSkip: true, maxTicksLimit: 10 },
              scaleLabel: { display: true, labelString: 'Frequency', fontStyle: 'bold', fontColor: 'black' }
            }]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0,0,0,1.0)',
            bodyFontSize: 16,
            callbacks: {
              // Custom tooltip label logic
              label: (tI, data) => {
                const dI = tI.datasetIndex;
                if (data.datasets?.[dI]?.data?.[tI.index]) {
                  const p = data.datasets[dI].data[tI.index] as any;
                  const type = data.datasets[dI].type;
                  const label = data.datasets[dI].label || '';

                  // For scatter plot, show the x-value
                  if ((type === 'scatter' || !type) && p?.x !== undefined) {
                    return `Difference: ${p.x.toFixed(2)}`;
                  }
                  // Hide tooltips for vertical lines
                  if (type === 'line' && label.includes('Difference')) return '';
                  // Show label for CI line
                  if (type === 'line' && label.includes('CI')) return label;
                  // Show label for SE/ME lines
                  if (type === 'line' && label.includes('Interval')) return label;
                  // Hide tooltips for theoretical curve
                  if (type === 'line' && label.includes('Theoretical')) return '';
                }
                return tI.value || '';
              }
            }
          },
          legend: { position: 'top' },
          animation: { duration: 0 } // Disable animations for performance
        }
      });
    } else {
      console.error("Failed to get 2D context for chart canvas");
    }
  }

  /**
   * Returns a user-friendly title based on the current problem type.
   */
  getProblemTitle(): string {
    switch (this.problemType) {
      case 'ci_diff':
        return 'Calculate the CI for Difference in Means';
      case 'find_point_estimate':
        return 'Find the Point Estimate (Difference)';
      case 'sampling_dist_diff':
        return 'Understand the Sampling Distribution';
      case "se_diff":
        return 'Calculate the Standard Error';
      case 'me_diff':
        return 'Calculate the Margin of Error';
      default:
        return 'Analyze';
    }
  }

} // End of class