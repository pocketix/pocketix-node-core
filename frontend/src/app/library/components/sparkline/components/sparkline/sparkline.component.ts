import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Series} from "@swimlane/ngx-charts/lib/models/chart-data.model";

@Component({
  selector: 'sparkline',
  templateUrl: './sparkline.component.html',
  styleUrls: ['./sparkline.component.css']
})
export class SparklineComponent implements OnInit {
  @Input() name?: string;
  @Input() data?: Series;
  @Input() referenceLines?: [{name: string, value: number}];
  @Output() clickOnChart = new EventEmitter<any>();
  showReferenceLines: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSparkLineSwitch($event: any) {
    this.showReferenceLines = !this.showReferenceLines && !!this.referenceLines;
    $event['showReferenceLines'] = this.showReferenceLines;
    this.clickOnChart.emit($event);
  }
}
