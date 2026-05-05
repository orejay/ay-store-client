export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
};

export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export const passwordStrength = (pw: string): StrengthLevel => {
  if (!pw) return 0;
  if (pw.length < 6) return 1;
  let score = 1;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4) as StrengthLevel;
};

export const STRENGTH_CONFIG: Record<
  StrengthLevel,
  { label: string; color: string }
> = {
  0: { label: "", color: "transparent" },
  1: { label: "Weak", color: "#EF4444" },
  2: { label: "Fair", color: "#F97316" },
  3: { label: "Good", color: "#3B82F6" },
  4: { label: "Strong", color: "#10B981" },
};
