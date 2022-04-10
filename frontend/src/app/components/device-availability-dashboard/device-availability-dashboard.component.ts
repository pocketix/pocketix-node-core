import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {first, tap} from "rxjs/operators";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-device-availability-dashboard',
  templateUrl: './device-availability-dashboard.component.html',
  styleUrls: ['./device-availability-dashboard.component.css'],
  providers: [MessageService]
})
export class DeviceAvailabilityDashboardComponent implements OnInit {
  private type = "";
  private deviceUid = "";

  constructor(private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    await this.route.params.pipe(tap(
        parameters => this.type = parameters["type"] ?? ""
      ), first()
    ).toPromise();

    await this.route.queryParamMap.pipe(tap(
        query => this.deviceUid = query.get("deviceUid") ?? ""
      ), first()
    ).toPromise();
  }

}
