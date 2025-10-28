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
          label: `95% Confidence Interval`,
          data: [{ x: lower, y: maxY * 0.8 }, { x: upper, y: maxY * 0.8 }],
          type: 'line',
          borderColor: 'blue',
          borderWidth: 3,
          pointRadius: 0
        }
      ]
    },
    /*options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        x: {
          min: 0,
          max: 1,
          title: {
            display: true,
            text: 'Sample Proportion (p̂)'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Density'
          }
        }
      }
    }*/
  });
}

          
}    
