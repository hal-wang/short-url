import { Action } from "@ipare/router";
import UrlItem from "../../entities/url-item";
import { readFileSync } from "fs";
import { Inject } from "@ipare/inject";
import { CollectionService } from "../../services/collection.service";

export default class extends Action {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const id = this.ctx.req.params.id;
    if (!id) {
      return this.errMsg(404, "invalid id");
    }
    if (id == "w" || id == "web") {
      this.redirect("w/");
      return;
    }

    const res = await this.collectionService.url.doc(id).get();
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
        await this.collectionService.url.doc(id).update({
          limit: url.limit - 1,
        });
      }
    }

    this.redirect(url.long, 302);
  }

  errMsg(code: number, msg: string): void {
    let html = readFileSync(`${process.cwd()}/static/warning.html`, "utf-8");
    html = html.replace("{{warning-msg}}", msg);

    this.ctx.res.status = code;
    this.ctx.res.body = html;
    this.ctx.res.setHeader("content-type", "text/html");
  }
}
