/*
 * Copyright (c) 2024, BetterWealth FTS AB
 */

export const enum Pep {
  Yes = "YES",
  No = "NO",
  Related = "RELATED",
}

export const enum PepPosition {
  ChiefOfState = "CHIEF_OF_STATE",
  MemberOfParlament = "MEMBER_OF_PARLAMENT",
  Judge = "JUDGE",
  PublicCompany = "PUBLIC_COMPANY",
  AmbassadorOrOfficer = "AMBASSADOR_OR_OFFICER",
  AudityAuthority = "AUDIT_AUTHORITY",
  CentralBankMemberOfBoard = "CENTRAL_BANK_MEMBER_OF_BOARD",
  InternationalLeader = "INTERNATIONAL_LEADER",
  PublicFunction = "PUBLIC_FUNCTION",
}

export const enum PepRelation {
  Partner = "PARTNER",
  Parent = "PARENT",
  Child = "CHILD",
  ParentOfChild = "PARTNER_OF_CHILD",
  Assistant = "ASSISTANT",
  Other = "OTHER",
}

interface PrivacyPolicyAccept {
  updated?: string;
  value: boolean;
}

const enum InvestmentSize {
  LessThanMillion = "LT_MILLION",
  GreaterThanMillion = "GT_MILLION",
}

const enum Employment {
  Employed = "EMPLOYED",
  SelfEmployed = "SELF_EMPLOYED",
  Unemployed = "UNEMPLOYED",
  Pension = "PENSION",
  Student = "STUDENT",
  SickLeave = "SICK_LEAVE",
  Other = "OTHER",
}

const enum TransferSource {
  SweBank = "SWE_BANK",
  SweInsurance = "SWE_INSURANCE",
  Ess = "ESS",
}

const enum TransferPeriodicity {
   Monthly = "MONTHLY",
   MultiplePerYear = "MULTIPLE_PER_YEAR",
   Yearly = "YEARLY",
   Occasionally = "OCCASIONALLY",
}

export const enum CashSourceOptions {
  Savings = "SAVINGS",
  Inheritance = "INHERITANCE",
  Salary = "SALARY",
  RealEstateSale = "REAL_ESTATE_SALE",
  CompanySale = "COMPANY_SALE",
  BusinessOperatinos = "BUSINESS_OPERATIONS",
  TradeInterest = "TRADE_INTEREST",
  TradeProfit = "TRADE_PROFIT",
  Gambling = "GAMBLING",
}

export const enum KnowledgeTestType {
  Funds = "funds",
  Stocks = "stocks",
  SriPreference = "sri_preference",
}

enum SriPreferenceTestVersion {
  One = 1,
}

enum FundsTestVerison {
  One = 1,
}

enum StocksTestVersion {
  One = 1,
}

export interface KnowledgeTest {
  type: KnowledgeTestType;
  version: SriPreferenceTestVersion | FundsTestVerison | StocksTestVersion;
  completionDate?: string; // Date for test completion as YYYY-MM-DD
}

export interface CustomerKnowledgeMultiSelect {
  [index: string]: boolean;
}

interface CustomerKnowledge {
  pep: Pep;
  pepPosition?: PepPosition;
  pepRelation?: PepRelation;
  pepRelationPosition?: PepPosition;
  privacyPolicyAccept: PrivacyPolicyAccept;
  unrealizedLiquidAssets: InvestmentSize;
  liquidAssets: InvestmentSize;
  investmentSize: InvestmentSize;
  ownage: boolean;
  income?: number;
  employment: Employment;
  citizenship: string[];
  cashSources: CustomerKnowledgeMultiSelect;
  investmentPurpose?: CustomerKnowledgeMultiSelect;
  depositPeriodicity?: TransferPeriodicity;
  withdrawalPeriodicity?: TransferPeriodicity;
  transferSource?: TransferSource;
  taxResidenceSweden: boolean;
  completedKnowledgeTests: KnowledgeTest[];
  usTax: boolean;
  version?: number;
}

enum DocumentCategory {
  PreSalesAgreement = "PRE_SALES_AGREEMENT",
  InvestmentInstruction = "INVESTMENT_INSTRUCTION",
  AgreementCustomer = "AGREEMENT_CUSTOMER",
  AgreementAccount = "AGREEMENT_ACCOUNT",
  AgreementOther = "AGREEMENT_OTHER",
  CapitalAdequacyReport = "CAPITAL_ADEQUACY_REPORT",
  Other = "OTHER",
}

interface Document {
  category: DocumentCategory;
  documentId: string;
  documentUrl: string;
  title: string;
  accepted?: boolean;
  contentType: string;
}


interface SignableDocument {
  accepted: boolean | undefined;
  goalId?: string | undefined;
  document: Document;
}

export interface UserCreatePayload {
  clientId: string;
  signable: {
    customerKnowledge: CustomerKnowledge;
    documents: SignableDocument[];
    email: string;
    phone?: string;
    requestType: "onboarding";
  },
  signer: {
    personalNumber: string;
    givenName: string;
    surname: string;
  }
}