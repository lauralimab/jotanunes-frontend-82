import { useState } from "react";
import NovoFornecedorModal from "./components/NovoFornecedorModal";
import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import Toast from "../../../shared/components/Toast";
import EmpresasTable from "./components/EmpresasTable";

export default function EmpresasPage({ onSelectCompany, onEditCompany }: { onSelectCompany: (id: number) => void; onEditCompany: (id: number) => void }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tableVersion, setTableVersion] = useState(0);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  function handleCreated() {
    setShowCreateModal(false);
    setTableVersion(version => version + 1);
    setShowSuccessNotification(true);
  }

  return (
    <>
      <Header title="Fornecedores" subtitle="Gestão de todos os fornecedores cadastrados"
        actions={<button className="btn btn-primary" onClick={() => setShowCreateModal(true)}><Icon name="plus" size={15} />Novo Fornecedor</button>} />
      <PageWrapper>
        <EmpresasTable key={tableVersion} onSelectCompany={onSelectCompany} onEditCompany={onEditCompany} />
      </PageWrapper>
      {showSuccessNotification && <Toast message="Fornecedor cadastrado com sucesso!" onClose={() => setShowSuccessNotification(false)} />}
      {showCreateModal && <NovoFornecedorModal onClose={() => setShowCreateModal(false)} onSaved={handleCreated} />}
    </>
  );
}
