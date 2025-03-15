import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CSVService {

  constructor() { }

  static dropTextFileOnTextArea(textAreaElement: HTMLTextAreaElement) {
    if (textAreaElement) {
      textAreaElement.addEventListener("dragover", (e: DragEvent) => {
        e.preventDefault();
        textAreaElement.classList.add("dragover");
      });
  
      textAreaElement.addEventListener("dragleave", () => {
        textAreaElement.classList.remove("dragover");
      });
  
      textAreaElement.addEventListener("drop", (e: DragEvent) => {
        e.preventDefault();
        textAreaElement.classList.remove("dragover");
        let file = e.dataTransfer?.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const target = event.target;
            if (target && typeof target.result === 'string') {
              textAreaElement.value = target.result;
            }
          };
          reader.readAsText(file);
        }
      });
  
    }
    
  }

  static enableUploadDataFile(uploadButton: HTMLElement, fileInput: HTMLInputElement, textAreaElement: HTMLTextAreaElement) {
    if (uploadButton && fileInput && textAreaElement) {
    uploadButton.addEventListener('click', event => {
      fileInput.click();
      event.preventDefault();
    });

    fileInput.addEventListener('change', event => {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = event => {
          const result = event.target?.result;
          if (typeof result === 'string') {
            textAreaElement.value = result;
          }
        };
        reader.readAsText(file);
      }
      event.preventDefault();
    });
  }
  }

  static parseCsvVariableByCol(rawData: string, columns: string[] = []): any {
    const [Header, ...data] = rawData.split(/[\r\n]+/);
    let varNames = !columns ? Header.split(/[\t,]/).map(x => x.trim()) : columns;
    const res: { [key: string]: number[] } = varNames.reduce((acc, x) => {
      return { ...acc, [x]: [] };
    }, {});

    if (columns) {
      data.unshift(Header);
    }

    data.forEach(row => {
      const nums = row.match(/(\d+(\.\d+)?)|-(\d+(\.\d+)?)/g);
      varNames.forEach((x, index) => {
        if (nums && nums.length === varNames.length)
          res[x].push(Number(nums[index]));
      });
    });

    return res;
  }

  static parseCSVtoSingleArray(rawData: string): any[] {
    const numRegex = /(-?\d+(\.\d+)?)/;
    return rawData
      .split(/[\r\n]+/)
      .filter(x => numRegex.test(x))
      .map((x, index) => ({
        id: index + 1,
        value: Number(x.match(numRegex)?.[0] || 0)
      }));
  }

  static readLocalFile(filePath: string): Promise<string> {
    return fetch(filePath).then(r => r.text());
  }

}