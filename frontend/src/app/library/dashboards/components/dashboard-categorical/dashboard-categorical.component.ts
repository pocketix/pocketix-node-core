import {Component, Input, OnInit} from '@angular/core';
import {ParameterType} from "../../../../generated/models/parameter-type";
import {Device} from "../../../../generated/models/device";
import {OutputData} from "../../../../generated/models/output-data";

@Component({
  selector: 'dashboard-categorical',
  templateUrl: './dashboard-categorical.component.html',
  styleUrls: ['./dashboard-categorical.component.css']
})
export class DashboardCategoricalComponent implements OnInit {
  @Input() device!: Device;
  @Input() optionsKPI: ParameterType[] = [];
  @Input() defaultKPIs?: ParameterType[];
  @Input() keyValue?: {key: string, value: string}[] = [];
  @Input() data?: OutputData[];
  @Input() states?: (string | number)[];
  @Input() fields?: string[];

  constructor() { }

  ngOnInit(): void {
  }

}
