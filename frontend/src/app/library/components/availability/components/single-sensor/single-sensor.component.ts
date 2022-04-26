import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {Availability} from "../../model/availability.model";
import {SparklineState} from "../../../../dashboards/model/dashboards.model";
import {ParameterType} from "../../../../../generated/models/parameter-type";

/**
 * display data about single sensor from the selected device.
 * This is intended for use in a modal.
 */
@Component({
	selector: 'single-sensor',
	templateUrl: './single-sensor.component.html',
	styleUrls: ['./single-sensor.component.css']
})
export class SingleSensorComponent implements OnInit{
  @Input()
  sensorName: string = "";
  /**
   * Pass availabilities for different time sengments of the sensor
   */
  @Input()
  sensorAvailability!: Availability[];
  @Input()
  sensorSparkline!: SparklineState;
  @Input()
  currentParameterType?: ParameterType;

  animations = true;

	constructor() {
	}

	ngOnInit(): void {

	}

}
