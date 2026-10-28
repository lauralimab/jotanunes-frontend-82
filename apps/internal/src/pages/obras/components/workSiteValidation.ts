import type { WorkSiteRequest } from "../../../shared/types/worksite";

export function validateWorkSite(nameValue: string, periodValue: string): { errors: Record<string, string>; payload: WorkSiteRequest } {
  const name = nameValue.trim();
  const renewalPeriodDays = Number(periodValue);
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Informe o nome da obra.";
  else if (name.length > 100) errors.name = "Use no máximo 100 caracteres.";
  if (!/^\d+$/.test(periodValue) || !Number.isSafeInteger(renewalPeriodDays) || renewalPeriodDays < 1 || renewalPeriodDays > 2147483647) errors.renewalPeriodDays = "Informe uma quantidade inteira de dias maior que zero, até 2.147.483.647.";
  return { errors, payload: { name, renewalPeriodDays } };
}
