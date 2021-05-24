import { Action } from "@hal-wang/cloudbase-access";
import Collections from "../../lib/Collections";
import UrlItem from "../../models/UrlItem";
import { readFileSync } from "fs";

/**
 * @action long-url
 *
 * get source long url
 *
 * @input
 * @@query
 * @@@id {string} short url id
 * @output
 * @@codes
 * @@@302 success
 */
export default class extends Action {
  async invoke(): Promise<void> {
    const id = this.ctx.req.query.id;
    if (!id) {
      return this.errMsg(404, "invalid id");
    }
    if (id == "w" || id == "web") {
      this.redirect("w/");
      return;
    }

    const res = await Collections.url.doc(id).get();
    if (!res.data || !res.data.length) {
      return this.errMsg(404, "the id is not exist");
    }

    const url = res.data[0] as UrlItem;
    if (url.expire != undefined && url.expire < new Date().valueOf()) {
      return this.errMsg(403, "the url is overdue");
    }
    if (url.limit != undefined) {
      if (!url.limit) {
        return this.errMsg(403, "the url is out of limit");
      } else {
        await Collections.url.doc(id).update({
          limit: url.limit - 1,
        });
      }
    }

    this.redirect(url.long, 302);
  }

  errMsg(code: number, msg: string): void {
    let html = readFileSync(`${process.cwd()}/static/warning.html`, "utf-8");
    html = html.replace("{{warning-msg}}", msg);

    this.res(code, html, {
      "content-type": "text/html",
    });
  }
}
