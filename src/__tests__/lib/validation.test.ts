import {
  LoginSchema,
  HealthCheckSchema,
  CSVRowSchema,
  GoogleSheetsImportSchema,
  validateInput,
  validateCSVFile,
} from '@/lib/validation';

describe('Validation Schemas', () => {
  describe('LoginSchema', () => {
    it('should validate valid login credentials', () => {
      const result = validateInput(LoginSchema, {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      });
    });

    it('should fail on invalid email', () => {
      const result = validateInput(LoginSchema, {
        email: 'invalid-email',
        password: 'password123',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email format');
    });

    it('should fail on missing password', () => {
      const result = validateInput(LoginSchema, {
        email: 'test@example.com',
      });

      expect(result.success).toBe(false);
    });

    it('should fail on short password', () => {
      const result = validateInput(LoginSchema, {
        email: 'test@example.com',
        password: '12345',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('at least 6 characters');
    });

    it('should default rememberMe to false', () => {
      const result = validateInput(LoginSchema, {
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.data?.rememberMe).toBe(false);
    });
  });

  describe('HealthCheckSchema', () => {
    it('should validate health check input', () => {
      const result = validateInput(HealthCheckSchema, {
        includeDetails: true,
      });

      expect(result.success).toBe(true);
      expect(result.data?.includeDetails).toBe(true);
    });

    it('should default includeDetails to false', () => {
      const result = validateInput(HealthCheckSchema, {});

      expect(result.success).toBe(true);
      expect(result.data?.includeDetails).toBe(false);
    });
  });

  describe('CSVRowSchema', () => {
    it('should validate a complete CSV row', () => {
      const result = CSVRowSchema.safeParse({
        storeName: 'Test Store',
        location: 'Vancouver',
        status: 'Active',
        salesRep: 'John Doe',
        date: '2024-01-15',
        notes: 'Test note',
      });

      expect(result.success).toBe(true);
    });

    it('should fail on missing storeName', () => {
      const result = CSVRowSchema.safeParse({
        storeName: '',
        location: 'Vancouver',
      });

      expect(result.success).toBe(false);
    });

    it('should provide defaults for optional fields', () => {
      const result = CSVRowSchema.safeParse({
        storeName: 'Test Store',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.location).toBe('');
        expect(result.data.status).toBe('');
      }
    });
  });

  describe('GoogleSheetsImportSchema', () => {
    it('should validate Google Sheets import data', () => {
      const result = validateInput(GoogleSheetsImportSchema, {
        rows: [
          { storeName: 'Store 1', location: 'Vancouver' },
          { 'Store Name': 'Store 2', Location: 'Toronto' },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.data?.rows).toHaveLength(2);
    });

    it('should fail on empty rows array', () => {
      const result = validateInput(GoogleSheetsImportSchema, {
        rows: [],
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('At least one row is required');
    });

    it('should fail on missing rows property', () => {
      const result = validateInput(GoogleSheetsImportSchema, {});

      expect(result.success).toBe(false);
    });
  });

  describe('validateCSVFile', () => {
    it('should validate a valid CSV file', () => {
      const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });
      const result = validateCSVFile(file);

      expect(result.success).toBe(true);
    });

    it('should fail on null file', () => {
      const result = validateCSVFile(null as unknown as File);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No file provided');
    });

    it('should fail on non-CSV file', () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = validateCSVFile(file);

      expect(result.success).toBe(false);
      expect(result.error).toBe('File must be a CSV');
    });

    it('should fail on file exceeding size limit', () => {
      // Create a mock file that exceeds 5MB
      const largeContent = 'x'.repeat(6 * 1024 * 1024);
      const file = new File([largeContent], 'large.csv', { type: 'text/csv' });
      const result = validateCSVFile(file);

      expect(result.success).toBe(false);
      expect(result.error).toBe('File must be less than 5MB');
    });
  });
});
