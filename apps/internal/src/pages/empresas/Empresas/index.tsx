import Header from "../../../shared/components/Header";
import Icon from "../../../shared/components/Icon";
import PageWrapper from "../../../shared/components/PageWrapper";
import type { Screen } from "../../../shared/types/portal";
import EmpresasTable from "./components/EmpresasTable";

export default function EmpresasPage({ onNav }: { onNav: (s: Screen) => void }) {
  return (
    <>
      <Header title="Fornecedores" subtitle="Gestão de todos os fornecedores cadastrados"
        actions={<button className="btn btn-primary"><Icon name="plus" size={15} />Novo Fornecedor</button>} />
      <PageWrapper>
        <EmpresasTable onNav={onNav} />
      </PageWrapper>
    </>
  );
}
