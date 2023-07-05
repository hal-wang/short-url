import "@halsp/lambda";
import startup from "./startup";
import { Startup } from "@halsp/core";

const app = startup(new Startup().useLambda());
export const main = (e: any, c: any) => app.run(e, c);
