/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface PullRequest {
  name?: string;
  data: {
    description?: string;
    status?: "open" | "closed";
    archived?: boolean;
    head?: {
      branch: string;
      sha: string;
      [k: string]: unknown;
    };
    base?: {
      branch: string;
      sha: string;
      [k: string]: unknown;
    };
    created_at?: string | null;
    merged_at?: string | null;
    repository?: string;
    mirrors?: string[];
    participants?: unknown[];
    mentionsUser?: unknown[];
    alertsUser?: unknown[];
    mentionsGroup?: unknown[];
    alertsGroup?: unknown[];
    [k: string]: unknown;
  };
  tags?: string[];
  [k: string]: unknown;
}
