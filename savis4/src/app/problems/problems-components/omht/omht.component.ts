import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-user-manual',
  templateUrl: './omht.component.html',
  styleUrls: ['./omht.component.scss']
})
export class OMHTProblemsComponent implements AfterViewInit, OnDestroy {

  @ViewChild('inputChart') inputDataChartRef: ElementRef<HTMLCanvasElement>

  inputChart!: Chart;

  inputAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  currentProblemIndex: number = 0;
  correctAnswer: string = '';

  problems = [
    {
      question: "A company claims that their new energy drink increases reaction time by an average of 100 milliseconds. In a study of 30 participants, the mean increase in reaction time was 95 milliseconds with a standard deviation of 15 milliseconds. At α = 0.05, what is the p-value for testing if there's evidence to reject the company's claim?",
      answer: "0.077",
      nullHypothesis: 100,
      sampleMean: 95,
      stdDev: 15,
      n: 30,
      alpha: 0.05
    },
    {
      question: "A manufacturer claims their light bulbs last an average of 1000 hours. A sample of 25 bulbs had a mean life of 975 hours with a standard deviation of 50 hours. At α = 0.05, what is the test statistic (t-value) for testing if there's evidence against the manufacturer's claim?",
      answer: "-2.5",
      nullHypothesis: 1000,
      sampleMean: 975,
      stdDev: 50,
      n: 25,
      alpha: 0.05
    },
    {
      question: "A health study claims the average daily steps for adults is 5000. A fitness tracker company sampled 40 users and found a mean of 5200 steps with a standard deviation of 800 steps. At α = 0.05, what is the critical value for this two-tailed test?",
      answer: "2.022",
      nullHypothesis: 5000,
      sampleMean: 5200,
      stdDev: 800,
      n: 40,
      alpha: 0.05
    },
    {
      question: "A coffee shop claims their customers wait an average of 3 minutes for their order. A study of 35 customers showed a mean wait time of 3.2 minutes with a standard deviation of 0.5 minutes. At α = 0.01, what is the p-value for testing if the true mean wait time is different from 3 minutes?",
      answer: "0.023",
      nullHypothesis: 3,
      sampleMean: 3.2,
      stdDev: 0.5,
      n: 35,
      alpha: 0.01
    },
    {
      question: "A diet program claims participants lose an average of 10 pounds in the first month. In a study of 28 participants, the mean weight loss was 9.2 pounds with a standard deviation of 2.1 pounds. At α = 0.05, what is the margin of error for this test?",
      answer: "0.814",
      nullHypothesis: 10,
      sampleMean: 9.2,
      stdDev: 2.1,
      n: 28,
      alpha: 0.05
    }
  ];

  constructor(
    private translate: TranslateService,
  ) {
    // Select random problem when component is created
    this.currentProblemIndex = Math.floor(Math.random() * this.problems.length);
    this.correctAnswer = this.problems[this.currentProblemIndex].answer;
  }

  submitAnswer(){
    this.answerIsCorrect = this.inputAnswer.trim() === this.correctAnswer;
    this.showAnswer = true;
    if (this.answerIsCorrect) {
      this.updateChartWithData();
    }
  }

  hideAnswer(){
    this.showAnswer = !this.showAnswer;
  }

  nextQuestion(){
    // Reset the form state
    this.inputAnswer = '';
    this.answerIsCorrect = false;
    this.showAnswer = false;

    this.currentProblemIndex = (this.currentProblemIndex + 1) % this.problems.length;
    this.correctAnswer = this.problems[this.currentProblemIndex].answer;

    // Reset the chart
    if(this.inputChart) {
      this.createInputChart();
    }
  }

  ngAfterViewInit() {
    this.createInputChart()
  }  

  ngOnDestroy(): void{
    if(this.inputChart){
      this.inputChart.destroy();
    }
  }

