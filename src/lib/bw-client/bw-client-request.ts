/*
 * Copyright (c) 2024, BetterWealth FTS AB
 */
import axios, {  AxiosError, AxiosRequestConfig } from "axios";
import { pki, md } from "node-forge";



const REQUEST_ERROR_NAME = "RequestError";

export interface QueryParams {
  [index: string]: string | number | undefined;
  expire?: number;
  client_id?: string;
  body_hash?: string;
}

export type Method =  "GET" | "POST" | "PATCH";
export interface SignedRequest {
  signedUri: string;
  signature: string;
  method: Method;
  body: any | undefined;
  headers: object;
}

export class RequestError extends Error {
  code: number | undefined;

  constructor(message: string, code: string | number | undefined) {
    super(message);
    this.name = REQUEST_ERROR_NAME;
    this.code = code ? parseIntIfString(code) : undefined;
  }
}

export const isRequestError = (error: any): error is RequestError => {
  return error.name === REQUEST_ERROR_NAME;
};


const parseIntIfString = (val: string | number): number => {
  if (typeof val === "number") {
    return val;
  }
  return parseInt(val);
};


function signMessage(message: string, privateKey: pki.rsa.PrivateKey) {
  const mdInstance = md.sha256.create();
  mdInstance.update(message, "utf8");
  const signature = privateKey.sign(mdInstance);
  return Buffer.from(signature, "binary").toString("base64");
}

export function signRequest(
    clientId: string,
    privateKey: pki.rsa.PrivateKey,
    uri: string,
    queryParams = {} as QueryParams,
    method: Method = "GET",
    requestHeaders?: object,
    body?: any,
): SignedRequest {

  const getTargetURI = (uriObj: string | {host: string, path: string}) => {
    if (typeof uriObj === "object") {
      return uriObj.host + uriObj.path;
    }
    return uriObj;
  };

  queryParams.expire = 5000 + (new Date()).getTime();
  queryParams.client_id = clientId;

  // Sort and append query params
  const query = Object.keys(queryParams)
    .map((key) => `${key}=${queryParams[key]}`)
    .sort((a, b) => a.localeCompare(b))
    .join("&");
  const targetUri = `${getTargetURI(uri)}?${query}`;

  // Generate the signature
  const signature = signMessage(targetUri, privateKey);
  const headers = Object.assign(requestHeaders || {}, {
    "bw-signature": signature,
  });

  return {
    signedUri: `${getTargetURI(uri)}?${buildQuery(queryParams)}`,
    signature,
    method: method,
    body: body,
    headers,
  };
}

function buildQuery(query: QueryParams): string {
  return Object.keys(query)
  .map((key) => `${key}=${query[key] ?? ""}`)
  .join("&");
}

export async function sendRequest<R>(signedRequest: SignedRequest, bodyAsJson = true): Promise<{data: R, headers: Record<string, any>}> {
  const options: AxiosRequestConfig = {
    url: signedRequest.signedUri,
    method: signedRequest.method,
    headers: signedRequest.headers,
  };

  if (signedRequest.body) {
    if (bodyAsJson) {
      // Options.data will be json encoded
      options.data = signedRequest.body;
      options.headers = {
        ...options.headers,
        "Content-Type": "application/json",
      };
    } else {
      options.data = signedRequest.body;
    }
  }
  try {
    const res = await axios.request<R>(options);
    if (res.status < 300) {
      return {data: res.data, headers: res.headers};
    }
    throw new Error(`${res.status}: ${res.statusText}`);
  } catch (err) {
    if (isAxiosError(err)) {
      const message =
        err.response?.data?.message ||
        err.response?.statusText ||
        err.code;
      throw new RequestError(`${err.response?.status || 0}: ${message}`, err.code);
    }
    throw err;
  }
}

export const isAxiosError = (error: any): error is AxiosError<Error> => {
  return !!error.config;
};