import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LegendPosition} from "@swimlane/ngx-charts";
import {LineState} from "../../model/line.model";

@Component({
  selector: 'line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineComponent implements OnInit {
  @Input() results: any;
  @Input() yAxisLabel: any;
  @Input() xAxisLabel: any;
  @Input() allKpis: any;
  @Input() allAggregationOperations: any;
  @Input() allDevicesToCompareWith: any;
  @Input() chartHeight = 400;

  @Output() onChanges: EventEmitter<any> = new EventEmitter<any>();
  @Output() stateChange: EventEmitter<LineState> = new EventEmitter<LineState>();
  @Input() set state(value: LineState) {
    this._state = value;
  }
  _state?: LineState;

  position = LegendPosition.Below;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;

  constructor() { }

  ngOnInit(): void {
  }

  changes() {
    this.onChanges.emit();
  }
}
