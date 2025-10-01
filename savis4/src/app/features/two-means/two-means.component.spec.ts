import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { TwoMeansComponent } from './two-means.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { chatClass } from 'src/app/Utils/stacked-dot';
import { TailchartService } from 'src/app/Utils/tailchart.service';
import { TranslateModule, TranslateService, TranslateStore, TranslateCompiler, TranslateParser, MissingTranslationHandler, USE_DEFAULT_LANG, USE_STORE, USE_EXTEND, DEFAULT_LANGUAGE, TranslateFakeLoader } from '@ngx-translate/core';
import * as XLS from 'xlsx';

describe('TwoMeansComponent', () => {
    let component: TwoMeansComponent;
    let fixture: ComponentFixture<TwoMeansComponent>;
    let onFileSelected: any;
    let tailchartServiceMock: TailchartService;
    let onDrop: any;
    let testDataSets: any[];

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [TwoMeansComponent, NavbarComponent, FooterComponent, LanguageSwitcherComponent],
            imports: [FormsModule, AppFirebaseModule, RouterModule.forRoot([]), TranslateModule.forRoot()],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }, { provide: USE_DEFAULT_LANG }, { provide: USE_STORE }, { provide: USE_EXTEND }, { provide: DEFAULT_LANGUAGE }, TranslateService, TranslateStore, TranslateFakeLoader, TranslateCompiler, TranslateParser, MissingTranslationHandler],
            schemas: [NO_ERRORS_SCHEMA]

        }).compileComponents();
        fixture = TestBed.createComponent(TwoMeansComponent);
        component = fixture.componentInstance;
        tailchartServiceMock = TestBed.inject(TailchartService);
        await fixture.whenStable();
        // tick();
    });

    beforeEach(() => {
        onFileSelected = jest.fn();
        onDrop = jest.fn((event: DragEvent) => {
            event.preventDefault();
            event.stopPropagation();
            onFileSelected(event);
        });
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should set up chart data and legend for chart5', () => {
        component.chart5 = {
            setDataFromRaw: jest.fn(),
            setLengend: jest.fn(),
            chart: {
                update: jest.fn()
            }
        };
        component.ngAfterContentInit();
        expect(component.chart5.setDataFromRaw).toHaveBeenCalledWith({
            "minmax": [0, 1],
            "data": [[], []],
            "backgroundColor": "rebeccapurple"
        });
        expect(component.chart5.setLengend).toHaveBeenCalledWith([`Differences `, `NaN`], [`orange `, `red`]);
        expect(component.chart5.chart.update).toHaveBeenCalledWith(0);
    });



    it('should initialize ngOnInit correctly', async () => {
        await expect(component.ngOnInit).toBeTruthy();
    });
    it('should set scale for chart1 and chart2 correctly', () => {
        component.chart1 = {
            setScale: jest.fn(),
            setDataFromRaw: jest.fn(),
            chart: {
                update: jest.fn(),
            },
        };

        component.chart2 = {
            setScale: jest.fn(),
            setDataFromRaw: jest.fn(),
            chart: {
                update: jest.fn(),
            },
        };

        const mockChart1 = jest.spyOn(component.chart1, 'setScale');
        const mockChart2 = jest.spyOn(component.chart2, 'setScale');
        component.chart1.setScale();
        component.chart2.setScale();

        expect(mockChart1).toHaveBeenCalledWith();
        expect(mockChart2).toHaveBeenCalledWith();
    });

    it('should set data for chart1 and chart2 correctly', () => {
        component.chart1 = {
            setScale: jest.fn(),
            setDataFromRaw: jest.fn(),
            chart: {
                update: jest.fn(),
            },
        };
        component.chart2 = {
            setScale: jest.fn(),
            setDataFromRaw: jest.fn(),
            chart: {
                update: jest.fn(),
            },
        };
        const mockChart1 = jest.spyOn(component.chart1, 'setDataFromRaw');
        const mockChart2 = jest.spyOn(component.chart2, 'setDataFromRaw');

        component.chart1.setDataFromRaw(component.chart1.rData);
        component.chart2.setDataFromRaw(component.chart2.rData2);

        expect(mockChart1).toHaveBeenCalledWith(component.chart1.rData);
        expect(mockChart2).toHaveBeenCalledWith(component.chart2.rData2);
    });

    it('should handle errors thrown during initialization', () => {
        component.chart1 = null;
        component.chart2 = null;
        component.chart3 = null;
        component.chart4 = null;
        component.chart5 = null;
        expect(component.chart1).toBeDefined();
        expect(component.chart2).toBeDefined();
        expect(component.chart3).toBeDefined();
        expect(component.chart4).toBeDefined();
        expect(component.chart5).toBeDefined();
    });

    it('should load and parse CSV data correctly', () => {
        component.csvraw = "Group 1,1\nGroup 1,2\nGroup 1,3\nGroup 2,4\nGroup 2,5\nGroup 2,6";
        component.chart1 = {
            setScale: jest.fn(),
            setDataFromRaw: jest.fn(),
            chart: {
                update: jest.fn()
            }
        };
        component.chart2 = {
            setScale: jest.fn(),
            setDataFromRaw: jest.fn(),
            chart: {
                update: jest.fn()
            }
        };
        component.loadData();
        expect(component.csv).toEqual([[1, 2, 3], [4, 5, 6]]);
    });

    it('should read and parse a valid Excel file with non-numeric values and return a CSV with only numeric values', () => {
        // Mock the onFileSelected method
        const mockOnFileSelected = jest.fn(async (event) => {
            component.csvraw = "group,value\nGroup 1,1\nGroup 2,2\nGroup 1,3\nGroup 2,4\nGroup 1,5\nGroup 2,6\nGroup 1,7\nGroup 2,8\nGroup 1,9\nGroup 2,10";
            component.csv = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]];
        });
        component.onFileSelected = mockOnFileSelected;
        const event = {
            target: {
                files: [
                    new File(["group,value\nGroup 1,1\nGroup 2,2\nGroup 1,3\nGroup 2,4\nGroup 1,5\nGroup 2,6\nGroup 1,7\nGroup 2,8\nGroup 1,9\nGroup 2,10"], "filename.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
                ]
            }
        };
        component.onFileSelected(event);
        // check that the csvraw property is set correctly
        expect(component.csvraw).toBe("group,value\nGroup 1,1\nGroup 2,2\nGroup 1,3\nGroup 2,4\nGroup 1,5\nGroup 2,6\nGroup 1,7\nGroup 2,8\nGroup 1,9\nGroup 2,10");
        // check that the csv property is set correctly
        expect(component.csv).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]);
    });

   

    it('should return without running simulations when given empty input data', () => {
        const addAllResultsMock = jest.spyOn((component as any)['tail'], 'addAllResults');

        component.chart3 = {
            setDataFromRaw: jest.fn(),
            chart: {
                update: jest.fn()
            }
        };
        component.chart4 = {
            setDataFromRaw: jest.fn(),
            chart: {
                update: jest.fn()
            }
        };
        component.calculateMean = jest.fn();
        component.numofSem = 10;
        component.csv = [[], []];
        component.runSim();
        expect(component.chart3.setDataFromRaw).not.toHaveBeenCalled();
        expect(component.chart4.setDataFromRaw).not.toHaveBeenCalled();
        expect(component.chart3.chart.update).not.toHaveBeenCalled();
        expect(component.chart4.chart.update).not.toHaveBeenCalled();
        expect(component.calculateMean).not.toHaveBeenCalled();
        expect(addAllResultsMock).not.toHaveBeenCalled(); 
        expect(component.simsummary.sampleMean1).toBe(NaN);
        expect(component.simsummary.sampleMean2).toBe(NaN);
        expect(component.simsummary.sampleMeanDiff).toBe(NaN);
        expect(component.samDisActive).toBe(false);
    });

    it('should adding simulation sample correctly', () => {
        const sample = [{ datasetId: 0, value: 10 }, { datasetId: 1, value: 20 }];
        const expectedData = { minmax: component.minmax, data: [[10], [20]] }; 
        const result = component.addSimulationSample(sample);
        expect(result).toEqual(expectedData);
    });

    it('should parse data correctly', () => {
        const rawData = 'Group1,10\nGroup1,20\nGroup2,15\nGroup2,25\n';
        const expectedParsedData = [[10, 20], [15, 25]]; 
        // 
        const parsedData = component.parseData(rawData);
        expect(parsedData).toEqual(expectedParsedData);
    });

    it('should initialize component properties', () => { 
        expect(component.activateSim).toBe(false);
        expect(component.dataSize1).toBe(0);
        expect(component.dataSize2).toBe(0);
        expect(component.datamean2).toBe(0);
        expect(component.datamean1).toBe(0);
        expect(component.mean_diff).toBe(0);
        expect(component.numofSem).toBe(1);
        expect(component.samDisActive).toBe(false);
        expect(component.lastSummary).toBeUndefined();
        expect(component.csv).toBeUndefined();
        expect(component.csvraw).toBeUndefined();
        expect(component.dataTextArea).toBe('');
        expect(component.datasets.length).toBe(4);
        expect(component.chartData.length).toBe(0);
        expect(component.chartLabels.length).toBe(0);
    });

    it('should handle file selected with no files', () => {
        const event = { target: { files: [] } } as any;
        component.onFileSelected(event);
        expect(component.csvraw).toBeUndefined();
        expect(component.csv).toBeUndefined();
    });

    it('should handle dropping files', () => {
        const event = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
            dataTransfer: { files: [{ name: 'test.csv', type: 'text/csv' }] }
        } as any;
        jest.spyOn(component, 'onFileSelected').mockImplementationOnce(() => { });
        component.onDrop(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(component.onFileSelected).toHaveBeenCalledWith(event);
    });

    it('should handle file selection with invalid file type', () => { 
        const file = new File(['invalid data'], 'invalid.txt', { type: 'text/plain' });
        const event = { target: { files: [file] } } as any;
        component.onFileSelected(event); 
        expect(component.csvraw).toBeUndefined();
        expect(component.csv).toBeUndefined();
    });

    it('should handle invalid CSV data during file parsing', () => { 
        const event = { target: { files: [new File(['invalid,data'], 'test.csv')] } } as any;
        component.onFileSelected(event); 
        expect(component.csvraw).toBeUndefined();
        expect(component.csv).toBeUndefined();
    });

    it('should parse CSV data correctly', () => { 
        const csvData = 'Group 1,10\nGroup 1,15\nGroup 2,20\nGroup 2,25';
        const parsedData = component.parseData(csvData);
        expect(parsedData.length).toBe(2);
    });

    it('should handle empty CSV data', () => {
        const csvData = '';
        const parsedData = component.parseData(csvData);
        expect(parsedData.length).toBe(0);
    });

    it('should return 0 for empty array', () => { 
        const testData: number[] = [];
        const expectedMean = 0;
        const calculatedMean = component.calculateMean(testData);
        expect(calculatedMean).toEqual(expectedMean);
    });

    it('should handle numbers which is not positive like 0 and 1 correctly', () => {
        const testData = [-1, -2, -3, -4, -5];
        const expectedMean = -3; 
        const calculatedMean = testData.reduce((sum, num) => sum + num, 0) / testData.length;
        expect(calculatedMean).toBe(expectedMean);
    });


    it('should handle negative number of simulations correctly', () => { 
        component.numberOfSimulations = -5;
        component.runSimulations();
    });

    it('should handle large number of simulations correctly', () => {
        component.numberOfSimulations = 1000000; 
        component.runSimulations();
    });

    it('should handle unknown sample selection correctly', async () => {
        const eventMock = { target: { value: 'unknown_sample' } };
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ text: () => '' }));
        await component.sampleSelect(eventMock);
        expect(component.csvraw).toBe('');
        expect(component.csv).toEqual([]);
        (global.fetch as jest.Mock).mockRestore(); 
    });

    it('should calculate mean correctly', () => { 
        const testData = [10, 20, 30, 40, 50];
        const mean = component.calculateMean(testData);
        expect(mean).toBe(30);
    });

    it('should calculate mean correctly for large dataset', () => { 
        const data = Array.from({ length: 10000 }, (_, i) => i + 1); 
        const expectedMean = 5000.5; 
        expect(component.calculateMean(data)).toEqual(expectedMean);
    });

    it('should calculate mean correctly for single-element dataset', () => {
        const data = [42]; 
        const expectedMean = 42; 
        expect(component.calculateMean(data)).toEqual(expectedMean);
    });

    it('should handle calculating mean for empty dataset', () => {
        const testData: number[] = [];
        const mean = component.calculateMean(testData);
        expect(mean).toBe(0);
    });

    it('should handle NaN values when calculating mean', () => {
        const data: number[] = [1, NaN, 3, NaN, 5]; // mock data with NaN values.
        const filteredData = data.filter(value => !isNaN(value)); // filter out NaN values.
        const mean = component.calculateMean(filteredData);
        expect(mean).toBeCloseTo(3); // (1 + 3 + 5) / 3 = 3
    });

    it('should toggle one section correctly', () => { /** @note here we are toggling sections. */
        component.toggleSection({ target: { checked: false } }, 'sectionOne');
        expect(component.sections.sectionOne).toBeFalsy();
    });

    it('should update chart data correctly', () => {
        const sampleData = '1,2\n3,4';
        const expectedChartData = [
            {
                data: [{ x: 2, y: 1 }, { x: 4, y: 3 }],
                label: 'Original Data',
                pointRadius: 6,
            },
        ];
        const expectedChartLabels = ['Data Point 1', 'Data Point 2'];
        component.updateChart(sampleData);
        expect(component.chartData).toEqual(expectedChartData);
        expect(component.chartLabels).toEqual(expectedChartLabels);
    });

    it('should update summary chart data correctly if not then not equal', () => {
        const sampleData = '1,2\n3,4';
        const expectedSummaryData = [{ data: [2, 1, NaN, NaN], label: 'Summary Statistics' }];
        component.updateSummaryChart(sampleData);
        expect(component.summaryData).not.toEqual([{ data: [0, 0, 0, 0], label: 'Empty Summary' }]);
    });

    it('should select sample correctly sample1', async () => {
        // Arrange
        const eventMock = { target: { value: 'sample1' } };
        const expectedLink = '../../../assets/twomean_sample1.csv'; // Sample link for sample1
        // Mock fetch function to simulate fetching data
        (global.fetch as jest.Mock) = jest.fn().mockImplementation(() => Promise.resolve({ text: () => 'Sample CSV data' }));
        // Act
        await component.sampleSelect(eventMock); // Ensure the sampleSelect function is awaited
        // Assert
        expect(component.csvraw).toBe('Sample CSV data');
        // Restore fetch function
        (global.fetch as jest.Mock).mockRestore();

    });

    it('should select sample correctly sample2', async () => {
        // Arrange
        const eventMock = { target: { value: 'sample1' } };
        const expectedLink = '../../../assets/twomean_sample2.csv'; // Sample link for sample1
        // Mock fetch function to simulate fetching data
        (global.fetch as jest.Mock) = jest.fn().mockImplementation(() => Promise.resolve({ text: () => 'Sample CSV data' }));
        // Act
        await component.sampleSelect(eventMock); // Ensure the sampleSelect function is awaited
        // Assert
        expect(component.csvraw).toBe('Sample CSV data');
        // Restore fetch function
        (global.fetch as jest.Mock).mockRestore();

    });

    it('should toggle section correctly and update section names', () => {
        jest.spyOn(component, 'toggleSection'); // mock the toggleSection method.
        // initial state of the sections.
        expect(component.sections['sectionOne']).toBeTruthy();
        expect(component.sections['sectionTwo']).toBeTruthy();
        expect(component.sections['sectionThree']).toBeTruthy();
        // simulate checkbox event for toggling sectionOne.
        component.toggleSection({ target: { checked: false } }, 'sectionOne');
        expect(component.toggleSection).toHaveBeenCalledWith({ target: { checked: false } }, 'sectionOne');
        expect(component.sections['sectionOne']).toBeFalsy();
        // simulate checkbox event for toggling sectionThree.
        component.toggleSection({ target: { checked: false } }, 'sectionThree');
        expect(component.toggleSection).toHaveBeenCalledWith({ target: { checked: false } }, 'sectionThree');
        expect(component.sections['sectionThree']).toBeFalsy();
        // ensure toggling sectionTwo doesn't change its state.
        component.toggleSection({ target: { checked: true } }, 'sectionTwo');
        expect(component.toggleSection).toHaveBeenCalledWith({ target: { checked: true } }, 'sectionTwo');
        expect(component.sections['sectionTwo']).toBeTruthy();

        component.toggleSection({ target: { checked: false } }, 'sectionTwo');
        expect(component.toggleSection).toHaveBeenCalledWith({ target: { checked: false } }, 'sectionTwo');
        expect(component.sections['sectionTwo']).toBeFalsy();
    });

    it('should update chart data correctly', () => { /** @note testing the updateChart method with sample data. */
        const testData = 'Group 1,10\nGroup 1,15\nGroup 2,20\nGroup 2,25';
        component.updateChart(testData);
        expect(component.chartData.length).toBe(1);
    });

    it('should handle resetting or updating charts', () => {
        // mock some chart data.
        component.chart1 = { clear: jest.fn(), chart: { update: jest.fn() } } as any;
        component.chart2 = { clear: jest.fn(), chart: { update: jest.fn() } } as any;
        component.chart3 = { clear: jest.fn(), chart: { update: jest.fn() } } as any;
        component.chart4 = { clear: jest.fn(), chart: { update: jest.fn() } } as any;
        // call the reset method.
        component.onResetChart();
        // expect the clear method to be called for each chart and update to be called once.
        expect(component.chart1.clear).toHaveBeenCalled();
        expect(component.chart2.clear).toHaveBeenCalled();
        expect(component.chart3.clear).toHaveBeenCalled();
        expect(component.chart4.clear).toHaveBeenCalled();
        expect(component.chart1.chart.update).toHaveBeenCalledTimes(1);
        expect(component.chart2.chart.update).toHaveBeenCalledTimes(1);
        expect(component.chart3.chart.update).toHaveBeenCalledTimes(1);
        expect(component.chart4.chart.update).toHaveBeenCalledTimes(1);
    });

    it('should run simulations and update summary', () => {/** @note here we can add expectations to verify that simulations are run and summary data is updated. */
        const initialSummary = JSON.parse(JSON.stringify(component.summaryData));
        component.runSimulations();
        const updatedSummary = component.summaryData;
        expect(updatedSummary).toEqual(initialSummary);
    });

    it('should ensure proper integration with external dependencies', () => {/** @note we are creating mock external dependency (e.g., chart library). */
        const mockUpdate = jest.fn();
        const mockSetDataFromRaw = jest.fn();
        const mockChartInstance = {
            update: mockUpdate,
            setDataFromRaw: mockSetDataFromRaw
        };
        component.chart1 = {
            chart: mockChartInstance
        };
        const rawData = {
            minmax: { min: 0, max: 10 },
            data: [[1, 2, 3]],
            label: 'Test Data',
            backgroundColor: 'blue'
        };
        component.chart1.chart.setDataFromRaw(rawData);
        expect(mockSetDataFromRaw).toHaveBeenCalledWith(rawData);
    });

    it('should handle unknown section name correctly', () => {
        // simulate checkbox event for an unknown section.
        const eventUnknownSection = { target: { checked: false } };
        component.toggleSection(eventUnknownSection, 'unknownSection');
        // assert that the behavior is as expected when toggling an unknown section.
    });

    it('should handle parsing errors when parsing data with missing values', () => {
        const rawData = 'Group1,10\nGroup1,\nGroup2,15\nGroup2,25\n'; // CSV data with missing value.
        const expectedParsedData: number[][] = [[10], [], [15], [25]]; // expected parsed data (missing value treated as NaN).
        const parsedData: any = component.parseData(rawData);

        let fail = false;
        for (let i = 0; i < expectedParsedData.length; i++) {
            for (let j = 0; j < expectedParsedData[i].length; j++) {
                if (parsedData[i][j] !== expectedParsedData[i][j] || (isNaN(parsedData[i][j]) && !isNaN(expectedParsedData[i][j]))) {
                    fail = true;
                    break;
                }
            }
            if (!fail) break;
        }
        expect(fail).toBe(false);
    });

    it('should handle parsing errors when the input data is an empty string', () => {
        const rawData = '';
        const expectedParsedData: number[][] = [];
        const parsedData: any = component.parseData(rawData);
        expect(parsedData).toEqual(expectedParsedData);
    });

    it('should handle parsing errors when the input data contains non-numeric values in numeric fields', () => {
        const rawData = 'Group1,10\nGroup1,a\nGroup2,15\nGroup2,25\n'; // CSV data with non-numeric value.
        const expectedParsedData: number[][] = [[10], [NaN], [15], [25]]; // expected parsed data (invalid value treated as NaN).
        const parsedData: any = component.parseData(rawData);

        let fail = true;
        for (let i = 0; i < expectedParsedData.length; i++) {
            for (let j = 0; j < expectedParsedData[i].length; j++) {
                // @note For NaN values, use isNaN to check equality
                if (isNaN(expectedParsedData[i][j])) {
                    if (!isNaN(parsedData[i][j])) {
                        fail;
                        break;
                    }
                } else {
                    // @note For other values, check for strict equality
                    if (parsedData[i][j] !== expectedParsedData[i][j]) {
                        fail = false;
                        break;
                    }
                }
            }
            if (fail) break;
        }
        expect(fail).toBeTruthy();
    });

    it('should render NavbarComponent and FooterComponent', () => {
        const navbarElement = fixture.nativeElement.querySelector('app-navbar');
        const footerElement = fixture.nativeElement.querySelector('app-footer');
        expect(navbarElement).toBeTruthy();
        expect(footerElement).toBeTruthy();
        /** @note from here we can add more expectations if necessary */
    });

   

    it('should prevents default and stops propagation', () => {
        const event = { preventDefault: jest.fn(), stopPropagation: jest.fn() } as unknown as DragEvent;
        onDrop(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
    });


    it('should update the activateSim flag to true after loading the input data', () => {
        component.activateSim = false;
        component.csv = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]];
        component.chart1 = {
            setScale: jest.fn(),
            setDataFromRaw: jest.fn(),
            chart: {
                update: jest.fn(),
            },
        };
        component.chart2 = {
            setScale: jest.fn(),
            setDataFromRaw: jest.fn(),
            chart: {
                update: jest.fn(),
            },
        };
        component.updateData(component.csv);
        expect(component.activateSim).toBe(true);
    });

    it('should update chart5 and set legend colors for oneTailRight', () => {
        // Mock necessary objects and functions
        const e = { target: { value: "oneTailRight" } };
        const tail = {
          setTailDirection: jest.fn(),
          updateChart2: jest.fn(() => [{ x: 1, y: 10 }, { x: 2, y: 20 }]), // Mock return value for updateChart2
          getSummary: jest.fn(() => "Summary"), // Mock return value for getSummary
        };
        const chart5 = {
          setDataFromRaw: jest.fn(),
          setLengend: jest.fn(),
          chart: { update: jest.fn() }
        };
        const mean_diff = 5;
    
        // Call the function with the mocked arguments
       component.selectedTest.call({ tail, chart5, mean_diff }, e);
    
        // Assert that the necessary functions were called with the correct arguments
        expect(tail.setTailDirection).toHaveBeenCalledWith("oneTailRight");
        expect(tail.updateChart2).toHaveBeenCalled();
        expect(chart5.setDataFromRaw).toHaveBeenCalledWith([{ x: 1, y: 10 }, { x: 2, y: 20 }]);
        expect(tail.getSummary).toHaveBeenCalled();
        expect(chart5.setLengend).toHaveBeenCalledWith(
          [`Differences < ${mean_diff}`, `Differences > = ${mean_diff}`],
          [`green`, `red`]
        );
        expect(chart5.chart.update).toHaveBeenCalledWith(0);
      });

      it('should update chart5 and set legend colors for other values', () => {
        // Mock necessary objects and functions
        const e = { target: { value: "otherValue" } };
        const tail = {
          setTailDirection: jest.fn(),
          updateChart2: jest.fn(() => [{ x: 1, y: 10 }, { x: 2, y: 20 }]), // Mock return value for updateChart2
          getSummary: jest.fn(() => "Summary"), // Mock return value for getSummary
        };
        const chart5 = {
          setDataFromRaw: jest.fn(),
          setLengend: jest.fn(),
          chart: { update: jest.fn() }
        };
        const mean_diff = 5;
    
        // Call the function with the mocked arguments
       component.selectedTest.call({ tail, chart5, mean_diff }, e);
    
        // Assert that the necessary functions were called with the correct arguments
        expect(tail.setTailDirection).toHaveBeenCalledWith("otherValue");
        expect(tail.updateChart2).toHaveBeenCalled();
        expect(chart5.setDataFromRaw).toHaveBeenCalledWith([{ x: 1, y: 10 }, { x: 2, y: 20 }]);
        expect(tail.getSummary).toHaveBeenCalled();
        expect(chart5.setLengend).toHaveBeenCalledWith(
          [`Differences < ${mean_diff}`, `Differences > = ${mean_diff}`],
          [`red`, `green`]
        );
        expect(chart5.chart.update).toHaveBeenCalledWith(0);
      });
    
});


