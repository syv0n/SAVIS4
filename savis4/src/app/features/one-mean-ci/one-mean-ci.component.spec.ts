import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OneMeanCIComponent } from './one-mean-ci.component';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { MathService } from 'src/app/Utils/math.service';
import { SamplingService} from 'src/app/Utils/sampling.service';
describe('OneMeanCIComponent', () => {
    let component: OneMeanCIComponent;
  let fixture: ComponentFixture<OneMeanCIComponent>;
    let mockTranslate: TranslateModule;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OneMeanCIComponent],
            imports: [FormsModule, ChartsModule, TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OneMeanCIComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
        // hi
    it('should have initial values set correctly', () => {
        expect(component.minInterValInput).toBe(0);
        expect(component.maxInterValInput).toBe(0);
        expect(component.csvRaw).toBeUndefined();
        expect(component.includeValMin).toBe(false);
        expect(component.includeValMax).toBeUndefined();
        expect(component.coverageDataDisplay).toBe('');
        expect(component.sampleSize).toBe(10);
        expect(component.noOfSim).toBe(1);
        expect(component.sampleStds).toEqual([]);
        expect(component.csvTextArea).toBe('');
        expect(component.inputDataArray).toEqual([]);
        expect(component.lowerBound).toEqual([]);
        expect(component.upperBound).toEqual([]);
        expect(component.sampleDataArray).toEqual([]);
        expect(component.min).toBe(0);
        expect(component.max).toBe(1);
        expect(component.confidenceIntervalCount).toBe(0);
        expect(component.confidenceIntervalCountNot).toBe(0);
        expect(component.sampleMeans).toEqual([]);
        expect(component.sampleMeansChartLabel).toBe('');
        expect(component.scaleChart).toEqual([]);
        expect(component.inputDataSize).toBeNaN();
        expect(component.sampleMeansSize).toBeNaN();
        expect(component.inputDataDisplay).toBe('');
        expect(component.sampleDataDisplay).toBe('');
        expect(component.sampleMeansDisplay).toBe('');
        expect(component.inputDataMean).toBeNaN();
        expect(component.sampleDataMean).toBeNaN();
        expect(component.sampleMeansMean).toBeNaN();
        expect(component.inputDataStd).toBeNaN();
        expect(component.sampleDataStd).toBeNaN();
        expect(component.sampleMeansStd).toBeNaN();
        expect(component.sampleMeansChosen).toBeNaN();
        expect(component.sampleMeansUnchosen).toBeNaN();
        expect(component.meanSymbol).toBe('μ');
        expect(component.stdSymbol).toBe('σ');
        expect(component.sizeSymbol).toBe('n');
        expect(component.disabledInput).toBe(true);
        expect(component.sampleMeanDisabled).toBe(true);
        expect(component.showInputForm).toBe(true);
        expect(component.showSampleForm).toBe(true);
        expect(component.showMeansForm).toBe(true);
        expect(component.showConfidenceIntervalForm).toBe(true);
        expect(component.noOfIntervals).toBe(1);
        expect(component.lowerBounds).toEqual([]);
        expect(component.upperBounds).toEqual([]);
        expect(component.samplemean2).toEqual([]);
    });
    it('should fetch and set CSV data based on the selected sample', async () => {
        const mockEvent = {
            target: {
                value: 'sample1'
            }
        };
    
        const mockResponse = {
            text: jest.fn().mockResolvedValue('CSV data')
        };
    
        global.fetch = jest.fn().mockResolvedValue(mockResponse);
    
        await component.sampleSelect(mockEvent);
    
        expect(global.fetch).toHaveBeenCalledWith('../../../assets/samp1.csv');
        expect(mockResponse.text).toHaveBeenCalled();
        expect(component.csvTextArea).toBe('CSV data');
    });
    it('should give the correct mean', () =>
    {
        component.inputDataArray = [1,2,3,4,5,6,7,8,9,10];
        component.inputDataSize = 10;
        let mean = component.mean(component.inputDataArray);
        expect(mean).toBe(5.5);
    } );
    it('should give the correct standard deviation', () =>
    {
        component.inputDataArray = [1,2,3,4,5,6,7,8,9,10];
        component.inputDataSize = 10;
        component.mean(component.inputDataArray);
        let inputDataStd = component.stddev(component.inputDataArray);
        expect(inputDataStd).toBe(2.8722813232690143);
    });

    it('should give the correct sample mean', () =>
    {
        component.sampleMeans = [1,2,3,4,5,6,7,8,9,10];
        let mean = component.mean(component.sampleMeans);
        expect(mean).toBe(5.5);
    }
    );
    it('should return max value in an array', () =>
    {
        component.sampleMeans = [1,2,3,4,5,6,7,8,9,10];
        let max = component.maxInArray(component.sampleMeans);
        expect(max).toBe(10);
    }
);
    it('should return min value in an array', () =>
    {
        component.sampleMeans = [1,2,3,4,5,6,7,8,9,10];
        let min = component.minInArray(component.sampleMeans);
        expect(min).toBe(1);
    }
);
    it('should return the correct samples standard deviation', () =>
    {
        component.sampleMeans = [1,2,3,4,5,6,7,8,9,10];
        component.sampleMeansSize = 10;
        let sampleMeansStd = component.sampleStddev(component.sampleMeans);
        expect(sampleMeansStd).toBe(3.0276503540974917);
    } );
//     it('should return the correct confidence interval', () =>
//     {
//         component.sampleMeans = [1,2,3,4,5,6,7,8,9,10];
//         component.sampleMeansSize = 10;
//         component.sampleMeansMean = 5.5;
//         component.sampleMeansStd = 2.8722813232690143;
//         component.confidenceIntervalCount = 0;
//         component.confidenceIntervalCountNot = 0;
//         component.confidenceInterval();
//         expect(component.lowerBound[0]).toBe(3.325);
//         expect(component.upperBound[0]).toBe(7.675);
//     }
// );  

});