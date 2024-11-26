/*
 * Copyright (c) 2024, BetterWealth FTS AB
 */
import {
  Command,
} from "commander";
import { AppApi } from "./lib/bw-api/bw-api";
import {
  getBwClient,
  getParentCommandOptions,
} from "./utils";
import userCreatePayload from "./request-templates/user-create.json";
import { UserCreatePayload } from "./lib/bw-client/types";

const DEFAULT_CLIENT_ID = "test";

export const initDemoCommands = (program: Command): Command => {

  const demo = program.command('demo');
  demo
    .command('authenticate-user')
    .requiredOption('--uuid <string>', 'Id of user to authenticate')
    .action(async (_options, program) => {
      try {
        const options = getParentCommandOptions(program);
        const client = await getBwClient(options);
        const userId = options!.uuid;
        const authenticationResponse = await client.authenticateUser(userId);
        console.log(`Authenticate user ${authenticationResponse.userUuid} using certificate`);
  
        const userApi = new AppApi(authenticationResponse.authToken, options.host);
        const userProfile = await userApi.getUserProfile();
        console.log("Fetched user meta using user api");
        console.log(JSON.stringify(userProfile, null, 2));
      } catch (err) {
        program.error("Command execution failed: \n" + err, { exitCode: 1});
        program.exit(1);
      }
  });

  demo
    .command('create-user')
    .requiredOption('--ssn <string>', 'SSN of user to create')
    .option('--client <string>', 'Client to connect user to, defaults to "test"', DEFAULT_CLIENT_ID)
    .action(async (_options, program) => {
      try {
        const options = getParentCommandOptions(program);
        const client = await getBwClient(options);
        const createPayload = userCreatePayload as UserCreatePayload;
        // Set ssn and client id to payload
        createPayload.signer.personalNumber = options.ssn;
        createPayload.clientId = options.client;

        // Create user
        const userCreateResponse = await client.createUser(userCreatePayload as UserCreatePayload);

        console.log("User created");
        console.log(JSON.stringify(userCreateResponse, null, 2));

      } catch (err) {
        program.error("Command execution failed: \n" + err, { exitCode: 1});
        program.exit(1);
      }
  });

  return program;
}