export type DocumentCategory =
  | 1
  | 2;

export type DocumentSubject =
  | 1
  | 2;

export type SupplierType =
  | 1
  | 2;

export const DOCUMENT_CATEGORY = {
  onboarding: 1,
  recurring: 2,
} as const;

export const DOCUMENT_SUBJECT = {
  company: 1,
  worker: 2,
} as const;

export type SupplierDocumentType = {
  id: number;

  code: string;
  name: string;

  category: DocumentCategory;
  categoryDescription: string;

  subject: DocumentSubject;
  subjectDescription: string;

  appliesTo: SupplierType;
  appliesToDescription: string;

  requiresExpirationDate: boolean;

  isConditional: boolean;

  conditionDescription:
    | string
    | null;
};