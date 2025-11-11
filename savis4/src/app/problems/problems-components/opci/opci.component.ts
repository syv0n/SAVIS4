//import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartType, Chart } from 'chart.js';
import { ChartDataSets, ChartPoint } from 'chart.js';


@Component({
  selector: 'app-user-manual',
  templateUrl: './opci.component.html',
  styleUrls: ['./opci.component.scss']
})
export class OPCIProblemsComponent implements AfterViewInit {

  @ViewChild('chart3') chart3Ref: ElementRef<HTMLCanvasElement>;

  chart!: Chart;

  wordProblem: string = '';
  inputAnswer: number;
  userAnswerLower: string = '';
  userAnswerUpper: string = '';
  userSampleProportion: string = '';
  userMarginError: string = '';
  answerIsCorrect: boolean = false;
  isLowerCorrect: boolean = false;
  isUpperCorrect: boolean = false;
  showAnswer: boolean = false;
  correctAnswerLower: string;
  correctAnswerUpper: string;
  correctAnswer: string = ''; 
  correctSampleProportion: string='';
  correctMarginError: string = '';

  isSamplePropCorrect: boolean = false;
  isMarginErrorCorrect: boolean = false;

  currentSampleSize!:number; //store generated sample size
  currentSuccesses!: number; //store number of successes
  currentConfidence!: number; //store confidence level

  constructor( 
    private translate: TranslateService
  ) { }

  generateNewProblem(): void {
    //generated the number of sample size between 100 and 200 
    const sampleSize = this.randomInt(100, 200);
    //generate the number of successes
    const successes = this.randomInt(Math.floor(sampleSize*0.3), Math.floor(sampleSize*0.7));
    //the number of failures
    const failures = sampleSize - successes;
    //randomly pick a number of confidence level
    const confidence = [0.90, 0.95, 0.99][Math.floor(Math.random()*3)];

    this.currentSampleSize = sampleSize;
    this.currentSuccesses = successes;
    this.currentConfidence = confidence;

    //generated word problem
    this.wordProblem = `In a survey of ${sampleSize} university students, ${successes} of those students are commuters. Conduct a ${confidence*100}% confidence interval of the true proportion of students who commute to campus. (Round all answers to 3 decimal places)`;

    //calculate the probability of sample
    const successProbability = successes / sampleSize;

    //get the z critical value that match the randomly picked confidence level
    const zTable: { [key: number]: number } = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.545
    };
    //assign z critical value to the corresponding confidence level
    const zCV = zTable[confidence] || 1.96;

    const standardError = (Math.sqrt((successProbability*(1-successProbability)) / sampleSize));

    //calculate margin error
    const marginError = zCV * standardError;

    //calculate lower and upper bounds
    const lowerBound = successProbability - marginError;
    const upperBound = successProbability + marginError;

    //store correct answers
    this.correctSampleProportion = successProbability.toFixed(3);
    this.correctMarginError = marginError.toFixed(3);
    this.correctAnswerLower = lowerBound.toFixed(3);
    this.correctAnswerUpper = upperBound.toFixed(3);

    //this.correctAnswer = `(${this.correctAnswerLower} , ${this.correctAnswerUpper})`;

    //reset user input when generating a new problem
    this.userSampleProportion = '';
    this.userMarginError = '';
    this.userAnswerLower = '';
    this.userAnswerUpper = '';
    this.showAnswer = false;
    this.answerIsCorrect = false;

    this.drawGraph(true);

    /*
    if (this.chart3Ref){
      this.createChart();
    }*/
  }

  //for random
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random()*(max - min + 1)) + min;
  }

  submitAnswer(){
    //make sure user answers all questions before submitting
    if (!this.userAnswerLower || !this.userAnswerUpper || !this.userSampleProportion || !this.userMarginError){
      alert('Please type in all boxes before checking the answers');
      return;
    }
    
    this.showAnswer = true;

    //check if answers are correct
    this.isSamplePropCorrect = this.userSampleProportion === this.correctSampleProportion;
    this.isMarginErrorCorrect = this.userMarginError === this.correctMarginError;
    this.isLowerCorrect = this.userAnswerLower === this.correctAnswerLower;
    this.isUpperCorrect = this.userAnswerUpper === this.correctAnswerUpper;

    this.answerIsCorrect = this.isSamplePropCorrect && this.isMarginErrorCorrect && this.isLowerCorrect && this.isUpperCorrect;

    this.drawGraph(true);

  }

  hideAnswer(){
    this.showAnswer = !this.showAnswer;
  }

  ngAfterViewInit(): void {
    this.generateNewProblem();
    //this.createChart();
    this.initializeWorkspace();
  }

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

  drawGraph(showAnswer: boolean = false): void {
  if (!this.chart3Ref) return;

  const ctx = this.chart3Ref.nativeElement.getContext('2d');
  if (!ctx) return;

  // Destroy previous chart
  if (this.chart) this.chart.destroy();

  const n = this.currentSampleSize;
  const pHat = this.currentSuccesses / n;
  const confidence = this.currentConfidence;

  // Z critical values
  const zTable: { [key: number]: number } = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.545
  };
  const zCV = zTable[confidence] || 1.96;

  // Standard error
  const se = Math.sqrt((pHat * (1 - pHat)) / n);
  //margin error
  const margin = zCV * se;
  //calculating lower and upper bound
  const lower = pHat - margin;
  const upper = pHat + margin;

  // Create normal curve points
  const points: ChartPoint[] = [];
  const step = 0.001; // fine enough for smooth curve
  const minX = Math.max(0, pHat - 4 * se);
  const maxX = Math.min(1, pHat + 4 * se);

  for (let x = minX; x <= maxX; x += step) {
    const y = (1 / (se * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - pHat) / se, 2));
    points.push({ x, y });
  }

  // Max y for confidence interval line
  const maxY = Math.max(...points.map(p => Number(p.y))) * 1.1;

  // Create the chart
  this.chart = new Chart(ctx, {
    type: 'scatter', 
    data: {
      datasets: [
        {
          label: 'Sampling Distribution (Normal Approx)',
          data: points,
          type: 'line',
          borderColor: 'black',
          borderWidth: 2,
          fill: false,
          pointRadius: 0
        },
        {
          label: `Sample Proportion (p̂)`,
          data: [{ x: pHat, y: 0 }, { x: pHat, y: maxY }],
          type: 'line',
          borderColor: 'green',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0
        },
        {
          label: `${confidence * 100}% Confidence Interval`,
          data: [{ x: lower, y: maxY * 0.9 }, { x: upper, y: maxY * 0.9 }],
          type: 'line',
          backgroundColor: 'rgba(173, 216, 230, 0.5)',
          borderWidth: 3,
          pointRadius: 0
        }
      ]
    },
  });
}
          
}    
