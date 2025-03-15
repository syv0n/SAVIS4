import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './input.component';
import { sampleCorrelation } from 'simple-statistics';
import { LanguageSwitcherComponent } from '../../../components/language-switcher/language-switcher.component';
import { TranslateModule } from '@ngx-translate/core';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent, LanguageSwitcherComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getFormValues Functionality', () => {
    beforeEach(() => {
      // Mock window.alert with a jest function before each test
      window.alert = jest.fn();
    });

    it('should return an array of two empty arrays if the form values are null', () => {
      // Setting the form values to null
      component.formGroupValues.controls['xValues'].setValue(null);
      component.formGroupValues.controls['yValues'].setValue(null);

      // Getting the form values
      const [xValuesArray, yValuesArray] = component.getFormValues();

      // Asserting that the form values are as expected
      expect(xValuesArray).toEqual([]);
      expect(yValuesArray).toEqual([]);
    });

    it('should return an array of two empty arrays if the form values are empty strings', () => {
      // Setting the form values to empty strings
      component.formGroupValues.controls['xValues'].setValue('');
      component.formGroupValues.controls['yValues'].setValue('');

      // Getting the form values
      const [xValuesArray, yValuesArray] = component.getFormValues();

      // Asserting that the form values are as expected
      expect(xValuesArray).toEqual([]);
      expect(yValuesArray).toEqual([]);
    });

    it('should return an array of two arrays of integers if the form values are valid', () => {
      // Setting the form values to valid values
      component.formGroupValues.controls['xValues'].setValue('1,2,3,4,5');
      component.formGroupValues.controls['yValues'].setValue('6,7,8,9,10');

      // Getting the form values
      const [xValuesArray, yValuesArray] = component.getFormValues();

      // Asserting that the form values are as expected
      expect(xValuesArray).toEqual([1, 2, 3, 4, 5]);
      expect(yValuesArray).toEqual([6, 7, 8, 9, 10]);
    });

    it('should ensure that "notEqual" form error is false', () => {
      const valueX = '1,2,3,4,5';
      const valueY = '6,7,8,9,10';
      component.formGroupValues.controls['xValues'].setValue(valueX);
      component.formGroupValues.controls['yValues'].setValue(valueY);
      component.calculate(); // Try to calculate with equal values
      expect(component.formGroupValues.controls['xValues'].errors).toBeNull();
      expect(component.formGroupValues.controls['yValues'].errors).toBeNull();
    });

    it('should ensure that "notEqual" form error is true', () => {
      const valueX = '1,2,3,4';
      const valueY = '6,7,8,9,10';
      component.formGroupValues.controls['xValues'].setValue(valueX);
      component.formGroupValues.controls['yValues'].setValue(valueY);
      component.calculate(); // Try to calculate with equal values
      expect(component.formGroupValues.controls['xValues'].errors).toBeTruthy();
      expect(
        component.formGroupValues.controls['yValues'].errors!['notEqual']
      ).toBeTruthy();
      expect(component.formGroupValues.controls['yValues'].errors).toBeTruthy();
      expect(
        component.formGroupValues.controls['xValues'].errors!['notEqual']
      ).toBeTruthy();
    });
  });

  describe('sampleCorrelation Functionality', () => {
    it('should correctly compute the correlation coefficient', () => {
      const data1 = [1, 2, 3, 4, 5];
      const data2 = [2, 2.5, 3, 4.5, 5];

      // Using sampleCorrelation to compute the correlation coefficient between data1 and data2
      const correlation = sampleCorrelation(data1, data2);

      // Asserting the correlation coefficient is as expected
      expect(correlation).toBeCloseTo(0.977, 3); // Checking with a precision of 3 decimal places
    });
  });

  describe('File Handling', () => {
    beforeEach(() => {
      jest.spyOn(component, 'parseCsv').mockImplementation(() => {});
    });
    it('should alert with "Incompatible File" for files with size < 0', () => {
      const files = new File([''], 'test.csv', { type: 'text/csv' });
      Object.defineProperty(files, 'size', { value: -1 });
      const mockEvent = {
        target: {
          files: [files],
        },
      };
      component.onFileChange(mockEvent);
      expect(window.alert).toHaveBeenCalledWith('Incompatible File');
    });

    it('should read files correctly', waitForAsync(() => {
      const mockFile = new File(['id,age\n1,30'], 'test.csv', {
        type: 'text/csv',
      });
      Object.defineProperty(mockFile, 'size', { value: 20 });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      };
      component
        .readFileMethod(mockFile)
        .then((result) => {
          expect(result).toBe('id,age\n1,30');
        })
        .catch((error) => {});
    }));

    it('should detect files correctly', () => {
      const mockFile = new File(['id,age\n1,30'], 'test.csv', {
        type: 'text/csv',
      });
      Object.defineProperty(mockFile, 'size', { value: 20 });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      };
      component
        .readFileMethod(mockFile)
        .then((result) => {
          expect(component.isFileData).toBeDefined();
        })
        .catch((error) => {});
    });

    it('should handle CSV file changes correctly', async () => {
      const mockFile = new File(['id,name\n1,Test'], 'test.csv', {
        type: 'text/csv',
      });
      const mockEvt = { target: { files: [mockFile] } };

      await component.onFileChange(mockEvt);

      expect(component.fileContent).toBeDefined();
      expect(component.extension).toBe('csv');
      expect(component.isFileData).toBeTruthy();
    });

    it('should handle XLSX file changes correctly', async () => {
      const mockFile = new File(['...'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const mockEvt = { target: { files: [mockFile] } };

      await component.onFileChange(mockEvt);

      expect(component.fileContent).toBeDefined();
      expect(component.extension).toBe('xlsx');
      expect(component.isFileData).toBeTruthy();
    });

    it('should alert on unsupported file types', async () => {
      const mockFile = new File(['content'], 'test.unsupported', {
        type: 'text/unsupported',
      });
      const mockEvt = { target: { files: [mockFile] } };

      await component.onFileChange(mockEvt);

      expect(window.alert).toHaveBeenCalledWith(
        '❌ ERROR: Unsupported file type. Please upload a CSV or XLSX file.'
      );
    });
  });

  describe('ParseCsv2', () => {
    it('should correctly parse CSV content', () => {
      // Setup
      component.fileContent = 'id,age\n23,30\n12,25';

      // Action
      component.parseCsv();

      // Assertions
      expect(component.isFileData).toBe(true);
      expect(component.headers).toEqual(['id', 'age']);
      expect(component.fileData).toEqual([
        { id: 23, age: 30 },
        { id: 12, age: 25 },
      ]);
    });

    it('should skip empty rows', () => {
      // Setup with an intentionally empty row
      component.fileContent = 'id,age\n23,30\n\n12,25';

      // Action
      component.parseCsv();

      // Assertions
      expect(component.fileData).toEqual([
        { id: 23, age: 30 },
        { id: 12, age: 25 },
      ]);
    });

    it('should handle rows with whitespace', () => {
      // Setup with rows that contain only whitespace
      component.fileContent = 'id,age\n23,30\n   \n12,25';

      // Action
      component.parseCsv();

      // Assertions
      expect(component.fileData.length).toBe(2); // Ensure it only parsed the non-empty rows
    });
  });
});
