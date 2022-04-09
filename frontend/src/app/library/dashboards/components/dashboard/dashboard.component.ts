import {Component, OnInit} from '@angular/core';
import {cloneDeep, keys, remove, startCase} from "lodash";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LegendPosition} from "@swimlane/ngx-charts";
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	legend: boolean = true;
	showLabels: boolean = true;
	animations: any = BrowserAnimationsModule;
	xAxis: boolean = true;
	yAxis: boolean = true;
	showYAxisLabel: boolean = true;
	showXAxisLabel: boolean = true;
	xAxisLabel: string = 'Date';
	yAxisLabel: string = 'Temperature °C';
	timeline: boolean = true;
	position: LegendPosition = LegendPosition.Below;

	start: Date = new Date(0);
	stop: Date = new Date(2147483646 * 1000);
	step: number = 15;
	enabledLines = [
		{name: startCase("t1_temperature")},
		{name: startCase("dhw_temperature")},
		{name: startCase("outside_temperature")},
		{name: startCase("ch1_internal_temperature")}
	];

	public dhwOptions = DashboardComponent.generateToolTip("DHW Stability", [35, 45]);
	public t1Options = DashboardComponent.generateToolTip("Indoor Temperature Stability", [20, 30]);

	private static generateToolTip(title: string, domain: [number, number], height?: number) {
		return {
			"title": title,
			"axes": {
				"bottom": {
					"mapsTo": "value",
					"includeZero": "false",
					"domain": domain
				},
				"left": {
					"scaleType": "labels",
					"mapsTo": "group"
				}
			},
			"height": (height ? `${height}px` : "150px")
		};
	}

	public data = [];
	rawSeries: { [p: string]: [{ name: Date, value: any }] | any[] } | undefined;
	private keys: string[] = [];
	public lines: { [p: string]: { string: string; enabled: boolean } } = {};
	public allLines: { name: string; }[] | null = null;
	private toBoxPlot = ["dhw_temperature", "ch1_internal_temperature"];
	public boxPlots: any[] = [];
	public sparkLineData: any;
	public outsideSparkLine: { series: { name: Date; value: any }[]; name: string }[] = [];
	private method?: Database;

	constructor(private dataService: DataServiceService, private route: ActivatedRoute, private influx: InfluxServiceService) {
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => this.method = params && params.hasOwnProperty("influx") ? "influx": "mongo");
		console.log(this.method);
		this.prepareData();
	}

	render(): void {
		this.prepareData();
	}

	private dataHelper(records: ValueRecord[]): any {
		this.keys = keys(records[0].values);
		remove(this.keys, key => key === "indoor_temperature");
		this.rawSeries = Object.fromEntries(this.keys.map(key => [key, []]));
		this.boxPlots = []; // Hax - must stay there, or carbon won't redraw

		records.map(record => {
			this.keys.forEach(key => {
				if (this.rawSeries)
					this.rawSeries[key].push(DataServiceService.extractSeries(record, key));

				if (this.toBoxPlot.includes(key))
					this.boxPlots?.push(DataServiceService.extractBox(record, key));
			})
		});

		this.initLines();

		let value: { name: string; series: any[] | [{ name: Date; value: any; }]; }[] = [];

		Object.entries(this.lines).forEach(([key, line]) => {
			if (line.enabled && this.rawSeries)
				value.push({name: line.string, series: this.rawSeries[key]});
		});

		return value;
	}

	rawToSeries(key: string) {
		if (this.rawSeries)
			return [{name: startCase(key), series: cloneDeep(this.rawSeries[key])}];

		return [];
	}

	private initLines() {
		this.lines = Object.fromEntries(this.keys.map(key => [key, {
			string: startCase(key),
			enabled: this.isEnabledLine(startCase(key))
		}]));
		this.allLines = Object.values(this.lines).map(value => {
			return {name: value.string}
		});
	}

	private isEnabledLine(key: string): boolean {
		for (let line of this.enabledLines)
			if (line.name === key)
				return true;

		return false;
	}

	private prepareData(): void {
		this.data = [];
		this.dataService.getSpecificData(this.start.getTime() / 1000, this.stop.getTime() / 1000, this.step).subscribe(
			records => {
				this.data = this.dataHelper(records);
				// @ts-ignore
				this.start = this.data[0].series[0].name;
				// @ts-ignore
				this.stop = this.data[0].series.at(-1).name;
			}
		);

		console.log(this.data);
		const data = this.influx.getSpecificData(this.start.getTime() / 1000, this.stop.getTime() / 1000, this.step).subscribe(
			records => console.log(records)
		)

		this.dataService.getSparkLineData().subscribe(
			records => {
				this.sparkLineData = [];
				const padding: { name: string, series: any[] } = {name: "Ideal Temperature", series: []};
				const data: { name: Date; value: any; }[] = []
				const outsideSparkLine: { name: Date; value: any; }[] = [];
				records.map((record) => {
					data.push(DataServiceService.extractSeries(record, "ch1_internal_temperature"));
					outsideSparkLine.push(DataServiceService.extractSeries(record, "outside_temperature"));
					padding.series.push({name: new Date(record.date * 1000), value: 23})
				});
				this.sparkLineData = [{name: "Internal Temperature", series: data}, padding];
				this.outsideSparkLine = [{name: "Outside Temperature", series: outsideSparkLine}];
			}
		);
	}

	public get localStartTime(): string {
		return this.parseDateToLocalString(this.start);
	}

	public get localStopTime(): string {
		return this.parseDateToLocalString(this.stop);
	}

	public set localStartTime(value: string) {
		this.start = this.parseLocalStringToDate(value);
	}

	public set localStopTime(value: string) {
		this.stop = this.parseLocalStringToDate(value);
	}

	private parseDateToLocalString(date: Date) {
		let result: string;
		let dd = date.getDate().toString();
		let mm = (date.getMonth() + 1).toString();
		let hh = date.getHours().toString();
		let min = date.getMinutes().toString();
		dd = dd.length === 2 ? dd : "0" + dd;
		mm = mm.length === 2 ? mm : "0" + mm;
		hh = hh.length === 2 ? hh : "0" + hh;
		min = min.length === 2 ? min : "0" + min;
		result = [date.getFullYear(), '-', mm, '-', dd, 'T', hh, ':', min].join('');

		return result;
	}

	private parseLocalStringToDate(value: string): Date {
		return new Date(value);
	}
}
