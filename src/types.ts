import type { RESTGetAPIApplicationCommandsResult } from "discord-api-types/v10";

export type AuthType = "Bot" | "Bearer";

export interface DscrOptions {
  token: string;
  version?: string;
}

export interface DscrRequestOptions {
  authType?: AuthType;
}

export interface DscrRawOptions extends DscrRequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

export type CommandList = RESTGetAPIApplicationCommandsResult;
