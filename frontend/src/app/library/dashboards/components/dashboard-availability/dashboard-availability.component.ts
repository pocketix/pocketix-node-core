import {Component, Input} from '@angular/core';
import {Device} from "../../../../generated/models/device";
import {Operation} from "../../../../generated/models/operation";
import {LineState} from "../../../components/line/model/line.model";
import {ApexAxisChartSeries} from "ng-apexcharts";
import {Bullet} from "../dashboard-l5/statistic-device-detail-dashboard.component";
import {chart, grid, plotOptions, yAxis } from '../dashboard-l5/boxSettings';

@Component({
  selector: 'app-dashboard-availability',
  templateUrl: './dashboard-availability.component.html',
  styleUrls: ['./dashboard-availability.component.css']
})
export class DashboardAvailabilityComponent  {
  @Input() device!: Device;
  @Input() bucket: string = "";
  @Input() fields: string[] = [];
  @Input() devices?: Device[];
  @Input() bullets: Bullet[] = [];
  @Input() sparklineMapping = (name: string) => name; // [parameter.mnParameter?.devParName, `${parameter.mnParameter?.label} ${parameter.mnParameter?.unit}`]
  @Input() sparklines: string[] = [];

  lineState = {
    selectedAggregationOperation: Operation.Mean.toString(),
    selectedKpis: [] as { [key: string]: string }[],
    dates: [] as Date[],
    selectedDevicesToCompareWith: [] as any[]
  } as LineState;

  aggregationOperations = Object.values(Operation).filter(item => isNaN(Number(item)) && item !== 'none');
  currentOperation = Operation.Mean.toString();

  results: any[] = [];
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Value';
  sparklineData: any[] = [];
  otherData: any[] = [];
  kpis: any[] = [];
  devicesOptions: any[] = [];
  timer: any;

  boxData = [] as {name: string, data: ApexAxisChartSeries }[];

  sparklineMaxMin: any = [];
  selectedDevicesToCompareWith: any;
  plotOptions = plotOptions;
  chart = chart;
  yAxis = yAxis;
  grid = grid;

  onReloadSwitch($event: any) {

  }

  onMainGraphChange() {

  }
}
