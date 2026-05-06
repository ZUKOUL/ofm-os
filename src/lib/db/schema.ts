import {
  boolean,
  date,
  decimal,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const platformSourceEnum = pgEnum('platform_source', [
  'twitter',
  'reddit',
  'modelmayhem',
  'instagram',
  'tiktok',
  'fanvue',
  'other',
]);

export const modelStatusEnum = pgEnum('model_status', [
  'to_dm',
  'dm_sent',
  'responded',
  'questionnaire_sent',
  'questionnaire_received',
  'call_scheduled',
  'call_done',
  'signed',
  'on_hold',
  'killed',
]);

export const tierEnum = pgEnum('tier', ['S', 'A', 'B', 'C', 'unknown']);

export const phoneQualityEnum = pgEnum('phone_quality', [
  'iphone_recent',
  'iphone_old',
  'android_premium',
  'low_quality',
  'unknown',
]);

export const decisionEnum = pgEnum('decision', ['signed', 'passed', 'on_hold']);

export const faceCamEnum = pgEnum('face_cam', ['good', 'ok', 'bad']);

export const compatEnum = pgEnum('compat', ['high', 'medium', 'low']);

export const activityTypeEnum = pgEnum('activity_type', [
  'dm_sent',
  'response_received',
  'questionnaire_sent',
  'questionnaire_received',
  'call_scheduled',
  'call_done',
  'note',
  'status_change',
  'photo_uploaded',
]);

export const models = pgTable('models', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  name: text('name').notNull(),
  pseudoHandle: text('pseudo_handle'),
  platformSource: platformSourceEnum('platform_source').notNull(),
  profileUrl: text('profile_url'),
  followersCount: integer('followers_count'),

  status: modelStatusEnum('status').default('to_dm').notNull(),
  killedReason: text('killed_reason'),

  hasExistingContent: boolean('has_existing_content').default(false),
  visiblePhoneQuality: phoneQualityEnum('visible_phone_quality').default('unknown'),
  elementDifferentiel: jsonb('element_differentiel'),

  estimatedTier: tierEnum('estimated_tier').default('unknown'),

  geoCountry: text('geo_country'),
  nationality: text('nationality'),
  age: integer('age'),

  disponibilityHoursPerDay: decimal('disponibility_hours_per_day', { precision: 4, scale: 2 }),
  hardLimits: text('hard_limits'),
  aiConsent: boolean('ai_consent'),
  multiAccountConsent: boolean('multi_account_consent'),
  financialExpectationsMonthly: integer('financial_expectations_monthly'),
  previousAgenciesCount: integer('previous_agencies_count'),

  callDate: date('call_date'),
  matosVerified: boolean('matos_verified'),
  faceCamNatural: faceCamEnum('face_cam_natural'),
  elementDifferentielConfirmed: boolean('element_differentiel_confirmed'),
  personalCompat: compatEnum('personal_compat'),
  notesCall: text('notes_call'),

  decision: decisionEnum('decision'),
  decisionReason: text('decision_reason'),
  decisionDate: date('decision_date'),
});

export const activities = pgTable('activities', {
  id: uuid('id').primaryKey().defaultRandom(),
  modelId: uuid('model_id')
    .references(() => models.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  type: activityTypeEnum('type').notNull(),
  content: text('content'),
  metadata: jsonb('metadata'),
});

export const dmTemplates = pgTable('dm_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  name: text('name').notNull(),
  platform: platformSourceEnum('platform').notNull(),
  content: text('content').notNull(),
  variables: jsonb('variables'),
  timesUsed: integer('times_used').default(0),
  responseRate: decimal('response_rate', { precision: 5, scale: 4 }),
});

export const questionnaires = pgTable('questionnaires', {
  id: uuid('id').primaryKey().defaultRandom(),
  modelId: uuid('model_id')
    .references(() => models.id, { onDelete: 'cascade' })
    .notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
  rawResponses: jsonb('raw_responses').notNull(),
  extractedSummary: text('extracted_summary'),
});
