import { z } from 'zod';

// ============================================================================
// Auth Validation Schemas
// ============================================================================

export const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// ============================================================================
// Health Check Validation Schemas
// ============================================================================

export const HealthCheckSchema = z.object({
  includeDetails: z.boolean().default(false),
});

export type HealthCheckInput = z.infer<typeof HealthCheckSchema>;

// ============================================================================
// Import Validation Schemas
// ============================================================================

export const CSVRowSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  location: z.string().optional().default(''),
  status: z.string().optional().default(''),
  salesRep: z.string().optional().default(''),
  date: z.string().optional().default(''),
  notes: z.string().optional().default(''),
});

export type CSVRow = z.infer<typeof CSVRowSchema>;

export const GoogleSheetsRowSchema = z.object({
  storeName: z.string().optional(),
  'Store Name': z.string().optional(),
  location: z.string().optional(),
  Location: z.string().optional(),
  status: z.string().optional(),
  Status: z.string().optional(),
  salesRep: z.string().optional(),
  'Sales Rep': z.string().optional(),
  date: z.string().optional(),
  Date: z.string().optional(),
  notes: z.string().optional(),
  Notes: z.string().optional(),
}).passthrough(); // Allow additional fields

export const GoogleSheetsImportSchema = z.object({
  rows: z
    .array(GoogleSheetsRowSchema)
    .min(1, 'At least one row is required')
    .max(10000, 'Maximum 10,000 rows per request'),
});

export type GoogleSheetsImportInput = z.infer<typeof GoogleSheetsImportSchema>;

// ============================================================================
// Dashboard Metrics Validation
// ============================================================================

export const MetricsRefreshSchema = z.object({
  forceRefresh: z.boolean().default(false),
  cacheKey: z.string().optional(),
}).optional();

export type MetricsRefreshInput = z.infer<typeof MetricsRefreshSchema>;

// ============================================================================
// Validation Helper
// ============================================================================

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: z.ZodIssue[];
}

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    error: result.error.issues.map((e: z.ZodIssue) => e.message).join(', '),
    errors: result.error.issues,
  };
}

// ============================================================================
// File Validation Helpers
// ============================================================================

export const MAX_CSV_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateCSVFile(file: File): ValidationResult<File> {
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  const validTypes = ['text/csv', 'application/vnd.ms-excel'];
  const isValidType = validTypes.includes(file.type) || file.name.endsWith('.csv');

  if (!isValidType) {
    return { success: false, error: 'File must be a CSV' };
  }

  if (file.size > MAX_CSV_FILE_SIZE) {
    return { success: false, error: 'File must be less than 5MB' };
  }

  return { success: true, data: file };
}
