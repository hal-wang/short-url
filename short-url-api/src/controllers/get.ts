import { Action } from "@hal-wang/cloudbase-access";
import Collections from "../lib/Collections";
import * as nanoid from "nanoid";
import Validate from "../lib/Validate";

/**
 * @action short-url
 *
 * create a short url
 *
 * @input
 * @@params
 * @@@url {string} long url
 * @@@expire {number} expire time
 * @@@custom {string} custom url
 * @@@limit {number} the limit of short url
 * @output
 * @@codes
 * @@@200 success
 * @@body
 * @@@url {string} short url
 */
export default class extends Action {
  async invoke(): Promise<void> {
    const url = this.ctx.req.params.url;
    const custom = this.ctx.req.params.custom;
    const expire = Number(this.ctx.req.params.expire);
    const limit = Number(this.ctx.req.params.limit);

    if (!url || !Validate.isUrl(url)) {
      this.redirect(`/w`, 302);
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
        this.badRequestMsg({ message: "the custom url is exist" });
        return;
      }
      if (await this.isExist(custom)) {
        this.badRequestMsg({ message: "the custom url is exist" });
        return;
      } else {
        id = custom;
      }
    } else {
      id = await this.getNewId();
    }
    await Collections.url.doc(id).set(obj);

    const origin = this.ctx.req.headers["short-url-origin"];
    if (!origin) {
      this.badRequestMsg({ message: "no short-url-origin" });
      return;
    }
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

      const id = nanoid.nanoid(length);
      if (!(await this.isExist(id))) {
        return id;
      } else {
        times++;
      }
    }
  }

  async isExist(id: string): Promise<boolean> {
    const countRes = await Collections.url
      .where({
        _id: id,
      })
      .count();
    return !!countRes.total;
  }
}
