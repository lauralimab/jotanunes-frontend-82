import { useEffect, useState } from "react";
import { getDocumentType } from "../../../../shared/api/documentType";
import type { DocumentType } from "../../../../shared/types/documentType";
import Modal from "../../../../shared/components/Modal";
import Icon from "../../../../shared/components/Icon";
import Skeleton from "../../../../shared/components/Skeleton";
import ErrorState from "../../../../shared/components/ErrorState";
import { documentCategories, documentSubjects, documentApplicabilities, optionLabel } from "../documentTypeOptions";
import styles from "../tiposDocumentos.module.css";

export default function DocumentTypeDetailModal({ documentTypeId, onClose, onEdit, onDelete }: { documentTypeId: number; onClose: () => void; onEdit: (item: DocumentType) => void; onDelete: (item: DocumentType) => void }) {
  const [result, setResult] = useState<{ item: DocumentType | null; error?: unknown } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    getDocumentType(documentTypeId, controller.signal).then(item => { if (!controller.signal.aborted) setResult({ item }); }).catch(error => { if (!controller.signal.aborted) setResult({ item: null, error }); });
    return () => controller.abort();
  }, [documentTypeId]);
  const loading = result === null;
  const item = result?.item;
  const condition = item?.conditionDescription?.trim();
  const sections = [
    { title: "Classificação", icon: "doc", fields: [
      { label: "Categoria", value: item ? optionLabel(documentCategories, item.category, item.categoryDescription) : "" },
      { label: "Tipo de fornecedor", value: item ? optionLabel(documentApplicabilities, item.appliesTo, item.appliesToDescription) : "" },
      { label: "Documento de", value: item ? optionLabel(documentSubjects, item.subject, item.subjectDescription) : "" },
    ] },
    { title: "Regras do documento", icon: "shield", fields: [
      { label: "Exige data de validade", value: item?.requiresExpirationDate ? "Sim" : "Não" },
      { label: "Documento condicional", value: item?.isConditional ? "Sim" : "Não" },
    ] },
  ];
  return <Modal title="Detalhes do tipo de documento" className={styles.dialog} busy={false} onClose={onClose}>
    <div className={styles.body} aria-busy={loading}>
      {result && !item ? <ErrorState error={result.error} compact /> : <>
        <div className={styles.summary}>
          <Skeleton loading={loading} width={48} height={48} borderRadius={12}><span className={styles.summaryIcon} aria-hidden="true"><Icon name="doc" size={24} /></span></Skeleton>
          <div className={styles.summaryName}><h4><Skeleton loading={loading} width="min(100%, 14rem)" height={22}>{item?.name}</Skeleton></h4><p><Skeleton loading={loading} width={130} height={15}>{item?.code}</Skeleton></p></div>
        </div>
        <div className={styles.details}>{sections.map(section => <section key={section.title} className={styles.detailCard}>
          <h4><Skeleton loading={loading} width={16} height={16}><Icon name={section.icon} size={16} /></Skeleton><Skeleton loading={loading}>{section.title}</Skeleton></h4>
          <dl className={styles.detailFields}>{section.fields.map(field => <div key={field.label}><dt><Skeleton loading={loading}>{field.label}</Skeleton></dt><dd><Skeleton loading={loading} width="min(100%, 10rem)" height={17}>{field.value}</Skeleton></dd></div>)}</dl>
        </section>)}
          {(loading || condition) && <section className={`${styles.detailCard} ${styles.full}`}>
            <h4><Skeleton loading={loading} width={16} height={16}><Icon name="info" size={16} /></Skeleton><Skeleton loading={loading}>Condição</Skeleton></h4>
            <p className={styles.conditionText}><Skeleton loading={loading} width="100%" height={34}>{condition}</Skeleton></p>
          </section>}
        </div>
      </>}
    </div>
    {item && <footer className={styles.footer}>
        <button type="button" className="btn btn-secondary" onClick={() => onEdit(item)}><Icon name="edit" size={15} />Editar</button>
        <button type="button" className="btn btn-primary" disabled={!item.active} onClick={() => onDelete(item)}><Icon name="trash" size={15} />Excluir</button>
    </footer>}
  </Modal>;
}
