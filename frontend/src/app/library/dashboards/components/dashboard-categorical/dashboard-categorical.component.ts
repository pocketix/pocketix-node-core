import {Component, Input, OnInit} from '@angular/core';
import {ParameterType} from "../../../../generated/models/parameter-type";

@Component({
  selector: 'dashboard-categorical',
  templateUrl: './dashboard-categorical.component.html',
  styleUrls: ['./dashboard-categorical.component.css']
})
export class DashboardCategoricalComponent implements OnInit {
  @Input() deviceUid!: string;
  @Input() optionsKPI: ParameterType[] = [];
  @Input() defaultKPIs?: ParameterType[];

  constructor() { }

  ngOnInit(): void {
  }

}
