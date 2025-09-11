import { HtmlParser } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  display: string = '0'; 
  firstOperand: number | null = null; 
  operator: string | null = null; 
  waitingForSecondOperand: boolean = false; //track second number
  hasDecimal: boolean = false; //track decimal
  advancedMode: boolean = false; // track if advanced mode is on or not

  constructor() {}

  ngOnInit(): void {}

  toggleAdvancedMode(): string {
    this.advancedMode = !this.advancedMode;
    if (this.advancedMode == true) {
      return "Advanced\nMode: On";
    } else {
      return "Advanced\nMode: Off"
    }
  }

  // Handle number button clicks (0-9)
  onNumberClick(value: string): void {
    if (this.waitingForSecondOperand) {
      this.display = value;
      this.waitingForSecondOperand = false;
    } else {
      this.display = this.display === '0' ? value : this.display + value;
    }
  }

  // Handle decimal point button
  onDecimalClick(): void {
    if (!this.hasDecimal) {
      this.display += '.';
      this.hasDecimal = true;
    }
  }

  // Handle operator buttons (+, -, *, /)
  onOperatorClick(operator: string): void {
    const currentValue = parseFloat(this.display);

    if (this.firstOperand === null) {
      this.firstOperand = currentValue;
    } else if (this.operator) {
      const result = this.calculate(this.firstOperand, currentValue, this.operator);
      this.display = String(result);
      this.firstOperand = result;
    }

    this.operator = operator;
    this.waitingForSecondOperand = true;
    this.hasDecimal = false;
  }

  // Handle equals button
  onEqualsClick(): void {
    if (this.firstOperand !== null && this.operator) {
      const currentValue = parseFloat(this.display);
      const result = this.calculate(this.firstOperand, currentValue, this.operator);
      this.display = String(result);
      this.firstOperand = null;
      this.operator = null;
      this.waitingForSecondOperand = false;
      this.hasDecimal = result % 1 !== 0; 
    }
  }

  // Perform the calculation based on the operator
  calculate(first: number, second: number, operator: string): number {
    switch (operator) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        if (second === 0) {
          alert('Cannot divide by zero!');
          this.onClearClick();
          return 0;
        }
        return first / second;
      default:
        return second;
    }
  }

  // Handle clear button
  onClearClick(): void {
    this.display = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
    this.hasDecimal = false;
  }

  // Handle negative/positive toggle
  onNegateClick(): void {
    if (this.display !== '0') {
      this.display = this.display.startsWith('-')
        ? this.display.slice(1)
        : '-' + this.display;
    }
  }

  // Handle percentage button
  onPercentageClick(): void {
    const currentValue = parseFloat(this.display) / 100;
    this.display = String(currentValue);
    if (this.firstOperand !== null && !this.waitingForSecondOperand) {
      this.firstOperand = currentValue;
    }
  }
}