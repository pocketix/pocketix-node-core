import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {Availability} from "../../model/availability.model";
import {SparklineState} from "../../../../dashboards/model/dashboards.model";
import {Device} from "../../../../../generated/models/device";
import {ParameterType} from "../../../../../generated/models/parameter-type";

@Component({
	selector: 'availability',
	templateUrl: './availability.component.html',
	styleUrls: ['./availability.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilityComponent implements AfterViewInit {
  @Input()
  device!: Device;
  @Input()
  availabilities!: Availability[];
  @Input()
  sensorAvailabilities?: Availability[];
  @Input()
  sensorSparkline?: SparklineState;
  @Output()
  onAvailabilityClicked: EventEmitter<Availability> = new EventEmitter<Availability>();

	availability?: number;
	showXAxis = true;
	showYAxis = true;
	showLegend = true;
	units = "Average availability";
  displayModal: boolean = false;

  clickedSensorLabel: string = "";
  selectedType?: ParameterType;

	constructor() {
	}

	ngAfterViewInit(): void {
    this.availability = Math.round(this.availabilities.reduce(
      (sum, availability) => sum + availability.value, 0
    ) / this.availabilities.length * 100) / 100;
	}

  availabilityClick($event: Availability) {
    this.clickedSensorLabel = $event.text;
    this.selectedType = this.device.parameterValues?.find(item => item.type.name === $event.field)?.type;
    this.onAvailabilityClicked.emit($event);
    this.displayModal = true;
  }
}
