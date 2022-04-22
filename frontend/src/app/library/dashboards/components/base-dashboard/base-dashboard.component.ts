import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Device} from "../../../../generated/models/device";
import {BoxState, Bullet, BulletsState, SparklineState} from "../../model/dashboards.model";
import {Operation} from "../../../../generated/models/operation";
import {LineState} from "../../../components/line/model/line.model";
import {ApexAxisChartSeries} from "ng-apexcharts";
import {DataItem} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {chart, grid, plotOptions, yAxis } from '../../shared/boxSettings';
import {
  createSensors,
  createStorage,
  handleMultipleLines, storageToSparklines,
  toBoxData,
  updatePreviousValue
} from "../../shared/tranformFunctions";
import {ReadRequestBody} from "../../../../generated/models/read-request-body";
import {ApiService} from "../../../../generated/services/api.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-base-dashboard',
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
