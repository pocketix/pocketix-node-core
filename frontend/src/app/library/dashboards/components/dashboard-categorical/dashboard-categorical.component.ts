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
  /**
   * Current device
   */
  @Input()
  device!: Device;
  /**
   * Values to display on the top left
   */
  @Input()
  keyValue?: {key: string, value: string, tooltip?: string}[] = [];
  /**
   * Raw OutputData from Influx for the switch display component
   */
  @Input()
  switchData?: OutputData[];
  /**
   * States for the switch display component
   */
  @Input()
  states?: (string | number)[];
  /**
   * Fields to make the switch display components for (2 fields === 2 graphs)
   */
  @Input()
  fields?: string[];
  /**
   * Start date of the switch display
   */
  @Input()
  start?: Date;
  /**
   * Data for bullet charts
   */
  @Input()
  bullets?: Bullet[];
  @Input()
  KPIs!: KPIOptions;
  /**
   * Field to viewable string
   */
  @Input()
  mapping!: (field: string) => string;

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
    this.currentDayChanged.emit($event)
  }
}
