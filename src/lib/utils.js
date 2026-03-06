import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility per combinare classi CSS condizionali e risolvere conflitti di Tailwind, semplificando la gestione delle classi nei componenti React

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
