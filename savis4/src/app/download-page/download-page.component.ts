import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-download-page',
  templateUrl: './download-page.component.html',
  styleUrls: ['./download-page.component.scss']
})
export class DownloadPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  downloadWindows() {
    window.open(
      'https://github.com/syv0n/SAVIS4/releases/download/v1.0.0/Savis4-Portable-Windows.zip',
      '_blank'
    );
  }
  
  downloadLinux() {
    window.open(
      'https://github.com/syv0n/SAVIS4/releases/download/v1.0.0/Savis4-Portable-Linux.zip', 
      '_blank'
    );
  }

}
