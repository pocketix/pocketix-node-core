import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breakAtSlash'
})
export class BreakAtSlashPipe implements PipeTransform {

  transform(value: string, split: boolean = false): unknown {
    if (!split) {
      return value;
    }

    const values = value.split("/");

    if (values.length === 1) {
      values.push("&nbsp;", "&nbsp;");
    }

    return values.join("<br>")
  }

}
