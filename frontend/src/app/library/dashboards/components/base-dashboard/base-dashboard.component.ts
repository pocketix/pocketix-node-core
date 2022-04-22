import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Device} from "../../../../generated/models/device";
import {BoxState, BulletsState, SparklineState} from "../../model/dashboards.model";
import {LineState} from "../../../components/line/model/line.model";
import {chart, grid, plotOptions, yAxis } from '../../shared/boxSettings';

@Component({
  selector: 'base-dashboard',
  templateUrl: './base-dashboard.component.html',
  styleUrls: ['./base-dashboard.component.css']
})
export class BaseDashboardComponent implements OnInit, AfterViewInit {
  @Input() device!: Device;
  @Input() sparklineMapping = (name: string) => name;
  @Input() lineState!: LineState;
  @Input() boxData!: BoxState;
  @Input() bulletsState!: BulletsState;
  @Input() sparklineState!: SparklineState;
  @Input() keyValue?: {key: string, value: string}[]

  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Value';
  otherData: any[] = [];
  timer: any;

  plotOptions = plotOptions;
  chart = chart;
  yAxis = yAxis;
  grid = grid;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

}
