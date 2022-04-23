import {AfterViewInit, Component, Input} from '@angular/core';
import {BaseDashboardComponent} from "../base-dashboard/base-dashboard.component";
import {Availability} from "../../../components/availability/model/availability.model";

@Component({
  selector: 'dashboard-availability',
  templateUrl: './dashboard-availability.component.html',
  styleUrls: ['./dashboard-availability.component.css']
})
export class DashboardAvailabilityComponent extends BaseDashboardComponent implements AfterViewInit {
  @Input()
  availabilities: Availability[] = [];

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

}
