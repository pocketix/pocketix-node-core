import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
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
  @Input()
  sensorAvailabilities?: Availability[];
  @Output()
  availabilityClicked: EventEmitter<Availability> = new EventEmitter<Availability>();

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  onAvailabilityClicked($event: Availability) {
    this.availabilityClicked.emit($event);
  }
}
