/*
 * Updated variant of:
 * https://github.com/swimlane/ngx-charts/blob/master/projects/swimlane/ngx-charts/src/lib/gauge/linear-gauge.component.ts
 * The linear gauge doesn't allow the rendering of bullet graph threshold lines.
 * Copying the source graph and updating it to fit current needs is encouraged by Swimlane:
 * https://github.com/swimlane/ngx-charts/blob/master/docs/custom-charts.md
 * Files in ./directly-copied are directly copied from ngx-charts repository
 */
import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { scaleLinear } from 'd3-scale';

import {
  BaseChartComponent,
  calculateViewDimensions,
  ColorHelper, ScaleType,
  ViewDimensions
} from '@swimlane/ngx-charts';
import {DataItem} from "@swimlane/ngx-charts/lib/models/chart-data.model";
import {isPlatformBrowser} from "@angular/common";
import {VERDANA_FONT_WIDTHS_16_PX} from "./directly-copied/font-widths";
import {calculateTextWidth} from "./directly-copied/calculate-width";

enum ElementType {
  Value = 'value',
  Units = 'units'
}

/**
 * Component representing bullet chart
 */
@Component({
  selector: 'bullet-chart',
  templateUrl: './bullet-chart.component.html',
  styleUrls: ['./bullet-chart.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulletChartComponent extends BaseChartComponent implements AfterViewInit {
  @Input()
  min = 0;
  @Input()
  max = 100;
  @Input()
  value = 0;
  /**
   * Value to display bellow the chart
   */
  @Input()
  name = '';
  /**
   * String to append behind the value
   */
  @Input()
  units = '';
  @Input()
  previousValue = 0;
  @Input()
  valueFormatting: any;
  @Input()
  valueTextStyle: any;
  @Input()
  unitsTextStyle: any;
  @Input()
  ticksTextStyle: any;
  /**
   * Threshold colors
   */
  @Input()
  otherColors = ['#DDDDDD', '#BBBBBB', '#999999'];
  @Input()
  thresholds = [70, 50, 30];
  /**
   * Resize the text automatically
   */
  @Input()
  resizeAutomatically: boolean = false;

  @ViewChild('valueTextEl') valueTextEl?: ElementRef;
  @ViewChild('unitsTextEl') unitsTextEl?: ElementRef;

  dims: ViewDimensions = {width: this.width, height: this.height} as ViewDimensions;
  valueDomain?: [number, number];
  valueScale: any;

  colors?: ColorHelper;
  transform = '';
  margin: number[] = [10, 20, 10, 20];
  transformLine = '';

  valueResizeScale = 1;
  unitsResizeScale = 1;
  valueTextTransform = '';
  valueTranslate = '';
  unitsTextTransform = '';
  unitsTranslate = '';
  displayValue = '';
  hasPreviousValue = false;

  barOrientation: any = 'horizontal';
  emptyData = {} as DataItem;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  update(): void {
    this.thresholds = this.thresholds.filter(threshold => threshold !== undefined).sort().reverse();
    super.update();

    this.hasPreviousValue = this.previousValue !== undefined;
    this.max = Math.max(this.max, this.value);
    this.min = Math.min(this.min, this.value);
    if (this.hasPreviousValue) {
      this.max = Math.max(this.max, this.previousValue);
      this.min = Math.min(this.min, this.previousValue);
    }

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin
    });

    this.valueDomain = this.getValueDomain();
    this.valueScale = this.getValueScale();
    this.displayValue = this.getDisplayValue();

    this.setColors();

    const xOffset = this.margin[3] + this.dims.width / 2;
    const yOffset = this.margin[0] + this.dims.height / 2;

    this.transform = `translate(${xOffset}, ${yOffset})`;
    this.transformLine = `translate(${this.margin[3] + this.valueScale(this.previousValue)}, ${yOffset})`;
    this.valueTranslate = `translate(0, -20)`;
    this.unitsTranslate = `translate(0, 30)`;
  }

  getValueDomain(): [number, number] {
    return [this.min, this.max];
  }

  getValueScale(): any {
    if (this.valueDomain) {
      return scaleLinear().range([0, this.dims.width]).domain(this.valueDomain);
    }
  }

  getTickTranslate(tick: number): any {
    const moveX = this.margin[3] + this.valueScale(tick);
    return `translate(${moveX}, ${this.height / 2 + 30})`;
  }

  getDisplayValue(): string {
    if (this.valueFormatting) {
      return this.valueFormatting(this.value);
    }
    return this.value.toLocaleString();
  }

  scaleText(element: ElementType, repeat: boolean = true): void {
    if (!this.resizeAutomatically) {
      return;
    }

    let el;
    let resizeScale;
    if (element === ElementType.Value) {
      el = this.valueTextEl;
      resizeScale = this.valueResizeScale;
    } else {
      el = this.unitsTextEl;
      resizeScale = this.unitsResizeScale;
    }

    const { width, height } = el?.nativeElement.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    const oldScale = resizeScale;
    resizeScale = this.getResizeScale(width, resizeScale, height);

    if (resizeScale !== oldScale) {
      if (element === ElementType.Value) {
        this.valueResizeScale = resizeScale;
        this.valueTextTransform = `scale(${resizeScale}, ${resizeScale})`;
      } else {
        this.unitsResizeScale = resizeScale;
        this.unitsTextTransform = `scale(${resizeScale}, ${resizeScale})`;
      }
      this.cd.markForCheck();
      if (repeat && isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.scaleText(element, false);
        }, 50);
      }
    }
  }

  private getResizeScale(width: number, resizeScale: number, height: number) {
    const availableWidth = this.dims.width;
    const availableHeight = Math.max(this.dims.height / 2 - 15, 0);
    const resizeScaleWidth = Math.floor((availableWidth / (width / resizeScale)) * 100) / 100;
    const resizeScaleHeight = Math.floor((availableHeight / (height / resizeScale)) * 100) / 100;
    return Math.min(resizeScaleHeight, resizeScaleWidth);
  }

  scaleTextSSR(element: string) {
    const value = element === 'value' ? this.displayValue : this.units;
    const width = calculateTextWidth(VERDANA_FONT_WIDTHS_16_PX, value, 10);
    const height = 25;

    const resizeScale = this.getResizeScale(width, 1, height);

    if (element === 'value') {
      this.valueResizeScale = resizeScale;
      this.valueTextTransform = `scale(${resizeScale}, ${resizeScale})`;
    } else {
      this.unitsResizeScale = resizeScale;
      this.unitsTextTransform = `scale(${resizeScale}, ${resizeScale})`;
    }

    this.cd.markForCheck();
  }

  onClick(): void {
    this.select.emit({
      name: 'Value',
      value: {
        min: this.min,
        max: this.max,
        value: this.value,
        name: this.name,
        units: this.units,
        previousValue: this.previousValue
      }
    });
  }

  setColors(): void {
    this.colors = new ColorHelper(this.scheme, 'ordinal' as ScaleType, [this.value], this.customColors);
  }
}
