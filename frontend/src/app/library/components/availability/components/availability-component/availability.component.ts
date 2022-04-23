import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Input,
  ViewContainerRef
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

	availability?: number;
	showXAxis = true;
	showYAxis = true;
	showLegend = true;
	units = "Average availability";
  displayModal: boolean = false;

	constructor(private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {
	}

	ngAfterViewInit(): void {
    console.log(this.availabilities)
    this.availability = Math.round(this.availabilities.reduce(
      (sum, availability) => sum + availability.value, 0
    ) / this.availabilities.length * 100) / 100;
    console.log(this.availability);
	}

  availabilityClick($event: any) {
    console.log($event)
    this.displayModal = true;
  }
}
