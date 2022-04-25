import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as d3 from "d3";
import {ScaleBand, ScaleTime} from "d3";
import {OutputData} from "../../../../../generated/models/output-data";
import {SingleSimpleValue} from "../../../../../generated/models/single-simple-value";
import {Changes, SwitchDisplayClickedEvent} from "../../model/switch-display.model";

@Component({
  selector: 'switch-display',
  templateUrl: './switch-display.component.html',
  styleUrls: ['./switch-display.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SwitchDisplayComponent implements AfterViewInit {
  @Input()
  data!: OutputData[];
  @Input()
  states?: SingleSimpleValue[] = [];
  @Input()
  status!:string;
  @Input()
  start!: Date;
  @Input()
  colors: string[] = ['#5AA454', '#C7B42C', '#AAAAAA'];
  @Input()
  disableItemsOnLegendClick: boolean = true;
  @Output()
  switchDisplayClicked: EventEmitter<SwitchDisplayClickedEvent> = new EventEmitter<SwitchDisplayClickedEvent>();
  @Output()
  switchDisplayResized: EventEmitter<{ width: number, height: number }> = new EventEmitter<{ width: number, height: number }>();
  @Output()
  legendClicked: EventEmitter<string | number> = new EventEmitter<string | number>();

  filtered?: OutputData[];
  private mainChartElement!: any;
  private innerChartElement!: any;
  private tooltip!: any;

  @ViewChild('chart') chart?: ElementRef;
  private mappedStates: { [p: string]: any[] } = {};
  private enabledOrDisabledStates: {[p: string]: boolean} = {};
  private stackedData!: any[][][];
  private allStackedData!: any[][][];
  private xAxis!: ScaleTime<number, number>;
  private yAxis!: ScaleBand<string>;
  color!: d3.ScaleOrdinal<string, unknown>;

  constructor() { }

  ngAfterViewInit(): void {
    this.drawCustomChart();
  }

  changesStart!: Date;
  changesEnd!: Date;

  private getChangesDate(index: number): Date {
    if (index > this.data.length) {
      return this.changesEnd;
    }

    if (index < 0) {
      return this.changesStart;
    }

    return new Date(this.data[index].time);
  }

  private drawCustomChart() {
    const status = this.status;
    this.filtered = this.data.filter(item =>item.hasOwnProperty(status) && item[status] !== null);
    const mainElement = d3.select(this.chart?.nativeElement);

    if (!this.filtered?.length) {
      mainElement.append("span").attr("text", "No data");
      return;
    }

    const appendTo = mainElement.append("div").attr("class", "svg-container");
    this.data = this.filtered;
    this.changesStart = new Date(this.filtered[0].time);
    this.changesEnd = new Date(this.filtered[this.filtered.length - 1].time);

    if (this.changesStart.getMilliseconds() === this.changesEnd.getMilliseconds()) {
      this.changesEnd.setHours(this.changesEnd.getHours() + 1);
      this.filtered.push({...this.filtered[0], time: this.changesEnd.toISOString()});
    }

    const margin = {top: 0, right: 25, bottom: 30, left: 25};
    const width = 460 - margin.left - margin.right;
    const height = 70 - margin.top - margin.bottom;
    this.mappedStates = Object.fromEntries(this.states?.map(state => [state, [] as any[]]) || []);
    this.enabledOrDisabledStates = Object.fromEntries(this.states?.map(state => [state, true]) || []);

    this.mainChartElement = appendTo
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .style("height", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call((svg) => this.resize(svg));

    this.color = d3.scaleOrdinal()
      .domain(Object.keys(this.mappedStates))
      .range(this.colors);

    this.createLegend(mainElement);

    this.tooltip = mainElement
      .append("div")
      .attr("class", "tooltip")
      .style("background", "#495057")
      .style("color", "white");

    this.yAxis = d3.scaleBand()
      .domain([status])
      .range([height, 0])
      .padding(0.2);

    this.xAxis = d3.scaleTime()
      .domain([this.changesStart, this.changesEnd])
      .range([0, width]);

    this.mainChartElement.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(this.xAxis).tickSizeOuter(0).ticks(5));

    this.stackData();
    this.render();
  }

  private stackData() {
    const changes = this.filtered!.map((change, index) => [
      change[this.status].toString() as string,
      this.outputDataToChanges(change, index)
    ] as [string, Changes]);

    const data = changes.reduce((previousValue, [status, rest]) => {
      previousValue[status].push(rest);
      return previousValue;
    }, this.mappedStates);

    this.stackedData = Object.entries(data).map(([key, items]) => {
      const array = items.map(item => {
        const value = [item.start, item.stop];
        // @ts-ignore
        value.data = item;
        return value;
      });
      // @ts-ignore
      array.key = key;
      return array;
    });

    this.allStackedData = Object.entries(data).map(([key, items]) => {
      const array = items.map(item => {
        const value = [item.start, item.stop];
        // @ts-ignore
        value.data = item;
        return value;
      });
      // @ts-ignore
      array.key = key;
      return array;
    });
  }

  private render() {
    const registerEvents = (element: any) => element
      .on("mouseover", ($event: any) => this.mouseOver($event))
      .on("mousemove", ($event: any) => this.mouseMove($event))
      .on("mouseleave", ($event: any) => this.mouseLeave($event))
      .on("click", ($event: PointerEvent) => this.mouseClick($event));

    console.log("draw");
    this.innerChartElement?.selectAll("g > *")?.remove();
    this.innerChartElement = this.mainChartElement.append("g")
      .selectAll("g")
      .data(this.stackedData)
      .enter().append("g").attr("fill", (value: { key: string; }) => this.color(value.key))
      .attr("class", (value: { key: string; }) => SwitchDisplayComponent.getLegendBarColorClassName(value.key))
      .selectAll("rest")
      .data((d: any) => d)
      .enter();

    registerEvents(this.innerChartElement.append("rect")
      .attr("x", (d: (Date | d3.NumberValue)[]) => this.xAxis(d[0]))
      .attr("y", this.yAxis(this.status))
      .attr("height", 30)
      .attr("width", (data: (Date | d3.NumberValue)[]) => this.xAxis(data[1]) - this.xAxis(data[0])));

    this.innerChartElement.append("foreignObject")
      .attr("x", (data: (Date | d3.NumberValue)[]) => this.xAxis(data[0]))
      .attr("y", this.yAxis(this.status))
      .attr("height", 30)
      .attr("width", (data: (Date | d3.NumberValue)[]) => this.xAxis(data[1]) - this.xAxis(data[0]))
      .attr("text-anchor", "middle")
      .style("pointer-events", "none")
      .append("xhtml:div")
      .style("pointer-events", "none")
      .append("p")
      .text((d: { data: { [x: string]: { toString: () => any; }; }; }) => d.data[this.status].toString())
      .style("width", "100%")
      .style("text-align", "center")
      .style("pointer-events", "none")
      .style("margin-top", "6px");
    console.log(this.innerChartElement);
  }

  private createLegend(mainElement: any) {
    const legendContainer = mainElement
      .append("div")
      .attr("class", "legend-container");

    const legend = legendContainer.selectAll(".legend")
      .data(this.color.domain())
      .enter()
      .append("div")
      .attr("class", "legend")
      .on("click", ($event: any) => {
        const state = $event.target.__data__;
        $event.target.classList.toggle("legend-disabled");
        this.legendClicked.emit(state);
        if (this.disableItemsOnLegendClick) {
          console.log(this.allStackedData);
          this.enabledOrDisabledStates[state] = !this.enabledOrDisabledStates[state];
          const states = Object.entries(this.allStackedData).filter(([key, _]) =>
            this.enabledOrDisabledStates[key]).map(([item, _]) => item);
          // @ts-ignore
          this.stackedData = this.allStackedData.filter(item => states.includes(item.key));
          console.log(this.stackedData, states, this.enabledOrDisabledStates, this.allStackedData);
          this.render();
        }
      });

    legend.append("span")
      .attr("class", "legend-color")
      .style("pointer-events", "none")
      .style("background-color", (item: any) => this.color(item) as string);

    legend.append("span")
      .style("pointer-events", "none")
      .text((text: any) => text);
  }

  private static getLegendBarColorClassName (color: string) {
    return `legend-bar-${color}`;
  }

  private outputDataToChanges(change: OutputData, index: number): Changes {
    return {
      ...change,
      time: new Date(change.time),
      start: this.getChangesDate(index - 1),
      stop: this.getChangesDate(index)
    } as Changes;
  }

  resize(svg: any, aspect: number = 4) {
    const container = d3.select(svg.node().parentNode);

    const resize = (switchDisplayResized: EventEmitter<{ width: number, height: number }>) => {
      const height = parseInt(container.style('height'));
      const width = Math.round(height / aspect);
      svg.attr('width', width);
      svg.attr('height', height);
      switchDisplayResized.emit({width, height});
    }

    d3.select(window).on(
      'resize.' + container.attr('id'),
      () => resize(this.switchDisplayResized)
    );
  }

  private mouseMove (item: any) {
    const data = item.toElement.__data__.data;
    const allBoundingBox = item.target.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
    const boundingBox = item.target.parentElement.parentElement.getBoundingClientRect();
    this.tooltip
      .style("display", "initial")
      .html(`<div class="tooltip-div">
                        <h4 class="tooltip-heading">Status:${data[this.status]}</h4>
                        <span>Start:</span>
                        <span>${data.start.toLocaleString()}
                        </span>
                        <span>Stop:</span>
                        <span>${data.stop.toLocaleString()}</span>
                      </div>`)
      .style("left", `${item.clientX - boundingBox.left}px`)
      .style("top", `${boundingBox.height + boundingBox.top - allBoundingBox.top + 5}px`)
  };

  private mouseLeave (item: any) {
    item.fromElement.parentElement.classList.toggle("tooltip-active");
    this.tooltip
      .transition()
      .duration(200)
      .ease(d3.easeCubicOut)
      .style("opacity", 0)
      .on("end", () =>
        this.tooltip
          .style("display", "none")
          .html("")
      );
  };

  private mouseClick (event: PointerEvent) {
    const target = event?.target;
    // @ts-ignore
    const data = target.__data__ as SwitchDisplayElementData;
    this.switchDisplayClicked.emit({data: data, originalEvent: event});
  };

  private mouseOver (item: any) {
    item.toElement.parentElement.classList.toggle("tooltip-active");
    this.tooltip
      .transition()
      .duration(200)
      .ease(d3.easeCubicIn)
      .style("opacity", 0.9)
      .style("stroke", "black");
  };
}
