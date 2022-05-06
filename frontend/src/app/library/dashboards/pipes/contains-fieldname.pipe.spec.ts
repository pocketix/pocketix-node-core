import { ContainsFieldNamePipe } from './contains-fieldname.pipe';
import {DataItem} from "@swimlane/ngx-charts/lib/models/chart-data.model";

describe('ContainsFieldNamePipe', () => {
  let pipe: ContainsFieldNamePipe;
  const data = [{name: "name", value: 14}] as DataItem[];

  beforeEach(() => {
    pipe = new ContainsFieldNamePipe();
  })

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should find single perfect match', () => {
    expect(pipe.transform({'name' : data}, 'name')).toEqual(data);
  });

  it('should find single', () => {
    expect(pipe.transform({'stuff-name-stuff' : data}, 'name')).toEqual(data);
  });

  it('should not find', () => {
    expect(pipe.transform({'name' : data}, 'should not find')).toEqual([]);
  });

  it('should find single in multiple', () => {
    expect(pipe.transform({'name' : data, 'second' : []}, 'name')).toEqual(data);
  });
});
