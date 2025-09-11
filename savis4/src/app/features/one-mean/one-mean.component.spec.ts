import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { OneMeanComponent } from './one-mean.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { MathService } from 'src/app/Utils/math.service';
import { SamplingService} from 'src/app/Utils/sampling.service';

describe('OneMeanComponent', () => {
  let component: OneMeanComponent;
  let fixture: ComponentFixture<OneMeanComponent>;
  let form: NgForm;
  let mathServiceMeanSpy: jest.SpyInstance;
  let randomIntSpy: jest.SpyInstance;
  let fileReaderSpy: jest.SpyInstance;
  let mockFileReader: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OneMeanComponent],
      imports: [FormsModule, ChartsModule, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneMeanComponent);
    component = fixture.componentInstance;
    form = new NgForm([], []);
    mathServiceMeanSpy = jest.spyOn(MathService, 'mean').mockReturnValue(3);
    randomIntSpy = jest.spyOn(SamplingService, 'randomInt');
    fileReaderSpy = jest.spyOn(global as any, 'FileReader').mockImplementation(() => ({
        readAsText: jest.fn(),
        onload: jest.fn()
      }));
    mockFileReader = {
        readAsText: jest.fn(),
        result: '1\n2\n3'
    };
    window.FileReader = jest.fn(() => mockFileReader) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render input textarea and buttons', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('textarea')).toBeTruthy();
    expect(compiled.querySelectorAll('button').length).toBe(3); // Load Data and Reset buttons
    expect(compiled.querySelector('input[type="file"]')).toBeTruthy();
  });

  // Add more test cases as needed to validate the rendering of elements and interactions with the template
  it('should render original data display', () => {
    component.valuesArray = [10, 20, 30];
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const tableRows = compiled.querySelectorAll('#original-data-display tbody tr');
    expect(tableRows.length).toBe(3);
    expect(tableRows[0].textContent).toContain('1'); // Check if ID is rendered correctly
    expect(tableRows[0].textContent).toContain('10'); // Check if value is rendered correctly
  });

  it('should render hypothetical data display', () => {
    component.hypoValuesArray = [15, 25, 35];
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const tableRows = compiled.querySelectorAll('#hypothetical-data-table tbody tr');
      expect(tableRows.length).toBe(3);
      expect(tableRows[0].textContent).toContain('1'); // Check if ID is rendered correctly
      expect(tableRows[0].textContent).toContain('15'); // Check if value is rendered correctly
    })
    
  });

  it('should call onSubmit method on form submission', fakeAsync(() => {
    const onSubmitSpy = jest.spyOn(component, 'onSubmit');
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    tick();
    expect(onSubmitSpy).toHaveBeenCalled();
  }));

  it('should reset all properties to their initial values', () => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.onReset(form);

      expect(component.dataInput).toBe("");
      expect(component.valuesArray).toEqual([]);
      expect(component.inputMean).toBe(0);
      expect(component.standardDeviation).toBe(0);
      expect(component.inputSize).toBe(0);
      expect(component.hypoInputMean).toBe(0);
      expect(component.rangeValue).toBe(0);
      expect(component.hypoValuesArray).toEqual([]);
      expect(component.meanValue).toBe(0);
      expect(component.lineChartData1).toEqual([]);
      expect(component.lineChartData2).toEqual([]);
      expect(component.lineChartData3).toEqual([]);
      expect(component.lineChartData4).toEqual([]);
      expect(component.sample).toEqual([]);
      expect(component.sampleMean).toBe(0);
      expect(component.sampleSize).toBe(1);
      expect(component.sampleMeans).toEqual([]);
      expect(component.sampleMeansMean).toBe(0);
      expect(component.numSamples).toBe(1);
      expect(component.sampleMeansStd).toBe(0);
      expect(component.meanSamples).toBe(1);
      })
  });

  it('should fill hypoValuesArray with repeated values from originalHypoValuesArray', () => {
    component.originalHypoValuesArray = [1, 2, 3];
    component.rangeValue = 3;
    component.increaseRange();

    expect(component.hypoValuesArray).toEqual([1, 1, 1, 2, 2, 2, 3, 3, 3]);
  });

  it('should fill hypoValuesArray with repeated values from valuesArray if originalHypoValuesArray is empty', () => {
    component.originalHypoValuesArray = [];
    component.valuesArray = [4, 5, 6];
    component.rangeValue = 2;
    component.increaseRange();

    expect(component.hypoValuesArray).toEqual([4, 4, 5, 5, 6, 6]);
  });

  it('should fill lineChartData2 based on hypoValuesArray', () => {
    component.hypoValuesArray = [1, 2, 2, 3, 3, 3];
    component.stackDots();

    const expectedOutput = [{
      pointBackgroundColor: 'orange',
      backgroundColor: 'orange',
      data: [
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 2, y: 2},
        {x: 3, y: 1},
        {x: 3, y: 2},
        {x: 3, y: 3}
      ],
      label: 'Hypothetical Population',
    }];
  
    expect(component.lineChartData2).toEqual(expectedOutput);
  });

  
  it('should update properties based on valuesArray and meanValue', () => {
    component.valuesArray = [1, 2, 3];
    component.meanValue = 1;
    component.prevMean = 0;

    component.increaseData();

    expect(component.hypoValuesArray).toEqual([2, 3, 4]);
    expect(component.originalHypoValuesArray).toEqual([2, 3, 4]);
    expect(component.hypoInputMean).toBe(3);
    expect(component.lineChartData2).toEqual([{
      data: [
        {x: 2, y: 1},
        {x: 3, y: 1},
        {x: 4, y: 1}
      ],
      label: 'Hypothetical Population',
      pointBackgroundColor: 'orange',
    }]);
    expect(component.lineChartLabels2).toEqual(['Value 3', 'Value 4', 'Value 5']);
    expect(component.sample).toEqual([]);
  });

  it('should generate a random sample from the input array', () => {
    const arr = [1, 2, 3, 4, 5];
    const n = 3;
    randomIntSpy.mockReturnValueOnce(0).mockReturnValueOnce(1).mockReturnValueOnce(2);

    const sample = component.randomSample(arr, n);

    expect(sample).toHaveLength(n);
    expect(sample).toContain(1);
    expect(sample).toContain(3);
    expect(sample).toContain(5);
    expect(component.sample).toEqual(sample);
  });


  it('should update properties based on the contents of the file', () => {
    const file = new Blob(['1\n2\n3'], {type: 'text/plain'});
    const event = {target: {files: [file]}};

    component.validateFile(event);

    mockFileReader.onload({target: mockFileReader});

    expect(component.valuesArray).toEqual([1, 2, 3]);
    expect(component.inputMean).toBe(MathService.mean([1, 2, 3]));
    expect(component.hypoInputMean).toBe(MathService.mean([1, 2, 3]));
    expect(component.standardDeviation).toBe(parseFloat(MathService.stddev([1, 2, 3]).toFixed(2)));
    expect(component.inputSize).toBe(3);
    expect(component.hypoValuesArray).toEqual([1, 2, 3]);
    expect(component.lineChartData1).toEqual([{
      data: [
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 3, y: 1}
      ],
      label: 'original_dataset',
      pointBackgroundColor: 'orange',
    }]);
    expect(component.lineChartLabels1).toEqual(['Value 2', 'Value 3', 'Value 4']);
    expect(component.lineChartData2).toEqual([{
      data: [
        {x: 1, y: 1},
        {x: 2, y: 1},
        {x: 3, y: 1}
      ],
      label: 'Hypothetical Population',
      pointBackgroundColor: 'orange',
    }]);
    expect(component.lineChartLabels2).toEqual(['Value 2', 'Value 3', 'Value 4']);
    // Add assertions for updateChartOptions as needed
  });

  it('should run simulation', () => {
    component.hypoValuesArray = [1, 2, 3, 4, 5];
    component.sampleSize = 3;
    component.numSamples = 2;
    component.randomSample = jest.fn((array, size) => array.slice(0, size));
    component.runSimulation();

    expect(component.lineChartData3).toEqual(expect.arrayContaining([
        expect.objectContaining({
          label: 'opc_Recent',
          pointBackgroundColor: 'orange',
          data: expect.arrayContaining([
            expect.objectContaining({
              y: expect.any(Number),
            }),
          ]),
        }),
      ]));

    expect(component.lineChartData4).toEqual(expect.arrayContaining([
        expect.objectContaining({
          label: 'dotPlot_means_in_interval',
          pointBackgroundColor: 'orange',
          data: expect.arrayContaining([
            expect.objectContaining({
              y: expect.any(Number),
            }),
          ]),
        }),
      ]));
  });


  it('should set properties correctly when extremeSampleFunc is called', () => {

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      component.extremeSampleFunc();

    expect(component.chosenVals).toBe(component.sampleMean);
    expect(component.sampleChosen).toBeCloseTo(0.6);
    expect(component.sampleNotChosen).toBeCloseTo(0.4);
    expect(component.lineChartData4).toEqual([
      {
        data: [
          {x: 2, y: 1},
          {x: 3, y: 1},
          {x: 4, y: 1}
        ],
        label: 'translated string',
        backgroundColor: 'orange',
        pointBackgroundColor: 'orange',
      },
      {
        data: [
          {x: 1, y: 1},
          {x: 5, y: 1}
        ],
        label: 'translated string',
        backgroundColor: 'red',
        pointBackgroundColor: 'red',
      }
    ]);
  });
  
});

});
