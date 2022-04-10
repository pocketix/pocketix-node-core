import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-key-value-display',
  templateUrl: './key-value-display.component.html',
  styleUrls: ['./key-value-display.component.css']
})
export class KeyValueDisplayComponent implements OnInit {
  @Input()
  key!: string;
  @Input()
  value!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
