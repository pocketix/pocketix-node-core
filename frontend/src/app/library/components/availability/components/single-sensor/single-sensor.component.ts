import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Availability} from "../../model/availability.model";
import {SparklineState} from "../../../../dashboards/model/dashboards.model";
import {ParameterType} from "../../../../../generated/models/parameter-type";

@Component({
	selector: 'single-sensor',
	templateUrl: './single-sensor.component.html',
	styleUrls: ['./single-sensor.component.css']
})
export class SingleSensorComponent implements OnInit{
  @Input()
  sensorName: string = "";
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
