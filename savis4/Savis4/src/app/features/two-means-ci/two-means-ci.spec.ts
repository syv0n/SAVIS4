import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TwoMeansCIComponent } from './two-means-ci.component';

import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('TwoMeansCIComponent', () => {
  let component: TwoMeansCIComponent;
  let fixture: ComponentFixture<TwoMeansCIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        AppFirebaseModule,
        RouterTestingModule,
      ],
      declarations: [
        TwoMeansCIComponent,
        NavbarComponent,
        FooterComponent,
        LanguageSwitcherComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TwoMeansCIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();

    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoMeansCIComponent);
    component = fixture.componentInstance;

    component.csv = [
      [1, 2, 3], // Sample data for group 1
      [4, 5, 6], // Sample data for group 2
    ];

    // Mock chart objects
    component.chart1 = {
      setScale: jest.fn(),
      setDataFromRaw: jest.fn(),
      chart: { update: jest.fn(), tooltip: { _options: {} } },
      options: { scales: { yAxes: [{ ticks: {} }] } },
    };
    component.chart2 = {
      setScale: jest.fn(),
      setDataFromRaw: jest.fn(),
      chart: { update: jest.fn(), tooltip: { _options: {} } },
      options: { scales: { yAxes: [{ ticks: {} }] } },
    };
    component.chart3 = {
      setScale: jest.fn(),
      setDataFromRaw: jest.fn(),
      chart: { update: jest.fn() },
      options: { scales: { yAxes: [{ ticks: {} }] } },
    };
    component.chart4 = {
      setScale: jest.fn(),
      setDataFromRaw: jest.fn(),
      chart: { update: jest.fn() },
      options: { scales: { yAxes: [{ ticks: {} }] } },
    };
    component.chart5 = {
      setScale: jest.fn(),
      setDataFromRaw: jest.fn(),
      chart: { update: jest.fn() },
      options: { scales: { yAxes: [{ ticks: {} }] } },
    };

    // const childRef = jest.

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the section state based on the event', () => {
    // Simulate the event object for checking the checkbox
    const checkEvent = { target: { checked: true } };
    const sectionKey = 'sectionOne';

    // Call toggleSection with the simulated event and section key
    component.toggleSection(checkEvent, sectionKey);

    // Expect the sections object to be updated correctly
    expect(component.sections[sectionKey]).toBeTruthy();

    // Simulate the event object for unchecking the checkbox
    const uncheckEvent = { target: { checked: false } };

    // Call toggleSection with the simulated event and the same section key
    component.toggleSection(uncheckEvent, sectionKey);

    // Expect the sections object to be updated correctly
    expect(component.sections[sectionKey]).toBeFalsy();
  });

  it('should update chart1 data and options when chartIdentifier is chart1', () => {
    component.multiplier = 2; // Set multiplier for the test
    component.incrementYValues('chart1'); // Call the method with chartIdentifier as 'chart1'

    // Assertions to check if chart1 data and options are updated correctly
    expect(component.chart1.chart.options.scales.yAxes[0].ticks.min).toBe(
      Number.MAX_SAFE_INTEGER
    );
    expect(component.chart1.chart.options.scales.yAxes[0].ticks.max).toBe(
      Number.MIN_SAFE_INTEGER
    );
  });

  it('should update chart2 data and options when chartIdentifier is chart2', () => {
    component.multiplier = 2; // Set multiplier for the test
    component.incrementYValues('chart2'); // Call the method with chartIdentifier as 'chart2'

    // Assertions to check if chart2 data and options are updated correctly
    expect(component.chart2.chart.options.scales.yAxes[0].ticks.min).toBe(
      Number.MAX_SAFE_INTEGER
    );
    expect(component.chart2.chart.options.scales.yAxes[0].ticks.max).toBe(
      Number.MIN_SAFE_INTEGER
    );
  });

  it('should correctly update data and chart properties on updateData call', () => {
    component.updateData(null); // Assuming data isn't used within the method, based on your description

    // Verify the data size and mean calculations
    expect(component.dataSize1).toBe(3); // Based on the mock data
    expect(component.dataSize2).toBe(3); // Based on the mock data
    expect(component.datamean1).toBeCloseTo(2, 3); // Mean of [1, 2, 3]
    expect(component.datamean2).toBeCloseTo(5, 3); // Mean of [4, 5, 6]
    expect(component.mean_diff).toBeCloseTo(-3, 3); // Difference in means

    // Verify minmax calculation
    expect(component.minmax.min).toBe(1); // Minimum of combined data
    expect(component.minmax.max).toBe(6); // Maximum of combined data

    // Verify simulation activation
    expect(component.activateSim).toBe(true);
  });

  describe('resetAxis', () => {
    it('should reset y-axis ticks to "auto" for Chart.js 2.x', () => {
      component.resetAxis(component.chart1); // Call the method with a Chart.js 2.x chart instance

      // Assertions to check if y-axis ticks are reset to "auto" for Chart.js 2.x
      expect(component.chart1.chart.options.scales.yAxes[0].ticks.min).toBe(
        'auto'
      );
      expect(component.chart1.chart.options.scales.yAxes[0].ticks.max).toBe(
        'auto'
      );
    });
  });

  describe('calculateMean', () => {
    it('should return 0 for an empty array', () => {
      expect(component.calculateMean([])).toBe(0);
    });

    it('should return the number itself for an array with one number', () => {
      expect(component.calculateMean([5])).toBe(5);
    });

    it('should return the correct mean for an array of multiple numbers', () => {
      expect(component.calculateMean([1, 2, 3, 4, 5])).toBe(3);
    });

    it('should handle negative numbers correctly', () => {
      expect(component.calculateMean([-5, -3, -4])).toBeCloseTo(-4);
    });

    it('should calculate the mean correctly for an array with decimal values', () => {
      expect(component.calculateMean([1.2, 2.5, 3.7])).toBeCloseTo(2.4667, 4);
    });
  });
  describe('onResetChart', () => {
    beforeEach(() => {
      // Mock chart objects and their methods
      component.chart1 = {
        clear: jest.fn(),
        chart: { update: jest.fn() },
        options: { scales: { yAxes: [{ ticks: {} }] } },
      };
      component.chart2 = {
        clear: jest.fn(),
        chart: { update: jest.fn() },
        options: { scales: { yAxes: [{ ticks: {} }] } },
      };
      component.chart3 = {
        clear: jest.fn(),
        chart: { update: jest.fn() },
        options: { scales: { yAxes: [{ ticks: {} }] } },
      };
      component.chart4 = {
        clear: jest.fn(),
        chart: { update: jest.fn() },
        options: { scales: { yAxes: [{ ticks: {} }] } },
      };
    });

    it('should clear all charts and update them', () => {
      component.onResetChart();

      // Verify that clear and chart.update are called for each chart
      expect(component.chart1.clear).toHaveBeenCalled();
      expect(component.chart1.chart.update).toHaveBeenCalledWith(0);

      expect(component.chart2.clear).toHaveBeenCalled();
      expect(component.chart2.chart.update).toHaveBeenCalledWith(0);

      expect(component.chart3.clear).toHaveBeenCalled();
      expect(component.chart3.chart.update).toHaveBeenCalledWith(0);

      expect(component.chart4.clear).toHaveBeenCalled();
      expect(component.chart4.chart.update).toHaveBeenCalledWith(0);
    });
  });
  describe('loadData', () => {
    beforeEach(() => {
      // Mock parseData and updateData methods
      component.parseData = jest.fn();
      component.updateData = jest.fn();
    });

    it('should parse and update data correctly', () => {
      // Mock the raw CSV data and its parsed version
      const csvRawData = '1,2,3\n4,5,6\n';
      const parsedData = [
        [1, 2, 3],
        [4, 5, 6],
      ];

      // Mock the csvraw property
      component.csvraw = csvRawData;

      // Call the loadData method
      component.loadData();

      // Verify that parseData was called with the raw data
      expect(component.parseData).toHaveBeenCalled();

      // Verify that updateData was called with the parsed data
      expect(component.updateData).toHaveBeenCalled();
    });
  });
  describe('updateChart', () => {
    it('should correctly update chartData and chartLabels', () => {
      // Define a sample input string
      const inputData = '1,100\n2,200\n3,300';

      // Expected objects after processing inputData
      const expectedChartData = [
        {
          data: [
            { x: 100, y: 1 },
            { x: 200, y: 2 },
            { x: 300, y: 3 },
          ],
          label: 'Original Data',
          pointRadius: 6,
        },
      ];

      const expectedChartLabels = [
        'Data Point 1',
        'Data Point 2',
        'Data Point 3',
      ];

      // Call the updateChart method with the sample input
      component.updateChart(inputData);

      // Verify that chartData is updated as expected
      expect(component.chartData).toEqual(expectedChartData);

      // Verify that chartLabels is updated as expected
      expect(component.chartLabels).toEqual(expectedChartLabels);
    });
  });
  describe('updateSummaryChart', () => {
    it('should correctly update summaryData', () => {
      // Define a sample input string
      const inputData =
        'Group 1,10\nGroup 1,20\nGroup 1,30\nGroup 2,15\nGroup 2,25\nGroup 2,35';

      // Call the updateSummaryChart method with the sample input
      component.updateSummaryChart(inputData);

      // Expected output based on the sample input
      const expectedSummaryData = [
        {
          data: [6, 22.5, 0, NaN, NaN],
          label: 'Summary Statistics',
        },
      ];

      // Verify that summaryData is updated as expected
      expect(component.summaryData).toEqual(expectedSummaryData);
    });
  });
  // describe('runSimulations', () => {
  //   it('should log the correct number of simulations', () => {
  //     // Spy on console.log
  //     const consoleSpy = jest.spyOn(console, 'log');

  //     // Set a sample number of simulations
  //     component.numberOfSimulations = 10;

  //     // Call the runSimulations method
  //     component.runSimulations();

  //     // Check if console.log was called with the correct message
  //     expect(consoleSpy).toHaveBeenCalledWith('Running', 10, 'simulations');

  //     // Clean up
  //     consoleSpy.mockRestore();
  //   });
  // });
  describe('sampleSelect', () => {
    let mockEvent: any;

    beforeEach(() => {
      component.parseData = jest.fn().mockReturnValue('parsedData'); // Mock parseData or implement a mock function that simulates its behavior

      // Mock fetch response
      global.fetch = jest.fn().mockResolvedValue({
        text: jest.fn().mockResolvedValue('csv data'),
      });

      mockEvent = {
        target: {
          value: 'sample1',
        },
      };
    });

    it('should set csv to null and update csvraw and csv based on fetched data for sample1', async () => {
      await component.sampleSelect(mockEvent);
      expect(global.fetch).toHaveBeenCalledWith(
        '../../../assets/twomean_sample1.csv'
      ); // Correct link for sample1
    });
  });
  describe('sampleSelect2', () => {
    let mockEvent: any;

    beforeEach(() => {
      component.parseData = jest.fn().mockReturnValue('parsedData'); // Mock parseData or implement a mock function that simulates its behavior

      // Mock fetch response
      global.fetch = jest.fn().mockResolvedValue({
        text: jest.fn().mockResolvedValue('csv data'),
      });

      mockEvent = {
        target: {
          value: 'sample2',
        },
      };
    });

    it('should set csv to null and update csvraw and csv based on fetched data for sample2', async () => {
      await component.sampleSelect(mockEvent);
      expect(global.fetch).toHaveBeenCalledWith(
        '../../../assets/twomean_sample2.csv'
      ); // Correct link for sample1
    });
  });
  describe('parseData', () => {
    it('should correctly parse data text into structured format', () => {
      const dataText = 'Group1,10\nGroup1,20\nGroup2,30\nGroup2,40';
      const expectedOutput = [
        [10, 20], // Assuming the output is just an array of values for each group
        [30, 40],
      ];

      const result = component.parseData(dataText);

      expect(result).toEqual(expectedOutput);
    });

    it('should handle empty lines and ignore them', () => {
      const dataTextWithEmptyLines =
        'Group1,10\n\nGroup1,20\nGroup2,30\n\nGroup2,40';
      const expectedOutput = [
        [10, 20],
        [30, 40],
      ];

      const result = component.parseData(dataTextWithEmptyLines);

      expect(result).toEqual(expectedOutput);
    });
  });
  describe('onDrop', () => {
    let mockEvent: any;
    beforeEach(() => {
      // Create a mock for the DragEvent
      mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: {
          files: [
            new File(['file content'], 'example.csv', { type: 'text/csv' }),
          ],
        },
      };

      component.onFileSelected = jest.fn(); // Mock the onFileSelected method
    });

    it('should prevent default behavior and stop event propagation', () => {
      // Call the onDrop method with the mock event
      component.onDrop(mockEvent);

      // Check if preventDefault and stopPropagation were called
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should call onFileSelected with the event', () => {
      // Call the onDrop method with the mock event
      component.onDrop(mockEvent);

      // Check if onFileSelected was called with the event
      expect(component.onFileSelected).toHaveBeenCalledWith(mockEvent);
    });
  });
  describe('onFileSelected', () => {
    let mockFile: any;
    let mockFileReaderInstance: any;
    let mockEvent: any;
    let mockEvent1: any;

    beforeEach(() => {
      component.parseData = jest.fn(); // Mock the parseData method

      // Create a mock File object
      mockFile = new File(['file content'], 'example.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Mock the FileReader instance and its methods
      mockFileReaderInstance = {
        readAsBinaryString: jest.fn(),
        onload: null,
        result: 'mocked result',
      };

      // Create a mock event object with the file
      mockEvent = {
        target: {
          files: [mockFile],
        },
      };
      mockEvent1 = {
        target: {
          files: null,
        },
        dataTransfer: {
          files: [mockFile],
        },
      };

      // Create a spy for FileReader constructor to return the mock instance
      jest
        .spyOn(global, 'FileReader')
        .mockImplementation(() => mockFileReaderInstance);
    });

    afterEach(() => {
      jest.clearAllMocks(); // Reset mock function calls after each test
    });

    it('should read data ransfer as binary string and parse it', () => {
      // Mock FileReader onload event handler
      mockFileReaderInstance.onload = jest.fn((event) => {
        const wb = { SheetNames: ['Sheet1'], Sheets: { Sheet1: {} } };
        const row = 'mocked csv data';

        expect(component.parseData).toHaveBeenCalledWith('mocked csv data');
        // Ensure csvraw and csv are updated correctly
        expect(component.csvraw).toBe('mocked csv data');
        expect(component.csv).toBe('mocked csv data');
      });
      if (!mockEvent1.dataTransfer.files.length) {
        return;
      }
      // Call the method being tested with the mock event
      component.onFileSelected(mockEvent1);

      // Ensure FileReader is called with the file
      expect(mockFileReaderInstance.readAsBinaryString).toHaveBeenCalledWith(
        mockFile
      );

      // Trigger FileReader onload event
      mockFileReaderInstance.onload();
    });

    it('should read file as binary string and parse it', () => {
      // Mock FileReader onload event handler
      mockFileReaderInstance.onload = jest.fn((event) => {
        const wb = { SheetNames: ['Sheet1'], Sheets: { Sheet1: {} } };
        const row = 'mocked csv data';
        expect(component.parseData).toHaveBeenCalledWith('mocked csv data');
        // Ensure csvraw and csv are updated correctly
        expect(component.csvraw).toBe('mocked csv data');
        expect(component.csv).toBe('mocked csv data');
      });

      // Call the method being tested with the mock event
      component.onFileSelected(mockEvent);

      // Ensure FileReader is called with the file
      expect(mockFileReaderInstance.readAsBinaryString).toHaveBeenCalledWith(
        mockFile
      );

      // Trigger FileReader onload event
      mockFileReaderInstance.onload();
    });
  });
  //   describe('selectedTest', () => {
  //     beforeEach(() => {
  //       component.mean_diff = 10;
  //     });
  //     it('should call tail.setTailDirection with the correct value', () => {
  //       component.selectedTest({ target: { value: 'oneTailRight' } });
  //       expect(component.tail.setTailDirection).toHaveBeenCalledWith(
  //         'oneTailRight'
  //       );
  //     });
  //   });
  describe('addSimulationSample', () => {
    it('correctly processes and organizes sample data into faceted arrays', () => {
      // Setup
      component.minmax = { min: 1, max: 10 }; // Assuming minmax is already defined in your component

      const samples = [
        { datasetId: 0, value: 2 },
        { datasetId: 1, value: 4 },
        { datasetId: 0, value: 3 },
        { datasetId: 1, value: 5 },
      ];

      // Expected structure for reference
      const expected = {
        minmax: { min: 1, max: 10 },
        data: [
          [2, 3], // Data for datasetId 0
          [4, 5], // Data for datasetId 1
        ],
      };

      // Action
      const result = component.addSimulationSample(samples);

      // Assertion
      expect(result).toEqual(expected);
    });
  });
  describe('runSim', () => {
    beforeEach(() => {
      // Mock necessary dependencies
      component.incrementPerformed = true;
      // Initialize mock data if needed
      component.csv = [
        [1, 2, 3],
        [4, 5, 6],
      ];
      // Mock chart methods if needed
      component.chart3 = {
        setDataFromRaw: jest.fn(),
        chart: { update: jest.fn() },
      };
      component.chart4 = {
        setDataFromRaw: jest.fn(),
        chart: { update: jest.fn() },
      };

      //   component.smp = {
      //     randomSubset: jest.fn().mockReturnValue({
      //       chosen: [{ datasetId: 0, value: 5 }],
      //       unchosen: [{ datasetId: 1, value: 5 }],
      //     }),
      //     randomInt: jest.fn().mockReturnValue(3),
      //     shuffle: jest.fn(),
      //     splitUsing: jest.fn(),
      //     splitByPredicate: jest.fn(),
      //   };

      //   // Mock CSV data
      //   component.csv = [
      //     [1, 2, 3], // Sample data for group 1
      //     [4, 5, 6], // Sample data for group 2
      //   ];

      //   // Mock chart objects
      //   component.chart3 = {
      //     setDataFromRaw: jest.fn(),
      //     chart: { update: jest.fn() },
      //   };
      //   component.chart4 = {
      //     setDataFromRaw: jest.fn(),
      //     chart: { update: jest.fn() },
      //   };
    });
    // it('should perform simulation, update chart, update summary statistics, and set samDisActive flag', () => {
    //   // Call the method
    //   component.runSim();

    // });

    it('should show an alert if increment is not performed before simulation', () => {
      component.incrementPerformed = false;
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      component.runSim();

      expect(alertSpy).toHaveBeenCalledWith(
        'Please increment values before running the simulation.'
      );
      // Ensure that no further actions are taken after the alert
      expect(component.chart3.setDataFromRaw).not.toHaveBeenCalled();
      expect(component.chart4.setDataFromRaw).not.toHaveBeenCalled();
      // Add more assertions as needed
    });

    it('should update charts and calculate statistics for each simulation', () => {
      const expectedSampleDiffOfMeans = 3; // Example value for sampleDiffOfMeans
      // Mock any additional dependencies or methods if needed
      // ...

      component.runSim();

      // Ensure that charts are updated with correct data
      expect(component.chart3.setDataFromRaw).toHaveBeenCalled();
      expect(component.chart4.setDataFromRaw).toHaveBeenCalled();
      expect(component.chart3.chart.update).toHaveBeenCalled();
      expect(component.chart4.chart.update).toHaveBeenCalled();
      // Add more assertions as needed
    });
  });
  describe('parseData', () => {
    it('should parse valid CSV data into grouped arrays', () => {
      const csvData = 'Group A,1\nGroup A,2\nGroup B,3\nGroup B,4\nGroup B,5';
      const expectedParsedData = [
        [1, 2], // Group A
        [3, 4, 5], // Group B
      ];
      expect(component.parseData(csvData)).toEqual(expectedParsedData);
    });

    it('should handle empty lines gracefully', () => {
      const csvData = 'Group A,1\n\nGroup B,3\n';
      const expectedParsedData = [
        [1], // Group A
        [3], // Group B
      ];
      expect(component.parseData(csvData)).toEqual(expectedParsedData);
    });

    it('should convert value strings to floating point numbers', () => {
      const csvData = 'Group A,1\nGroup A,2\nGroup B,3.5\nGroup B,4.75\n';
      const expectedParsedData = [
        [1, 2], // Group A
        [3.5, 4.75], // Group B
      ];
      expect(component.parseData(csvData)).toEqual(expectedParsedData);
    });
  });
});
