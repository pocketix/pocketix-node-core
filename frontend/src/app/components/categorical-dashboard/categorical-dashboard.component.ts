import { Component, OnInit } from '@angular/core';
import {first, tap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {DeviceService} from "../../generated/services/device.service";
import {Device} from "../../generated/models/device";
import {ParameterType} from "../../generated/models/parameter-type";

@Component({
  selector: 'app-categorical-dashboard',
  templateUrl: './categorical-dashboard.component.html',
  styleUrls: ['./categorical-dashboard.component.css']
})
export class CategoricalDashboardComponent implements OnInit {
  type?: string;
  deviceUid!: string;
  device?: Device;
  fields?: string[]
  parameterTypes: ParameterType[] = [];
  defaults: ParameterType[] = [];

  constructor(private route: ActivatedRoute, private deviceService: DeviceService) { }

  async ngOnInit(): Promise<void> {
    await this.route.params.pipe(tap(
        parameters => this.type = parameters["type"] ?? ""
      ), first()
    ).toPromise();

    await this.route.queryParamMap.pipe(tap(
        query => this.deviceUid = query.get("deviceUid") ?? ""
      ), first()
    ).toPromise();
    this.deviceService.getDeviceById({
      deviceUid: this.deviceUid
    }).subscribe(device => {
      this.device = device;
      this.fields = this.device.parameterValues?.map(parameterValues => parameterValues.type.name) || [];
      this.parameterTypes = this.device.parameterValues?.map(parameterValues => parameterValues.type) || [];
      this.defaults = this.parameterTypes.slice(0,3);
    });
  }
}
