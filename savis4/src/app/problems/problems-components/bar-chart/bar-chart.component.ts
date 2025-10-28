import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-problems',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartProblemsComponent implements AfterViewInit {
  @ViewChild('inputChart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  inputChart: Chart;

  // State for practice problems
  selectedAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  correctAnswer: string = '';
  question: string = '';
  randomData: { category: string; value: number }[] = [];
  xAxisLabel: string = '';
  yAxisLabel: string = '';
  multipleChoices: string[] = [];

  constructor() {}

  ngAfterViewInit(): void {
    this.generateNewProblem();
  }

  /**
   * Generate a new bar chart problem
   */
  generateNewProblem(): void {
    // Generate random axis labels
    this.generateRandomAxisLabels();

    // Generate random data for the bar chart
    this.randomData = this.generateRandomData();

    // Update the chart with the new data
    this.updateChartWithData();

    // Generate a question based on the data
    this.generateQuestion();

    // Reset user input and feedback
    this.selectedAnswer = '';
    this.answerIsCorrect = false;
    this.showAnswer = false;
  }

  /**
   * Generate random axis labels
   */
  generateRandomAxisLabels(): void {
    const wordBank = [
      { x: 'Class', y: 'Students' },
      { x: 'Car', y: 'Price' },
      { x: 'Year', y: 'Population' },
      { x: 'Movie', y: 'Tickets Sold' },
      { x: 'Eye Color', y: 'Frequency' },
      { x: 'Hair Color', y: 'Frequency' },
      { x: 'Job', y: 'Salary' },
      { x: 'Animal', y: 'Weight' },
      { x: 'Person', y: 'Height' },
      { x: 'Company', y: 'Sales' }
    ];
    const randomPair = wordBank[Math.floor(Math.random() * wordBank.length)];
    this.xAxisLabel = randomPair.x;
    this.yAxisLabel = randomPair.y;
  }

  /**
   * Generate random data for the bar chart
   */
  generateRandomData(): { category: string; value: number }[] {
    const categories = ['A', 'B', 'C', 'D', 'E'].slice(0, Math.floor(Math.random() * 3) + 3); // Randomize 3-5 categories
    return categories.map((category) => ({
      category: `${this.xAxisLabel} ${category}`,
      value: Math.floor(Math.random() * 100) + 1 // Random values between 1 and 100
    }));
  }

  /**
   * Generate a question based on the random data
   */
  generateQuestion(): void {
    const sortedData = [...this.randomData].sort((a, b) => a.value - b.value);
    const lowest = sortedData[0];
    const secondLowest = sortedData[1];
    const highest = sortedData[sortedData.length - 1];
    const randomCategory = this.randomData[Math.floor(Math.random() * this.randomData.length)];
    const anotherRandomCategory = this.randomData.filter((data) => data !== randomCategory)[Math.floor(Math.random() * (this.randomData.length - 1))];

    const questionTypes = [
      {
        question: `Which ${this.xAxisLabel} has the highest ${this.yAxisLabel}?`,
        correctAnswer: highest.category,
        choices: this.randomData.map((data) => data.category)
      },
      {
        question: `Does ${randomCategory.category} have a higher ${this.yAxisLabel} than ${anotherRandomCategory.category}?`,
        correctAnswer: randomCategory.value > anotherRandomCategory.value ? 'Yes' : 'No',
        choices: ['Yes', 'No']
      },
      {
        question: `If you combined the two lowest ${this.xAxisLabel}s, would it have more ${this.yAxisLabel} than the highest ${this.xAxisLabel}?`,
        correctAnswer: lowest.value + secondLowest.value > highest.value ? 'Yes' : 'No',
        choices: ['Yes', 'No']
      }
    ];

    const selectedQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    this.question = selectedQuestion.question;
    this.correctAnswer = selectedQuestion.correctAnswer;
    this.multipleChoices = selectedQuestion.choices;
  }

  /**
   * Submit the user's answer and validate it
   */
  submitAnswer(): void {
    this.answerIsCorrect = this.selectedAnswer === this.correctAnswer;
    this.showAnswer = true;
  }

  /**
   * Hide the answer feedback
   */
  hideAnswer(): void {
    this.showAnswer = false;
  }

  /**
   * Update the chart with the random data
   */
  updateChartWithData(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.inputChart) {
      this.inputChart.destroy();
    }

    this.inputChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.randomData.map((data) => data.category),
        datasets: [
          {
            label: `${this.yAxisLabel} per ${this.xAxisLabel}`,
            data: this.randomData.map((data) => data.value),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: 'black',
                fontSize: 14,
                fontStyle: 'bold'
              },
              scaleLabel: {
                display: true,
                labelString: this.yAxisLabel,
                fontColor: 'black',
                fontSize: 14,
                fontStyle: 'bold'
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                fontColor: 'black',
                fontSize: 14,
                fontStyle: 'bold'
              },
              scaleLabel: {
                display: true,
                labelString: this.xAxisLabel,
                fontColor: 'black',
                fontSize: 14,
                fontStyle: 'bold'
              }
            }
          ]
        }
      }
    });
  }
}