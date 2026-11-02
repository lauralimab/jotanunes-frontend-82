/** Mantém só os dígitos (máx. 11). */
export function onlyCpfDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

/** Aplica a máscara 000.000.000-00 enquanto o usuário digita. */
export function formatCpf(value: string) {
  const digits = onlyCpfDigits(value);

  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(
      /^(\d{3})\.(\d{3})\.(\d{3})(\d)/,
      "$1.$2.$3-$4",
    );
}

/** Valida o CPF pelos dígitos verificadores. */
export function isValidCpf(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 11) {
    return false;
  }

  // 111.111.111-11 e similares passam na conta, mas não são válidos.
  if (/^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  function checkDigit(length: number) {
    let sum = 0;

    for (let i = 0; i < length; i++) {
      sum += Number(digits[i]) * (length + 1 - i);
    }

    const rest = (sum * 10) % 11;

    return rest === 10 ? 0 : rest;
  }

  return (
    checkDigit(9) === Number(digits[9]) &&
    checkDigit(10) === Number(digits[10])
  );
}
