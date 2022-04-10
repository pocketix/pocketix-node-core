import {first, tap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

class PathParameterAccessor {
  /**
   * Get parameter from query
   * @param route current route
   * @param field field to get
   */
  public static async getQueryParameter(route: ActivatedRoute, field: string): Promise<string | undefined> {
    let value;
    await route.params.pipe(tap(
        parameters => value = parameters[field]
      ), first()
    ).toPromise();

    return value;
  }

  /**
   * Get parameter from path
   * @param route current route
   * @param field field to get
   */
  public static async getPathParameter(route: ActivatedRoute, field: string): Promise<string | undefined> {
    let value;
    await route.queryParamMap.pipe(tap(
        query => value = query.get(field)
      ), first()
    ).toPromise();

    return value;
  }
}

export {PathParameterAccessor};
