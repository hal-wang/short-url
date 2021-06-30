import SfaCloudbase from "@sfajs/cloudbase";
import "@sfajs/router";
import Collections from "./lib/Collections";
import * as fs from "fs";

const version = (() => {
  let path = "./package.json";
  while (!fs.existsSync(path)) {
    path = "../" + path;
  }
  const pkgStr = fs.readFileSync(path, "utf-8");
  return JSON.parse(pkgStr).version;
})();

const startup = new SfaCloudbase()
  .use(async (ctx, next) => {
    ctx.res.setHeader("version", version);
    ctx.res.setHeader("demo", "short-url");
    await next();
  })
  .useCloudbaseApp()
  .useCloudbaseDbhelper()
  .use(async (ctx, next) => {
    Collections.ctx = ctx;
    await next();
  })
  .useRouter();

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("event", JSON.stringify(event));
  console.log("context", JSON.stringify(context));

  return await startup.run(event, context);
};
