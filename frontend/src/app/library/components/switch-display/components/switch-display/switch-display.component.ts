import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import * as d3 from "d3";
import {OutputData} from "../../../../../generated/models/output-data";
import {SingleSimpleValue} from "../../../../../generated/models/single-simple-value";

type Chages = OutputData | {time: Date, start: Date, stop: Date};

@Component({
  selector: 'app-switch-display',
  templateUrl: './switch-display.component.html',
  styleUrls: ['./switch-display.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SwitchDisplayComponent implements OnInit {
  @Input()
  data!: OutputData[];
  @Input()
  states?: SingleSimpleValue[] = [];

  constructor() { }

  ngOnInit(): void {
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
    this.changesStart = new Date(this.data[0].time);
    this.changesEnd = new Date(this.data[this.data.length - 1].time);

    const margin = {top: 10, right: 30, bottom: 20, left: 60};
    const width = 460 - margin.left - margin.right;
    const height = 80 - margin.top - margin.bottom;
    const devices = ["boiler"]
    const states = Object.fromEntries(this.states?.map(state => [state, [] as any[]]) || []);
    const mainElement = d3.select("#new-chart");

    const appendTo = mainElement.append("div").attr("class", "svg-container");

    const svg = appendTo
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .style("height", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(this.resize);

    const color = d3.scaleOrdinal()
      .domain(Object.keys(states))
      .range(['#5AA454', '#C7B42C', '#AAAAAA']);

    const legendContainer = mainElement
      .append("div")
      .attr("class", "legend-container");

    const legend = legendContainer.selectAll(".legend")
      .data(color.domain())
      .enter()
      .append("div")
      .attr("class", "legend")

    legend.append("span")
      .attr("class", "legend-color")
      .style("background-color", item => color(item) as string)

    legend.append("span")
      .text(text => text);

    const tooltip = mainElement
      .append("div")
      .attr("class", "tooltip")
      .style("background", "#495057")
      .style("color", "white");

    const mouseOver = (item: any) => {
      item.toElement.parentElement.classList.toggle("tooltip-active")
      tooltip
        .transition()
        .duration(200)
        .ease(d3.easeCubicIn)
        .style("opacity", 0.9)
        .style("stroke", "black");
    }

    const mouseMove = (item: any) => {
      const data = item.toElement.__data__.data;
      const allBoundingBox = item.target.parentElement.parentElement.parentElement.parentElement.getBoundingClientRect();
      const boundingBox = item.target.parentElement.parentElement.getBoundingClientRect();
      tooltip
        .html(`<div style="display: flex; flex-direction: column;">
                        <h4 style="padding: 0; margin: 0">Status:${data[status]}</h4>
                        <span>Start:</span>
                        <span>${data.start.toLocaleString()}
                        </span>
                        <span>Stop:</span>
                        <span>${data.stop.toLocaleString()}</span>
                      </div>`)
        .style("left", `${item.clientX - boundingBox.left}px`)
        .style("top", `${boundingBox.height + boundingBox.top - allBoundingBox.top + 5}px`)
    }

    const mouseLeave = (item: any) => {
      item.fromElement.parentElement.classList.toggle("tooltip-active");
      tooltip
        .transition()
        .duration(200)
        .ease(d3.easeCubicOut)
        .style("opacity", 0);
    }

    const yAxis = d3.scaleBand()
      .domain(devices)
      .range([height, 0])
      .padding(0.2);

    const xAxis = d3.scaleTime()
      .domain([this.changesStart, this.changesEnd])
      .range([0, width]);

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xAxis).tickSizeOuter(0).ticks(5));

    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yAxis));

    console.log(this.data);
    const status = "boiler_status"

    const changes = this.data.map((change, index) => [
      change[status].toString() as string,
      this.outputDataToChanges(change, index)
    ] as [string, Chages]);

    console.log(changes);

    const data = changes.reduce((previousValue, [status, rest]) => {
      previousValue[status].push(rest);
      return previousValue;
    }, states);

    console.log(data);
    const stackedData = Object.entries(data).map(([key, items]) => {
      const array = items.map(item => {
        const value = [item.start, item.stop];
        // @ts-ignore
        value.data = item;
        return value;
      })
      // @ts-ignore
      array.key = key;
      return array;
    });
    console.log(stackedData);

    const registerEvents = (element: any) => element.on("mouseover", mouseOver)
      .on("mousemove", mouseMove)
      .on("mouseleave", mouseLeave);

    const test = svg.append("g")
      .selectAll("g")
      .data(stackedData)
      // @ts-ignore
      .enter().append("g").attr("fill", value => color(value.key))
      // @ts-ignore
      .attr("class", value => this.getLegendBarColorClassName(value.key))
      .selectAll("rest")
      .data(d => d)
      .enter();

    registerEvents(test.append("rect")
      .attr("x", d => xAxis(d[0]))
      // @ts-ignore
      .attr("y", d => yAxis(d.data.sensor as unknown as string) || null)
      .attr("height", 35)
      .attr("width", data => xAxis(data[1]) - xAxis(data[0])));

    test.append("foreignObject")
      .attr("x", data => xAxis(data[0]))
      // @ts-ignore
      .attr("y", d => yAxis(d.data.sensor as unknown as string) || null)
      .attr("height", 35)
      .attr("width", data => xAxis(data[1]) - xAxis(data[0]))
      .attr("text-anchor", "middle")
      .style("pointer-events", "none")
      .append("xhtml:div")
      .style("pointer-events", "none")
      .append("p")
      // @ts-ignore
      .text((d) => d.data[status].toString())
      .style("width", "100%")
      .style("text-align", "center")
      .style("pointer-events", "none")
      .style("margin-top", "8px");
  }

  private getLegendBarColorClassName (color: string) {
    return `legend-bar-${color}`;
  }

  private outputDataToChanges(change: OutputData, index: number): Chages {
    return {
      ...change,
      time: new Date(change.time),
      start: this.getChangesDate(index - 1),
      stop: this.getChangesDate(index)
    };
  }

  resize(svg: any, aspect: number = 4) {
    const container = d3.select(svg.node().parentNode);

    const resize = () => {
      const height = parseInt(container.style('height'));
      svg.attr('width', Math.round(height / aspect));
      svg.attr('height', height);
    }

    // add a listener so the chart will be resized
    // when the window resizes
    // multiple listeners for the same event type
    // requires a namespace, i.e., 'click.foo'
    // api docs: https://goo.gl/F3ZCFr
    d3.select(window).on(
      'resize.' + container.attr('id'),
      resize
    );
  }

}
