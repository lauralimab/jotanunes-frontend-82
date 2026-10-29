export const documentCategories = [{ value: "1", label: "Cadastro inicial" }, { value: "2", label: "Recorrente" }];
export const documentSubjects = [{ value: "1", label: "Empresa" }, { value: "2", label: "Funcionário" }];
export const documentApplicabilities = [{ value: "1", label: "Material" }, { value: "2", label: "Mão de obra" }, { value: "3", label: "Material e mão de obra" }];
export function optionLabel(options: { value: string; label: string }[], value: number, fallback?: string) {
  return options.find(option => option.value === String(value))?.label ?? fallback ?? "—";
}
export function normalizeSearch(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim(); }
export function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR"); }
