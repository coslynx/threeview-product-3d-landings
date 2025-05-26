import * as THREE from 'three';

/**
 * Formats a number according to specified locale-sensitive options.
 * @param value The number to format.
 * @param options Optional formatting options.
 * @returns The formatted number string.
 */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  try {
    return new Intl.NumberFormat(undefined, options).format(value);
  } catch (error) {
    console.warn('Error formatting number:', error);
    return value.toString();
  }
}

/**
 * Formats a date or timestamp according to specified locale-sensitive options.
 * @param date The date or timestamp to format.
 * @param options Optional formatting options.
 * @returns The formatted date string.
 */
export function formatDate(date: Date | number, options?: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat(undefined, options).format(date);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return new Date(date).toLocaleDateString();
  }
}

/**
 * Truncates a string to a specified length, adding an ellipsis if necessary.
 * @param text The string to truncate.
 * @param maxLength The maximum length of the string.
 * @param ellipsis The ellipsis string to append if truncation occurs (default: "...").
 * @returns The truncated string.
 */
export function truncateString(text: string, maxLength: number, ellipsis: string = "..."): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + ellipsis;
}

/**
 * Escapes HTML special characters in a string to prevent XSS vulnerabilities.
 * @param str The string to escape.
 * @returns The escaped string.
 */
export function escapeHTML(str: string): string {
  let escaped = str;
  escaped = escaped.replace(/&/g, "&amp;");
  escaped = escaped.replace(/>/g, "&gt;");
  escaped = escaped.replace(/</g, "&lt;");
  escaped = escaped.replace(/"/g, "&quot;");
  escaped = escaped.replace(/'/g, "&#039;");
  return escaped;
}

/**
 * Parses a string into a number, considering locale-specific formatting.
 * @param str The string to parse.
 * @param options Optional formatting options to guide parsing (currency, decimal places, etc.).
 * @returns The parsed number, or null if parsing fails.
 */
export function parseNumber(str: string, options?: Intl.NumberFormatOptions): number | null {
  try {
    const formattedStr = String(str).trim();
    if (!formattedStr) return null;

    const parts = new Intl.NumberFormat(undefined, options).formatToParts(12345.678);
    const groupSeparator = parts.find(part => part.type === 'group')?.value;
    const decimalSeparator = parts.find(part => part.type === 'decimal')?.value;

    if (groupSeparator) {
      str = str.replace(new RegExp(`\${groupSeparator}`, 'g'), '');
    }

    if (decimalSeparator) {
      str = str.replace(decimalSeparator, '.');
    }

    const num = Number(str);
    return isNaN(num) ? null : num;
  } catch (error) {
    console.warn('Error parsing number:', error);
    return null;
  }
}

/**
 * Capitalizes the first letter of a given string.
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Sanitizes a string to remove potentially harmful characters and prevent XSS attacks
 * @param text The string to sanitize
 * @returns The sanitized string
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  let sanitized = text;
  sanitized = escapeHTML(sanitized); // Escape HTML entities
  // Add more sanitization steps as needed, e.g., removing or encoding specific characters

  return sanitized;
}