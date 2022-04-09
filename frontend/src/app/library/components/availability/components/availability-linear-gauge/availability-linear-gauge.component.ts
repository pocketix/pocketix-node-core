import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-availability-linear-gauge',
	templateUrl: './availability-linear-gauge.component.html',
	styleUrls: ['./availability-linear-gauge.component.css']
})
export class AvailabilityLinearGaugeComponent implements OnInit {
	@Input() units: string = "";
	@Input() formatter: (value: string) => string = (value: string) => {
		return AvailabilityLinearGaugeComponent.formatHelper(value, this.stringToAdd)
	};
	@Input() value: number = 0;
	@Input() borderValue: number = 0;
	@Input() view: [number, number] = [166, 80];
	@Input() stringToAdd?: string;

	constructor() {
	}

	ngOnInit(): void {
	}

	public static formatHelper(value: string, stringToAdd?: string) {
		return stringToAdd ? `${value} ${stringToAdd}` : `${value}`;
	}
}
