/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface GhPush {
  data: {
    before: string;
    after: string;
    commits?: {
      [k: string]: unknown;
    }[];
    author?: string;
    branch: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
