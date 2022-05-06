import { Pipe, PipeTransform } from '@angular/core';
import {DataItem} from "@swimlane/ngx-charts/lib/models/chart-data.model";

@Pipe({
  name: 'containsFieldName'
})
export class ContainsFieldNamePipe implements PipeTransform {

  transform(value: {[key: string]: DataItem[] }, name: string, ...args: unknown[]): DataItem[] {
    const fieldData = Object.entries(value).find(([valueName, _]) => valueName.includes(name));
    console.log(fieldData, name);
    return fieldData ? fieldData[1] : [];
  }

}
