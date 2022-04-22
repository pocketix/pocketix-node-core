import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'main-chart-template',
  templateUrl: './main-chart-template.component.html',
  styleUrls: ['./main-chart-template.component.css']
})
export class MainChartTemplateComponent implements OnInit {
  @Input() deviceName = "Device Name";
  @Output() onReloadSwitchEventEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onReloadSwitch($event: any) {
    this.onReloadSwitchEventEmitter.emit($event);
  }
}
