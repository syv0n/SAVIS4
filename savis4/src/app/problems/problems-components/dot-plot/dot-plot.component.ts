//import { Component, OnInit } from '@angular/core};
import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-user-manual',
  templateUrl: './dot-plot.component.html',
  styleUrls: ['./dot-plot.component.scss']
})
// Component for dot plot practice problems
export class DotPlotProblemsComponent implements AfterViewInit, OnDestroy {

  @ViewChild('inputChart') inputDataChartRef: ElementRef<HTMLCanvasElement>

  inputChart!: Chart;
  // User's answer and feedback variables
  inputAnswer: string = '';
  answerIsCorrect: boolean = false;
  showAnswer: boolean = false;
  // Hardcoded correct answer for testing
  correctAnswer: string = '100';
  // Problem data variables
  xAxisLabel: string = '';
  yAxisLabel: string = '';
  randomData: { category: string; value: number }[] = [];
  question: string = '';
  multipleChoices: string[] = [];
  selectedAnswer: string = '';
  showCorrectAnswer: boolean = false;

  constructor(
    private translate: TranslateService,
  ) { }
  // Submit the user's answer and check correctness
  submitAnswer() {
    this.answerIsCorrect = this.selectedAnswer.trim() === this.correctAnswer;
    this.showAnswer = true;
  }
  // Toggle the visibility of the answer
  hideAnswer(){
    this.showAnswer = !this.showAnswer;
    this.showCorrectAnswer = false;
  }
  // Toggle the visibility of the correct answer
  toggleCorrectAnswer(): void {
    this.showCorrectAnswer = !this.showCorrectAnswer;
  }
  // Lifecycle hook to initialize component
  ngAfterViewInit() {
    this.generateNewProblem();
    this.createInputChart();
    this.updateChartWithData();
    this.initializeWorkspace();
  }  
  // Cleanup chart instance on component destroy
  ngOnDestroy(): void{
    if(this.inputChart){
      this.inputChart.destroy();
    }
  }
  // Create the initial input chart with default data
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
  // Generate random axis labels for the dot plot
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
  // Generate random data for the dot plot
  generateRandomData(): { category: string; value: number }[] {
    const categories = ['A', 'B', 'C', 'D', 'E'].slice(0, Math.floor(Math.random() * 3) + 3);
    return categories.map((category) => ({
      category: `${this.xAxisLabel} ${category}`,
      value: Math.floor(Math.random() * 10) + 1
    }));
  }
  // Generate a question based on the random data
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

  // Initialize the drawing workspace
  initializeWorkspace(): void {
    const canvas = document.getElementById('drawingCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const context = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    const eraserButton = document.getElementById('eraserButton');
    const clearButton = document.getElementById('clearButton');
    const drawButton = document.getElementById('drawButton');
    const textButton = document.getElementById('textButton');
    const textOverlay = document.getElementById('textOverlay') as HTMLTextAreaElement;
    const colorButtons = document.querySelectorAll('.color-button');

    let isDrawing = false;
    let isErasing = false;
    let isTextMode = false;
    let isTextEditing = false;
    let lastCommittedText = '';
    let currentColor = '#000000';
    let prevX: number;
    let prevY: number;

    // Initial cursor state
    canvas.classList.add('drawing-mode');

    const draw = (e: MouseEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Draw line
      context.beginPath();
      context.moveTo(prevX, prevY);
      context.lineTo(x, y);
      // Set drawing or erasing styles
      if (isErasing) {
        context.globalCompositeOperation = 'destination-out';
        context.lineWidth = 20;
        context.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        context.globalCompositeOperation = 'source-over';
        context.lineWidth = 2;
        context.strokeStyle = currentColor;
      }
      // Smooth line
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
    // Mouse event listeners
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

    // Default select black
    const blackButton = document.querySelector('.color-button.black');
    if (blackButton) blackButton.classList.add('selected');
    // Eraser button
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
    // Clear button
    clearButton?.addEventListener('click', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (textOverlay) {
        textOverlay.value = '';
        lastCommittedText = '';
      }
    });

    // Text mode
    textButton?.addEventListener('click', () => {
      isTextMode = true;
      isErasing = false;
      canvas.classList.remove('drawing-mode', 'eraser-mode');
      canvas.classList.add('text-mode');
      // Activate text overlay
      if (textOverlay) {
        textOverlay.classList.add('active');
        textOverlay.readOnly = false;
        textOverlay.focus();
        isTextEditing = true;
        textOverlay.style.color = currentColor;
      }
      // Update button states
      textButton.classList.add('active');
      drawButton?.classList.remove('active');
      eraserButton?.classList.remove('active');
    });
    // Draw mode
    drawButton?.addEventListener('click', () => {
      isTextMode = false;
      isErasing = false;
      canvas.classList.remove('text-mode', 'eraser-mode');
      canvas.classList.add('drawing-mode');

      drawButton.classList.add('active');
      textButton?.classList.remove('active');
      eraserButton?.classList.remove('active');
      // Deactivate text overlay
      if (textOverlay) {
        if (textOverlay.value && textOverlay.value !== lastCommittedText) {
          commitOverlayTextToCanvas();
        }
        textOverlay.classList.remove('active');
        textOverlay.readOnly = true;
        isTextEditing = false;
      }
    });
    // Text overlay interactions
    if (textOverlay) {
      textOverlay.style.color = currentColor;
      // Click to edit
      textOverlay.addEventListener('click', (ev) => {
        if (!isTextMode) return;
        if (isTextEditing) {
          textOverlay.readOnly = true;
          isTextEditing = false;
          commitOverlayTextToCanvas();
        } else {
          textOverlay.readOnly = false;
          isTextEditing = true;
          textOverlay.focus();
        }
      });
      // Blur to commit
      textOverlay.addEventListener('blur', () => {
        if (isTextMode && isTextEditing) {
          textOverlay.readOnly = true;
          isTextEditing = false;
          commitOverlayTextToCanvas();
        }
      });
    }
    // Commit text from overlay to canvas
    function commitOverlayTextToCanvas() {
      if (!textOverlay) return;
      const text = textOverlay.value || '';
      if (!text) return;
      if (text === lastCommittedText) return;
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = currentColor;
      const fontSize = 16;
      context.font = `${fontSize}px Arial`;
      const lines = text.split('\n');
      const startX = 8;
      let startY = 20;
      const lineHeight = fontSize * 1.4;
      for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], startX, startY + i * lineHeight);
      }
      lastCommittedText = text;
    }
  }
  // Generate a new problem with random data and question
  generateNewProblem(): void {
    this.generateRandomAxisLabels();
    this.randomData = this.generateRandomData();
    this.updateChartWithData();
    this.generateQuestion();
    this.selectedAnswer = '';
    this.answerIsCorrect = false;
    this.showAnswer = false;
  }
  // Update the chart with the generated random data
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
