import {DataItem} from '@swimlane/ngx-charts/lib/models/chart-data.model';

type BarchartValues = {
  data: {name: string, series: DataItem[]}[],
  visibleData: {name: string, series: DataItem[]}[],
  currentlyShown: {[key: string]: boolean}
};

export {BarchartValues};
