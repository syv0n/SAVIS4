import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';

@Component({
  selector: 'app-linear-regression',
  templateUrl: './linear-regression.component.html',
  styleUrls: ['./linear-regression.component.scss']
})
export class LinearRegressionComponent implements OnInit{
  datapoints: string = '';
  parsedDatapoints: { x: number, y: number }[] = [];
  csvContent: string = '';
  
  @ViewChild(ScatterPlotComponent) scatterPlotComponent!: ScatterPlotComponent;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.sharedService.currentData.subscribe(data => this.datapoints = data)
  }

  updateChart() {
    // Parse the user input into data points
    this.parsedDatapoints = this.datapoints.split('\n')
      .map(point => point.split(',').map(coord => +coord))
      .map(coords => ({ x: coords[0], y: coords[1] }));
  }

  onFileSelect(input: Event): void {
    const target = input.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.csvContent = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this.sharedService.changeData('')
  }

  /**
   * Export linear regression data and chart as PDF
   */
  async exportAsPDF(): Promise<void> {
    if (this.parsedDatapoints.length === 0) return;
    
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');

      const doc = new jsPDF();
      doc.setFontSize(16).text('Linear Regression Export', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
      
      // Add chart image
      if (this.scatterPlotComponent && this.scatterPlotComponent.chart) {
        const imgData = this.scatterPlotComponent.chart.toBase64Image();
        const canvas = this.scatterPlotComponent.chart.chart.canvas;
        const imgHeight = (canvas.height * 170) / canvas.width;
        doc.addImage(imgData, 'PNG', 15, 25, 170, imgHeight);
      }
      
      // Add data table
      const tableData = this.parsedDatapoints.map((point, index) => [index + 1, point.x, point.y]);
      autoTable(doc, {
        startY: 200,
        head: [['Index', 'X Value', 'Y Value']],
        body: tableData,
      });
      
      // Add regression statistics
      if (this.scatterPlotComponent) {
        const statsY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text(`Regression Formula: ${this.scatterPlotComponent.regressionFormula}`, 15, statsY);
        doc.text(`Least Squares: ${this.scatterPlotComponent.leastSquares.toFixed(4)}`, 15, statsY + 10);
      }
      
      doc.save('linear-regression-export.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  }

  /**
   * Export linear regression data and chart as DOCX
   */
  async exportAsDOCX(): Promise<void> {
    if (this.parsedDatapoints.length === 0) return;
    
    try {
      const { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, AlignmentType } = await import('docx');
      const FileSaver = await import('file-saver');

      const children: any[] = [
        new Paragraph({ 
          children: [new TextRun({ text: 'Linear Regression Export', bold: true, size: 32 })], 
          alignment: AlignmentType.CENTER 
        })
      ];
      
      // Add chart image
      if (this.scatterPlotComponent && this.scatterPlotComponent.chart) {
        const imgData = this.scatterPlotComponent.chart.toBase64Image();
        children.push(new Paragraph({ 
          children: [new ImageRun({ 
            type: "png", 
            data: imgData.split(',')[1], 
            transformation: { width: 500, height: 250 } 
          })] 
        }));
      }
      
      // Add data table
      const tableRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Index', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'X Value', bold: true })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Y Value', bold: true })] })] }),
          ],
        }),
        ...this.parsedDatapoints.map((point, index) => new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(String(index + 1))] }),
            new TableCell({ children: [new Paragraph(String(point.x))] }),
            new TableCell({ children: [new Paragraph(String(point.y))] }),
          ],
        }))
      ];
      
      const dataTable = new Table({ 
        rows: tableRows, 
        width: { size: 100, type: WidthType.PERCENTAGE } 
      });
      children.push(dataTable);
      
      // Add regression statistics
      if (this.scatterPlotComponent) {
        children.push(new Paragraph({ children: [new TextRun({ text: `Regression Formula: ${this.scatterPlotComponent.regressionFormula}` })] }));
        children.push(new Paragraph({ children: [new TextRun({ text: `Least Squares: ${this.scatterPlotComponent.leastSquares.toFixed(4)}` })] }));
      }

      const doc = new Document({ sections: [{ children }] });
      Packer.toBlob(doc).then(blob => FileSaver.saveAs(blob, 'linear-regression-export.docx'));
    } catch (error) {
      console.error('Failed to generate DOCX:', error);
    }
  }
}
