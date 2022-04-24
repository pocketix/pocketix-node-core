import {Component, Input, OnInit} from '@angular/core';
import {Device} from "../../../../generated/models/device";
import {OutputData} from "../../../../generated/models/output-data";
import {Bullet} from "../../model/dashboards.model";
import {KPIOptions} from "../../../components/categorical/model/categorical.model";

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

  constructor() { }

  ngOnInit(): void {
  }

}
