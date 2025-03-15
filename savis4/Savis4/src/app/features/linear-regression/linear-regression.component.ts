import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-linear-regression',
  templateUrl: './linear-regression.component.html',
  styleUrls: ['./linear-regression.component.scss']
})
export class LinearRegressionComponent implements OnInit{
  datapoints: string = '';
  parsedDatapoints: { x: number, y: number }[] = [];
  csvContent: string = '';

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.sharedService.currentData.subscribe(data => this.datapoints = data)
  }

  updateChart() {
    // Parse the user input into data points
    this.parsedDatapoints = this.datapoints.split('\n')
      .map(point => point.split(',').map(coord => +coord))
      .map(coords => ({ x: coords[0], y: coords[1] }));
  }

  onFileSelect(input: Event): void {
    const target = input.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.csvContent = e.target?.result as string;
      };
      reader.readAsText(file);
    }
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this.sharedService.changeData('')
  }
}
