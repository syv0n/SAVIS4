import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartDataSets, ChartPoint } from 'chart.js';

@Component({
  selector: 'app-user-manual', 
  templateUrl: './omci.component.html',
  styleUrls: ['./omci.component.scss']
})
export class OMCIProblemsComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('inputChart') inputDataChartRef: ElementRef<HTMLCanvasElement>;
  problemChart!: Chart;

  // --- Problem State ---
  sampleSize: number = 0;
  sampleMean: number = 0;
  sampleStdDev: number = 0;
  populationMean: number = 0;

  // --- User's answer ---
  // CI problem
  userStdError: string = '';
  userMarginOfErrorCI: string = '';
  userLowerBound: string = '';
  userUpperBound: string = '';
  // Sample Size problem
  userZ_x_Sigma_over_E: string = '';
  userSquaredValue: string = '';
  userN: string = ''; // Final N answer
  // Find Xbar problem
  userSumBounds: string = '';
  userXBar: string = ''; // Final xbar answer
  // Find E from CI problem
  userDiffBounds: string = '';
  userE: string = ''; // Final E answer
  // Sampling Dist problem
  userMu: string = '';
  
  // --- Feedback properties ---
  feedback: string = '';
  isCorrect: boolean = false; // Overall correctness for the main question
  showAnswer: boolean = false;
  // Step correctness booleans
  isStep1Correct: boolean = true;
  isStep2Correct: boolean = true;
  isStep3Correct: boolean = true;
  isStep4Correct: boolean = true; // For CI problem

  // --- Private Problem Data ---
  private populationData: number[] = [];
  private sampleMeansDist: number[] = [];
  private simulationCount: number = 1000;
  private populationStdDev: number = 0;
  
  // --- Public Problem Data (for HTML) ---
  correctCI = { lower: 0, upper: 0 };
  confLevel: number = 95;
  criticalValue: number = 1.96;
  criticalType: string = 'z';
  problemType: string = 'ci';
  sigma: number = 0;
  E: number = 0; // Target E for samplesize
  // Correct answers for steps
  correctStdError: number = 0;
  correctMarginOfErrorCI: number = 0;
  correctLowerBound: number = 0;
  correctUpperBound: number = 0;
  correctN: number = 0;
  correctZ_x_Sigma_over_E: number = 0;
  correctSquaredValue: number = 0;
  correctSumBounds: number = 0;
  correctXBar: number = 0; // Correct final xbar
  correctDiffBounds: number = 0;
  correctE: number = 0; // Correct final E
  correctMu: number = 0; // Correct final Mu


  constructor(
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.generateProblem();
  }

  ngAfterViewInit() {
    if (this.problemType !== 'samplesize') {
      this.createChart();
      this.drawGraph();
    }
    this.initializeWorkspace();
  }

  ngOnDestroy(): void {
    if (this.problemChart) {
      this.problemChart.destroy();
    }
  }

  /**
   * Generates a new random problem.
   */
  generateProblem(): void {
    // 1. Reset state
    this.userStdError = ''; this.userMarginOfErrorCI = ''; this.userLowerBound = ''; this.userUpperBound = '';
    this.userZ_x_Sigma_over_E = ''; this.userSquaredValue = ''; this.userN = '';
    this.userSumBounds = ''; this.userXBar = '';
    this.userDiffBounds = ''; this.userE = '';
    this.userMu = '';
    this.hideAnswer(); // This also resets feedback and step booleans

    const problemTypes = ['ci', 'samplesize', 'find_xbar', 'find_e_from_ci', 'sampling_dist'];
    const randIndex = this.getRandomInt(0, problemTypes.length - 1);
    this.problemType = problemTypes[randIndex];

    this.confLevel = 95;
    this.criticalValue = 1.96;
    this.criticalType = 'z';

    const popMean = this.getRandomInt(100, 200);
    const popStdDev = this.getRandomInt(25, 50);
    
    this.populationMean = popMean; 
    this.populationStdDev = popStdDev;
    this.correctMu = popMean;

    if (this.problemType === 'samplesize') {
      this.sigma = popStdDev;
      this.E = this.getRandomInt(2, 5); // Target E for calculation

      // Calculate sample size steps
      this.correctZ_x_Sigma_over_E = (this.criticalValue * this.sigma / this.E);
      this.correctSquaredValue = Math.pow(this.correctZ_x_Sigma_over_E, 2);
      this.correctN = Math.ceil(this.correctSquaredValue);
    
    } else { // Covers 'ci', 'find_xbar', 'find_e_from_ci', 'sampling_dist'
      this.populationData = [];
      for (let i = 0; i < 200; i++) {
        this.populationData.push(this.getNormallyDistributedRandom(popMean, popStdDev));
      }
      this.sampleSize = this.getRandomInt(30, 50); 
      this.sampleMeansDist = [];
      for (let i = 0; i < this.simulationCount; i++) {
        const sample = this.randomSubset(this.populationData, this.sampleSize);
        this.sampleMeansDist.push(this.calculateMean(sample));
      }

      if (this.problemType !== 'sampling_dist') { // Covers 'ci', 'find_xbar', 'find_e_from_ci'
        const sampleData = this.randomSubset(this.populationData, this.sampleSize);
        this.sampleMean = this.calculateMean(sampleData);
        this.sampleStdDev = this.calculateStdDev(sampleData, true);

        // Calculate CI steps and final answers
        this.correctStdError = this.sampleStdDev / Math.sqrt(this.sampleSize);
        this.correctMarginOfErrorCI = this.criticalValue * this.correctStdError;
        this.correctLowerBound = this.sampleMean - this.correctMarginOfErrorCI;
        this.correctUpperBound = this.sampleMean + this.correctMarginOfErrorCI;
        // Also store for problems that use the final CI
        this.correctCI = { lower: this.correctLowerBound, upper: this.correctUpperBound };
        
        // Calculate answers for find_xbar
        this.correctSumBounds = this.correctCI.upper + this.correctCI.lower;
        this.correctXBar = this.correctSumBounds / 2; // Should match sampleMean

        // Calculate answers for find_e_from_ci
        this.correctDiffBounds = this.correctCI.upper - this.correctCI.lower;
        this.correctE = this.correctDiffBounds / 2; // Should match correctMarginOfErrorCI
      }
    }

    // Draw graph if needed
    if (this.problemType !== 'samplesize') {
      if (!this.problemChart) {
        setTimeout(() => { this.createChart(); this.drawGraph(); }, 0);
      } else {
        this.drawGraph();
      }
    } else {
      if (this.problemChart) { this.problemChart.destroy(); this.problemChart = undefined; }
    }
  }

  /**
   * Submission Logic: Validates the user's answer.
   */
  submitAnswer(): void {
    this.showAnswer = true; 
    let feedbackMessages: string[] = [];

    switch (this.problemType) {
      case 'ci':
        const ansSE = parseFloat(this.userStdError);
        const ansME = parseFloat(this.userMarginOfErrorCI);
        const ansLower = parseFloat(this.userLowerBound);
        const ansUpper = parseFloat(this.userUpperBound);
        
        this.isStep1Correct = this.isCloseEnough(ansSE, this.correctStdError, 0.01);
        this.isStep2Correct = this.isCloseEnough(ansME, this.correctMarginOfErrorCI, 0.1);
        this.isStep3Correct = this.isCloseEnough(ansLower, this.correctLowerBound, 0.5);
        this.isStep4Correct = this.isCloseEnough(ansUpper, this.correctUpperBound, 0.5);
        
        // Grade based on final bounds
        this.isCorrect = this.isStep3Correct && this.isStep4Correct; 

        if (this.isCorrect) {
          feedbackMessages.push(`✅ Correct! The 95% CI is (${this.correctLowerBound.toFixed(2)}, ${this.correctUpperBound.toFixed(2)}).`);
          if (!this.isStep1Correct || !this.isStep2Correct) {
            feedbackMessages.push(`Your final interval is right, but check the steps below for rounding differences.`);
          }
        } else {
          feedbackMessages.push(`❌ Incorrect. The correct interval is (${this.correctLowerBound.toFixed(2)}, ${this.correctUpperBound.toFixed(2)}).`);
          feedbackMessages.push(`Check your steps against the correct values shown below.`);
        }
        this.feedback = feedbackMessages.join('<br>');
        this.drawGraph(true);
        break;

      case 'samplesize':
        const ansZSE = parseFloat(this.userZ_x_Sigma_over_E);
        const ansSq = parseFloat(this.userSquaredValue);
        const ansN = parseInt(this.userN);
        
        this.isStep1Correct = this.isCloseEnough(ansZSE, this.correctZ_x_Sigma_over_E, 0.01);
        this.isStep2Correct = this.isCloseEnough(ansSq, this.correctSquaredValue, 0.1);
        this.isStep3Correct = (ansN === this.correctN);

        this.isCorrect = this.isStep3Correct; 
        
        if (this.isCorrect) {
          feedbackMessages.push(`✅ Correct! The minimum sample size is ${this.correctN}.`);
          if (!this.isStep1Correct || !this.isStep2Correct) {
            feedbackMessages.push(`Your final answer is right, but check the steps below for rounding differences.`);
          }
        } else {
          feedbackMessages.push(`❌ Incorrect. The correct minimum sample size is ${this.correctN}.`);
          feedbackMessages.push(`Check your steps against the correct values shown below.`);
        }
        this.feedback = feedbackMessages.join('<br>');
        break;
      
      case 'find_e_from_ci':
        const ansDiff = parseFloat(this.userDiffBounds);
        const ansE = parseFloat(this.userE);

        this.isStep1Correct = this.isCloseEnough(ansDiff, this.correctDiffBounds, 0.1);
        this.isStep2Correct = this.isCloseEnough(ansE, this.correctE, 0.1);

        this.isCorrect = this.isStep2Correct; // Grade on final E

        if (this.isCorrect) {
          feedbackMessages.push(`✅ Correct! The margin of error (E) is ${this.correctE.toFixed(2)}.`);
          if (!this.isStep1Correct) {
             feedbackMessages.push(`Your final answer is right, but check the step below for rounding differences.`);
          }
        } else {
           feedbackMessages.push(`❌ Incorrect. The correct margin of error is ${this.correctE.toFixed(2)}.`);
           feedbackMessages.push(`Check your steps against the correct values shown below.`);
        }
        this.feedback = feedbackMessages.join('<br>');
        this.drawGraph(true);
        break;

      case 'find_xbar':
        const ansSum = parseFloat(this.userSumBounds);
        const ansXBar = parseFloat(this.userXBar);

        this.isStep1Correct = this.isCloseEnough(ansSum, this.correctSumBounds, 0.1);
        this.isStep2Correct = this.isCloseEnough(ansXBar, this.correctXBar, 0.1);

        this.isCorrect = this.isStep2Correct; // Grade on final xbar

        if (this.isCorrect) {
          feedbackMessages.push(`✅ Correct! The sample mean (x̄) is ${this.correctXBar.toFixed(2)}.`);
           if (!this.isStep1Correct) {
             feedbackMessages.push(`Your final answer is right, but check the step below for rounding differences.`);
          }
        } else {
           feedbackMessages.push(`❌ Incorrect. The correct sample mean (x̄) is ${this.correctXBar.toFixed(2)}.`);
           feedbackMessages.push(`Check your steps against the correct values shown below.`);
        }
        this.feedback = feedbackMessages.join('<br>');
        this.drawGraph(true);
        break;
      
      case 'sampling_dist':
        const ansMu = parseFloat(this.userMu);
        this.isCorrect = this.isCloseEnough(ansMu, this.correctMu, 0.1); // Only one step
        this.isStep1Correct = this.isCorrect; // Use step 1 flag for consistency
        this.feedback = this.isCorrect ?
          `✅ Correct! The mean of the sampling distribution is always equal to the population mean (μ), which is ${this.correctMu.toFixed(2)}.` :
          `❌ Incorrect. The mean of the sample means is always equal to the true population mean (μ). The correct answer is ${this.correctMu.toFixed(2)}.`;
        
        this.drawGraph(false);
        break;
    }
  }

  /**
   * Hides the answer feedback.
   */
  hideAnswer(): void {
    this.showAnswer = false;
    this.feedback = '';
    this.isCorrect = false;

    // Reset step inputs
    this.userStdError = ''; this.userMarginOfErrorCI = ''; this.userLowerBound = ''; this.userUpperBound = '';
    this.userZ_x_Sigma_over_E = ''; this.userSquaredValue = ''; this.userN = '';
    this.userSumBounds = ''; this.userXBar = '';
    this.userDiffBounds = ''; this.userE = '';
    this.userMu = '';
    
    // Reset step booleans
    this.isStep1Correct = true; this.isStep2Correct = true;
    this.isStep3Correct = true; this.isStep4Correct = true;
    
    if (this.problemChart && this.problemType !== 'samplesize') {
      this.drawGraph(false);
    }
  }

  // --- (drawGraph and helper functions remain the same) ---
  // ... [omitted for brevity] ...
  drawGraph(showSolution: boolean = false): void {
    if (!this.problemChart) return;
    
    const title = `Distribution of ${this.simulationCount} Sample Means (N=${this.sampleSize})`;
    const xAxisLabel = 'Sample Means (x̄)';
    
    this.problemChart.data.datasets = [];

    const scatterData = this.rawToScatter(this.sampleMeansDist);
    this.problemChart.data.datasets.push({
      label: title,
      backgroundColor: 'orange',
      data: scatterData,
      type: 'scatter',
    });
    
    this.addNormalCurve();

    let maxFreq = 0;
    for (const point of scatterData) {
      const yValue = point.y as number; 
      if (yValue && yValue > maxFreq) maxFreq = yValue;
    }
    const normalDataset = this.problemChart.data.datasets.find(d => d.label === 'Theoretical Sampling Distribution');
    if (normalDataset && normalDataset.data) {
      for (const point of normalDataset.data as ChartPoint[]) {
        const yValue = point.y as number;
        if (yValue && yValue > maxFreq) maxFreq = yValue;
      }
    }
    if (maxFreq === 0) maxFreq = 10; 

    const ciLineY = maxFreq + (maxFreq * 0.1); 
    
    let yAxisMax = maxFreq * 1.2;
    if (yAxisMax === 0) yAxisMax = 10; 
    yAxisMax = Math.ceil(yAxisMax / 5) * 5; 

    this.addMuLine(yAxisMax); 

    if (this.problemType !== 'sampling_dist' && this.problemType !== 'find_xbar') {
      this.addXBarLine(yAxisMax);
    }

    if (showSolution) {
      if (this.problemType !== 'sampling_dist') {
        this.addCILine(ciLineY); 
      }
      if (this.problemType === 'find_xbar') {
        this.addXBarLine(yAxisMax);
      }
    }

    const min = Math.min(...this.sampleMeansDist, this.populationMean - this.populationStdDev);
    const max = Math.max(...this.sampleMeansDist, this.populationMean + this.populationStdDev);
    const padding = (max - min) * 0.1;
    this.problemChart.options.scales.xAxes[0].ticks.min = Math.floor(min - padding);
    this.problemChart.options.scales.xAxes[0].ticks.max = Math.ceil(max + padding);
    this.problemChart.options.scales.xAxes[0].scaleLabel.labelString = xAxisLabel;
    
    this.problemChart.options.scales.yAxes[0].ticks.min = 0;
    this.problemChart.options.scales.yAxes[0].ticks.max = yAxisMax;

    this.problemChart.update();
  }
  
  private addMuLine(maxY: number): void {
    if (!this.problemChart) return;
    this.problemChart.data.datasets.push({
      label: `Population Mean (μ = ${this.populationMean.toFixed(2)})`,
      data: [{ x: this.populationMean, y: 0 }, { x: this.populationMean, y: maxY }],
      type: 'line',
      borderColor: 'red',
      borderDash: [5, 5],
      borderWidth: 2,
      pointRadius: 0,
    });
  }
  
  private addXBarLine(maxY: number): void {
    if (!this.problemChart) return;
    this.problemChart.data.datasets.push({
      label: `Sample Mean (x̄ = ${this.sampleMean.toFixed(2)})`,
      data: [{ x: this.sampleMean, y: 0 }, { x: this.sampleMean, y: maxY }],
      type: 'line',
      borderColor: 'green',
      borderDash: [5, 5],
      borderWidth: 2,
      pointRadius: 0,
    });
  }
  
  private addCILine(yPosition: number): void {
    if (!this.problemChart) return;
    const didCapture = (this.correctCI.lower <= this.populationMean) && (this.correctCI.upper >= this.populationMean);
    const color = didCapture ? 'rgba(0, 0, 255, 0.7)' : 'rgba(255, 0, 0, 0.7)'; // 70% opacity

    this.problemChart.data.datasets.push({
      label: `Correct 95% CI (Interval ${didCapture ? 'captured' : 'missed'} μ)`,
      data: [ { x: this.correctCI.lower, y: yPosition }, { x: this.correctCI.upper, y: yPosition } ],
      type: 'line',
      borderColor: color,
      backgroundColor: color,
      borderWidth: 3,
      pointRadius: 6,
    });
  }

  private addNormalCurve(): void {
    if (!this.problemChart) return;
    const samplingMean = this.calculateMean(this.sampleMeansDist);
    const samplingStdDev = this.calculateStdDev(this.sampleMeansDist);

    const curveData: ChartPoint[] = [];
    const minX = Math.min(...this.sampleMeansDist);
    const maxX = Math.max(...this.sampleMeansDist.filter(x => isFinite(x)));
    const step = (maxX - minX) / 100;
    const binWidth = 0.1;

    for (let x = minX; x <= maxX; x += step) {
      if (!isFinite(x)) continue;
      const y = this.normalPdf(x, samplingMean, samplingStdDev) * this.sampleMeansDist.length * binWidth;
      if (isFinite(y)) {
        curveData.push({ x, y });
      }
    }

    this.problemChart.data.datasets.push({
      label: 'Theoretical Sampling Distribution',
      data: curveData,
      type: 'line',
      borderColor: 'black',
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
    });
  }

  private normalPdf(x: number, mean: number, stdDev: number): number {
    if (stdDev === 0) return 0;
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  }
  
  private isCloseEnough(val1: number, val2: number, tolerance: number): boolean {
    if (isNaN(val1)) return false;
    return Math.abs(val1 - val2) <= tolerance;
  }

  private rawToScatter(arr: number[]): ChartPoint[] {
    const counts: { [key: string]: number } = {};
    const scatter: ChartPoint[] = [];
    const precision = 10;
    const roundedArr = arr.map(val => Math.round(val * precision) / precision);
    for (const item of roundedArr) {
      if (!isFinite(item)) continue;
      const y = (counts[item] = (counts[item] || 0) + 1);
      scatter.push({ x: item, y: y });
    }
    return scatter;
  }

  private calculateMean(data: number[]): number {
    const finiteData = data.filter(isFinite);
    if (finiteData.length === 0) return 0;
    const sum = finiteData.reduce((acc, val) => acc + val, 0);
    return sum / finiteData.length;
  }

  private calculateStdDev(data: number[], useSample: boolean = false): number {
    const finiteData = data.filter(isFinite);
    if (finiteData.length <= 1) return 0;
    const mean = this.calculateMean(finiteData);
    const sumOfSquares = finiteData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const denominator = useSample ? finiteData.length - 1 : finiteData.length;
    if (denominator === 0) return 0;
    return Math.sqrt(sumOfSquares / denominator);
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getNormallyDistributedRandom(mean: number, stddev: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stddev + mean;
  }

  private randomSubset(itr: number[], n: number): number[] {
    const result = new Array(n);
    let len = itr.length;
    const taken = new Array(len);
    if (n > len) throw new RangeError("randomSubset: n is larger than array length");
    while (n--) {
      const x = Math.floor(Math.random() * len);
      result[n] = itr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  createChart(): void {
    if (this.problemChart) {
      this.problemChart.destroy();
    }
    
    const ctx = this.inputDataChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.problemChart = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: [] },
        options: {
          scales: {
            xAxes: [{
              ticks: { 
                fontColor: 'black', 
                fontSize: 16, 
                padding: 0,
                autoSkip: true,
                maxTicksLimit: 10
              },
              scaleLabel: {
                display: true,
                labelString: 'Data',
                fontStyle: 'bold',
                fontColor: 'black'
              }
            }],
            yAxes: [{
              ticks: { 
                fontColor: 'black', 
                fontSize: 16, 
                padding: 0, 
                min: 0,
                autoSkip: true, 
                maxTicksLimit: 10 
              },
              scaleLabel: {
                display: true,
                labelString: 'Frequency',
                fontStyle: 'bold',
                fontColor: 'black'
              }
            }]
          },
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: 'rgba(0, 0, 0, 1.0)',
            bodyFontSize: 16,
          }
        }
      });
    }
  }

  /**
   * Returns a specific title based on the current problem type.
   */
  getProblemTitle(): string {
    switch (this.problemType) {
      case 'ci':
        return 'Calculate the Confidence Interval';
      case 'samplesize':
        return 'Determine the Sample Size';
      case 'find_xbar':
        return 'Find the Point Estimate (x̄)';
      case 'find_e_from_ci':
        return 'Find the Margin of Error (E)';
      case 'sampling_dist':
        return 'Understand the Sampling Distribution';
      default:
        return 'Analyze the Problem'; // Default fallback
    }
  }
    // Initialize the drawing workspace
