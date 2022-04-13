import {AfterViewInit, Component, Input} from '@angular/core';
import {Availability} from "../../../components/availability/components/availability-component/availability.component";
import {BaseDashboardComponent} from "../base-dashboard/base-dashboard.component";

@Component({
  selector: 'app-dashboard-availability',
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
