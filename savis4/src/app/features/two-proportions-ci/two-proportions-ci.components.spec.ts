import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { TwoProportionsCIComponent } from './two-proportions-ci.component';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('TwoProportionsCIComponent', () => {
  let component: TwoProportionsCIComponent;
  let fixture: ComponentFixture<TwoProportionsCIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TwoProportionsCIComponent,
        NavbarComponent,
        FooterComponent,
      ],
      imports: [
        FormsModule,
        TranslateModule.forRoot(),
        AppFirebaseModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoProportionsCIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('loadData()', () => {
    beforeEach(() => {
      component.resetLastChart = jest.fn();
      global.alert = jest.fn();
      component.setProportions = jest.fn();
      component.chart1.update = jest.fn();
      component.chart2.update = jest.fn();
    });
    it('should reset charts and show alert if any input is <= 0', () => {
      // Set some input values <= 0
      component.numASuccesses = 0;
      component.numAFailures = 1;
      component.numBSuccesses = 1;
      component.numBFailures = 1;

      // Call the method
      component.loadData();

      // Check that alert was called with the correct message
      expect(global.alert).toHaveBeenCalledWith(
        component.translate.instant('tpci_alert')
      );

      // Check that resetLastChart was called
      expect(component.resetLastChart).not.toHaveBeenCalled();

      // Check that setProportions and update were not called for chart1 and chart2
      expect(component.setProportions).not.toHaveBeenCalled();
      expect(component.chart1.update).not.toHaveBeenCalled();
      expect(component.chart2.update).not.toHaveBeenCalled();
    });

    it('should update charts with correct proportions', () => {
      // Set some input values > 0
      component.numASuccesses = 10;
      component.numAFailures = 5;
      component.numBSuccesses = 8;
      component.numBFailures = 7;

      // Call the method
      component.loadData();

      // Check that setProportions was called with the correct arguments for chart1
      expect(component.setProportions).toHaveBeenCalledWith(component.chart1, {
        numASuccess: 10,
        numAFailures: 5,
        numBSuccesses: 8,
        numBFailures: 7,
      });

      // Check that update was called for chart1
      expect(component.chart1.update).toHaveBeenCalled();

      // Check that setProportions was called with the correct arguments for chart2
      expect(component.setProportions).toHaveBeenCalledWith(component.chart2, {
        numASuccess: 0,
        numAFailures: 0,
        numBSuccesses: 0,
        numBFailures: 0,
      });

      // Check that update was called for chart2
      expect(component.chart2.update).toHaveBeenCalled();
    });
  });

  describe('samplePlot()', () => {
    it('should correctly calculate sample properties', () => {
      // Mock dependencies
      component.shuffle = jest.fn(() => [1, 0, 1, 1, 0, 1, 0, 0, 1, 1]);
      component.randomSubset = jest.fn(() => ({
        chosen: [1, 0, 1, 1, 0],
        unchosen: [],
      }));

      // Call the method with sample inputs
      const result = component.samplePot(10, 6, 5);

      // Check the result
      expect(result).toEqual({
        successes: 3, // 3 successes in the chosen subset
        failures: 2, // 5 - 3 successes
        sampleSize: 5, // sampleSize parameter
        prop: 0.6, // 3 successes / 5 sampleSize
      });

      // Check that shuffle was called with the correct array length
      expect(component.shuffle).toHaveBeenCalled();

      // Check that randomSubset was called with the correct shuffled array and sample size
      expect(component.randomSubset).toHaveBeenCalled();
    });
  });

  describe('runSimulation()', () => {
    beforeEach(() => {
      component.setProportions = jest.fn();
      component.updateLastChart = jest.fn();
      component.chart2.update = jest.fn();
    });
    it('should perform simulations and update charts correctly', () => {
      // Mock samplePot method to return fixed values for the sake of testing
      component.samplePot = jest.fn((totalGroup, success, sampleSize) => ({
        successes: success,
        failures: sampleSize - success,
        sampleSize: sampleSize,
        prop: success / sampleSize,
      }));

      // Set some initial values
      component.numSimulations = 3;
      component.numASuccesses = 10;
      component.numAFailures = 5;
      component.numBSuccesses = 8;
      component.numBFailures = 7;
      component.factor = 1;

      // Call the method
      component.runSimulation();

      // Check if samplePot was called twice with correct arguments for group A
      expect(component.samplePot).toHaveBeenCalledWith(15, 10, 15);
      // Check if samplePot was called twice with correct arguments for group B
      expect(component.samplePot).toHaveBeenCalledWith(15, 8, 15);

      // Check if simulations array is populated correctly
      expect(component.simulations).toEqual([
        0.1333333333333333, +0.1333333333333333, +0.1333333333333333,
      ]);

      // Check if setProportions was called with correct arguments
      expect(component.setProportions).toHaveBeenCalledWith(component.chart2, {
        numASuccess: 10,
        numAFailures: 5,
        numBSuccesses: 8,
        numBFailures: 7,
      });

      // Check if properties are updated correctly
      expect(component.simAFailures).toEqual(5);
      expect(component.simASuccesses).toEqual(10);
      expect(component.simBFailures).toEqual(7);
      expect(component.simBSuccesses).toEqual(8);
      expect(component.simulationProportionGroupA).toEqual(
        '0.6666666666666666'
      );
      expect(component.simulationProportionGroupB).toEqual(
        '0.5333333333333333'
      );
      expect(component.simulationDifferenceProportions).toEqual(
        '0.1333333333333333'
      );
      expect(component.simMean).toEqual('0.1333333333333333');
      expect(component.simStdDev).toEqual('0');
      expect(component.simTotal).toEqual('3');

      // Check if updateLastChart was called
      expect(component.updateLastChart).toHaveBeenCalled();

      // Check if chart2.update() was called
      expect(component.chart2.update).toHaveBeenCalled();
    });
  });

  describe('updateLastChart()', () => {
    beforeEach(() => {
      component.getCutOffInterval = jest.fn(() => [1, 4]); // Mock cutoff interval
      component.splitUsing = jest.fn((arr, callback) => {
        const chosen = arr.filter(callback);
        const unchosen = arr.filter((val: any) => !callback(val));
        return [chosen, unchosen];
      });
      component.setScale = jest.fn();
      component.setDataFromRaw = jest.fn();
      component.setScale = jest.fn();
      component.setDataFromRaw = jest.fn();
      component.chart3.update = jest.fn();

      component.getCutOffInterval = jest.fn(() => {
        return [0, 0];
      });
    });
    it('should update last chart correctly', () => {
      // Mock confidenceLevel and simulations array
      component.confidenceLevel = 0.95; // Mock confidence level
      component.simulations = [0.1, 0.2, 0.3, 0.4, 0.5]; // Mock simulations array

      // Call the method
      component.updateLastChart();

      // Check if getCutOffInterval was called with correct arguments
      expect(component.getCutOffInterval).toHaveBeenCalledWith(
        0.95,
        component.simulations.length
      );

      // Check if splitUsing was called with correct arguments
      expect(component.splitUsing).toHaveBeenCalledWith(
        component.simulations,
        expect.any(Function)
      );

      // Check if setScale was called with correct arguments
      expect(component.setScale).toHaveBeenCalledWith(
        component.chart3,
        0.1,
        0.5
      );

      // Check if setDataFromRaw was called with correct arguments
      expect(component.setDataFromRaw).toHaveBeenCalled();

      // Check if chart3.update was called
      expect(component.chart3.update).toHaveBeenCalled();

      // Check if properties are set correctly
      expect(component.lowerBound).toEqual('0.1');
      expect(component.upperBound).toEqual('0.1');
    });

    it('should not update last chart if confidence level is 0', () => {
      // Mock confidenceLevel as 0
      component.confidenceLevel = 0;
      component.updateLastChart();

      // Check if getCutOffInterval was not called
      expect(component.getCutOffInterval).not.toHaveBeenCalled();

      // Check if chart3.update was not called
      expect(component.chart3.update).not.toHaveBeenCalled();
    });
  });

  describe('resetLastChart()', () => {
    it('should reset last chart correctly', () => {
      component.chart3.update = jest.fn();
      // Mock simulations array
      component.simulations = [0.1, 0.2, 0.3, 0.4, 0.5];

      // Call the method
      component.resetLastChart();

      // Check if chart3 data datasets are cleared
      expect(component.chart3.data.datasets[0].data).toEqual([]);
      expect(component.chart3.data.datasets[1].data).toEqual([]);

      // Check if confidenceLevel is set to 95
      expect(component.confidenceLevel).toEqual(95);

      // Check if simulations array is cleared
      expect(component.simulations).toEqual([]);

      // Check if chart3.update was called
      expect(component.chart3.update).toHaveBeenCalled();
    });
  });

  describe('setProprotions()', () => {
    it('should set proportions correctly for the given chart', () => {
      // Mock chart object
      const chart = {
        data: {
          datasets: [{ data: [0, 0] }, { data: [0, 0] }],
        },
      };

      // Mock input values
      const inputValues = {
        numASuccess: 10,
        numAFailures: 5,
        numBSuccesses: 8,
        numBFailures: 7,
      };

      // Call the method
      component.setProportions(chart, inputValues);

      // Calculate total values
      const totalInA = inputValues.numASuccess + inputValues.numAFailures;
      const totalInB = inputValues.numBSuccesses + inputValues.numBFailures;

      // Calculate proportions
      const proportionA = (100 * inputValues.numASuccess) / totalInA;
      const proportionB = (100 * inputValues.numBSuccesses) / totalInB;
      const proportionAFailures = (100 * inputValues.numAFailures) / totalInA;
      const proportionBFailures = (100 * inputValues.numBFailures) / totalInB;

      // Check if proportions are set correctly in the chart
      expect(chart.data.datasets[0].data[0]).toEqual(proportionA);
      expect(chart.data.datasets[0].data[1]).toEqual(proportionB);
      expect(chart.data.datasets[1].data[0]).toEqual(proportionAFailures);
      expect(chart.data.datasets[1].data[1]).toEqual(proportionBFailures);
    });
  });

  describe('shuffle()', () => {
    it('should shuffle the array', () => {
      // Input array
      const arr = [1, 2, 3, 4, 5];

      // Call the method
      const shuffledArr = component.shuffle(arr);

      // Check if the length of the shuffled array is the same as the original array
      expect(shuffledArr.length).toEqual(arr.length);

      // Check if the shuffled array contains the same elements as the original array
      arr.forEach((element) => {
        expect(shuffledArr).toContain(element);
      });

      // Check if the shuffled array is different from the original array
      expect(shuffledArr).not.toEqual(arr);
    });

    it('should not modify the original array', () => {
      // Input array
      const arr = [1, 2, 3, 4, 5];

      // Clone the array
      const originalArrClone = arr.slice();

      // Call the method
      component.shuffle(arr);

      // Check if the original array remains unchanged
      expect(arr).toEqual(originalArrClone);
    });
  });

  describe('randomInt', () => {
    it('should generate random integers within the specified range', () => {
      // Call the method multiple times and check if the generated integers fall within the expected range
      for (let i = 0; i < 100; i++) {
        const randomNum = component.randomInt(1, 10);
        expect(randomNum).toBeGreaterThanOrEqual(1);
        expect(randomNum).toBeLessThanOrEqual(10);
      }
    });

    it('should return "from" value if "from" and "to" are equal', () => {
      // If "from" and "to" are equal, the method should return the same value
      const randomNum = component.randomInt(5, 5);
      expect(randomNum).toEqual(5);
    });

    it('should return "from" value if "to" is less than "from"', () => {
      // If "to" is less than "from", the method should return the "from" value
      const randomNum = component.randomInt(10, 5);
      expect(randomNum).toBeGreaterThanOrEqual(5);
      expect(randomNum).toBeLessThanOrEqual(10);
    });
  });

  describe('randomSubset()', () => {
    it('should select a random subset of elements from the input iterable', () => {
      // Input iterable
      const itr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      // Call the method
      const { chosen, unchosen } = component.randomSubset(itr, 3);

      // Check if the chosen elements are part of the input iterable
      chosen.forEach((element) => {
        expect(itr).toContain(element);
      });

      // Check if the unchosen elements are part of the input iterable
      unchosen.forEach((element) => {
        expect(itr).toContain(element);
      });

      // Check if the chosen elements are different from the unchosen elements
      chosen.forEach((element) => {
        expect(unchosen).not.toContain(element);
      });

      // Check if the number of chosen elements is equal to the specified size
      expect(chosen.length).toEqual(3);
    });

    it('should throw an error if the input iterable has fewer elements than the specified size', () => {
      // Input iterable with fewer elements than the specified size
      const itr = [1, 2];

      // Call the method and expect it to throw an error
      expect(() => {
        component.randomSubset(itr, 3);
      }).toThrow('not enough elements');
    });
  });

  describe('countWhere()', () => {
    it('should count the elements that satisfy the predicate', () => {
      // Input iterable
      const itr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      // Predicate function to check if the element is even
      const isEven = (num: number) => num % 2 === 0;

      // Call the method
      const count = component.countWhere(itr, isEven);

      // Check if the count is correct
      expect(count).toEqual(5); // There are 5 even numbers in the input iterable
    });

    it('should throw an error if either input parameter is missing', () => {
      // Call the method with undefined parameters and expect it to throw an error
      expect(() => {
        component.countWhere(undefined, undefined);
      }).toThrow('Missing parameter');

      expect(() => {
        component.countWhere([1, 2, 3], undefined);
      }).toThrow('Missing parameter');

      expect(() => {
        component.countWhere(undefined, () => true);
      }).toThrow('Missing parameter');
    });
  });

  describe('mean()', () => {
    it('should calculate the mean of the elements in the input iterable', () => {
      // Input iterable
      const itr = [1, 2, 3, 4, 5];

      // Call the method
      const mean = component.mean(itr);

      // Calculate the expected mean
      const expectedMean = (1 + 2 + 3 + 4 + 5) / 5; // (sum of elements) / (number of elements)

      // Check if the calculated mean matches the expected value
      expect(mean).toEqual(expectedMean);
    });

    it('should return NaN if the input iterable is empty', () => {
      // Input iterable
      const itr: any[] = [];

      // Call the method
      const mean = component.mean(itr);

      // Check if the result is NaN
      expect(mean).toBeNaN();
    });
  });

  describe('stddev()', () => {
    it('should calculate the standard deviation of the elements in the input iterable', () => {
      // Input iterable
      const itr = [1, 2, 3, 4, 5];

      // Call the method
      const stddev = component.stddev(itr);

      // Calculate the expected standard deviation manually
      const mean = (1 + 2 + 3 + 4 + 5) / 5; // Mean of the elements
      const variance =
        ((1 - mean) ** 2 +
          (2 - mean) ** 2 +
          (3 - mean) ** 2 +
          (4 - mean) ** 2 +
          (5 - mean) ** 2) /
        5; // Variance
      const expectedStdDev = Math.sqrt(variance); // Square root of the variance

      // Check if the calculated standard deviation matches the expected value
      expect(stddev).toEqual(expectedStdDev);
    });

    it('should return NaN if the input iterable is empty', () => {
      // Input iterable
      const itr: any[] = [];

      // Call the method
      const stddev = component.stddev(itr);

      // Check if the result is NaN
      expect(stddev).toBeNaN();
    });
  });

  describe('variance()', () => {
    it('should calculate the standard deviation of the elements in the input iterable', () => {
      // Input iterable
      const itr = [1, 2, 3, 4, 5];

      // Call the method
      const stddev = component.stddev(itr);

      // Calculate the expected standard deviation manually
      const mean = (1 + 2 + 3 + 4 + 5) / 5; // Mean of the elements
      const variance =
        ((1 - mean) ** 2 +
          (2 - mean) ** 2 +
          (3 - mean) ** 2 +
          (4 - mean) ** 2 +
          (5 - mean) ** 2) /
        5; // Variance
      const expectedStdDev = Math.sqrt(variance); // Square root of the variance

      // Check if the calculated standard deviation matches the expected value
      expect(stddev).toEqual(expectedStdDev);
    });

    it('should return NaN if the input iterable is empty', () => {
      // Input iterable
      const itr: any[] = [];

      // Call the method
      const stddev = component.stddev(itr);

      // Check if the result is NaN
      expect(stddev).toBeNaN();
    });
  });

  describe('getCutoffInterval()', () => {
    it('should calculate the lower and upper bounds of the confidence interval', () => {
      // Test cases: confidence level and total size pairs
      const testCases = [
        { confidenceLevel: 95, totalSize: 100 },
        { confidenceLevel: 99, totalSize: 50 },
        { confidenceLevel: 90, totalSize: 200 },
      ];

      // Iterate through test cases
      testCases.forEach((testCase) => {
        // Destructure test case
        const { confidenceLevel, totalSize } = testCase;

        // Call the method
        const [lowerBound, upperBound] = component.getCutOffInterval(
          confidenceLevel,
          totalSize
        );

        // Calculate expected values
        const alpha2 = (1 - confidenceLevel / 100) / 2;
        const expectedLowerBound = Math.floor(alpha2 * totalSize);
        const expectedUpperBound = Math.floor(totalSize - alpha2 * totalSize);

        // Check if the calculated bounds match the expected values
        expect(lowerBound).toEqual(expectedLowerBound);
        expect(upperBound).toEqual(expectedUpperBound);
      });
    });
  });

  describe('splitUsing', () => {
    it('should split the input iterable into two arrays based on the callback function', () => {
      // Input iterable
      const itr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      // Callback function to categorize elements (even numbers)
      const callback = (num: number) => num % 2 === 0;

      // Call the method
      const [chosen, unchosen] = component.splitUsing(itr, callback);

      // Check if chosen contains only even numbers and unchosen contains only odd numbers
      chosen.forEach((element) => {
        expect(element % 2).toEqual(0);
      });

      unchosen.forEach((element) => {
        expect(element % 2).toEqual(1);
      });
    });

    it('should return empty arrays if the input iterable is empty', () => {
      // Input iterable
      const itr: any[] = [];

      // Callback function (arbitrary)
      const callback = (obj: number) => obj > 5;

      // Call the method
      const [chosen, unchosen] = component.splitUsing(itr, callback);

      // Check if chosen and unchosen arrays are empty
      expect(chosen).toEqual([]);
      expect(unchosen).toEqual([]);
    });
  });

  describe('setScale', () => {
    let chart: any;
    beforeEach(() => {
      chart = {
        options: {
          scales: {
            xAxes: [{ ticks: { min: 0, max: 10 } }],
          },
        },
      };
    });
    it('should set the scale of the x-axis ticks correctly', () => {
      // Call the method

      component.setScale(chart, 5, 15);

      // Check if the minimum and maximum values of the x-axis ticks are updated as expected
      expect(chart.options.scales.xAxes[0].ticks.min).toEqual(5);
      expect(chart.options.scales.xAxes[0].ticks.max).toEqual(16); // Expected ceil(15) + 1
    });

    it('should set the minimum value to 0 if start is less than 0', () => {
      // Call the method with negative start value
      component.setScale(chart, -5, 15);

      // Check if the minimum value is set to 0
      expect(chart.options.scales.xAxes[0].ticks.min).toEqual(-5);
    });
  });

  describe('rawToScatter()', () => {
    it('should convert raw data arrays into scatter plot data arrays', () => {
      // Input raw data arrays
      const arrs = [
        [1, 1, 2, 3, 3, 3],
        [2, 2, 3, 3, 4, 4],
      ];

      // Call the method
      const faceted = component.rawToScatter(arrs);

      // Expected scatter plot data arrays
      const expectedFaceted = [
        [
          { x: 1, y: 1 },
          { x: 1, y: 2 },
          { x: 2, y: 1 },
          { x: 3, y: 1 },
          { x: 3, y: 2 },
          { x: 3, y: 3 },
        ],
        [
          { x: 2, y: 2 },
          { x: 2, y: 3 },
          { x: 3, y: 4 },
          { x: 3, y: 5 },
          { x: 4, y: 1 },
          { x: 4, y: 2 },
        ],
      ];

      // Check if the generated scatter plot data arrays match the expected values
      expect(faceted).toEqual(expectedFaceted);
    });

    it('should handle empty arrays gracefully', () => {
      // Input raw data arrays with empty arrays
      const arrs: any[] = [[], []];

      // Call the method
      const faceted = component.rawToScatter(arrs);

      // Check if the result is an array of empty arrays
      expect(faceted).toEqual([[], []]);
    });
  });

  describe('scaleToStackDots', () => {
    let chart: any;
    beforeEach(() => {
      chart = {
        data: {
          datasets: [
            {
              data: [
                { x: 1, y: 5 },
                { x: 2, y: 10 },
                { x: 3, y: 15 },
              ],
            },
            {
              data: [
                { x: 1, y: 8 },
                { x: 2, y: 12 },
                { x: 3, y: 18 },
              ],
            },
          ],
        },
        options: {
          scales: {
            yAxes: [{ ticks: { stepSize: 1, min: 0 } }],
          },
        },
      };
    });

    it('should adjust the scale of the y-axis ticks correctly', () => {
      // Call the method
      component.scaleToStackDots(chart);

      // Check if the stepSize of y-axis ticks is adjusted based on the maximum value
      expect(chart.options.scales.yAxes[0].ticks.stepSize).toEqual(4); // max = 18, stepSize = ceil(18 * 0.2) = 4
    });

    it('should set minimum y-axis value to 0 if max value exceeds 1000', () => {
      // Add a data point with a value greater than 1000
      chart.data.datasets[0].data.push({ x: 4, y: 1200 });

      // Call the method
      component.scaleToStackDots(chart);

      // Check if the minimum y-axis value is set to 0
      expect(chart.options.scales.yAxes[0].ticks.min).toEqual(0);
    });
  });

  describe('setDataFromRaw', () => {
    let chart: any;
    beforeEach(() => {
      chart = {
        data: {
          datasets: [{ data: [] }, { data: [] }],
        },
      };
    });
    it('should set data for each dataset based on raw data arrays', () => {
      // Raw data arrays
      const rawDataArrays = [
        [1, 2, 3],
        [4, 5, 6],
      ];

      // Call the method
      component.setDataFromRaw(chart, rawDataArrays);

      // Expected scatter plot data arrays
      const expectedScatterArrays = [
        [
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 3, y: 1 },
        ],
        [
          { x: 4, y: 1 },
          { x: 5, y: 1 },
          { x: 6, y: 1 },
        ],
      ];

      // Check if the data arrays for each dataset are set correctly
      for (let idx = 0; idx < rawDataArrays.length; idx++) {
        expect(chart.data.datasets[idx].data).toEqual(
          expectedScatterArrays[idx]
        );
      }
    });
  });
});
