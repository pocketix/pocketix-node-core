import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-switch-display',
  templateUrl: './switch-display.component.html',
  styleUrls: ['./switch-display.component.css']
})
export class SwitchDisplayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  changes = [
    {
      _result: 0,
      table: 0,
      time: '2022-03-20T09:38:25.599Z',
      doorState: 'open',
      deviceUid: 'dooooor'
    },
    {
      _result: 0,
      table: 0,
      time: '2022-03-20T10:38:25.599Z',
      doorState: 'closed',
      deviceUid: 'dooooor'
    },
    {
      _result: 0,
      table: 0,
      time: '2022-03-20T11:38:25.599Z',
      doorState: 'open',
      deviceUid: 'dooooor'
    },
    {
      _result: 0,
      table: 0,
      time: '2022-03-20T12:38:25.599Z',
      doorState: 'closed',
      deviceUid: 'dooooor'
    }
  ];

  changesStart = new Date('2022-03-20T09:38:25.599Z');
  changesEnd = new Date('2022-03-20T12:38:25.599Z')

  private getChangesDate(index: number): Date {
    if (index > this.changes.length) {
      return this.changesEnd;
    }

    if (index < 0) {
      return this.changesStart;
    }

    return new Date(this.changes[index].time);
  }

  private drawCustomChart() {
    const margin = {top: 10, right: 30, bottom: 20, left: 70};
    const width = 460 - margin.left - margin.right;
    const height = 100 - margin.top - margin.bottom;
    const devices = ["dooooor"]
    const states = {open: [], closed: []} as {open: any[], closed: any[]};
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
      .range(['#e41a1c', '#377eb8', '#4daf4a']);

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
                        <h4 style="padding: 0; margin: 0">Status:${data.doorState}</h4>
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

    const data = this.changes.map((change, index) => [change.doorState, {
      ...change,
      time: new Date(change.time),
      start: this.getChangesDate(index - 1),
      stop: this.getChangesDate(index)
    }]).reduce((previousValue, [status, rest]) => {
      // @ts-ignore
      previousValue[status].push(rest);
      return previousValue;
    }, states);
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
      .attr("y", d => yAxis(d.data.deviceUid as unknown as string) || null)
      .attr("height", 50)
      .attr("width", data => xAxis(data[1]) - xAxis(data[0])));

    test.append("foreignObject")
      .attr("x", data => xAxis(data[0]))
      // @ts-ignore
      .attr("y", d => yAxis(d.data.deviceUid as unknown as string) || null)
      .attr("height", 50)
      .attr("width", data => xAxis(data[1]) - xAxis(data[0]))
      .attr("text-anchor", "middle")
      .style("pointer-events", "none")
      .append("xhtml:div")
      .style("pointer-events", "none")
      .append("p")
      // @ts-ignore
      .text((d) => d.data.doorState)
      .style("width", "100%")
      .style("text-align", "center")
      .style("pointer-events", "none");
  }

  private getLegendBarColorClassName (color: string) {
    return `legend-bar-${color}`;
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
