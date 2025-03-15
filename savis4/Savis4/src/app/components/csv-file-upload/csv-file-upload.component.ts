import { Component } from '@angular/core';

@Component({
  selector: 'app-csv-file-upload',
  templateUrl: './csv-file-upload.component.html',
  styleUrls: ['./csv-file-upload.component.scss']
})
export class CsvFileUploadComponent {
  csvContent: string = '';

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

}
