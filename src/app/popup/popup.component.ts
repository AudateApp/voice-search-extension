import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'audate-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PopupComponent implements OnInit {
  display: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }  
  
  showDialog() {
    this.display = true;
   }
}
