import { HtmlParser } from '@angular/compiler';
import {Component, ElementRef, ViewChild, Renderer2, NgZone,OnDestroy,} from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnDestroy {

  // Reference to calculator container for dragging
  @ViewChild('calculatorContainer', { static: true })
  calculatorContainer!: ElementRef<HTMLElement>;

  advancedMode: boolean = false; // track if advanced mode is on or not
  private isDragging = false;
  private offsetX = 0; // pointer-to-top-left offset while dragging
  private offsetY = 0;

  //setting up for advanced mode
  toggleAdvancedMode(): string {
    this.advancedMode = !this.advancedMode;
    if (this.advancedMode == true) {
      return "Advanced\nMode: On";
    } else {
      return "Advanced\nMode: Off"
    }
  }

  private removeMouseMove?: () => void;
  private removeMouseUp?: () => void;
  private removeTouchMove?: () => void;
  private removeTouchEnd?: () => void;

  constructor(private renderer: Renderer2, private zone: NgZone) {}

  // Handle mouse down on the calculator display to start dragging
  onMouseDown(ev: MouseEvent): void {
    ev.preventDefault();
    this.beginDrag(ev.clientX, ev.clientY);
    // Attach listeners to document so drag continues even if cursor leaves the element
    this.zone.runOutsideAngular(() => {
      this.removeMouseMove = this.renderer.listen(document,'mousemove',
        (e: MouseEvent) => this.onPointerMove(e.clientX, e.clientY));
      this.removeMouseUp = this.renderer.listen(document, 'mouseup', () => this.endDrag());
    });
  }

  // Handle touch start on mobile devices to start dragging
  onTouchStart(ev: TouchEvent): void {
    if (ev.touches.length !== 1) return;
    const t = ev.touches[0];
    this.beginDrag(t.clientX, t.clientY);
    // Attach listeners for touch move and touch end
    this.zone.runOutsideAngular(() => {
      this.removeTouchMove = this.renderer.listen(
        document,
        'touchmove',
        (e: TouchEvent) => {
          if (e.touches.length !== 1) return;
          const tt = e.touches[0];
          this.onPointerMove(tt.clientX, tt.clientY);
        }
      );
      this.removeTouchEnd = this.renderer.listen(document, 'touchend', () =>
        this.endDrag()
      );
    });
  }

   // Initialize drag state and compute pointer offset relative to element
  private beginDrag(clientX: number, clientY: number): void {
    const el = this.calculatorContainer.nativeElement;
    el.style.position = 'absolute'; // allow for free positioning
    // compute offsets so the pointer stays at the same relative spot
    const rect = el.getBoundingClientRect();
    this.offsetX = clientX - rect.left;
    this.offsetY = clientY - rect.top;
    this.isDragging = true;
    // nice UX: disable text selection while dragging
    document.body.style.userSelect = 'none'; // prevent text selection while dragging
    // set cursor on the handle (you can also do this in SCSS)
    el.style.cursor = 'move';
  }

  // Update calculator position as mouse/touch moves
  private onPointerMove(clientX: number, clientY: number): void {
    if (!this.isDragging) return;
    const el = this.calculatorContainer.nativeElement;
    // new absolute position
    const left = clientX - this.offsetX;
    const top = clientY - this.offsetY;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }

   // End dragging and clean up listeners
  private endDrag(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    document.body.style.userSelect = '';
    if (this.removeMouseMove) this.removeMouseMove();
    if (this.removeMouseUp) this.removeMouseUp();
    if (this.removeTouchMove) this.removeTouchMove();
    if (this.removeTouchEnd) this.removeTouchEnd();
    this.removeMouseMove = this.removeMouseUp = undefined;
    this.removeTouchMove = this.removeTouchEnd = undefined;
  }

   // Ensure listeners are removed if component is destroyed
  ngOnDestroy(): void {
    this.endDrag();
  }

  //diplay values to represent calculator Logic (simple, non-scientific) 
  display = '0';
  private currentInput = '0';
  private storedValue: number | null = null;
  private pendingOp: string | null = null;
  private justEvaluated = false;

   // Update the display string from current input
  private setDisplayFromInput() {
    this.display = this.currentInput;
  }

   // Clear all state and reset display
  onClearClick(): void {
    this.currentInput = '0';
    this.storedValue = null;
    this.pendingOp = null;
    this.justEvaluated = false;
    this.setDisplayFromInput();
  }

  // Toggle sign (+/-) of current input
  onNegateClick(): void {
    if (this.currentInput === '0') return;
    this.currentInput =
      this.currentInput[0] === '-' ? this.currentInput.slice(1) : '-' + this.currentInput;
    this.setDisplayFromInput();
  }

   // Convert current input into a percentage
  onPercentageClick(): void {
    const v = parseFloat(this.currentInput || '0') / 100;
    this.currentInput = this.trimNumber(v);
    this.setDisplayFromInput();
  }

   // Append a decimal point if not already present
  onDecimalClick(): void {
    if (this.justEvaluated) {
      this.currentInput = '0';
      this.justEvaluated = false;
    }
    if (!this.currentInput.includes('.')) {
      this.currentInput += '.';
      this.setDisplayFromInput();
    }
  }

   // Append a number digit to the current input
  onNumberClick(d: string): void {
    if (this.justEvaluated) {
      this.currentInput = '0';
      this.justEvaluated = false;
    }
    if (this.currentInput === '0') this.currentInput = d;
    else this.currentInput += d;
    this.setDisplayFromInput();
  }

  // Store operator and prepare for next input
  onOperatorClick(op: string): void {
    const current = parseFloat(this.currentInput || '0');
    if (this.storedValue === null) {
      this.storedValue = current;
    } else if (this.pendingOp) {
      this.storedValue = this.applyOp(this.storedValue, current, this.pendingOp);
      this.display = this.trimNumber(this.storedValue);
    }
    this.pendingOp = op;
    this.currentInput = '0';
    this.justEvaluated = false;
  }

  // Execute pending operation and show result
  onEqualsClick(): void {
    if (this.pendingOp === null || this.storedValue === null) {
      // nothing to do
      this.display = this.trimNumber(parseFloat(this.currentInput || '0'));
      return;
    }
    const result = this.applyOp(
      this.storedValue,
      parseFloat(this.currentInput || '0'),
      this.pendingOp
    );
    this.display = this.trimNumber(result);
    this.currentInput = this.display;
    this.storedValue = null;
    this.pendingOp = null;
    this.justEvaluated = true;
  }

  // Perform the chosen operation
  private applyOp(a: number, b: number, op: string): number {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  }

  // Format numbers: avoid long floats and strip trailing zeros
  private trimNumber(n: number): string {
    // avoid long floats; remove trailing zeros
    const s = n.toFixed(12);
    return s.replace(/\.?0+$/, '');
  }
}
