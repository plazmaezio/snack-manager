export const USERNAME_PATTERN = "^[a-zA-Z0-9_-]+$";

const USERNAME_REGEX = new RegExp(USERNAME_PATTERN);
const PASSWORD_SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/;

export const isValidUsername = (username: string): boolean => {
  return USERNAME_REGEX.test(username);
};

export const getPasswordValidationErrors = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must have at least one lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must have at least one uppercase letter");
  }
  if (!PASSWORD_SPECIAL_CHAR_REGEX.test(password)) {
    errors.push("Password must have at least one special character");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must have at least one number");
  }

  return errors;
};