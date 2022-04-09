import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
	public sensor: string | undefined;
	public sensorData: any | undefined;
	public close: any;
	@ViewChild('modal', { static: true }) input?: any;


	constructor() {
	}

	ngOnInit(): void {

	}

	ngAfterViewInit() {
		this.openModal(this.input);
	}

	openModal(template: TemplateRef<any>) {
	}
}