initializeWorkspace(): void {
    // Get DOM elements
    const canvas = document.getElementById('drawingCanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    const eraserButton = document.getElementById('eraserButton');
    const clearButton = document.getElementById('clearButton');
    const drawButton = document.getElementById('drawButton');
    const textButton = document.getElementById('textButton');
    const textOverlay = document.getElementById('textOverlay') as HTMLTextAreaElement;
    const colorButtons = document.querySelectorAll('.color-button');
    // State variables
    let isDrawing = false;
    let isErasing = false;
    let isTextMode = false;
    let isTextEditing = false;
    let lastCommittedText = '';
    let currentColor = '#000000';
    let prevX: number;
    let prevY: number;

    // Set initial cursor style
    canvas.classList.add('drawing-mode');
    // Drawing functionality
    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Draw line from previous point to current point
      context.beginPath();
      context.moveTo(prevX, prevY);
      context.lineTo(x, y);

      if (isErasing) {
        // Use destination-out composite operation for true erasing
        context.globalCompositeOperation = 'destination-out';
        context.lineWidth = 20;
        context.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        context.globalCompositeOperation = 'source-over';
        context.lineWidth = 2;
        context.strokeStyle = currentColor;
      }
      // Smooth lines
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.stroke();

      prevX = x;
      prevY = y;
    };
    // Mouse event listeners
    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      prevX = e.clientX - rect.left;
      prevY = e.clientY - rect.top;
    });
    // Continue drawing on mousemove
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    // Color buttons
    colorButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        isErasing = false;
        currentColor = target.dataset.color || '#000000';

        colorButtons.forEach(btn => btn.classList.remove('selected'));
        target.classList.add('selected');

        canvas.classList.remove('eraser-mode');
        canvas.classList.add('drawing-mode');
        eraserButton?.classList.remove('active');
        if (textOverlay) textOverlay.style.color = currentColor;
      });
    });

    // Select black by default
    const blackButton = document.querySelector('.color-button.black');
    if (blackButton) {
      blackButton.classList.add('selected');
    }
    // Eraser functionality
    eraserButton?.addEventListener('click', () => {
      isErasing = true;
      isTextMode = false;
      canvas.classList.remove('drawing-mode', 'text-mode');
      canvas.classList.add('eraser-mode');
      context.globalCompositeOperation = 'destination-out';
      context.lineWidth = 20;

      // Update button states
      eraserButton.classList.add('active');
      drawButton?.classList.remove('active');
      textButton?.classList.remove('active');
      textOverlay.classList.remove('active');
      colorButtons.forEach(btn => btn.classList.remove('selected'));
    });
    // Clear functionality
    clearButton?.addEventListener('click', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (textOverlay) {
        textOverlay.value = '';
        lastCommittedText = '';
      }
    });

    // Text mode functionality
    textButton?.addEventListener('click', () => {
      isTextMode = true;
      isErasing = false;
      canvas.classList.remove('drawing-mode', 'eraser-mode');
      canvas.classList.add('text-mode');

      // Show and enable overlay for typing
      if (textOverlay) {
        textOverlay.classList.add('active');
        textOverlay.readOnly = false;
        textOverlay.focus();
        isTextEditing = true;
        // sync color
        textOverlay.style.color = currentColor;
      }

      // Update button states
      textButton.classList.add('active');
      drawButton?.classList.remove('active');
      eraserButton?.classList.remove('active');
    });
    // Draw mode functionality
    drawButton?.addEventListener('click', () => {
      isTextMode = false;
      isErasing = false;
      canvas.classList.remove('text-mode', 'eraser-mode');
      canvas.classList.add('drawing-mode');

      // Update button states
      drawButton.classList.add('active');
      textButton?.classList.remove('active');
      eraserButton?.classList.remove('active');
      // commit overlay text (if changed) then hide overlay to avoid duplicate rendering
      if (textOverlay) {
        // commit only if content differs from last commit
        if (textOverlay.value && textOverlay.value !== lastCommittedText) {
          commitOverlayTextToCanvas();
        }
        textOverlay.classList.remove('active');
        textOverlay.readOnly = true;
        isTextEditing = false;
      }
    });

    // Overlay click toggles editing on/off. When editing is turned off we commit text into canvas.
    if (textOverlay) {
      // ensure overlay color matches current color
      textOverlay.style.color = currentColor;

      textOverlay.addEventListener('click', (ev) => {
        if (!isTextMode) return;
        // toggle editing state
        if (isTextEditing) {
          // finish editing: set readonly and commit to canvas
          textOverlay.readOnly = true;
          isTextEditing = false;
          // draw overlay text onto canvas
          commitOverlayTextToCanvas();
        } else {
          // enable editing
          textOverlay.readOnly = false;
          isTextEditing = true;
          textOverlay.focus();
        }
      });

      // Commit on blur too (in case user tabs away)
      textOverlay.addEventListener('blur', () => {
        if (isTextMode && isTextEditing) {
          textOverlay.readOnly = true;
          isTextEditing = false;
          commitOverlayTextToCanvas();
        }
      });
    }
    // Function to commit overlay text to canvas
    function commitOverlayTextToCanvas() {
      if (!textOverlay) return;
      const text = textOverlay.value || '';
      if (!text) return;
      if (text === lastCommittedText) return; // avoid double commits
      // Draw each line onto canvas
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = currentColor;
      const fontSize = 16;
      context.font = `${fontSize}px Arial`;
      const lines = text.split('\n');
      // Draw starting at 8px padding
      const startX = 8;
      // Initial baseline
      let startY = 20; //
      const lineHeight = fontSize * 1.4;
      for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], startX, startY + i * lineHeight);
      }
      lastCommittedText = text;
    }
  }
  
}