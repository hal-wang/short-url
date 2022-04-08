import { Action } from "@sfajs/router";

export default class extends Action {
  async invoke(): Promise<void> {
    this.redirect(`/w`, 302);
  }
}
