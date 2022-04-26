import {Component, Input, OnInit} from '@angular/core';
import {Availability} from "../../model/availability.model";
import {SparklineState} from "../../../../dashboards/model/dashboards.model";

@Component({
	selector: 'single-sensor',
	templateUrl: './single-sensor.component.html',
	styleUrls: ['./single-sensor.component.css']
})
export class SingleSensorComponent implements OnInit {
  @Input()
  sensorName: string = "";
  @Input()
  sensorAvailability!: Availability[];
  @Input()
  sensorSparkline!: SparklineState;

  animations = true;

	constructor() {
	}

	ngOnInit(): void {

	}

}
