import {Component, Input} from '@angular/core';
import {Device} from "../../../../generated/models/device";
import {Operation} from "../../../../generated/models/operation";
import {LineState} from "../../../components/line/model/line.model";
import {ApexAxisChartSeries} from "ng-apexcharts";
import {chart, grid, plotOptions, yAxis } from '../../shared/boxSettings';
import {Availability} from "../../../components/availability/components/availability-component/availability.component";
import {Bullet} from "../../model/dashboards.model";
import {BaseDashboardComponent} from "../base-dashboard/base-dashboard.component";

@Component({
  selector: 'app-dashboard-availability',
  templateUrl: './dashboard-availability.component.html',
  styleUrls: ['./dashboard-availability.component.css']
})
export class DashboardAvailabilityComponent extends BaseDashboardComponent  {
  @Input() device!: Device;
  @Input() bucket: string = "";
  @Input() fields: string[] = [];
  @Input() devices?: Device[];
  @Input() bullets: Bullet[] = [];
  @Input() sparklineMapping = (name: string) => name;
  @Input() sparklines: string[] = [];

  lineState = {
    selectedAggregationOperation: Operation.Mean.toString(),
    selectedKpis: [] as { [key: string]: string }[],
    dates: [] as Date[],
    selectedDevicesToCompareWith: [] as any[],
    device: this.device
  } as LineState;

  aggregationOperations = Object.values(Operation).filter(item => isNaN(Number(item)) && item !== 'none');
  currentOperation = Operation.Mean.toString();

