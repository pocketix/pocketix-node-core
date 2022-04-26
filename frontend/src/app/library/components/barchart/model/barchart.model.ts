import {DataItem} from '@swimlane/ngx-charts/lib/models/chart-data.model';

/**
 * State of the barchart
 */
type BarchartValues = {
  data: { name: string, series: DataItem[] }[],
  visibleData: { name: string, series: DataItem[] }[],
  currentlyShown: { [key: string]: boolean }
};

/**
 * Values that can be present when event is triggered.
 * The value is string, when the user clicked to the legend.
 */
type BarchartEventValue = string | { name: string, value: string, label: string, series: any };

/**
 * Barchart event wrapper. If isLegend === true then typeof value === string
 */
type BarchartEvent = {
  isLegend: boolean;
  value: BarchartEventValue;
}

/**
 * Element reference to ngx charts, should not be used outside this module
 */
type BarchartElementRef = {
  chartElement: {
    nativeElement: {
      querySelector: (arg0: string) =>
        { (): any; new(): any; querySelectorAll: { (arg0: string): Iterable<unknown> | ArrayLike<unknown>; new(): any; }; };
    };
  };
} | undefined;

export {BarchartValues, BarchartEvent, BarchartEventValue, BarchartElementRef};
