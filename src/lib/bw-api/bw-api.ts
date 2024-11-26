/*
 * Copyright (c) 2024, BetterWealth FTS AB
 */
import axios from "axios";

import { OrganizationNumber } from "./types/organization";
import { UserProfileRepresentation } from "./types/user";

export class AppApi {

  private readonly authToken: string;
  private readonly baseUrl: string;

  constructor(authToken: string, baseUrl: string) {
    this.authToken = authToken;
    this.baseUrl = baseUrl;
  }

  bwGet(path: string): Promise<any> {
    return axios.get(`${this.baseUrl}/${path}`, {
      // User API is primarly designed for web client usage, so we set the cookie header for authentication
      headers: {
        Cookie: `bw-auth=${this.authToken};`,
      }
    })
    .then((r) => r.data);
  }


  getUserProfile = (): Promise<UserProfileRepresentation> => {
    return this.bwGet("v1/user/@me")
      .then((response) => {
        if (response.organization) {
          response.organization.organizationNumber = OrganizationNumber.parseCanonical(response.organization.organizationNumber);
        }
        return response;
      });
  };
}