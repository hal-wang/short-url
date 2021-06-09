import { Database } from "@cloudbase/node-sdk";
import { isTest } from "../Global";
import * as tcb from "@cloudbase/node-sdk";
import { HttpContext } from "sfa";

export default class Collections {
  public static ctx: HttpContext;

  private static getCollection(
    collection: string
  ): Database.CollectionReference {
    let name;
    if (isTest) name = `${collection}_test`;
    else name = collection;

    return this.ctx.bag<tcb.Database.Db>("CB_DB").collection(name);
  }

  static get url(): Database.CollectionReference {
    return Collections.getCollection("short-url");
  }
}
