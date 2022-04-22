import {Component, Input, OnInit} from '@angular/core';
import {cloneDeep, startCase} from "lodash";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AvailabilityLinearGaugeComponent} from "../availability-linear-gauge/availability-linear-gauge.component";

@Component({
	selector: 'single-sensor',
	templateUrl: './single-sensor.component.html',
	styleUrls: ['./single-sensor.component.css']
})
export class SingleSensorComponent implements OnInit {
	@Input() sensor: string | undefined;
	@Input() sensorData: any | undefined;
	public formatter = AvailabilityLinearGaugeComponent.formatHelper;
	public sensorName: string | undefined;
	public animations: any = BrowserAnimationsModule;
	public data: any[] | undefined;
	public copyOfSensorData: any | undefined;
	public availability: {name: string, availability: number}[] = [];
	public xAxisLabel: string = "Time";
	public yAxisLabel: string = "Availability %";
	public yAxisLabelTemperature: string = "Temperature °C";
	public minimumDate: Date | undefined;
	public maximumDate: Date | undefined;
	private availabilityLine: { series: { name: Date; value: any }[]; name: string }[] = [];
	private lastRecord: Date | undefined;
	private firstRecord: Date | undefined;
	private availabilityStorage: {date: Date, count: number, total: number}[] = [];

	constructor() {
	}

	ngOnInit(): void {
		this.sensorName = startCase(this.sensor);
		/*if (this.sensor != null) {
			this.availabilityLine = [];
			this.dataService.getSingleSensorAvailabilityData(this.sensor).subscribe((records) => {
				this.availabilityLine.push({name: `${startCase(this.sensor)} Availability`, series: []});
				// @ts-ignore
				const lastRecord = records.at(-1);
				this.lastRecord = new Date(lastRecord.name * 1000);
				this.maximumDate = new Date(lastRecord.maximumDate * 1000);
				this.firstRecord = new Date(records[0].name * 1000);
				this.minimumDate = new Date(records[0].minimumDate * 1000);
				this.initializeAvailability();

				records.forEach((record) => {
					this.availabilityLine[0].series.push({name: new Date(record.name * 1000), value: ((record.total / record.count) * 100)});
					this.calculateAvailability(record);
				});

				this.copyOfSensorData = cloneDeep(this.sensorData);
				this.data = this.availabilityLine;
				this.finalizeCalculation();
			});
		}*/
	}

	private initializeAvailability() {
		if (this.lastRecord && this.firstRecord) {
			const sevenDaysBack = new Date(this.lastRecord.getDate() - 7 * 24 * 60 * 60 * 1000);
			const thirtyDaysBack = new Date(this.lastRecord.getDate() - 30 * 24 * 60 * 60 * 1000);
			this.availabilityStorage.push({date: sevenDaysBack, count: 0, total: 0});
			this.availabilityStorage.push({date: thirtyDaysBack, count: 0, total: 0});
			this.availabilityStorage.push({date: this.firstRecord, count: 0, total: 0});
		}
	}

	private calculateAvailability(record: {name: number, total: number, count: number}) {
		const date = new Date(record.name * 1000);
		this.availabilityStorage.forEach(value => {
			if (date >= value.date) {
				value.total += record.total;
				value.count += record.count;
			}
		});
	}

	private finalizeCalculation() {
		this.availability.push({name: "Last 7 Days", availability: (this.availabilityStorage[0].total / this.availabilityStorage[0].count) * 100});
		this.availability.push({name: "Last 30 Days", availability: (this.availabilityStorage[1].total / this.availabilityStorage[1].count) * 100});
		this.availability.push({name: "Total availability", availability: (this.availabilityStorage[2].total / this.availabilityStorage[2].count) * 100});
	}

}
