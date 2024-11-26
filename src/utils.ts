/*
 * Copyright (c) 2024, BetterWealth FTS AB
 */
import {
  Command,
  OptionValues,
} from "commander";
import { BwClient } from "./lib/bw-client/bw-client";

export const getParentCommandOptions = (command: Command, options: OptionValues = {}): OptionValues => {
  const opts = {...options, ...command.opts()};
  if (command.parent != null) {
    return getParentCommandOptions(command.parent, opts);
  }
  return opts;
};
  
export const getBwClient = async (options: OptionValues): Promise<BwClient> => {
  const bwClient = new BwClient(options.host);
  await bwClient.init(options.client_id, options.cert, options.password);
  return bwClient;
};
