/*
 * Copyright (c) 2024, BetterWealth FTS AB
 */
import fs from "fs/promises";
import { pki } from "node-forge";
import {
  Method,
  sendRequest,
  signRequest,
} from "./bw-client-request";
import { UserCreatePayload } from "./types";
import { UserProfileRepresentation } from "../bw-api/types/user";

export interface UserAuthenticationResponse {
  authorities: string[];
  expiration: number;
  userUuid: string;
  authToken: string;
}

export class BwClient {

  private host: string;
  private clientId: string | undefined;
  private privateKey: pki.rsa.PrivateKey | undefined;

  constructor(host: string) {
    this.host = host;
  }

  async init(clientId: string, certPath: string, certPassword?: string | undefined): Promise<void> {
    if (this.clientId) {
      return; // Already initialized
    }
    try {
      const certData = await fs.readFile(certPath, "utf8");

      this.privateKey = this.loadCertificate(certData, certPassword);
      this.clientId = clientId;
    } catch (error: any) {
      throw new Error("Could not set certificate: " + error.message);
    }
  }

  loadCertificate(certData: string, password?: string): pki.rsa.PrivateKey {
    if (password) {
      return pki.decryptRsaPrivateKey(certData, password);
    } else {
      return pki.privateKeyFromPem(certData);
    }
  }

  async request<T>(uri: string, queryParams = {}, method: Method = "GET", body?: object): Promise<{data: T, headers: Record<string, any>}> {
    if (!this.clientId) {
      throw new Error("Client id is not set");
    }
    if (!this.privateKey) {
      throw new Error("Private key is not set");
    }
    const signed = signRequest(this.clientId, this.privateKey, uri, queryParams, method, {}, body);
    return sendRequest<T>(signed);
  }

  async authenticateUser(userId: string): Promise<UserAuthenticationResponse> {
    const res = await this.request<UserAuthenticationResponse>(`${this.host}/v2/b2b/auth/user/${userId}`, {}, "POST");
    return res.data;
  }

  async createUser(payload: UserCreatePayload): Promise<UserProfileRepresentation> {
    const res = await this.request<UserProfileRepresentation>(`${this.host}/v2/b2b/sign/user/create`, {}, "POST", payload);
    return res.data;
  }
}