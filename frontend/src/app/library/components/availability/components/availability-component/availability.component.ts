import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Availability} from "../../model/availability.model";

@Component({
	selector: 'availability',
	templateUrl: './availability.component.html',
	styleUrls: ['./availability.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilityComponent implements AfterViewInit {
  @Input()
  availabilities!: Availability[];
  @Input()
  sensorAvailabilities?: Availability[];
  @Output()
  onAvailabilityClicked: EventEmitter<Availability> = new EventEmitter<Availability>();

	availability?: number;
	showXAxis = true;
	showYAxis = true;
	showLegend = true;
	units = "Average availability";
  displayModal: boolean = false;

  clickedSensorLabel: string = "";

	constructor() {
	}

	ngAfterViewInit(): void {
    console.log(this.availabilities)
    this.availability = Math.round(this.availabilities.reduce(
      (sum, availability) => sum + availability.value, 0
    ) / this.availabilities.length * 100) / 100;
    console.log(this.availability);
	}

  availabilityClick($event: Availability) {
    this.clickedSensorLabel = $event.text;
    this.onAvailabilityClicked.emit($event);
    this.displayModal = true;
  }
}
