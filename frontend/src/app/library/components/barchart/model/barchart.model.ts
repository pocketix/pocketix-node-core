import {DataItem} from '@swimlane/ngx-charts/lib/models/chart-data.model';

type BarchartValues = {
  data: { name: string, series: DataItem[] }[],
  visibleData: { name: string, series: DataItem[] }[],
  currentlyShown: { [key: string]: boolean }
};

type BarchartEventValue = string | { name: string, value: string, label: string, series: any };

type BarchartEvent = {
  isLegend: boolean;
  value: BarchartEventValue;
}

type BarchartElementRef = {
  chartElement: {
    nativeElement: {
      querySelector: (arg0: string) =>
        { (): any; new(): any; querySelectorAll: { (arg0: string): Iterable<unknown> | ArrayLike<unknown>; new(): any; }; };
    };
  };
} | undefined;

export {BarchartValues, BarchartEvent, BarchartEventValue, BarchartElementRef};
