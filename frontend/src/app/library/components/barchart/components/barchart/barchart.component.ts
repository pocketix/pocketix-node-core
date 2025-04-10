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
import {BarchartElementRef, BarchartEvent, BarchartEventValue, BarchartValues} from '../../model/barchart.model';
import {Series} from '@swimlane/ngx-charts/lib/models/chart-data.model';
import {LegendPosition} from "@swimlane/ngx-charts";
import {getTextWidth, waitForElement} from "../../../../dashboards/shared/resizeUtility";

@Component({
  selector: 'barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css'],
  encapsulation:  ViewEncapsulation.None
})
export class BarchartComponent implements OnInit, OnChanges, AfterViewInit {
  private font = "";
  private canvas: any;

  constructor(public currentElement: ElementRef) { }

  public values: BarchartValues = {} as BarchartValues;
  @Input() data: Series[] = [];
  @ViewChild('chart') chartElement: BarchartElementRef;
  @Input() xAxisTickFormatting: any;
  @Input() yAxisTickFormatting: any;
  @Input() colorScheme: any;
  @Input() legendMapping: {} | undefined;

  @Input() xAxisLabel!: string;
  @Input() yAxisLabel!: string;
  @Input() fillToNValues: number | undefined;
  @Input() xAxisTicks: any[] = [];
  @Input() yAxisTicks: any[] = [];
  @Input() fillTicks = false;
  @Input() hideSeriesOnClick = true;
  @Input() sortFunction: ((a: Series, b: Series) => number) | undefined;
  @Input() maxXAxisTickLength = 0;
  @Input() maxYAxisTickLength = 0;
  @Input() manuallyFixTicksOverflow = false;

  position = LegendPosition.Below;

  @Output() clickOnChart = new EventEmitter<BarchartEvent>();
  @Output() seriesHidden = new EventEmitter<BarchartEvent>();

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

    if (this.fillTicks && this.xAxisTicks) {
      this.xAxisTicks.forEach(tick => {
        if (!data.find(series => series.name === tick)) {
          data.push({name: tick, series: []} as Series);
        }
      });
    }

    if (this.sortFunction) {
      data?.sort(this.sortFunction);
    }

    this.values.currentlyShown = Object.fromEntries(entries);
    this.values = {currentlyShown: this.values.currentlyShown, data, visibleData: data} as BarchartValues;
  }

  onSelect($event: BarchartEventValue) {
    const isLegend = BarchartComponent.isLegend($event);
    const convertedEvent = {isLegend, value: $event};

    this.clickOnChart.emit(convertedEvent);

    if (!isLegend || !this.hideSeriesOnClick) {
      return;
    }

    const key = $event.toString();

    if (this.values.currentlyShown[key] === undefined) {
      this.values.currentlyShown[key] = true;
    }

    this.values.currentlyShown[key] = !this.values.currentlyShown[key];
    this.handleUpdate();
    this.seriesHidden.emit(convertedEvent);
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

    const legend = Array.from(this?.chartElement?.chartElement?.nativeElement?.querySelector('.legend-labels')?.querySelectorAll('.legend-label-text') || []);

    Object.entries(this.values.currentlyShown).forEach(([item, status]) => {
        // @ts-ignore
      const currentElement = legend.find((span: HTMLElement) => span.innerHTML.includes(item.toString())) as HTMLElement;

        if (!!currentElement) {
          status ? currentElement.classList.remove('strike-trough') : currentElement.classList.add('strike-trough');
        }
      }
    );
  }

  async ngAfterViewInit() {
    this.values.visibleData = [...this.values.visibleData];
    const element: any = await waitForElement('.bar:not(.hidden)');
    if (this.manuallyFixTicksOverflow) {
      new ResizeObserver(() => this.formattingHack()).observe(element);
    }
    element.parentElement.parentElement.parentElement.addEventListener('resize', () => this.formattingHack());
  }

  formattingHack() {
    const bar = document.querySelector('.bar:not(.hidden)');
    if (this.chartElement && bar) {
      const width = bar.getBoundingClientRect().width - 20;
      const fontSize = getComputedStyle(bar).fontSize;
      const fontWeight = getComputedStyle(bar).fontWeight;
      const fontFamily = getComputedStyle(bar).fontFamily;
      this.font = `${fontWeight} ${fontSize} ${fontFamily}`;

      Array.from(
        this.chartElement.chartElement.nativeElement.querySelectorAll('.tick')
      ).forEach((node: any) => {
        if (node.childNodes && node.childNodes.length === 2) {
          const title = node.childNodes[0];
          const text = node.childNodes[1];

          let textContent = title.innerHTML.trim();
          while (this.updateCanvas(textContent) > width) {
            textContent = textContent.slice(0, -1);
          }

          text.innerHTML = textContent;
        }
      });
    }
  }

  updateCanvas(textContent: string) {
    const {width, canvas} = getTextWidth(textContent, this.canvas, this.font);
    this.canvas = canvas;
    return width;
  }
}
