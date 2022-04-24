import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import * as _ from 'lodash';
import {toNumber} from 'lodash';
import {Color, LegendPosition} from "@swimlane/ngx-charts";
import {CurrentDayState, KPIOptions, PastDaysState} from "../../model/categorical.model";


@Component({
  selector: 'categorical',
  templateUrl: './categorical.component.html',
  styleUrls: ['./categorical.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Categorical {

  constructor() {
  }

  @Input() deviceUid!: string;
  @Input() KPIs!: KPIOptions;

  @Input()
  set currentDay(currentDay: CurrentDayState) {
    this._currentDay = currentDay
  }
  @Output()
  currentDayChange: EventEmitter<CurrentDayState> = new EventEmitter<CurrentDayState>();
  @Output()
  currentDayChanged: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  set pastDays(pastDays: PastDaysState) {
    this._pastDays = pastDays;
  }
  @Output()
  pastDaysChange: EventEmitter<PastDaysState> = new EventEmitter<PastDaysState>();
  @Output()
  pastDaysMove: EventEmitter<number> = new EventEmitter<number>();

  _currentDay!: CurrentDayState;
  _pastDays!: PastDaysState;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  labelHours = 'Hours';
  labelDays = 'Days';
  showYAxisLabel = true;
  labelSwitchCount = 'Switch count';
  animations = true;

  @Input()
  colorScheme: Color = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  } as Color;

  hourTicks: string[] = _.range(0, 24, 2).map(item => item.toString());

  sort = (first: { name: any; }, second: { name: any; }) => toNumber(first.name) > toNumber(second.name) ? 1 : -1;
  sortDates = (first: { name: string | number | Date; }, second: { name: string | number | Date; }) =>
    new Date(first.name) > new Date(second.name) ? 1 : -1;

  position = LegendPosition.Below;

  switchInDaysMove(direction: number) {
    this.pastDaysMove.emit(direction);
  }

  updateDay($event: any) {
    this.currentDayChanged.emit($event);
  }
}
