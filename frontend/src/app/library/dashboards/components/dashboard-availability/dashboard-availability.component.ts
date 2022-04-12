import {AfterViewInit, Component} from '@angular/core';
import {Availability} from "../../../components/availability/components/availability-component/availability.component";
import {BaseDashboardComponent} from "../base-dashboard/base-dashboard.component";

@Component({
  selector: 'app-dashboard-availability',
  templateUrl: './dashboard-availability.component.html',
  styleUrls: ['./dashboard-availability.component.css']
})
export class DashboardAvailabilityComponent extends BaseDashboardComponent implements AfterViewInit {
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

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

}
