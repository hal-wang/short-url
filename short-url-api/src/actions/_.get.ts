import { Action } from "@halsp/router";

export default class extends Action {
  async invoke(): Promise<void> {
    console.log("this.path", typeof this.req.path);
    this.redirect(`/w`, 302);
  }
}
