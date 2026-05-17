export type TermType =
  | 'SERVICE'
  | 'PRIVACY_COLLECT'
  | 'PRIVACY_THIRD_PARTY'
  | 'PROFILE_DATA'
  | 'MARKETING';

export interface TermResponse {
  id: number;
  type: TermType;
  version: number;
  contentUrl: string;
  mandatory: boolean;
  agreed: boolean;
}

export interface TermAgreement {
  type: TermType;
  agreed: boolean;
}

export interface TermsAgreeRequest {
  agreements: TermAgreement[];
}
