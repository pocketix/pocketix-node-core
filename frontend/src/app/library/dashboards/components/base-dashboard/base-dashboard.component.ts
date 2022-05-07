import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Device} from "../../../../generated/models/device";
import {BoxState, BulletsState, SparklineState} from "../../model/dashboards.model";
import {LineState} from "../../../components/line/model/line.model";
import {chart, grid, plotOptions, yAxis } from '../../shared/boxSettings';
import {ReloadEvent} from "../../../components/main-chart-template/components/model/main-chart-template.model";

/**
 * Component representing the base statistical dashboard
 * Don't use this directly, this server to unify the Input and Output names used in statistical dashboards
 */
@Component({
  selector: 'base-dashboard',
  templateUrl: './base-dashboard.component.html',
  styleUrls: ['./base-dashboard.component.css']
})
export class BaseDashboardComponent implements OnInit, AfterViewInit {
  /**
   * Current device
   */
  @Input()
  device!: Device;
  /**
   * Field to name mapping
   * @param name
   */
  @Input()
  sparklineMapping = (name: string) => name;
  /**
   * Data to view in box plots
   */
  @Input()
  boxData!: BoxState;
  /**
   * State of the bullet graphs
   */
  @Input()
  bulletsState!: BulletsState;
  @Input()
  keyValue?: {key: string, value: string}[]
  @Input()
  sparklineState!: SparklineState;
  /**
   * Line state
   */
  @Output() lineStateChanged = new EventEmitter<LineState>();
  @Output() lineStateChange: EventEmitter<LineState> = new EventEmitter<LineState>();
  @Input() set lineState(value: LineState) {
    this._lineState = value;
  }
  _lineState?: LineState;
  /**
   * Line reload switch changed
   */
  @Output() onReloadSwitchChanged = new EventEmitter<ReloadEvent>();
  /**
   * Label of the X axis of the main line chart
   */
  @Input()
  xAxisLabel: string = 'Date';
  /**
   * Label of the Y axis of the main line chart
   */
  @Input()
  yAxisLabel: string = 'Value';
  /**
   * ApexCharts overrides, defaults to shared/boxSettings
   */
  @Input()
  plotOptions = plotOptions;
  @Input()
  chart = chart;
  @Input()
  yAxis = yAxis;
  @Input()
  grid = grid;

  otherData: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  lineStateChanges() {
    this.lineStateChanged.emit();
  }

  onReloadSwitch($event: ReloadEvent) {
    this.onReloadSwitchChanged.emit($event);
  }
}
