import { z } from 'zod';

// Register User Schema
export const registerSchema = z
    .object({
        email: z.string().trim().toLowerCase().pipe(z.email('Invalid email format')),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .refine((s) => !s.includes(' '), 'Password cannot contain spaces')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number')
            .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type RegisterDTO = z.infer<typeof registerSchema>;

// Login User Schema
export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().pipe(z.email('Invalid email format')),
    password: z.string().min(1, 'Password is required'),
});

export type LoginDTO = z.infer<typeof loginSchema>;

// Base Plan Schema, shares properties between Create and Update
export const planBaseSchema = z.object({
    name: z.preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : val),
        z.string().trim().max(100, 'Plan name is too long').optional(),
    ),
    current_age: z.coerce
        .number()
        .int('Age must be a whole number')
        .min(18, 'Must be at least 18')
        .max(80, 'Must be 80 or under'),
    retirement_age: z.coerce
        .number()
        .int('Age must be a whole number')
        .min(30, 'Retirement age must be at least 30')
        .max(90, 'Retirement age must be 90 or under'),
    annual_income: z.coerce.number().positive('Annual income must be positive'),
    current_savings: z.coerce.number().min(0, 'Current savings cannot be negative'),
    monthly_contributions: z.coerce.number().positive('Monthly contributions must be positive'),
    risk_tolerance: z.enum(['conservative', 'moderate', 'aggressive'], {
        error: 'Invalid risk tolerance',
    }),
    retirement_goal: z.preprocess(
        (val) => (val === '' || val === null || val === undefined ? undefined : val),
        z.coerce.number().positive('Retirement goal must be positive').optional(),
    ),
    tfsa_balance: z.coerce.number().min(0, 'TFSA balance cannot be negative'),
    rrsp_balance: z.coerce.number().min(0, 'RRSP balance cannot be negative'),
    fhsa_balance: z.coerce.number().min(0, 'FHSA balance cannot be negative'),
    contribution_priority: z
        .enum(['tfsa_first', 'balanced', 'rrsp_heavy'], {
            error: 'Invalid contribution priority',
        })
        .default('tfsa_first'),
});

// Create Plan Schema
export const createPlanSchema = planBaseSchema.superRefine((data, ctx) => {
    if (data.current_age >= data.retirement_age) {
        ctx.addIssue({
            code: 'custom',
            message: 'Retirement age must be greater than current age',
            path: ['retirement_age'],
        });
    }

    if (data.monthly_contributions * 12 > data.annual_income) {
        ctx.addIssue({
            code: 'custom',
            message: 'Annual contributions cannot exceed annual income',
            path: ['monthly_contributions'],
        });
    }

    const accountTotal = data.tfsa_balance + data.rrsp_balance + data.fhsa_balance;
    if (accountTotal > data.current_savings) {
        ctx.addIssue({
            code: 'custom',
            message: 'Sum of accounts cannot exceed total savings',
            path: ['current_savings'],
        });
    }
});

// Update Plan Schema
export const updatePlanSchema = planBaseSchema.partial();

export type CreatePlanDTO = z.infer<typeof createPlanSchema>;
export type CreatePlanInput = z.input<typeof planBaseSchema>;
export type UpdatePlanDTO = z.infer<typeof updatePlanSchema>;
