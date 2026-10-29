import type { DocumentType } from "../../../../shared/types/documentType";
import Icon from "../../../../shared/components/Icon";
import Skeleton from "../../../../shared/components/Skeleton";
import { documentSubjects, documentApplicabilities, optionLabel } from "../documentTypeOptions";
import styles from "../tiposDocumentos.module.css";

type Props = { item: DocumentType; onDetails: () => void };

export function DocumentTypeCardSkeleton() {
  return <div className={`card ${styles.documentCard}`} aria-hidden="true">
    <div className={styles.cardHeading}><Skeleton width={36} height={36} borderRadius={9} /><div className={styles.cardName}><Skeleton width="90%" height={17} /></div></div>
    <dl className={styles.cardMetadata}>{Array.from({ length: 2 }, (_, index) => <div key={index}><dt><Skeleton width="80%" height={12} /></dt><dd><Skeleton width="90%" height={16} /></dd></div>)}</dl>
  </div>;
}

export default function DocumentTypeCard({ item, onDetails }: Props) {
  return <article className={`card ${styles.documentCard}`} aria-label={item.name}>
    <button type="button" className={styles.cardLink} aria-label={`Ver detalhes de ${item.name}`} onClick={onDetails} />
    <div className={styles.cardHeading}>
      <span className={styles.cardIcon} aria-hidden="true"><Icon name="doc" size={19} /></span>
      <div className={styles.cardName}><h3 title={item.name}>{item.name}</h3></div>
    </div>
    <dl className={styles.cardMetadata}>
      <div><dt>Tipo de fornecedor</dt><dd>{optionLabel(documentApplicabilities, item.appliesTo, item.appliesToDescription)}</dd></div>
      <div><dt>Documento de</dt><dd>{optionLabel(documentSubjects, item.subject, item.subjectDescription)}</dd></div>
    </dl>
  </article>;
}
