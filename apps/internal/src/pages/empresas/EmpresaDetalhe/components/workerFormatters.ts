import type { Worker } from '../../../../shared/types/worker';

export function formatWorkerCpf(worker: Worker) {
  if (worker.formattedCpf) return worker.formattedCpf;
  const digits = worker.cpf.replace(/\D/g, '');
  return digits.length === 11 ? digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4') : worker.cpf || '—';
}

export function formatWorkerDate(value: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR');
}
