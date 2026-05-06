import { z } from 'zod/v4';

export const createModelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  pseudoHandle: z.string().optional(),
  platformSource: z.enum([
    'twitter',
    'reddit',
    'modelmayhem',
    'instagram',
    'tiktok',
    'fanvue',
    'other',
  ]),
  profileUrl: z.url().optional().or(z.literal('')),
  followersCount: z.coerce.number().int().min(0).optional(),
  elementDifferentiel: z
    .object({
      category: z
        .enum(['physical_trait', 'makeup_hair', 'accessory', 'behavior', 'setting'])
        .optional(),
      description: z.string().optional(),
      photoUrl: z.string().optional(),
    })
    .optional(),
});

export const updateModelSchema = createModelSchema.partial().extend({
  id: z.string().uuid(),
  hasExistingContent: z.boolean().optional(),
  visiblePhoneQuality: z
    .enum(['iphone_recent', 'iphone_old', 'android_premium', 'low_quality', 'unknown'])
    .optional(),
  estimatedTier: z.enum(['S', 'A', 'B', 'C', 'unknown']).optional(),
  geoCountry: z.string().optional(),
  nationality: z.string().optional(),
  age: z.coerce.number().int().min(18).max(99).optional(),
  disponibilityHoursPerDay: z.coerce.number().min(0).max(24).optional(),
  hardLimits: z.string().optional(),
  aiConsent: z.boolean().optional(),
  multiAccountConsent: z.boolean().optional(),
  financialExpectationsMonthly: z.coerce.number().int().min(0).optional(),
  previousAgenciesCount: z.coerce.number().int().min(0).optional(),
  notesCall: z.string().optional(),
  decisionReason: z.string().optional(),
});

export type CreateModelInput = z.infer<typeof createModelSchema>;
export type UpdateModelInput = z.infer<typeof updateModelSchema>;
