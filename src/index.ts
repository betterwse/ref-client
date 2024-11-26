/*
 * Copyright (c) 2024, BetterWealth FTS AB
 */
import {
  Command,
} from "commander";
import { initDemoCommands } from "./demo";

const program = new Command();

/* Common options */
const DEFAULT_CERT_PATH = "./demo-cert/key.pem";
const DEFAULT_CERT_PASSWORD = "qwerty123";
const DEFAULT_CERT_ID = "2802dba0-fc4f-48f1-b5c1-aa36771dd4a9";
const DEFAULT_API_HOST = "https://api.smettermelth.nu";

program
  .option("--cert <cert key file>", `Path to cert private key, defaults to ${DEFAULT_CERT_PATH}`, DEFAULT_CERT_PATH)
  .option("--password <cert password>", `Private kay password file, defaults to ${DEFAULT_CERT_PASSWORD}`, DEFAULT_CERT_PASSWORD)
  .option("--client_id <cert client id>", `BetterWealth internal cert id, defaults to ${DEFAULT_CERT_ID} (to be used with the demo cert)`, DEFAULT_CERT_ID)
  .option("--host <API host>", `API Host, Defaults to ${DEFAULT_API_HOST}`, DEFAULT_API_HOST);

initDemoCommands(program);

program.parse(process.argv);