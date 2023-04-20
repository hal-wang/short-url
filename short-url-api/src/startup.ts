import { HttpStartup } from "@halsp/http";
import "@halsp/inject";
import "@halsp/router";
import "@halsp/logger";
import "@halsp/static";
import { InjectType } from "@halsp/inject";
import { CbappService } from "./services/cbapp.service";
import { CollectionService } from "./services/collection.service";
import { getVersion } from "@halsp/env";

export default <T extends HttpStartup>(startup: T) => {
  return startup
    .use(async (ctx, next) => {
      ctx.res.set("version", (await getVersion()) ?? "");
      await next();
    })
    .useEnv()
    .useInject()
    .inject(CollectionService, InjectType.Singleton)
    .inject(CbappService, InjectType.Singleton)
    .useConsoleLogger()
    .use(async (ctx, next) => {
      const logger = await ctx.getLogger();
      logger.info("event: " + JSON.stringify(ctx.lambdaEvent));
      logger.info("context: " + JSON.stringify(ctx.lambdaContext));
      await next();
    })
    .useRouter()
    .useStatic({
      dir: "web",
      prefix: "w",
      listDir: false,
      useIndex: true,
      method: "GET",
      useExt: true,
      use404: true,
    });
};
