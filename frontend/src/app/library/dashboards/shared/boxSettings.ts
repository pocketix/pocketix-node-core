import {ApexChart} from "ng-apexcharts";

const chart = {
  height: 100,
  type: "boxPlot"
} as ApexChart;

const plotOptions = {
  bar: {
    horizontal: true,
    barHeight: "50%"
  },
  boxPlot: {
    colors: {
      upper: "#e9ecef",
      lower: "#f8f9fa"
    }
  }
};

const yAxis = {
  labels: {
    minWidth: 0,
    maxWidth: 0,
    offsetX: 0
  }
};

const grid = {
  padding: {
    left: 10,
    right: 10,
    bottom: -15,
    top: -5
  }
};

export {chart, plotOptions, yAxis, grid};
