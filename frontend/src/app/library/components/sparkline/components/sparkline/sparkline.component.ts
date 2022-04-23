import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataItem, Series} from "@swimlane/ngx-charts/lib/models/chart-data.model";

@Component({
  selector: 'sparkline',
  templateUrl: './sparkline.component.html',
  styleUrls: ['./sparkline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparklineComponent implements OnInit, AfterViewInit {
  @Input() name?: string;
  @Input() data!: Series[];
  @Input() referenceLines?: DataItem[];
  @Output() clickOnChart = new EventEmitter<any>();
  showReferenceLines: boolean = false;
  state: boolean = false;

  min!: number;
  max!: number;
  minY: number = 0;
  maxY: number = 0;
  loaded = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const values = this.data[0].series.map(item => item.value);
    this.min = Math.min(...values);
    this.max = Math.max(...values);
    this.minY = this.min;
    this.maxY = this.max;
    this.loaded = true;
  }

  onSparkLineSwitch($event: any) {
    this.showReferenceLines = !this.showReferenceLines && !!this.referenceLines;
    this.minY = this.showReferenceLines && this.referenceLines ? Math.min(...this.referenceLines?.map(item => item.value), this.min) : this.min;
    this.maxY = this.showReferenceLines && this.referenceLines ? Math.max(...this.referenceLines?.map(item => item.value), this.max) : this.max;
    $event['showReferenceLines'] = this.showReferenceLines;
    this.clickOnChart.emit($event);
  }
}
