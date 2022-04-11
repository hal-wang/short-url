import { SfaCloudbase } from "@sfajs/cloudbase";
import { Startup } from "@sfajs/core";
import { InjectType } from "@sfajs/inject";
import "@sfajs/inject";
import "@sfajs/router";
import "@sfajs/req-deco";
import * as fs from "fs";
import { CbappService } from "./services/cbapp.service";
import * as dotenv from "dotenv";

const version = (() => {
  let path = "./package.json";
  while (!fs.existsSync(path)) {
    path = "../" + path;
  }
  const pkgStr = fs.readFileSync(path, "utf-8");
  return JSON.parse(pkgStr).version;
})();

export function setStartup<T extends Startup>(startup: T, dev: boolean): T {
  dotenv.config({
    path: "./.env",
  });
  if (dev) {
    dotenv.config({
      path: "./.env.local",
    });
  }

  return startup
    .use(async (ctx, next) => {
      ctx.res.setHeader("version", version);
      ctx.res.setHeader("demo", "short-url");
      await next();
    })
    .useInject()
    .inject(CbappService, CbappService, InjectType.Singleton)
    .useReqDeco()
    .useRouter({
      dir: dev ? "src/actions" : "actions",
    });
}

const startup = setStartup(new SfaCloudbase(), false);
export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("event", JSON.stringify(event));
  console.log("context", JSON.stringify(context));

  return await startup.run(event, context);
};
