import {Component, ComponentFactoryResolver, Input, OnInit, ViewContainerRef} from '@angular/core';
import {ModalComponent} from "../modal/modal.component";

@Component({
	selector: 'app-availability',
	templateUrl: './availability.component.html',
	styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {
	@Input() rawSeries: { [p: string]: [{ name: Date, value: any }] | any[] } = {};
	@Input() extractor: any;
	public data: { name: string; value: number; key: string; }[] | undefined;
	public availability: number = 0;
	private count = 0;
	showXAxis = true;
	showYAxis = true;
	showLegend = true;
	units = "Average availability";
	modal: any;

	constructor(private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {
	}

	ngOnInit(): void {
	}


	createModal(sensor: string) {
		console.log(sensor);
		let factory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
		this.modal = this.viewContainerRef.createComponent(factory);
		let childComponent = this.modal.instance;
		childComponent.sensor = sensor;
		let data = this.extractor(sensor)
		console.log(data)
		childComponent.sensorData = data;
		// @ts-ignore
		childComponent.parentRef = this;
		childComponent.close = this.remove;
	}

	remove() {
		console.log(this);
		let vcrIndex: number = this.viewContainerRef.indexOf(this.modal as any);
		this.viewContainerRef.remove(vcrIndex);
	}
}
