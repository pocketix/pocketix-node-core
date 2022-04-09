import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {BarchartValues} from '../../model/barchart.model';
import {Series} from '@swimlane/ngx-charts/lib/models/chart-data.model';

@Component({
  selector: 'barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css'],
  encapsulation:  ViewEncapsulation.None
})
export class BarchartComponent implements OnInit, OnChanges, AfterViewInit {

  constructor(public currentElement: ElementRef) { }

  public values: BarchartValues = {} as BarchartValues;
  @Input() data: Series[] = [];
  @Output() clickOnChart = new EventEmitter<any>();
  @ViewChild('chart') chartElement;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() colorScheme: any;

  @Input() legendMapping: {};
  @Input() xAxisLabel?: string;
  @Input() yAxisLabel?: string;
  @Input() fillToNValues: number;
  @Input() xAxisTicks?: any[];
  @Input() yAxisTicks?: any[];
  @Input() fillTicks = false;

  @Input() sortFunction: (a: Series, b: Series) => number;

  private static fromEntries(iterable: Iterable<any>) {
    return Array.from(iterable).reduce((target, [key, value]) => {
      target[key] = value;
      return target;
    }, {});
  }

  private static isLegend($event: any) {
    return typeof $event === 'string';
  }

  ngOnInit(): void {
    this.update();
    this.values.visibleData = [...this.values.visibleData];
  }

  update() {
    const entries = this.legendMapping ?
      Object.values(this.legendMapping).map(item => [item, true]) : [];

    if (!entries && this.legendMapping === undefined) {
      return;
    }

    const data = this.data ? [...this.data] : [];

    if (this.fillTicks) {
      this.xAxisTicks.forEach(tick => {
        if (!data.find(series => series.name === tick)) {
          data.push({name: tick, series: []} as Series);
        }
      });
    }

    if (this.sortFunction) {
      data?.sort(this.sortFunction);
    }

    this.values.currentlyShown = BarchartComponent.fromEntries(entries);
    this.values = {currentlyShown: this.values.currentlyShown, data, visibleData: data} as BarchartValues;
  }

  onSelect($event: any) {
    if (!BarchartComponent.isLegend($event)) {
      this.clickOnChart.emit($event);
      return;
    }
    const key = $event.toString();

    if (this.values.currentlyShown[key] === undefined) {
      this.values.currentlyShown[key] = true;
    }

    this.values.currentlyShown[key] = !this.values.currentlyShown[key];
    this.handleUpdate();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.data = changes.data.currentValue;
    this.update();
    this.values.visibleData = [...this.values.visibleData];
  }

  private shouldBeEnabled(name: string) {
    return typeof this.values.currentlyShown[name] === 'undefined' ||  this.values.currentlyShown[name];
  }

  handleUpdate() {
    this.values.visibleData = this.values.data.map(item => ({
      name: item.name,
      series: item.series.map(series => ({
        name: series.name,
        value: this.shouldBeEnabled(series.name.toString()) ? series.value : 0
      }))
    }));

    const legend = Array.from(this.chartElement.chartElement.nativeElement.querySelector('.legend-labels').querySelectorAll('.legend-label-text'));

    Object.entries(this.values.currentlyShown).forEach(([item, status]) => {
        const currentElement = legend.find((span: HTMLElement) => span.innerHTML.includes(item.toString())) as HTMLElement;

        if (!!currentElement) {
          status ? currentElement.classList.remove('strike-trough') : currentElement.classList.add('strike-trough');
        }
      }
    );
  }

  ngAfterViewInit() {
    this.values.visibleData = [...this.values.visibleData];
  }
}
