import "@sfajs/http";
import { SfaHttp } from "@sfajs/http";
import { setStartup } from "./src";

setStartup(new SfaHttp(), true).listen(2333);

console.log("start: http://localhost:2333");
