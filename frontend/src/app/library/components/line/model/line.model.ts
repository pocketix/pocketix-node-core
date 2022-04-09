interface LineState {
  selectedKpis: { [key: string]: string }[];
  dates: Date[];
  selectedAggregationOperation: any;
  selectedDevicesToCompareWith: any[];
}

export {LineState};
