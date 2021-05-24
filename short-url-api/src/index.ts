import { Response, Startup } from "@hal-wang/cloudbase-access";
import AppMiddleware from "@hal-wang/cloudbase-access-middleware-app";
import DbhelperMiddleware from "@hal-wang/cloudbase-access-middleware-dbhelper";

export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("event", event, context);
  setHeaders();

  return await new Startup(event, context)
    .use(() => new AppMiddleware())
    .use(() => new DbhelperMiddleware())
    .useRouter()
    .invoke();
};

function setHeaders(): void {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = <Record<string, unknown>>require("./package.json");
  Response.baseHeaders.version = config.version as string;
  Response.baseHeaders.demo = "todo";
}
