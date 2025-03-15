import { LinearRegressionComponent } from './linear-regression.component';
import { of } from 'rxjs';

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

});