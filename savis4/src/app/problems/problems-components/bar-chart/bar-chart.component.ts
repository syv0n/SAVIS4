import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-problems',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
// Component for bar chart practice problems
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
  showCorrectAnswer: boolean = false;

  constructor() {}
  // Lifecycle hook to initialize component
  ngAfterViewInit(): void {
    this.generateNewProblem();
    this.initializeWorkspace();
  }

  // Generate a new practice problem
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

  // Generate random axis labels for the bar chart
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

  // Generate random data for the bar chart
  generateRandomData(): { category: string; value: number }[] {
    const categories = ['A', 'B', 'C', 'D', 'E'].slice(0, Math.floor(Math.random() * 3) + 3); // Randomize 3-5 categories
    return categories.map((category) => ({
      category: `${this.xAxisLabel} ${category}`,
      value: Math.floor(Math.random() * 100) + 1 // Random values between 1 and 100
    }));
  }

  // Generate a question based on the chart data
  generateQuestion(): void {
    const sortedData = [...this.randomData].sort((a, b) => a.value - b.value);
    const lowest = sortedData[0];
    const secondLowest = sortedData[1];
    const highest = sortedData[sortedData.length - 1];
    const randomCategory = this.randomData[Math.floor(Math.random() * this.randomData.length)];
    const anotherRandomCategory = this.randomData.filter((data) => data !== randomCategory)[Math.floor(Math.random() * (this.randomData.length - 1))];
    // Define different question types
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
    // Define different question types
    const selectedQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    this.question = selectedQuestion.question;
    this.correctAnswer = selectedQuestion.correctAnswer;
    this.multipleChoices = selectedQuestion.choices;
  }

  // Submit the user's answer and provide feedback
  submitAnswer(): void {
    this.answerIsCorrect = this.selectedAnswer === this.correctAnswer;
    this.showAnswer = true;
  }

  // Hide the answer feedback
  hideAnswer(): void {
    this.showAnswer = false;
    this.showCorrectAnswer = false;
  }

  // Update the chart with the generated data
  updateChartWithData(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.inputChart) {
      this.inputChart.destroy();
    }
    // Create new bar chart
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
  // Toggle display of correct answer
  toggleCorrectAnswer(): void {
    this.showCorrectAnswer = !this.showCorrectAnswer;
  }
}