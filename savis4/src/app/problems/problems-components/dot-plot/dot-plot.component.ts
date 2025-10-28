//import { Component, OnInit } from '@angular/core};
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-user-manual',
  templateUrl: './dot-plot.component.html',
  styleUrls: ['./dot-plot.component.scss']
})
export class DotPlotProblemsComponent implements AfterViewInit, OnDestroy {

  @ViewChild('inputChart') inputDataChartRef: ElementRef<HTMLCanvasElement>

  inputChart!: Chart;

  inputAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  correctAnswer: string = '100'; //hardcoded the correct answer

  xAxisLabel: string = '';
  yAxisLabel: string = '';
  randomData: { category: string; value: number }[] = [];
  question: string = '';
  multipleChoices: string[] = [];
  selectedAnswer: string = '';

  constructor(
    private translate: TranslateService,
  ) { }

  submitAnswer() {
    this.answerIsCorrect = this.selectedAnswer.trim() === this.correctAnswer;
    this.showAnswer = true;
  }

  hideAnswer(){
    this.showAnswer = !this.showAnswer;
  }

  ngAfterViewInit() {
    this.generateNewProblem();
    this.createInputChart();
    this.updateChartWithData();
  }  

  ngOnDestroy(): void{
    if(this.inputChart){
      this.inputChart.destroy();
    }
  }

  createInputChart(): void {
    const ctx = this.inputDataChartRef.nativeElement.getContext('2d');
    if (ctx) {
      this.inputChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: this.translate.instant('dotPlot_input_data'),
              backgroundColor: 'green',
              data: [
                { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 },
                { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 },
                { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 3, y: 5 },
                { x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 }
              ],
              pointRadius: 5,
              pointHoverRadius: 7
            }
          ]
        },
        options: {
          scales: {
            xAxes: [
              {
                type: 'linear',
                position: 'bottom',
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  stepSize: 1,
                  min: 0,
                  max: 5
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('dotPlot_data'),
                  fontStyle: 'bold',
                  fontSize: 16,
                  fontColor: 'black'
                }
              }
            ],
            yAxes: [
              {
                type: 'linear',
                ticks: {
                  fontColor: 'black',
                  fontSize: 16,
                  stepSize: 1,
                  min: 0,
                  max: 10
                },
                scaleLabel: {
                  display: true,
                  labelString: this.translate.instant('dotPlot_frequencies'),
                  fontStyle: 'bold',
                  fontSize: 16,
                  fontColor: 'black'
                }
              }
            ]
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 1.0)',
              bodyFontSize: 16
            }
          }
        }
      });
    }
  }

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

  generateRandomData(): { category: string; value: number }[] {
    const categories = ['A', 'B', 'C', 'D', 'E'].slice(0, Math.floor(Math.random() * 3) + 3);
    return categories.map((category) => ({
      category: `${this.xAxisLabel} ${category}`,
      value: Math.floor(Math.random() * 10) + 1
    }));
  }

  generateQuestion(): void {
    const sortedData = [...this.randomData].sort((a, b) => a.value - b.value);
    const lowest = sortedData[0];
    const secondLowest = sortedData[1];
    const highest = sortedData[sortedData.length - 1];

    // Handle ties for the highest value
    const highestValues = sortedData.filter((data) => data.value === highest.value);
    const highestCategories = highestValues.map((data) => data.category).join(' and ');

    const randomCategory = this.randomData[Math.floor(Math.random() * this.randomData.length)];
    const anotherRandomCategory = this.randomData.filter((data) => data !== randomCategory)[Math.floor(Math.random() * (this.randomData.length - 1))];

    const questionTypes = [
        {
            question: `Which ${this.xAxisLabel} has the highest ${this.yAxisLabel}?`,
            correctAnswer: highestValues.length > 1 ? highestCategories : highest.category,
            choices: highestValues.length > 1
                ? this.randomData.map((data) => data.category).concat(highestCategories)
                : this.randomData.map((data) => data.category)
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

  generateNewProblem(): void {
    this.generateRandomAxisLabels();
    this.randomData = this.generateRandomData();
    this.updateChartWithData();
    this.generateQuestion();
    this.selectedAnswer = '';
    this.answerIsCorrect = false;
    this.showAnswer = false;
  }

  updateChartWithData(): void {
    const ctx = this.inputDataChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.inputChart) {
        this.inputChart.destroy();
    }

    this.inputChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: this.translate.instant('dotPlot_input_data'),
                    backgroundColor: 'green',
                    data: this.randomData.map((data, index) => ({ x: index + 1, y: data.value })),
                    pointRadius: 5,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            scales: {
                xAxes: [
                    {
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            fontColor: 'black',
                            fontSize: 16,
                            stepSize: 1,
                            min: 0,
                            max: this.randomData.length + 1,
                            callback: (value: number) => {
                                if (value > 0 && value <= this.randomData.length) {
                                    return this.randomData[value - 1].category;
                                }
                                return '';
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: this.xAxisLabel,
                            fontStyle: 'bold',
                            fontSize: 16,
                            fontColor: 'black'
                        }
                    }
                ],
                yAxes: [
                    {
                        type: 'linear',
                        ticks: {
                            fontColor: 'black',
                            fontSize: 16,
                            stepSize: 1,
                            min: 0,
                            max: 10
                        },
                        scaleLabel: {
                            display: true,
                            labelString: this.yAxisLabel,
                            fontStyle: 'bold',
                            fontSize: 16,
                            fontColor: 'black'
                        }
                    }
                ]
            },
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: 'rgba(0, 0, 0, 1.0)',
                bodyFontSize: 16
            }
        }
    });
  }

}
