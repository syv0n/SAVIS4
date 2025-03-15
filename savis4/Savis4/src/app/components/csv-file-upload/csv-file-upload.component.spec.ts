import { CsvFileUploadComponent } from './csv-file-upload.component';

describe('CsvFileUploadComponent', () => {
  let component: CsvFileUploadComponent;

  beforeEach(() => {
    component = new CsvFileUploadComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
});