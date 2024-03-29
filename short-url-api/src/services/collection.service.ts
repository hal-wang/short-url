import { Database } from "@cloudbase/node-sdk";
import { Inject } from "@halsp/inject";
import { CbappService } from "./cbapp.service";

export class CollectionService {
  @Inject
  private readonly cbappService!: CbappService;

  private getCollection(collection: string): Database.CollectionReference {
    return this.cbappService.db.collection(collection);
  }

  get url(): Database.CollectionReference {
    return this.getCollection("short-url");
  }
}
