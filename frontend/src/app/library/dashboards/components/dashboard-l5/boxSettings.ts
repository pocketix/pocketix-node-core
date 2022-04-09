import {ApexChart} from "ng-apexcharts";

const chart = {
  height: 125,
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
    minWidth: 100,
    maxWidth: 100,
    offsetX: -20
  }
};

const grid = {
  padding: {
    left: 0,
    right: -10
  }
};

export {chart, plotOptions, yAxis, grid};
