import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Device} from "../../../../generated/models/device";
import {OutputData} from "../../../../generated/models/output-data";
import {Bullet} from "../../model/dashboards.model";
import {CurrentDayState, KPIOptions, PastDaysState} from "../../../components/categorical/model/categorical.model";

@Component({
  selector: 'dashboard-categorical',
  templateUrl: './dashboard-categorical.component.html',
  styleUrls: ['./dashboard-categorical.component.css']
})
export class DashboardCategoricalComponent implements OnInit {
  @Input() device!: Device;
  @Input() keyValue?: {key: string, value: string}[] = [];
  @Input() data?: OutputData[];
  @Input() states?: (string | number)[];
  @Input() fields?: string[];
  @Input() bullets?: Bullet[];
  @Input() start?: Date;
  @Input() KPIs!: KPIOptions;

  @Input()
  set currentDay(currentDay: CurrentDayState) {
    this._currentDay = currentDay
  }
  @Output()
  currentDayChange: EventEmitter<CurrentDayState> = new EventEmitter<CurrentDayState>();
  @Output()
  currentDayChanged: EventEmitter<any> = new EventEmitter<any>();
  _currentDay!: CurrentDayState;

  @Input()
  set pastDays(pastDays: PastDaysState) {
    this._pastDays = pastDays;
  }
  @Output()
  pastDaysChange: EventEmitter<PastDaysState> = new EventEmitter<PastDaysState>();
  @Output()
  pastDaysMove: EventEmitter<number> = new EventEmitter<number>();
  _pastDays!: PastDaysState;

  constructor() { }

  ngOnInit(): void {
  }

  pastDaysMoved($event: number) {
    this.pastDaysMove.emit($event);
  }

  currentDayChanges($event: CurrentDayState) {
    console.log($event);
    this.currentDayChanged.emit($event)
  }
}
