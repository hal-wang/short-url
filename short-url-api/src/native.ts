import "@halsp/native";
import startup from "./startup";
import { Startup } from "@halsp/core";

startup(new Startup().useNative()).listen();
