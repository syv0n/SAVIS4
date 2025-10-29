import { Component, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Chart, ChartPoint } from 'chart.js';

@Component({
  selector: 'app-user-manual',
  templateUrl: './tpht.component.html',
  styleUrls: ['./tpht.component.scss']
})
export class TPHTProblemsComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('zChart') zChartRef!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;

  // --- Problem state ---
  n1 = 0; n2 = 0;
  x1 = 0; x2 = 0;
  p1hat = 0; p2hat = 0;
  pooled = 0;     // p̄ under H0
  se = 0;         // √[ p̄(1−p̄)(1/n1 + 1/n2) ]
  z = 0;          // (p̂1 − p̂2) / SE
  pValue = 0;     // two-sided
  confidence = 95;
  zCritical = 1.96;
  correctDecision: 'Reject H₀' | 'Fail to Reject H₀' = 'Fail to Reject H₀';
  problemText = '';

  // --- User inputs (strings so template binds cleanly) ---
  userPooled = '';
  userSE = '';
  userZ = '';
  userPValue = '';
  userDecision = '';

  // --- Feedback + step flags (mirrors OPHT) ---
  feedback = '';
  showAnswer = false;
  isCorrect = false;
  isStep1Correct = true; // pooled
  isStep2Correct = true; // SE
  isStep3Correct = true; // z
  isStep4Correct = true; // p-value (optional)
  isStep5Correct = true; // decision

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.generateProblem();
  }

  ngAfterViewInit(): void {
    this.createChart();
    this.drawGraph(false);
  }

  ngOnDestroy(): void {
    if (this.chart) this.chart.destroy();
  }

  // =============== Problem generation ===============
  generateProblem(): void {
    // reset UI
    this.hideAnswer();
    this.userPooled = this.userSE = this.userZ = this.userPValue = this.userDecision = '';

    // randomize inputs
    const confs = [90, 95, 99];
    this.confidence = confs[this.randInt(0, confs.length - 1)];
    this.zCritical = this.confidence === 90 ? 1.645 : this.confidence === 99 ? 2.575 : 1.96;

    this.n1 = this.randInt(60, 180);
    this.n2 = this.randInt(60, 180);

    // generate “true” proportions near each other
    const baseP = [0.35, 0.45, 0.55, 0.65][this.randInt(0, 3)];
    const deltas = [0, 0.05, -0.05, 0.08, -0.08];
    const p1 = this.clamp(baseP, 0.1, 0.9);
    const p2 = this.clamp(baseP + deltas[this.randInt(0, deltas.length - 1)], 0.1, 0.9);

    // sample successes
    this.x1 = this.randBinomial(this.n1, p1);
    this.x2 = this.randBinomial(this.n2, p2);

    // estimates
    this.p1hat = this.x1 / this.n1;
    this.p2hat = this.x2 / this.n2;

    // H0: p1 = p2 → pooled p and SE
    this.pooled = (this.x1 + this.x2) / (this.n1 + this.n2);
    this.se = Math.sqrt(this.pooled * (1 - this.pooled) * (1 / this.n1 + 1 / this.n2));
    this.z = (this.p1hat - this.p2hat) / this.se;

    // two-sided p-value
    const pRight = 1 - this.stdNormCdf(Math.abs(this.z));
    this.pValue = 2 * pRight;

    this.correctDecision = Math.abs(this.z) > this.zCritical ? 'Reject H₀' : 'Fail to Reject H₀';

    this.updateProblemText();

    // refresh chart
    if (this.chart) this.drawGraph(false);
  }

  private updateProblemText(): void {
    this.problemText =
      `Two independent groups A and B are compared. ` +
      `Group A: n₁ = ${this.n1}, x₁ = ${this.x1} (p̂₁ = ${this.p1hat.toFixed(3)}). ` +
      `Group B: n₂ = ${this.n2}, x₂ = ${this.x2} (p̂₂ = ${this.p2hat.toFixed(3)}). ` +
      `Test H₀: p₁ = p₂ at the ${this.confidence}% level (two-sided).`;
  }

  // =============== Submission ===============
  submitAnswer(): void {
    this.showAnswer = true;
    const msgs: string[] = [];

    const ansPooled = parseFloat(this.userPooled);
    const ansSE = parseFloat(this.userSE);
    const ansZ = parseFloat(this.userZ);
    const ansP = parseFloat(this.userPValue);
    const ansDecision = this.userDecision as 'Reject H₀' | 'Fail to Reject H₀';

    // tolerances
    const tolPooled = 0.002;
    const tolSE = 0.002;
    const tolZ = 0.05;
    const tolP = 0.01;

    this.isStep1Correct = this.isClose(ansPooled, this.pooled, tolPooled);
    this.isStep2Correct = this.isClose(ansSE, this.se, tolSE);
    this.isStep3Correct = this.isClose(ansZ, this.z, tolZ);
    this.isStep4Correct = isNaN(ansP) ? true : this.isClose(ansP, this.pValue, tolP);
    this.isStep5Correct = ansDecision === this.correctDecision;

    // prioritize decision
    this.isCorrect = this.isStep5Correct;

    if (this.isCorrect) {
      msgs.push(`✅ Correct! Decision: <strong>${this.correctDecision}</strong> at ${this.confidence}% (z<sub>crit</sub> = ${this.zCritical}).`);
      if (!this.isStep1Correct || !this.isStep2Correct || !this.isStep3Correct || !this.isStep4Correct) {
        msgs.push(`Your decision is right; check the computations below for rounding.`);
      }
    } else {
      msgs.push(`❌ Not quite. The correct decision is <strong>${this.correctDecision}</strong> at ${this.confidence}% (z<sub>crit</sub> = ${this.zCritical}).`);
      msgs.push(`Compare your steps with the correct values shown below.`);
    }

    this.feedback = msgs.join('<br>');
    this.drawGraph(true);
  }

  hideAnswer(): void {
    this.showAnswer = false;
    this.feedback = '';
    this.isCorrect = false;
    this.isStep1Correct = this.isStep2Correct = this.isStep3Correct = this.isStep4Correct = this.isStep5Correct = true;
    if (this.chart) this.drawGraph(false);
  }

  // =============== Chart (standard normal, same style as OPHT) ===============
  createChart(): void {
    if (this.chart) this.chart.destroy();

    const ctx = this.zChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: { datasets: [] },
      options: {
        scales: {
          xAxes: [{
            ticks: { min: -4, max: 4, stepSize: 1, fontColor: 'black', fontSize: 14 },
            scaleLabel: { display: true, labelString: 'z', fontStyle: 'bold', fontColor: 'black' }
          }],
          yAxes: [{
            ticks: { min: 0, max: 0.45, fontColor: 'black', fontSize: 14 },
            scaleLabel: { display: true, labelString: 'Density', fontStyle: 'bold', fontColor: 'black' }
          }]
        },
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        tooltips: { enabled: false }
      }
    });
  }

  drawGraph(showSolution: boolean): void {
    if (!this.chart) return;

    // base curve
    const curve = this.normalCurveData(-4, 4, 200);
    const data: ChartPoint[] = curve.map(([x, y]) => ({ x, y }));

    this.chart.data.datasets = [
      {
        label: 'Standard Normal',
        type: 'line',
        data,
        borderColor: 'black',
        borderWidth: 2,
        fill: false,
        pointRadius: 0
      }
    ];

    // critical lines (two-sided)
    this.addVertLine(+this.zCritical, `Critical value  +z₍crit₎ = ${this.zCritical}`, 'rgba(0,0,255,0.9)');
    this.addVertLine(-this.zCritical, `Critical value  −z₍crit₎ = ${this.zCritical}`, 'rgba(0,0,255,0.9)');

    // observed z
    this.addVertLine(this.z, `Observed z = ${this.z.toFixed(2)}`, 'rgba(255,0,0,0.9)');

    // rejection shading
    this.addShadeRegion(3.999, this.zCritical, 'rgba(0,0,255,0.15)', 'Rejection region (α/2)');
    this.addShadeRegion(-3.999, -this.zCritical, 'rgba(0,0,255,0.15)', 'Rejection region (α/2)');

    // show p-value shading when solution is revealed
    if (showSolution) {
      if (this.z >= 0) {
        this.addShadeRegion(this.z, 3.999, 'rgba(255,0,0,0.12)', 'Observed p-value (right tail)');
        this.addShadeRegion(-3.999, -this.z, 'rgba(255,0,0,0.12)', 'Observed p-value (left tail)');
      } else {
        this.addShadeRegion(-3.999, this.z, 'rgba(255,0,0,0.12)', 'Observed p-value (left tail)');
        this.addShadeRegion(-this.z, 3.999, 'rgba(255,0,0,0.12)', 'Observed p-value (right tail)');
      }
    }

    this.chart.update();
  }

  private addVertLine(x: number, label: string, color: string): void {
    const yMax = 0.45;
    this.chart.data.datasets.push({
      label,
      type: 'line',
      data: [{ x, y: 0 }, { x, y: yMax }],
      borderColor: color,
      borderWidth: 2,
      borderDash: [5, 5],
      pointRadius: 0
    } as any);
  }

  private addShadeRegion(xFrom: number, xTo: number, color: string, label = 'Shaded'): void {
    const [min, max] = xFrom < xTo ? [xFrom, xTo] : [xTo, xFrom];
    const curve = this.normalCurveData(min, max, 80);
    const base = [[max, 0], [min, 0]];
    const poly = [...curve, ...base].map(([x, y]) => ({ x, y }));
    this.chart.data.datasets.push({
      label,
      type: 'line',
      data: poly,
      borderColor: color,
      backgroundColor: color,
      fill: true,
      pointRadius: 0
    } as any);
  }

  private normalCurveData(minX: number, maxX: number, steps: number): [number, number][] {
    const out: [number, number][] = [];
    const step = (maxX - minX) / steps;
    for (let x = minX; x <= maxX; x += step) {
      out.push([x, this.stdNormPdf(x)]);
    }
    return out;
  }

  // =============== Helpers ===============
  private randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  private clamp(x: number, lo: number, hi: number): number {
    return Math.min(hi, Math.max(lo, x));
  }
  private randBinomial(n: number, p: number): number {
    let c = 0; for (let i = 0; i < n; i++) if (Math.random() < p) c++; return c;
  }
  private isClose(a: number, b: number, tol: number): boolean {
    return isFinite(a) && Math.abs(a - b) <= tol;
  }
  private stdNormPdf(x: number): number {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  }
  private stdNormCdf(z: number): number {
    // Abramowitz–Stegun approximation for Φ(z)
    const t = 1 / (1 + 0.2316419 * z);
    const b1 = 0.319381530, b2 = -0.356563782, b3 = 1.781477937, b4 = -1.821255978, b5 = 1.330274429;
    const poly = ((((b5 * t + b4) * t + b3) * t + b2) * t + b1) * t;
    const phi = this.stdNormPdf(z);
    const cdf = 1 - phi * poly;
    return z >= 0 ? cdf : 1 - cdf;
  }

  getProblemTitle(): string {
    return 'Two-Proportion z-Test (Two-Sided)';
  }
}
