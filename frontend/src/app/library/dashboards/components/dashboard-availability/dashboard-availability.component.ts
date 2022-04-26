import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {BaseDashboardComponent} from "../base-dashboard/base-dashboard.component";
import {Availability} from "../../../components/availability/model/availability.model";
import {SparklineState} from "../../model/dashboards.model";

@Component({
  selector: 'dashboard-availability',
  templateUrl: './dashboard-availability.component.html',
  styleUrls: ['./dashboard-availability.component.css']
})
export class DashboardAvailabilityComponent extends BaseDashboardComponent implements AfterViewInit {
  /**
   * The availabilities of the items
   */
  @Input()
  availabilities: Availability[] = [];
  /**
   * Availabilities of the selected sensor
   * Refresh this with an event listener on availabilityClicked
   */
  @Input()
  sensorAvailabilities?: Availability[];
  /**
   * Sparkline of the current sensor
   */
  @Input()
  sensorSparkline?: SparklineState;
  @Output()
  availabilityClicked: EventEmitter<Availability> = new EventEmitter<Availability>();

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  onAvailabilityClicked($event: Availability) {
    this.availabilityClicked.emit($event);
  }
}
