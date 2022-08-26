import { Startup } from "@ipare/core";
import "@ipare/inject";
import "@ipare/router";
import "@ipare/env";
import "@ipare/logger";
import { InjectType } from "@ipare/inject";
import { CbappService } from "./services/cbapp.service";
import { CollectionService } from "./services/collection.service";

export default <T extends Startup>(startup: T, mode: string) => {
  return startup
    .useVersion()
    .useEnv(mode)
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
    .useRouter();
};
