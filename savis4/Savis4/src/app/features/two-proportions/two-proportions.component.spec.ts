import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TwoProportionsComponent } from './two-proportions.component';

import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { LanguageSwitcherComponent } from 'src/app/components/language-switcher/language-switcher.component';
import { AppFirebaseModule } from 'src/app/app-firebase.module';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Sampling } from 'src/app/Utils/sampling';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';
import { MathService } from 'src/app/Utils/math.service';

describe('TwoProportionsComponent', () => {
    let component: TwoProportionsComponent;
    let cdrMock: ChangeDetectorRef;
    let samplingMock: Sampling;
    let translateServiceMock: TranslateService;
  
    beforeEach(() => {
      // Create mocks for dependencies
      cdrMock = {} as ChangeDetectorRef;
      samplingMock = {} as Sampling;
      translateServiceMock = { instant: jest.fn() } as any;
  
      // Initialize the component with mocked dependencies
      component = new TwoProportionsComponent(cdrMock, samplingMock, translateServiceMock);
    });
  
  


     it('should correctly round to specified decimal places', () => {
          // Test rounding to 2 decimal places
          expect(component.roundToPlaces(3.14159, 2)).toBeCloseTo(3.14);
          expect(component.roundToPlaces(10.12345, 2)).toBeCloseTo(10.12);
          expect(component.roundToPlaces(0.123456, 2)).toBeCloseTo(0.12);
      
          // Test rounding to 3 decimal places
          expect(component.roundToPlaces(1.234567, 3)).toBeCloseTo(1.235);
          expect(component.roundToPlaces(99.9999, 3)).toBeCloseTo(100);
          expect(component.roundToPlaces(0.99999, 3)).toBeCloseTo(1);
        });

    it('should correctly split the iterable based on the predicate function', () => {

      const iterable = [1, 2, 3, 4, 5];
      const isEven = (num: number) => num % 2 === 0;

      const result = component.splitByPredicate(iterable,isEven);
      console.log(result.chosen);
      console.log(result.unchosen);
  
      expect(result.chosen).toEqual([2, 4]);
  
      expect(result.unchosen).toEqual([1, 3, 5]);
    });
  
    it('should handle null predicate by returning the iterable as unchosen', () => {
      
      const iterable = [1, 2, 3, 4, 5];
      const nullPredicate: (num: number) => boolean = null;
  
     
      const result = component.splitByPredicate(iterable, nullPredicate);
  
      
      expect(result.chosen).toEqual([]);
  
      
      expect(result.unchosen).toEqual([1, 2, 3, 4, 5]);
    });
 

  
    it('should correctly update properties with calculated proportions', () => {
        // Set up test data
        const totalChosen = 10;
        const totalUnchosen = 5;
        const totalSamples = 50;
    
        // Create a mock component instance with necessary properties and methods
        const mockcomponent = {
          simulations: Array(totalSamples), // Create an array of length totalSamples
          totalsamples_chart3: totalSamples,
          extremediff_chart3: '',
          propextremediff_chart3: '',
          updateInfoSampleProp: component.updateInfoSampleProp, // Assign the method directly to the mock component
        };
    
        // Call the method with the test data
        mockcomponent.updateInfoSampleProp(totalChosen, totalUnchosen);
    
        // Calculate expected proportions
        const proportionChosen = MathService.roundToPlaces(totalChosen / totalSamples, 4);
        const proportionUnchosen = MathService.roundToPlaces(totalUnchosen / totalSamples, 4);
    
        // Assert that the properties are updated with the expected values
        expect(mockcomponent.extremediff_chart3).toBe('40'); // Assuming this.simulations.length is 50
        expect(mockcomponent.propextremediff_chart3).toBe(`${totalChosen} / ${totalSamples} = ${proportionChosen}`);
      });

      it('should return the correct predicate function when both limits are inclusive', () => {
        // Set up test data
        const left = 3;
        const right = 7;
        const includeValMin = true;
        const includeValMax = true;
    
        // Call the method with the test data
        const predicate = component.predicateForTail(left, right, includeValMin, includeValMax);
    
        // Assert the returned predicate function
        expect(predicate(3)).toBe(true);
        expect(predicate(5)).toBe(true);
        expect(predicate(7)).toBe(true);
        expect(predicate(2)).toBe(false);
        expect(predicate(8)).toBe(false);
      });

      it('should return the correct predicate function when only min limit is inclusive', () => {
        // Set up test data
        const left = 3;
        const right = 7;
        const includeValMin = true;
        const includeValMax = false;
    
        // Call the method with the test data
        const predicate = component.predicateForTail(left, right, includeValMin, includeValMax);
    
        // Assert the returned predicate function
        expect(predicate(3)).toBe(true);
        expect(predicate(5)).toBe(true);
        expect(predicate(7)).toBe(false);
        expect(predicate(2)).toBe(false);
        expect(predicate(8)).toBe(false);
      });
    
      it('should return the correct predicate function when only max limit is inclusive', () => {
        // Set up test data
        const left = 3;
        const right = 7;
        const includeValMin = false;
        const includeValMax = true;
    
        // Call the method with the test data
        const predicate = component.predicateForTail(left, right, includeValMin, includeValMax);
    
        // Assert the returned predicate function
        expect(predicate(3)).toBe(false);
        expect(predicate(5)).toBe(true);
        expect(predicate(7)).toBe(true);
        expect(predicate(2)).toBe(false);
        expect(predicate(8)).toBe(false);
      });
    
      it('should return the correct predicate function when both limits are exclusive', () => {
        // Set up test data
        const left = 3;
        const right = 7;
        const includeValMin = false;
        const includeValMax = false;
    
        // Call the method with the test data
        const predicate = component.predicateForTail(left, right, includeValMin, includeValMax);
    
        // Assert the returned predicate function
        expect(predicate(3)).toBe(false);
        expect(predicate(5)).toBe(true);
        expect(predicate(7)).toBe(false);
        expect(predicate(2)).toBe(false);
        expect(predicate(8)).toBe(false);
    });

});  