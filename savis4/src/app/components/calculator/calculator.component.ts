import {Component,OnInit, OnDestroy, ElementRef, Renderer2, NgZone, ViewChild
} from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit, OnDestroy {
  // Variables for calculator logic
  display: string = '0';
  expression: string = '';
  firstOperand: number | null = null;
  operator: string | null = null;
  waitingForSecondOperand: boolean = false;
  hasDecimal: boolean = false;
  advancedMode: boolean = false;

  // Resizing variables
  isResizing = false;
  resizeStartX = 0;
  resizeStartY = 0;
  width = 340;
  height = 480;

  // Reference to calculator container for dragging
  @ViewChild('calculatorContainer', { static: true })
  calculatorContainer!: ElementRef<HTMLElement>;
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;
  private removeMouseMove?: () => void;
  private removeMouseUp?: () => void;
  private removeTouchMove?: () => void;
  private removeTouchEnd?: () => void;
  // Calculator buttons configuration (advanced mode)
  advancedButtons = [
    [
      { label: 'Del', action: 'del' }, { label: 'π', action: 'pi' }, { label: 'e', action: 'e' }, { label: 'C', action: 'clear' }
    ],
    [
      { label: 'x²', action: 'square' }, { label: '⅟ₓ', action: 'inv' }, { label: '|x|', action: 'abs' }, { label: 'exp', action: 'exp' }, { label: 'mod', action: 'mod' }
    ],
    [
      { label: '²√x', action: 'sqrt' }, { label: '(', action: 'parenL' }, { label: ')', action: 'parenR' }, { label: 'n!', action: 'fact' }, { label: '÷', action: '/' }
    ],
    [
      { label: 'xʸ', action: 'pow' }, { label: '7', action: '7' }, { label: '8', action: '8' }, { label: '9', action: '9' }, { label: '×', action: '*' }
    ],
    [
      { label: '10ˣ', action: 'tenpow' }, { label: '4', action: '4' }, { label: '5', action: '5' }, { label: '6', action: '6' }, { label: '−', action: '-' }
    ],
    [
      { label: 'log', action: 'log' }, { label: '1', action: '1' }, { label: '2', action: '2' }, { label: '3', action: '3' }, { label: '+', action: '+' }
    ],
    [
      { label: 'ln', action: 'ln' }, { label: '+/−', action: 'neg' }, { label: '0', action: '0' }, { label: '.', action: '.' }, { label: '=', action: '=' }
    ]
  ];
  // Calculator buttons configuration (basic mode)
  basicButtons = [
    [
      { label: 'C', action: 'clear' }, { label: '-/+', action: 'neg' }, { label: '%', action: 'percent' }, { label: '/', action: '/' }
    ],
    [
      { label: '7', action: '7' }, { label: '8', action: '8' }, { label: '9', action: '9' }, { label: '*', action: '*' }
    ],
    [
      { label: '4', action: '4' }, { label: '5', action: '5' }, { label: '6', action: '6' }, { label: '-', action: '-' }
    ],
    [
      { label: '1', action: '1' }, { label: '2', action: '2' }, { label: '3', action: '3' }, { label: '+', action: '+' }
    ],
    [
      { label: '0', action: '0' }, { label: '.', action: '.' }, { label: '=', action: '=' }
    ]
  ];

  constructor(private renderer: Renderer2, private zone: NgZone) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.endDrag();
  }
  // setting up for advanced mode
  toggleAdvancedMode(): string {
    this.advancedMode = !this.advancedMode;
    return this.advancedMode ? 'Advanced\nMode: On' : 'Advanced\nMode: Off';
  }
  // Handle mouse down on the calculator display to start dragging
  onMouseDown(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('resize-handle')) {
      return;
    }
    event.preventDefault();
    this.beginDrag(event.clientX+10, event.clientY+80);
  }
  // Handle touch start on mobile devices to start dragging
  onTouchStart(event: TouchEvent) {
    if ((event.target as HTMLElement).classList.contains('resize-handle')) {
      return;
    }
    event.preventDefault();
    const touch = event.touches[0];
    this.beginDrag(touch.clientX, touch.clientY);
  }
  // Initialize drag state and compute pointer offset relative to element
  private beginDrag(clientX: number, clientY: number) {
    this.isDragging = true;
    // compute offsets so the pointer stays at the same relative spot
    const rect = this.calculatorContainer.nativeElement.getBoundingClientRect();
    this.offsetX = clientX - rect.left;
    this.offsetY = clientY - rect.top;
    // Use NgZone to run event listeners outside Angular to avoid triggering change detection
    this.zone.runOutsideAngular(() => {
      const moveHandler = (event: MouseEvent) =>
        this.onPointerMove(event.clientX, event.clientY);
      const touchMoveHandler = (event: TouchEvent) => {
        if (event.touches.length > 0) {
          this.onPointerMove(event.touches[0].clientX, event.touches[0].clientY);
        }
      };
      const upHandler = () => this.endDrag();
      const touchEndHandler = () => this.endDrag();
      // Listen to document events to track dragging outside the element
      this.removeMouseMove = this.renderer.listen('document', 'mousemove', moveHandler);
      this.removeTouchMove = this.renderer.listen('document', 'touchmove', touchMoveHandler);
      this.removeMouseUp = this.renderer.listen('document', 'mouseup', upHandler);
      this.removeTouchEnd = this.renderer.listen('document', 'touchend', touchEndHandler);
    });
  }
  // Update calculator position as mouse/touch moves
  private onPointerMove(clientX: number, clientY: number) {
    if (!this.isDragging) return;
    this.renderer.setStyle(
      this.calculatorContainer.nativeElement,
      'left',
      `${clientX - this.offsetX}px`
    );
    this.renderer.setStyle(
      this.calculatorContainer.nativeElement,
      'top',
      `${clientY - this.offsetY}px`
    );
  }
  // End dragging and clean up listeners
  private endDrag() {
    this.isDragging = false;
    this.removeMouseMove?.();
    this.removeTouchMove?.();
    this.removeMouseUp?.();
    this.removeTouchEnd?.();
  }

  // Begin resize logic, declare listeners
  onResizeStart(event: MouseEvent): void {
    event.stopPropagation();
    this.isResizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartY = event.clientY;
    document.addEventListener('mousemove', this.onResizeMoveBound);
    document.addEventListener('mouseup', this.onResizeEndBound);
  }
  // Update width/height as mouse moves
  onResizeMove(event: MouseEvent): void {
    if (this.isResizing) {
      this.width += event.clientX - this.resizeStartX;
      this.height += event.clientY - this.resizeStartY;
      this.resizeStartX = event.clientX;
      this.resizeStartY = event.clientY;
      this.width = Math.max(340, Math.min(480, this.width));
      this.height = Math.max(480, Math.min(700, this.height));
    }
  }
  // End resize and clean up listeners
  onResizeEnd(): void {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onResizeMoveBound);
    document.removeEventListener('mouseup', this.onResizeEndBound);
  }
  // Bound versions of resize handlers for adding/removing event listeners
  onResizeMoveBound = this.onResizeMove.bind(this);
  onResizeEndBound = this.onResizeEnd.bind(this);

  // Compute the value to display (either current expression or last result)
  get displayValue(): string {
    return this.expression || this.display;
  }
  // Handle button clicks and update expression/display accordingly
  onButtonClick(action: string): void {

    if (this.operator && (/^\d$/.test(action) || action === '.')) {
      this.operator = null;
    }

    if (this.isOperator(action)) {
      this.operator = action;
    }

    switch (action) {
      case 'clear':
        this.onClearClick();
        this.expression = '';
        this.operator = null;
        break;
      case 'del':
        if (this.expression.length > 0) {
          this.expression = this.expression.slice(0, -1);
        } else if (this.display.length > 1) {
          this.display = this.display.slice(0, -1);
        } else {
          this.display = '0';
        }
        break;
      case 'neg':
        if (this.expression) {
          if (this.expression.startsWith('-')) {
            this.expression = this.expression.slice(1);
          } else {
            this.expression = '-' + this.expression;
          }
        } else {
          this.onNegateClick();
        }
        break;
      case 'percent':
        this.expression += '/100';
        break;
      case '=':
        this.evaluateExpression();
        this.operator = null;
        break;
      case '.':
        this.expression += '.';
        break;
      case '+': case '-': case '*': case '/':
        this.expression += action;
        this.operator = action;
        break;
      // Advanced actions
      case 'pi': this.expression += 'π'; break;
      case 'e': this.expression += 'e'; break;
      case 'square': this.expression += '^2'; break;
      case 'inv': this.expression += '^-1'; break;
      case 'abs': this.expression += 'abs('; break;
      case 'exp': this.expression += 'exp('; break;
      case 'mod': this.expression += '%'; break;
      case 'sqrt': this.expression += '√('; break;
      case 'fact': this.expression += '!'; break;
      case 'pow': this.expression += '^'; break;
      case 'tenpow': this.expression += '10^'; break;
      case 'log': this.expression += 'log('; break;
      case 'ln': this.expression += 'ln('; break;
      case 'parenL': this.expression += '('; break;
      case 'parenR': this.expression += ')'; break;
      default:
        if (!isNaN(Number(action))) {
          this.expression += action;
        }
        break;
    }
  }
  // Evaluate the current expression and update the display
  evaluateExpression(): void {
    let expr = this.expression
      .replace(/π/g, Math.PI.toString())
      .replace(/e/g, Math.E.toString())
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/exp\(/g, 'Math.exp(')
      .replace(/\^/g, '**')
      .replace(/÷/g, '/')
      .replace(/×/g, '*');
      // Handle factorial separately since it's not a standard operator
    if (expr.endsWith('!')) {
      const num = parseFloat(expr.slice(0, -1));
      expr = this.factorial(num).toString();
    }
    // Eval is used here for simplicity
    try {
      // eslint-disable-next-line no-eval
      const result = eval(expr);
      this.display = String(result);
    } catch {
      this.display = 'Error';
    }
    this.expression = '';
    this.operator = null;
  }

  factorial(n: number): number {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    return n <= 1 ? 1 : n * this.factorial(n - 1);
  }
  // Clear all state and reset display
  onClearClick(): void {
    this.display = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
    this.hasDecimal = false;
  }
  // Toggle sign (+/-) of current input
  onNegateClick(): void {
    if (this.display !== '0') {
      this.display = this.display.startsWith('-')
        ? this.display.slice(1)
        : '-' + this.display;
    }
  }
  // Return the appropriate set of buttons based on mode
  get buttons() {
    return this.advancedMode ? this.advancedButtons : this.basicButtons;
  }

  //checks if operator is in use
   isOperator(action: string): boolean{
    if (/^\d$/.test(action)) return false;
    const nonSticky = new Set(['.', 'del', '=']);
    return !nonSticky.has(action);
  }

}
