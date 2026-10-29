export type DocumentCategory = 1 | 2;
export type DocumentSubject = 1 | 2;
export type DocumentApplicability = 1 | 2 | 3;

export type DocumentType = {
  id: number;
  code: string;
  name: string;
  category: DocumentCategory;
  categoryDescription: string;
  appliesTo: DocumentApplicability;
  appliesToDescription: string;
  subject: DocumentSubject;
  subjectDescription: string;
  requiresExpirationDate: boolean;
  isConditional: boolean;
  conditionDescription: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DocumentTypeUpdateRequest = Pick<DocumentType, "name" | "category" | "appliesTo" | "subject" | "requiresExpirationDate" | "isConditional" | "conditionDescription">;
export type DocumentTypeCreateRequest = DocumentTypeUpdateRequest & { code: string };
