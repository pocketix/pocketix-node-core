import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {DataItem, Series} from "@swimlane/ngx-charts/lib/models/chart-data.model";

/**
 * Sparkline component
 * Allows to pass reference lines and automatically resized maximum or minimum Y when the reference lines are
 * Smaller / bigger than the y ticks
 */
@Component({
  selector: 'sparkline',
  templateUrl: './sparkline.component.html',
  styleUrls: ['./sparkline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SparklineComponent implements OnInit, OnChanges {
  /**
   * Sparkline name
   */
  @Input()
  name?: string;
  /**
   * Series to display should only contain one series or more, for stacking.
   * Don't overuse this as no legend is and should be shown
   */
  @Input()
  data!: Series[];
  /**
   * Chart reference lines. Useful for displaying maximum or minimum line, or any other thresholds.
   */
  @Input()
  referenceLines?: DataItem[];
  /**
   * Ignore passed reference lines. This option hides the checkbox and any interaction with reference lines.
   */
  ignoreReferenceLines: boolean = false;

  showReferenceLines: boolean = false;
  @Output()
  clickOnChart = new EventEmitter<any>();


  state: boolean = false;
  min!: number;
  max!: number;
  minY: number = 0;
  maxY: number = 0;
  loaded = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    const values = this.data[0].series.map(item => item.value);
    this.min = Math.min(...values);
    this.max = Math.max(...values);
    this.minY = this.min;
    this.maxY = this.max;
    this.loaded = true;
  }

  onSparkLineSwitch($event: any) {
    if (this.ignoreReferenceLines) {
      return;
    }

    this.showReferenceLines = !this.showReferenceLines && !!this.referenceLines;
    this.minY = this.showReferenceLines && this.referenceLines ? Math.min(...this.referenceLines?.map(item => item.value), this.min) : this.min;
    this.maxY = this.showReferenceLines && this.referenceLines ? Math.max(...this.referenceLines?.map(item => item.value), this.max) : this.max;
    $event['showReferenceLines'] = this.showReferenceLines;
    console.log(this.min, this.maxY, this.referenceLines);
    this.clickOnChart.emit($event);
  }
}
