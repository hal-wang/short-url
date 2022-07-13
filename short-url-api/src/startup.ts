import { Startup } from "@ipare/core";
import "@ipare/inject";
import "@ipare/router";
import * as fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { InjectType } from "@ipare/inject";
import { CbappService } from "./services/cbapp.service";

export default <T extends Startup>(startup: T, mode?: string) => {
  const dev = mode == "development";
  if (dev) {
    dotenv.config({
      path: "../.env.local",
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
    .useRouter();
};

const version = (() => {
  const pkgPath = path.join(__dirname, "package.json");
  const pkgStr = fs.readFileSync(pkgPath, "utf-8");
  return JSON.parse(pkgStr).version;
})();
