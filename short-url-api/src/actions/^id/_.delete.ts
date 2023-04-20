import { Inject } from "@halsp/inject";
import { Action } from "@halsp/router";
import { CollectionService } from "../../services/collection.service";

export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    this.forbiddenMsg({ message: "not open" });

    // const id = this.requestParams.query.id;
    // if (!id) {
    //   return this.badRequestMsg({ message: "invalid id" });
    // }
    // if (!(await this.isExist(id))) {
    //   return this.notFoundMsg({ message: "the id is not exist" });
    // }

    // await Collections.url.doc(id).delete();
    // return this.noContent();
  }

  async isExist(id: string): Promise<boolean> {
    const countRes = await this.collectionService.url
      .where({
        _id: id,
      })
      .count();
    return !!countRes.total;
  }
}
