import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import Chart from 'chart.js';
import { ElementRef } from '@angular/core';
import { SaveLoadButtonsComponent } from 'src/app/components/save-load-buttons/save-load-buttons.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { CalculatorComponent } from 'src/app/components/calculator/calculator.component';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        AppFirebaseModule,
        RouterTestingModule,
        MatDialogModule
      ],
      declarations: [BarChartComponent, FooterComponent, NavbarComponent, SaveLoadButtonsComponent, LanguageSwitcherComponent, CalculatorComponent],
      providers:[
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'barChart_title'
    );
  });

  it('should fetch barSample1.csv when "sample1" is selected', async () => {
    const mockResponse = 'mock csv data for sample1'; // Mock response data
    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue(mockResponse),
    });

    await component.sampleSelect({ target: { value: 'sample1' } });

    expect(fetch).toHaveBeenCalledWith('../../../assets/barSample1.csv');
  });

  it('should fetch barSample2.csv when a value other than "sample1" is selected', async () => {
    const mockResponse = 'mock csv data for sample2'; // Mock response data
    global.fetch = jest.fn().mockResolvedValue({
      text: jest.fn().mockResolvedValue(mockResponse),
    });

    await component.sampleSelect({ target: { value: 'sample2' } });

    expect(fetch).toHaveBeenCalledWith('../../../assets/barSample2.csv');
  });

  describe('ClearChart', () => {
    let chartMock: any;
    beforeEach(() => {
      chartMock = {
        data: {
          labels: ['Label1', 'Label2'],
          datasets: [
            {
              data: [10, 20],
            },
          ],
        },
        options: {
          scales: {
            yAxes: [{ ticks: { max: 10 } }],
          },
        },
        update: jest.fn(), // Mock the update method
      } as any;
    });
    it('should clear the chart data and update the chart', () => {
      // Spy on the update method
      const updateSpy = jest.spyOn(chartMock, 'update');

      component.clearChart(chartMock);

      expect(chartMock.data.labels).toEqual([]);
      expect(chartMock.data.datasets[0].data).toEqual([]);
      expect(chartMock.options.scales.yAxes[0].ticks.max).toEqual(1);

      expect(updateSpy).toHaveBeenCalled();
    });
  });
  describe('Total Clear', () => {
    let inputChartMock: Chart;
    let sampleChartMock: Chart;
    beforeEach(() => {
      // Mock inputChart and sampleChart instances
      inputChartMock = {} as Chart;
      sampleChartMock = {} as Chart;

      // Spy on clearChart method
      component.clearChart = jest.fn();
    });

    it('should reset all relevant properties and clear charts', () => {
      component.totalReset();

      // Expect properties to be reset
      expect(component.inputDataArray).toEqual([]);
      expect(component.dataCategoryArray).toEqual([]);
      expect(component.sampleDataArray).toEqual([]);
      expect(component.datasets[0].data).toEqual([]);
      expect(component.datasets[1].data).toEqual([]);
      expect(component.inputDataSizeNum).toEqual('NaN');
      expect(component.sampleDataSizeNum).toEqual('NaN');
      expect(component.csvTextArea).toEqual('');
      expect(component.inputDataDisplay.nativeElement.innerHTML).toEqual('');
      expect(component.sampleDataDisplay.nativeElement.innerHTML).toEqual('');
      expect(component.inputDataTable.nativeElement.innerText).toEqual('');
      expect(component.sampleDataTable.nativeElement.innerText).toEqual('');
    });
  });

  describe('resetSampleChart()', () => {
    let sampleChartMock: Chart;

    beforeEach(() => {
      // Mock sampleChart instance
      sampleChartMock = {} as Chart;

      // Spy on clearChart method
      component.clearChart = jest.fn();
    });

    it('should reset sampleDataArray, datasets[1].data, and clear sampleChart', () => {
      // Set some initial values to properties
      component.sampleDataArray = [{ id: 1, value: 'sampleData' }];
      component.datasets[1].data = [4, 5, 6];

      component.resetSampleChart();

      // Expect properties to be reset
      expect(component.sampleDataArray).toEqual([]);
      expect(component.datasets[1].data).toEqual([]);
    });
  });
  describe('updateSampleData()', () => {
    it('should update sampleDataArray and call updateData() with correct parameters', () => {
      // Mock input data array
      component.inputDataArray = [
        { id: 1, value: 'data1' },
        { id: 2, value: 'data2' },
        { id: 3, value: 'data3' },
        { id: 4, value: 'data4' },
        { id: 5, value: 'data5' },
      ];

      // Mock randomSubset function
      component.randomSubset = jest.fn().mockReturnValue({
        chosen: [
          { id: 1, value: 'data1' },
          { id: 2, value: 'data2' },
        ],
        unchosen: [
          { id: 3, value: 'data3' },
          { id: 4, value: 'data4' },
          { id: 5, value: 'data5' },
        ],
      });

      component.updateData = jest.fn();

      component.updateSampleData();

      // Expect sampleDataArray to be updated with the chosen subset
      expect(component.sampleDataArray).toEqual([
        { id: 1, value: 'data1' },
        { id: 2, value: 'data2' },
      ]);

      // Expect updateData to be called with correct parameters
      expect(component.updateData).toHaveBeenCalledWith(1);
    });

    it('should set sampleErrorMsg when there is no input data', () => {
      component.inputDataArray = [];

      component.updateSampleData();

      // Expect sampleErrorMsg to be set
      expect(component.sampleErrorMsg).toEqual('ERROR\n');
    });
  });

  describe('loadInputData', () => {
    it('should reset sample chart, update dataCategoryArray, and call updateData() with parameter 0', () => {
      // Mock inputDataArray
      component.inputDataArray = [
        { id: 1, value: 'category1' },
        { id: 2, value: 'category2' },
        { id: 3, value: 'category3' },
        { id: 4, value: 'category1' },
        { id: 5, value: 'category2' },
      ];

      // Mock resetSampleChart and updateData functions
      component.resetSampleChart = jest.fn();
      component.updateData = jest.fn();

      component.loadInputData();

      // Expect sample chart to be reset
      expect(component.resetSampleChart).toHaveBeenCalled();

      // Expect dataCategoryArray to be updated
      expect(component.dataCategoryArray).toEqual([
        'category1',
        'category2',
        'category3',
      ]);

      // Expect updateData to be called with parameter 0
      expect(component.updateData).toHaveBeenCalledWith(0);
    });

    it('should set inputErrorMsg when there are too many categories', () => {
      // Mock inputDataArray with more than 15 unique categories
      component.inputDataArray = Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        value: `category${i + 1}`,
      }));

      // Mock resetSampleChart and updateData functions
      component.resetSampleChart = jest.fn();
      component.updateData = jest.fn();

      component.loadInputData();

      // Expect inputErrorMsg to be set
      expect(component.inputErrorMsg).toEqual(
        'ERROR: Only 16 categories are supported'
      );

      // Expect resetSampleChart and updateData not to be called
      expect(component.resetSampleChart).toHaveBeenCalled();
      expect(component.updateData).not.toHaveBeenCalled();
    });
  });

  describe('setMaxScale', () => {
    it('should return the correct maximum scale', () => {
      // Test cases for values less than 1
      expect(component.setMaxScale(0.5)).toEqual(0.6);
      expect(component.setMaxScale(0.1)).toEqual(0.2);
      expect(component.setMaxScale(0.9)).toEqual(1);

      // Test cases for values equal to or greater than 1
      expect(component.setMaxScale(1)).toEqual(1);
      expect(component.setMaxScale(1.5)).toEqual(1);
      expect(component.setMaxScale(2)).toEqual(1);
    });
  });

  describe('LoadDataButton', () => {
    beforeEach(() => {});

    it('should parse CSV text and call loadInputData() if inputDataArray is not empty', () => {
      // Mock CSV text
      component.csvTextArea = 'data1,data2,data3\nvalue1,value2,value3';

      // Mock loadInputData and totalReset methods
      component.loadInputData = jest.fn();
      component.totalReset = jest.fn();

      // Call loadDataButton method
      component.loadDataButton();

      // Expect inputDataArray to be updated with parsed data
      expect(component.inputDataArray).toBeDefined();

      // Expect loadInputData to be called
      expect(component.loadInputData).toHaveBeenCalled();

      // Expect totalReset not to be called
      expect(component.totalReset).not.toHaveBeenCalled();
    });

    it('should call totalReset() if inputDataArray is empty', () => {
      // Mock empty CSV text
      component.csvTextArea = '';

      // Mock loadInputData and totalReset methods
      component.loadInputData = jest.fn();
      component.totalReset = jest.fn();

      // Call loadDataButton method
      component.loadDataButton();

      // Expect inputDataArray to be empty
      expect(component.inputDataArray).toEqual([]);

      // Expect totalReset to be called
      expect(component.totalReset).toHaveBeenCalled();

      // Expect loadInputData not to be called
      expect(component.loadInputData).not.toHaveBeenCalled();
    });
  });

  describe('RandomInt', () => {
    beforeEach(() => {});

    it('should return a random integer within the specified range', () => {
      // Test the method with different ranges and multiple iterations to ensure randomness
      for (let i = 0; i < 1000; i++) {
        const from = Math.floor(Math.random() * 100);
        const to = Math.floor(Math.random() * 100) + from + 1; // Ensure 'to' is greater than 'from'

        // Call randomInt method
        const result = component.randomInt(from, to);

        // Expect the result to be an integer
        expect(Number.isInteger(result)).toBe(true);

        // Expect the result to be within the specified range [from, to)
        expect(result).toBeGreaterThanOrEqual(from);
        expect(result).toBeLessThan(to);
      }
    });
  });
  describe('RandomSubset', () => {
    beforeEach(() => {});

    it('should return a random subset of elements from the iterable', () => {
      // Mock iterable and subset size
      const iterable = ['item1', 'item2', 'item3', 'item4', 'item5'];
      const subsetSize = 3;

      // Call randomSubset method
      const { chosen, unchosen } = component.randomSubset(iterable, subsetSize);

      // Expect chosen and unchosen arrays to be of expected lengths
      expect(chosen.length).toBe(subsetSize);
      expect(unchosen.length).toBe(iterable.length - subsetSize);

      // Expect all chosen elements to be from the iterable
      chosen.forEach((element) => {
        expect(iterable).toContain(element);
      });

      // Expect no duplicates in the chosen array
      expect(new Set(chosen).size).toBe(chosen.length);

      // Expect all unchosen elements to be from the iterable
      unchosen.forEach((element) => {
        expect(iterable).toContain(element);
      });
    });

    it('should throw an error if there are not enough elements in the iterable', () => {
      // Mock iterable with fewer elements than the subset size
      const iterable = ['item1', 'item2'];
      const subsetSize = 3;

      // Expect randomSubset to throw an error
      expect(() => component.randomSubset(iterable, subsetSize)).toThrow(
        'not enough elements'
      );
    });
  });
  describe('SortAlphaNumString', () => {
    beforeEach(() => {});

    it('should correctly sort alphanumeric strings and numbers', () => {
      // Mock raw data with alphanumeric strings and numbers
      const rawData = ['item3', 'item1', '2', 'item10', '1', 'item2'];

      // Call sortAlphaNumString method
      const sortedData = component.sortAlphaNumString(rawData);

      // Expect sortedData to be correctly sorted and consecutive
      expect(sortedData).toEqual([
        '1',
        '2',
        'item1',
        'item10',
        'item2',
        'item3',
      ]);
    });
  });
  describe('ClearChart', () => {
    let mockChartInstance: any;

    beforeEach(() => {
      // Mock Chart instance
      mockChartInstance = {
        data: {
          labels: ['label1', 'label2'],
          datasets: [{ data: [1, 2, 3] }],
        },
        options: {
          scales: {
            yAxes: [{ ticks: { max: 10 } }],
          },
        },
        update: jest.fn(), // Mock the update method
      };
    });

    it('should clear the chart data and options', () => {
      // Call clearChart with the mocked Chart instance
      component.clearChart(mockChartInstance);

      // Expect chart data and options to be cleared
      expect(mockChartInstance.data.labels).toEqual([]);
      expect(mockChartInstance.data.datasets[0].data).toEqual([]);
      expect(mockChartInstance.options.scales.yAxes[0].ticks.max).toEqual(1);

      // Expect update method to be called
      expect(mockChartInstance.update).toHaveBeenCalled();
    });
  });

  describe('RoundToPleaces', () => {
    beforeEach(() => {});

    it('should round a value to the specified number of decimal places', () => {
      // Test cases for different values and decimal places
      expect(component.roundToPlaces(3.14159, 2)).toBeCloseTo(3.14);
      expect(component.roundToPlaces(3.14159, 3)).toBeCloseTo(3.142);
      expect(component.roundToPlaces(123.456, 0)).toBe(123);
      expect(component.roundToPlaces(0.123456, 4)).toBeCloseTo(0.1235);
    });
  });
  describe('Max In Array', () => {
    beforeEach(() => {});

    it('should return the maximum value in the array', () => {
      // Test cases for different arrays
      expect(component.maxInArray([1, 2, 3, 4, 5])).toBe(5);
      expect(component.maxInArray([-1, -5, -3, -2])).toBe(-1);
      expect(component.maxInArray([10, 0, -10])).toBe(10);
      expect(component.maxInArray([3])).toBe(3);
    });

    it('should return undefined if the array is empty or undefined', () => {
      // Test cases for empty or undefined arrays
      expect(component.maxInArray([])).toBe(undefined);
      expect(component.maxInArray(undefined)).toBe(undefined);
    });
  });

  describe('UpdateChartData', () => {
    let mockChartInstance: any;

    beforeEach(() => {
      // Mock Chart instance
      mockChartInstance = {
        data: {
          labels: [],
          datasets: [{ data: [] }],
        },
        update: jest.fn(), // Mock the update method
      };
    });

    it('should update chart data and labels and call update method', () => {
      // Mock data
      const labels = ['label1', 'label2', 'label3'];
      const contElements = [10, 20, 30];

      // Call updateChartData with the mock Chart instance
      component.updateChartData(mockChartInstance, labels, contElements);

      // Expect chart data and labels to be updated
      expect(mockChartInstance.data.labels).toEqual(labels);
      expect(mockChartInstance.data.datasets[0].data).toEqual(contElements);

      // Expect update method to be called
      expect(mockChartInstance.update).toHaveBeenCalled();
    });
  });

  describe('SetScale', () => {
    let mockChartInstance: any;

    beforeEach(() => {
      // Mock Chart instance
      mockChartInstance = {
        options: {
          scales: {
            yAxes: [{ ticks: { min: 0, max: 10 } }],
          },
        },
        update: jest.fn(), // Mock the update method
      };
    });

    it('should set floor and ceiling values for y-axis ticks and call update method', () => {
      // Mock floor and ceil values
      const floor = 5;
      const ceil = 15;

      // Call setScale with the mock Chart instance
      component.setScale(mockChartInstance, floor, ceil);

      // Expect y-axis ticks min and max to be updated
      expect(mockChartInstance.options.scales.yAxes[0].ticks.min).toBe(floor);
      expect(mockChartInstance.options.scales.yAxes[0].ticks.max).toBe(ceil);

      // Expect update method to be called
      expect(mockChartInstance.update).toHaveBeenCalled();
    });
  });

  describe('Trigger File Input', () => {
    let mockFileInputElement: any;

    beforeEach(() => {
      // Mock file input element
      mockFileInputElement = {
        nativeElement: {
          click: jest.fn(), // Mock the click method
        },
      };

      // Assign the mock file input element to the component's fileInput property
      component.fileInput = mockFileInputElement;
    });

    it('should trigger click event on file input element', () => {
      // Call triggerFileInput method
      component.triggerFileInput();

      // Expect click method of file input element to be called
      expect(mockFileInputElement.nativeElement.click).toHaveBeenCalled();
    });
  });

  describe('updateData', () => {
    let translateServiceMock: any;
    let mockInputDataDisplay: any;
    let mockSampleDataDisplay: any;
    beforeEach(() => {
      mockInputDataDisplay = {
        nativeElement: document.createElement('div'), // Create a mock div element
      };
      mockSampleDataDisplay = {
        nativeElement: document.createElement('div'), // Create a mock div element
      };
      translateServiceMock = {
        instant: jest.fn().mockImplementation((key: string) => key), // Mock translate.instant method
      };

      // component = new BarChartComponent(translateServiceMock); // Create an instance of the component
    });

    it('should update input chart data and display table when num is 0', () => {
      component.inputDataDisplay = mockInputDataDisplay;
      // Mock input data array and category array
      component.inputDataArray = [
        { id: 1, value: 'category1' },
        { id: 2, value: 'category2' },
        { id: 3, value: 'category3' },
      ];
      component.dataCategoryArray = ['category1', 'category2', 'category3'];

      // Mock nativeElement for inputDataTable
      component.inputDataTable = {
        nativeElement: document.createElement('div'),
      } as ElementRef;

      // Mock updateChartData and setScale methods
      component.updateChartData = jest.fn();
      component.setScale = jest.fn();

      // Call updateData with num = 0
      component.updateData(0);

      // Expect input chart data to be updated
      expect(component.updateChartData).toHaveBeenCalled();

      // Expect setScale to be called with correct parameters
      expect(component.setScale).toHaveBeenCalledWith(
        component.inputChart,
        0,
        0.4
      );

      // Expect input data table to be displayed
      const tableElement = component.inputDataDisplay.nativeElement;
      expect(tableElement.innerHTML).toContain('<table');
    });

    it('should update sample chart data and display table when num is not 0', () => {
      component.sampleDataDisplay = mockSampleDataDisplay;
      // Mock sample data array and category array
      component.sampleDataArray = [
        { id: 1, value: 'category1' },
        { id: 2, value: 'category2' },
        { id: 3, value: 'category3' },
      ];
      component.dataCategoryArray = ['category1', 'category2', 'category3'];

      // Mock nativeElement for sampleDataTable
      component.sampleDataTable = {
        nativeElement: document.createElement('div'),
      } as ElementRef;

      // Mock updateChartData and setScale methods
      component.updateChartData = jest.fn();
      component.setScale = jest.fn();

      // Call updateData with num != 0
      component.updateData(1);

      // Expect sample chart data to be updated
      expect(component.updateChartData).toHaveBeenCalled();

      // Expect setScale to be called with correct parameters
      expect(component.setScale).toHaveBeenCalledWith(
        component.sampleChart,
        0,
        0.4
      );

      // Expect sample data table to be displayed
      const tableElement = component.sampleDataDisplay.nativeElement;
      expect(tableElement.innerHTML).toContain('<table');
    });
  });
});
