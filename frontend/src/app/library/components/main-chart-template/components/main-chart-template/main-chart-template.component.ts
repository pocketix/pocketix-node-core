import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {ReloadEvent} from "../model/main-chart-template.model";

/**
 * Main chart template with one chart on the right and smaller column on the right.
 * Use the "chart" attribute to for the main chart and "rightColumn" for the column.
 */
@Component({
  selector: 'main-chart-template',
  templateUrl: './main-chart-template.component.html',
  styleUrls: ['./main-chart-template.component.css']
})
export class MainChartTemplateComponent implements OnInit {
  /**
   * Device name
   */
  @Input()
  deviceName = "Device Name";
  /**
   * Show the automatic reload switch
   */
  @Input()
  showReloadSwitch: boolean = true;
  /**
   * Switch status changed emitter
   */
  @Output()
  onReloadSwitchEventEmitter = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onReloadSwitch($event: ReloadEvent) {
    this.onReloadSwitchEventEmitter.emit($event);
  }
}
