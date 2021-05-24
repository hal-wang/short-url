import { Database } from "@cloudbase/node-sdk";
import { Startup } from "@hal-wang/cloudbase-access";
import { isTest } from "../Global";
import * as tcb from "@cloudbase/node-sdk";

export default class Collections {
  private static getCollection(
    collection: string
  ): Database.CollectionReference {
    let name;
    if (isTest) name = `${collection}_test`;
    else name = collection;

    return Startup.current.ctx.getBag<tcb.Database.Db>("db").collection(name);
  }

  static get url(): Database.CollectionReference {
    return Collections.getCollection("short-url");
  }
}
