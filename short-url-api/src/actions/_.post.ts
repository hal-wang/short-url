import { Inject } from "@halsp/inject";
import { Body } from "@halsp/pipe";
import { Action } from "@halsp/router";
import { CollectionService } from "../services/collection.service";
import { CreateDto } from "./dtos/create-dto";

const dynamicImport = new Function(
  "specifier",
  `return import(specifier);
  `
) as <T = any>(specifier: string) => Promise<T>;

export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  @Body
  private readonly body!: CreateDto;

  async invoke(): Promise<void> {
    const { url, custom } = this.body;
    const expire = Number(this.body.expire);
    const limit = Number(this.body.limit);
    console.log("this.body", this.body);

    if (!url) {
      this.badRequestMsg("The url is required");
      return;
    }

    const origin = this.ctx.req.headers["short-url-origin"];
    if (!origin) {
      this.badRequestMsg("no short-url-origin");
      return;
    }

    const obj = <Record<string, unknown>>{
      long: url,
      create_at: new Date().valueOf(),
    };
    if (!isNaN(expire) && expire > 0) {
      obj.expire = expire;
    }
    if (!isNaN(limit) && limit > 0) {
      obj.limit = limit;
    }

    let id: string;
    if (!!custom) {
      if (custom == "w" || custom == "web") {
        this.badRequestMsg("the custom url is exist");
        return;
      }
      if (await this.isExist(custom)) {
        this.badRequestMsg("the custom url is exist");
        return;
      } else {
        id = custom;
      }
    } else {
      id = await this.getNewId();
    }
    await this.collectionService.url.doc(id).set(obj);

    this.ok({
      url: `${origin}/${id}`,
    });
  }

  async getNewId(length = 4): Promise<string> {
    let times = 0;
    while (true) {
      if (times > 4) {
        return await this.getNewId(length + 1);
      }

      const nanoidModule = await dynamicImport<typeof import("nanoid")>(
        "nanoid"
      );
      const id = nanoidModule.nanoid(length);
      if (!(await this.isExist(id))) {
        return id;
      } else {
        times++;
      }
    }
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
