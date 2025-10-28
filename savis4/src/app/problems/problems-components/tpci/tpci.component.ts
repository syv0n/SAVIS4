//import { Component, OnInit } from '@angular/core';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartPoint } from 'chart.js';

@Component({
  selector: 'app-user-manual',
  templateUrl: './tpci.component.html',
  styleUrls: ['./tpci.component.scss']
})
export class TPCIProblemsComponent implements AfterViewInit {

  @ViewChild('chart1') chart1Ref: ElementRef<HTMLCanvasElement>;
  
  chart1: Chart;

  wordProblem: string = '';
  userSampleProportion1: string = '';
  userSampleProportion2: string = '';
  userMarginError: string = '';
  userAnswerLower: string = '';
  userAnswerUpper: string = '';
  userDiffProportion: string = '';
  inputAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  correctAnswer: string = '100'; //hardcoded the correct answer

  correctAnswerLower: string;
  correctAnswerUpper: string; 
  correctSampleProportion1: string='';
  correctSampleProportion2: string='';
  correctMarginError: string = '';
  correctDiffProportion: string = '';

  isSamplePropCorrect1: boolean = false;
  isSamplePropCorrect2: boolean = false;
  isMarginErrorCorrect: boolean = false;
  isLowerCorrect: boolean = false;
  isUpperCorrect: boolean = false;
  isDiffPropCorrect: boolean = false;

  currentSuccess1!: number;
  currentSuccess2!: number;
  currentConfidence!: number;
  currentMarginError!: number;
  currentStandardError!: number;
  currentLower!: number;
  currerntUpper!: number;
  

  constructor(
    private translate: TranslateService
  ) {}

  generateNewProblem()
  {
    //group A sample size
    const sampleSize1 = this.randomInt(130,230);
    //group B sample size
    const sampleSize2 = this.randomInt(100, 200);
    //group A
    const success1 = this.randomInt(Math.floor(sampleSize1*0.3), Math.floor(sampleSize1*0.7));
    //group B
    const success2 = this.randomInt(Math.floor(sampleSize2*0.3), Math.floor(sampleSize2*0.7));
    //randomly pick a confidence level
    const confidence = [0.90, 0.95, 0.99][Math.floor(Math.random()*3)];

    //generate word problem
    this.wordProblem = `A researcher wants to compare how many teenagers and adults use social media daily. A survey was conducted. Out of ${sampleSize1} teenagers, ${success1} teenagers use social media daily. Out of ${sampleSize2} adults, ${success2} adults use social media daily. Construct a ${confidence}% confidence interval to estimate the difference between the proportions of teenagers and adults that use social media on a daily. (Round all answers to 3 decimal places)`

    //calculate the probability of sample
    const successProbability1 = success1 / sampleSize1;
    const successProbability2 = success2 / sampleSize2;

    const diffProportion = successProbability1 - successProbability2;

    //get the z critical values that match the randomly picked confidence level
    const zTable: { [key: number]: number } = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.545
    };
    //assign z critical value to the corresponding confidence level
    const zCV = zTable[confidence] || 1.96;

    //calculate the standard error
    const standardError = Math.sqrt( (successProbability1*(1-successProbability1)) / sampleSize1 + (successProbability2*(1-successProbability2)) / sampleSize2);
    
    //calculate the margin error
    const marginError = zCV * standardError;

    //calculate lower and upper bounds
    //calculate lower and upper bounds
    const lowerBound = (successProbability1 - successProbability2) - marginError;
    const upperBound = (successProbability1 - successProbability2) + marginError;

    //store correct answers
    this.correctSampleProportion1 = successProbability1.toFixed(3);
    this.correctSampleProportion2 = successProbability2.toFixed(3);
    this.correctMarginError = marginError.toFixed(3);
    this.correctAnswerLower = lowerBound.toFixed(3);
    this.correctAnswerUpper = upperBound.toFixed(3);
    this.correctDiffProportion = diffProportion.toFixed(3);

    //store data for graph
    this.currentSuccess1 = successProbability1;
    this.currentSuccess2 = successProbability2;
    this.currentConfidence = confidence;
    this.currentMarginError = marginError;
    this.currentStandardError = standardError;
    this.currentLower = lowerBound;
    this.currerntUpper = upperBound;


    //reset user input when generating a new problem
    this.userSampleProportion1 = '';
    this.userSampleProportion2 = '';
    this.userDiffProportion = '';
    this.userMarginError = '';
    this.userAnswerLower = '';
    this.userAnswerUpper = '';
    this.showAnswer = false;
    this.answerIsCorrect = false;

    this.drawGraph(true);
  }

  //use for random
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random()*(max - min + 1)) + min;
  }

  submitAnswer(){
    //make sure user answers all questions before submitting
    if (!this.userAnswerLower || !this.userAnswerUpper || !this.userSampleProportion1 || !this.userSampleProportion2 || !this.userMarginError || !this.userDiffProportion){
      alert('Please type in all boxes before checking the answers');
      return;
    }
    
    this.showAnswer = true;

    //check if answers are correct
    this.isSamplePropCorrect1 = this.userSampleProportion1 === this.correctSampleProportion1;
    this.isSamplePropCorrect2 = this.userSampleProportion2 === this.correctSampleProportion2;
    this.isDiffPropCorrect = this.userDiffProportion === this.correctDiffProportion;
    this.isMarginErrorCorrect = this.userMarginError === this.correctMarginError;
    this.isLowerCorrect = this.userAnswerLower === this.correctAnswerLower;
    this.isUpperCorrect = this.userAnswerUpper === this.correctAnswerUpper;

    this.answerIsCorrect = this.isSamplePropCorrect1 && this.isSamplePropCorrect2 && this.isDiffPropCorrect && this.isMarginErrorCorrect && this.isLowerCorrect && this.isUpperCorrect;

    //this.drawGraph(true);
  }

  hideAnswer(){
    this.showAnswer = !this.showAnswer;
  }

  ngAfterViewInit(): void {
    this.generateNewProblem();
  }

  drawGraph(showAnswer: boolean = false): void {
  if (!this.chart1Ref) return;

  const ctx = this.chart1Ref.nativeElement.getContext('2d');
  if (!ctx) return;

  // Destroy previous chart
  if (this.chart1) this.chart1.destroy();

  //different in sample proportion
  const pHat = this.currentSuccess1 - this.currentSuccess2;
  const confidence = this.currentConfidence;

  // Z critical values
  const zTable: { [key: number]: number } = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.545
  };
  const zCV = zTable[confidence] || 1.96;

  // Standard error
  const se = this.currentStandardError;
  //margin error
  const margin = zCV * se;
  //calculating lower and upper bound
  const lower = this.currentLower;
  const upper = this.currerntUpper;

  // Create normal curve points
  const points: ChartPoint[] = [];
  const step = 0.001; // fine enough for smooth curve
  const minX = pHat - 4 * se;
  const maxX = pHat + 4 * se

  for (let x = minX; x <= maxX; x += step) {
    const y = (1 / (se * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - pHat) / se, 2));
    points.push({ x, y });
  }

  // Max y for confidence interval line
  const maxY = Math.max(...points.map(p => Number(p.y))) * 1.1;

  // Create the chart
  this.chart1 = new Chart(ctx, {
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
