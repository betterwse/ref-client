/*
 * Copyright (c) 2024, BetterWealth FTS AB
 */
import { OrganizationWithUsers } from "./organization";

export interface UserProfileRepresentation {
  id: string;
  personalNumber: string;
  created: string; // YYYY-MM-DDTHH:MM:SS
  firstName: string;
  lastName: string;
  name: string;
  email?: string;
  newsletter: boolean;
  notifications: boolean;
  confirmEmail?: string;
  phone?: string;
  admin?: {
    uuid: string;
    name: string;
  };
  organization?: OrganizationWithUsers;
}