import { LinearRegressionComponent } from './linear-regression.component';
import { of } from 'rxjs';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';

class MockSharedService {
  data = of('1,2\n3,4');
  currentData = of('1,2\n3,4');
  changeData = jest.fn();
}

describe('LinearRegressionComponent', () => {
  let component: LinearRegressionComponent;
  let sharedService: MockSharedService;

  beforeEach(() => {
    sharedService = new MockSharedService();
    component = new LinearRegressionComponent(sharedService as any);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to currentData on init', () => {
    component.ngOnInit();
    expect(component.datapoints).toBe('1,2\n3,4');
  });

  it('should parse datapoints on updateChart', () => {
    component.datapoints = '1,2\n3,4';
    component.updateChart();
    expect(component.parsedDatapoints).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 }
    ]);
  });

  it('should read file content on file select', (done) => {
    const mockFile = new Blob(['test'], { type: 'text/csv' }) as any;
    mockFile.name = 'test.csv';

    const mockEvt = { target: { files: [mockFile] } } as any;

    component.onFileSelect(mockEvt);

    setTimeout(() => {
      expect(component.csvContent).toBe('test');
      done();
    }, 100);
  });

  it('should call changeData on destroy', () => {
    component.ngOnDestroy();
    expect(sharedService.changeData).toHaveBeenCalledWith('');
  });

  describe('Export Methods', () => {
    beforeEach(() => {
      // Setup mock scatter plot component
      component.scatterPlotComponent = {
        chart: {
          toBase64Image: jest.fn().mockReturnValue('data:image/png;base64,mockImageData'),
          chart: {
            canvas: {
              height: 400,
              width: 600
            }
          }
        },
        regressionFormula: 'y = 2.00x + 1.00',
        leastSquares: 0.5
      } as any;
      
      component.parsedDatapoints = [
        { x: 1, y: 3 },
        { x: 2, y: 5 },
        { x: 3, y: 7 }
      ];
    });

    it('should export PDF successfully', async () => {
      const mockJsPDF = {
        setFontSize: jest.fn().mockReturnThis(),
        text: jest.fn().mockReturnThis(),
        addImage: jest.fn().mockReturnThis(),
        save: jest.fn()
      };
      
      jest.doMock('jspdf', () => ({ default: jest.fn(() => mockJsPDF) }));
      jest.doMock('jspdf-autotable', () => ({ default: jest.fn() }));
      
      await component.exportAsPDF();
      
      expect(mockJsPDF.save).toHaveBeenCalledWith('linear-regression-export.pdf');
    });

    it('should export DOCX successfully', async () => {
      const mockFileSaver = { saveAs: jest.fn() };
      jest.doMock('file-saver', () => ({ saveAs: mockFileSaver.saveAs }));
      jest.doMock('docx', () => ({
        Document: jest.fn(),
        Packer: { toBlob: jest.fn().mockResolvedValue(new Blob()) },
        Paragraph: jest.fn(),
        TextRun: jest.fn(),
        ImageRun: jest.fn(),
        Table: jest.fn(),
        TableRow: jest.fn(),
        TableCell: jest.fn(),
        WidthType: { PERCENTAGE: 'percentage' },
        AlignmentType: { CENTER: 'center' }
      }));
      
      await component.exportAsDOCX();
      
      expect(mockFileSaver.saveAs).toHaveBeenCalled();
    });

    it('should not export when no data points', async () => {
      component.parsedDatapoints = [];
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await component.exportAsPDF();
      await component.exportAsDOCX();
      
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should handle export errors gracefully', async () => {
      // Mock import failure
      jest.doMock('jspdf', () => { throw new Error('Import failed'); });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await component.exportAsPDF();
      
      expect(consoleSpy).toHaveBeenCalledWith('Failed to generate PDF:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

});