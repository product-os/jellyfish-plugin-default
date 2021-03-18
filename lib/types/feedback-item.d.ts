/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Empathy = 1 | 0 | -1;
export type TechnicalKnowledge = 1 | 0 | -1;
export type Process = 1 | 0 | -1;
export type Grammar = 1 | 0 | -1;
export type GoingTheExtraMile = 1 | 0 | -1;

export interface FeedbackItem {
  name?: string;
  data: {
    feedback: {
      empathy?: Empathy;
      knowledge?: TechnicalKnowledge;
      process?: Process;
      grammar?: Grammar;
      effort?: GoingTheExtraMile;
      notes?: string;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
