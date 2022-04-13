import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Input,
  ViewContainerRef
} from '@angular/core';
import {ModalComponent} from "../modal/modal.component";

export type Availability = {
  text: string;
  value: number;
  target: number;
}

@Component({
	selector: 'app-availability',
	templateUrl: './availability.component.html',
	styleUrls: ['./availability.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailabilityComponent implements AfterViewInit {
  @Input()
  availabilities!: Availability[];

	availability?: number;
	showXAxis = true;
	showYAxis = true;
	showLegend = true;
	units = "Average availability";
	modal: any;

	constructor(private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {
	}

	ngAfterViewInit(): void {
    console.log(this.availabilities)
    this.availability = Math.round(this.availabilities.reduce(
      (sum, availability) => sum + availability.value, 0
    ) / this.availabilities.length * 100) / 100;
    console.log(this.availability);
	}

	createModal(sensor: string) {
		console.log(sensor);
		let factory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
		this.modal = this.viewContainerRef.createComponent(factory);
		let childComponent = this.modal.instance;
		childComponent.sensor = sensor;
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
