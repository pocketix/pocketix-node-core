import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Device} from "../../../../generated/models/device";
import {BoxState, BulletsState, SparklineState} from "../../model/dashboards.model";
import {LineState} from "../../../components/line/model/line.model";
import {chart, grid, plotOptions, yAxis } from '../../shared/boxSettings';

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

  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Value';
  otherData: any[] = [];

  plotOptions = plotOptions;
  chart = chart;
  yAxis = yAxis;
  grid = grid;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  lineStateChanges() {
    this.lineStateChanged.emit();
  }

}
