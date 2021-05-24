import { Startup } from "@hal-wang/cloudbase-access";
import "@hal-wang/cloudbase-access-middleware-app";
import "@hal-wang/cloudbase-access-middleware-dbhelper";

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("env", event, context);

  return await new Startup(event, context)
    .use(async (ctx, next) => {
      ctx.res.headers.version = require("./package.json").version;
      ctx.res.headers.demo = "short-url";
      await next();
    })
    .useApp()
    .useDbhelper()
    .useRouter()
    .invoke();
};
