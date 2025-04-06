import {Component, Input, OnInit} from '@angular/core';
import {split} from "lodash";

@Component({
  selector: 'key-value-display',
  templateUrl: './key-value-display.component.html',
  styleUrls: ['./key-value-display.component.css']
})
export class KeyValueDisplayComponent implements OnInit {
  @Input()
  key!: string;
  @Input()
  value!: string;
  @Input()
  tooltip?: string;
  @Input()
  keySize: number = 16;
  @Input()
  valueSize: number = 16;
  @Input()
  split: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