  updateChartWithData(): void {
    if (this.inputChart) {
      const problem = this.problems[this.currentProblemIndex];
      const { nullHypothesis, sampleMean, stdDev, n, alpha } = problem;
      
      // Calculate standard error and test statistic
      const se = stdDev / Math.sqrt(n);
      const testStat = (sampleMean - nullHypothesis) / se;
      
      // Generate points for the t-distribution curve
      const points = [];
      const criticalT = this.getCriticalValue(alpha);
      const xMin = -4;
      const xMax = 4;
      const step = 0.1;
      
      for (let x = xMin; x <= xMax; x += step) {
        // Calculate t-distribution PDF
        const y = this.tDistributionPDF(x, n - 1);
        points.push({x, y});
      }

      // Create datasets for different parts of the visualization
      const mainCurve = points.map(p => ({x: p.x, y: p.y}));
      const criticalRegion = points.filter(p => Math.abs(p.x) > criticalT).map(p => ({x: p.x, y: p.y}));
      const testStatPoint = [{x: testStat, y: 0}];

      // Update chart with new datasets
      this.inputChart.data.datasets = [
        {
          data: mainCurve,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          fill: true,
          pointRadius: 0,
          showLine: true
        } as any,
        {
          data: criticalRegion,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.3)',
          borderWidth: 2,
          fill: true,
          pointRadius: 0,
          showLine: true
        } as any,
        {
          data: testStatPoint,
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 1)',
          pointRadius: 8,
          pointStyle: 'triangle',
          showLine: false
        } as any
      ];
      
      // Update axis labels
      this.inputChart.options.scales.xAxes[0].ticks.min = xMin;
      this.inputChart.options.scales.xAxes[0].ticks.max = xMax;
      this.inputChart.options.scales.xAxes[0].scaleLabel.labelString = 't-statistic';
      this.inputChart.options.scales.yAxes[0].scaleLabel.labelString = 'Density';
      
      this.inputChart.update();
    }
  }

  // Helper function to calculate t-distribution PDF
  private tDistributionPDF(x: number, df: number): number {
    const gamma = (n: number): number => {
      if (n === 1) return 1;
      if (n === 0.5) return Math.sqrt(Math.PI);
      return (n - 1) * gamma(n - 1);
    };

    const numerator = gamma((df + 1) / 2);
    const denominator = Math.sqrt(df * Math.PI) * gamma(df / 2);
    return (numerator / denominator) * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
  }

  // Helper function to get critical value based on alpha
  private getCriticalValue(alpha: number): number {
    if (alpha === 0.05) return 1.96;
    if (alpha === 0.01) return 2.576;
    return 1.96; // default to 0.05 level
  }

  createInputChart(): void {
    const ctx = this.inputDataChartRef.nativeElement.getContext('2d')
    if(ctx) {
      this.inputChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [
            {
              data: [] as any[],
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              fill: true,
              pointRadius: 0,
              showLine: true
            } as any,
            {
              data: [] as any[],
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.3)',
              borderWidth: 2,
              fill: true,
              pointRadius: 0,
              showLine: true
            } as any,
            {
              data: [] as any[],
              borderColor: 'rgba(255, 206, 86, 1)',
              backgroundColor: 'rgba(255, 206, 86, 1)',
              pointRadius: 8,
              pointStyle: 'triangle',
              showLine: false
            } as any
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              type: 'linear',
              position: 'bottom',
              ticks: {
                min: -4,
                max: 4,
                fontColor: 'black',
                fontSize: 12,
                padding: 5
              },
              scaleLabel: {
                display: true,
                labelString: 't-statistic',
                fontStyle: 'bold',
                fontColor: 'black'
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: 'black',
                fontSize: 12,
                padding: 5
              },
              scaleLabel: {
                display: true,
                labelString: 'Density',
                fontStyle: 'bold',
                fontColor: 'black'
              }
            }]
          },
          tooltips: {
            enabled: false
          }
        }
      })
    }

  }

}
