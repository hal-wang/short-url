import { Database } from "@cloudbase/node-sdk";
import { isTest } from "../global";
import { Inject } from "@sfajs/inject";
import { CbappService } from "./cbapp.service";

export class CollectionService {
  @Inject
  private readonly cbappService!: CbappService;

  private getCollection(collection: string): Database.CollectionReference {
    let name;
    if (isTest) name = `${collection}_test`;
    else name = collection;

    return this.cbappService.db.collection(name);
  }

  get url(): Database.CollectionReference {
    return this.getCollection("short-url");
  }
}