  results: any[] = [];
  xAxisLabel: string = 'Date';
  yAxisLabel: string = 'Value';
  sparklineData: any[] = [
    [
      {
        "name": "Outside Temperature",
        "series": [
          {
            "value": "5.92",
            "name": "2022-04-08T19:36:00.000Z"
          },
          {
            "value": "5.87",
            "name": "2022-04-08T22:00:00.000Z"
          },
          {
            "value": "5.70",
            "name": "2022-04-09T00:24:00.000Z"
          },
          {
            "value": "5.56",
            "name": "2022-04-09T02:48:00.000Z"
          },
          {
            "value": "4.62",
            "name": "2022-04-09T05:12:00.000Z"
          },
          {
            "value": "4.00",
            "name": "2022-04-09T07:36:00.000Z"
          },
          {
            "value": "5.20",
            "name": "2022-04-09T10:00:00.000Z"
          },
          {
            "value": "2.08",
            "name": "2022-04-09T19:36:00.000Z"
          },
          {
            "value": "1.95",
            "name": "2022-04-09T22:00:00.000Z"
          },
          {
            "value": "2.82",
            "name": "2022-04-10T00:24:00.000Z"
          },
          {
            "value": "2.21",
            "name": "2022-04-10T02:48:00.000Z"
          },
          {
            "value": "2.50",
            "name": "2022-04-10T05:12:00.000Z"
          },
          {
            "value": "3.52",
            "name": "2022-04-10T07:36:00.000Z"
          },
          {
            "value": "5.50",
            "name": "2022-04-10T10:00:00.000Z"
          },
          {
            "value": "6.44",
            "name": "2022-04-10T12:24:00.000Z"
          },
          {
            "value": "6.34",
            "name": "2022-04-10T14:48:00.000Z"
          },
          {
            "value": "5.08",
            "name": "2022-04-10T17:12:00.000Z"
          },
          {
            "value": "2.91",
            "name": "2022-04-10T19:36:00.000Z"
          },
          {
            "value": "1.84",
            "name": "2022-04-10T22:00:00.000Z"
          },
          {
            "value": "1.91",
            "name": "2022-04-11T00:24:00.000Z"
          },
          {
            "value": "2.18",
            "name": "2022-04-11T02:48:00.000Z"
          },
          {
            "value": "0.76",
            "name": "2022-04-11T05:12:00.000Z"
          },
          {
            "value": "3.43",
            "name": "2022-04-11T07:36:00.000Z"
          },
          {
            "value": "7.57",
            "name": "2022-04-11T10:00:00.000Z"
          },
          {
            "value": "8.47",
            "name": "2022-04-11T12:24:00.000Z"
          },
          {
            "value": "9.79",
            "name": "2022-04-11T14:48:00.000Z"
          },
          {
            "value": "8.39",
            "name": "2022-04-11T17:12:00.000Z"
          },
          {
            "value": "3.75",
            "name": "2022-04-11T19:35:28.991Z"
          }
        ]
      }
    ],
    [
      {
        "name": "Room Temperature",
        "series": [
          {
            "value": "21.89",
            "name": "2022-04-08T19:36:00.000Z"
          },
          {
            "value": "22.02",
            "name": "2022-04-08T22:00:00.000Z"
          },
          {
            "value": "21.39",
            "name": "2022-04-09T00:24:00.000Z"
          },
          {
            "value": "21.00",
            "name": "2022-04-09T02:48:00.000Z"
          },
          {
            "value": "21.11",
            "name": "2022-04-09T05:12:00.000Z"
          },
          {
            "value": "21.44",
            "name": "2022-04-09T07:36:00.000Z"
          },
          {
            "value": "21.98",
            "name": "2022-04-09T10:00:00.000Z"
          },
          {
            "value": "22.21",
            "name": "2022-04-09T19:36:00.000Z"
          },
          {
            "value": "22.00",
            "name": "2022-04-09T22:00:00.000Z"
          },
          {
            "value": "21.62",
            "name": "2022-04-10T00:24:00.000Z"
          },
          {
            "value": "20.95",
            "name": "2022-04-10T02:48:00.000Z"
          },
          {
            "value": "21.12",
            "name": "2022-04-10T05:12:00.000Z"
          },
          {
            "value": "21.28",
            "name": "2022-04-10T07:36:00.000Z"
          },
          {
            "value": "21.96",
            "name": "2022-04-10T10:00:00.000Z"
          },
          {
            "value": "22.44",
            "name": "2022-04-10T12:24:00.000Z"
          },
          {
            "value": "22.51",
            "name": "2022-04-10T14:48:00.000Z"
          },
          {
            "value": "22.49",
            "name": "2022-04-10T17:12:00.000Z"
          },
          {
            "value": "22.03",
            "name": "2022-04-10T19:36:00.000Z"
          },
          {
            "value": "22.00",
            "name": "2022-04-10T22:00:00.000Z"
          },
          {
            "value": "21.34",
            "name": "2022-04-11T00:24:00.000Z"
          },
          {
            "value": "20.99",
            "name": "2022-04-11T02:48:00.000Z"
          },
          {
            "value": "21.07",
            "name": "2022-04-11T05:12:00.000Z"
          },
          {
            "value": "20.79",
            "name": "2022-04-11T07:36:00.000Z"
          },
          {
            "value": "20.95",
            "name": "2022-04-11T10:00:00.000Z"
          },
          {
            "value": "21.20",
            "name": "2022-04-11T12:24:00.000Z"
          },
          {
            "value": "21.51",
            "name": "2022-04-11T14:48:00.000Z"
          },
          {
            "value": "22.03",
            "name": "2022-04-11T17:12:00.000Z"
          },
          {
            "value": "22.00",
            "name": "2022-04-11T19:35:28.991Z"
          }
        ]
      }
    ],
    [
      {
        "name": "Room Temperature",
        "series": [
          {
            "value": "21.89",
            "name": "2022-04-08T19:36:00.000Z"
          },
          {
            "value": "22.02",
            "name": "2022-04-08T22:00:00.000Z"
          },
          {
            "value": "21.39",
            "name": "2022-04-09T00:24:00.000Z"
          },
          {
            "value": "21.00",
            "name": "2022-04-09T02:48:00.000Z"
          },
          {
            "value": "21.11",
            "name": "2022-04-09T05:12:00.000Z"
          },
          {
            "value": "21.44",
            "name": "2022-04-09T07:36:00.000Z"
          },
          {
            "value": "21.98",
            "name": "2022-04-09T10:00:00.000Z"
          },
          {
            "value": "22.21",
            "name": "2022-04-09T19:36:00.000Z"
          },
          {
            "value": "22.00",
            "name": "2022-04-09T22:00:00.000Z"
          },
          {
            "value": "21.62",
            "name": "2022-04-10T00:24:00.000Z"
          },
          {
            "value": "20.95",
            "name": "2022-04-10T02:48:00.000Z"
          },
          {
            "value": "21.12",
            "name": "2022-04-10T05:12:00.000Z"
          },
          {
            "value": "21.28",
            "name": "2022-04-10T07:36:00.000Z"
          },
          {
            "value": "21.96",
            "name": "2022-04-10T10:00:00.000Z"
          },
          {
            "value": "22.44",
            "name": "2022-04-10T12:24:00.000Z"
          },
          {
            "value": "22.51",
            "name": "2022-04-10T14:48:00.000Z"
          },
          {
            "value": "22.49",
            "name": "2022-04-10T17:12:00.000Z"
          },
          {
            "value": "22.03",
            "name": "2022-04-10T19:36:00.000Z"
          },
          {
            "value": "22.00",
            "name": "2022-04-10T22:00:00.000Z"
          },
          {
            "value": "21.34",
            "name": "2022-04-11T00:24:00.000Z"
          },
          {
            "value": "20.99",
            "name": "2022-04-11T02:48:00.000Z"
          },
          {
            "value": "21.07",
            "name": "2022-04-11T05:12:00.000Z"
          },
          {
            "value": "20.79",
            "name": "2022-04-11T07:36:00.000Z"
          },
          {
            "value": "20.95",
            "name": "2022-04-11T10:00:00.000Z"
          },
          {
            "value": "21.20",
            "name": "2022-04-11T12:24:00.000Z"
          },
          {
            "value": "21.51",
            "name": "2022-04-11T14:48:00.000Z"
          },
          {
            "value": "22.03",
            "name": "2022-04-11T17:12:00.000Z"
          },
          {
            "value": "22.00",
            "name": "2022-04-11T19:35:28.991Z"
          }
        ]
      }
    ],
    [
      {
        "name": "Boiler Calibration",
        "series": [
          {
            "value": "0.27",
            "name": "2022-04-08T19:36:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-08T22:00:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-09T00:24:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-09T02:48:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-09T05:12:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-09T07:36:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-09T10:00:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-09T19:36:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-09T22:00:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-10T00:24:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-10T02:48:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-10T05:12:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-10T07:36:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-10T10:00:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-10T12:24:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-10T14:48:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-10T17:12:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-10T19:36:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-10T22:00:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-11T00:24:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-11T02:48:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-11T05:12:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-11T07:36:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-11T10:00:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-11T12:24:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-11T14:48:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-11T17:12:00.000Z"
          },
          {
            "value": "0.27",
            "name": "2022-04-11T19:35:28.991Z"
          }
        ]
      }
    ]
  ];
  otherData: any[] = [];
  kpis: any[] = [];
  devicesOptions: any[] = [];
  timer: any;

  boxData: {name: string, data: ApexAxisChartSeries }[] = [{
    name: "test",
    data: [{data: [{x: "name", y: [0,1,2,3,4]}]}]
  }, {
    name: "test",
    data: [{data: [{x: "name", y: [0,1,2,3,4]}]}]
  }];

  sparklineMaxMin: any = [];
  selectedDevicesToCompareWith: any;
  plotOptions = plotOptions;
  chart = chart;
  yAxis = yAxis;
  grid = grid;
  availabilities: Availability[] = [{
    text: "a",
    value: 100,
    target: 40
  }, {
    text: "a",
    value: 100,
    target: 40
  }, {
    text: "a",
    value: 100,
    target: 40
  }];

  onReloadSwitch($event: any) {

  }

  onMainGraphChange() {

  }
}
