/*
 * Copyright (c) 2024, BetterWealth FTS AB
 */
const PREFIX = "se";
const SEP = "-";

export class OrganizationNumber {

  private readonly raw: string;

  constructor(raw: string) {
    this.raw = raw;
  }

  static parseCanonical(canonical: string) {
    const parts = canonical.split(SEP);
    if (parts.length !== 2) {
      throw new Error("invalid separator in " + canonical);
    }
    if (parts[0] !== PREFIX) {
      throw new Error("invalid organization number prefix in " + canonical);
    }
    if (parts[1].length !== 10) {
      throw new Error("invalid organization number length in " + canonical);
    }
    return new OrganizationNumber(parts[1]);
  }

  toCanonical(): string {
    return PREFIX + SEP + this.raw;
  }

  toFormatted(): string {
    return this.raw.substr(0, 6) + "-" + this.raw.substr(6);
  }
}


export enum OrganizationRole {
  /**
   * User can login and edit
   */
  Editor = "editor",
  /**
   * User can only login but they cannot edit anything
   */
  Viewer = "viewer",
  /**
   * User can't log in
   */
  None = "none",
}


export enum OrganizationStatus {
  /**
   * Organization is under setup, still not visible for the user
   */
  Pending = "pending",
  /**
   * Organization data is being reviewed, visible for user,
   * but not accessible
   */
  Reviewing = "reviewing",
  /**
   * Organization is active
   */
  Active = "active",
  /**
   * Organization will become deleted once all data and records has expired
   */
  PendingDelete = "pending_delete",
  /**
   * Organization is deleted
   */
  Deleted = "deleted",
  /**
   * Organisation onboarding progress has staled, this can be for
   * example since an organization has stopped responding or
   * some paper work take very long. From a user and administrator
   * perspective Stale works much like Reviewing, but it does not
   * trigger alarms about pending reviews
   *
   * Items in state Stale has to e monitored manually
   */
  Stale = "stale",
}

interface OrganizationUser {
  uuid: string;
  organizationRole: OrganizationRole;
  userId: string;
  userName: string;
}

export interface OrganizationWithUsers {
  uuid: string;
  name: string;
  email: string;
  lei: string;
  confirmEmail?: string;
  status: OrganizationStatus;
  principal: {
    personalNumber: string;
    name: string;
  };
  users: OrganizationUser[];
}