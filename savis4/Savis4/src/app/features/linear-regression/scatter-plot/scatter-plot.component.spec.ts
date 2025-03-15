import { ScatterPlotComponent } from './scatter-plot.component';
import { SimpleChange } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

describe('ScatterPlotComponent', () => {
  let component: ScatterPlotComponent;
  let translateService: TranslateService;

  beforeEach(() => {
    translateService = { instant: jest.fn() } as any;
    component = new ScatterPlotComponent(translateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should update regression parameters and chart data when dataPoints change', () => {
      const dataPoints = [{ x: 1, y: 2 }, { x: 3, y: 4 }];
      component.dataPoints = dataPoints;

      const changes = {
        dataPoints: new SimpleChange(null, dataPoints, true)
      };

      const updateRegressionParametersSpy = jest.spyOn(component as any, 'updateRegressionParameters');
      const updateChartDataSpy = jest.spyOn(component as any, 'updateChartData');

      component.ngOnChanges(changes);

      expect(updateRegressionParametersSpy).toHaveBeenCalled();
      expect(updateChartDataSpy).toHaveBeenCalled();
    });
  });
});