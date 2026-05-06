import { and, desc, eq, ilike, inArray, or, sql, lt } from 'drizzle-orm';

import { db } from '@/lib/db';
import { activities, models } from '@/lib/db/schema';

export type ModelFilters = {
  search?: string;
  status?: string[];
  platform?: string;
  tier?: string;
  geoCountry?: string;
  page?: number;
  pageSize?: number;
};

export async function getModels(filters: ModelFilters = {}) {
  const { search, status, platform, tier, geoCountry, page = 1, pageSize = 50 } = filters;

  const conditions = [];

  if (search) {
    conditions.push(
      or(ilike(models.name, `%${search}%`), ilike(models.pseudoHandle, `%${search}%`)),
    );
  }
  if (status?.length) {
    conditions.push(inArray(models.status, status as any));
  }
  if (platform) {
    conditions.push(eq(models.platformSource, platform as any));
  }
  if (tier) {
    conditions.push(eq(models.estimatedTier, tier as any));
  }
  if (geoCountry) {
    conditions.push(eq(models.geoCountry, geoCountry));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(models)
      .where(where)
      .orderBy(desc(models.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: sql<number>`count(*)` })
      .from(models)
      .where(where),
  ]);

  return { data, total: Number(countResult[0].count) };
}

export async function getModelById(id: string) {
  const result = await db.select().from(models).where(eq(models.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getModelActivities(modelId: string) {
  return db
    .select()
    .from(activities)
    .where(eq(activities.modelId, modelId))
    .orderBy(desc(activities.createdAt));
}

export async function getStaleModels() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

  return db
    .select()
    .from(models)
    .where(
      or(
        and(eq(models.status, 'dm_sent'), lt(models.updatedAt, sevenDaysAgo)),
        and(eq(models.status, 'questionnaire_sent'), lt(models.updatedAt, fiveDaysAgo)),
      ),
    );
}

export async function getModelStats() {
  const result = await db
    .select({
      status: models.status,
      count: sql<number>`count(*)`,
    })
    .from(models)
    .groupBy(models.status);

  return result;
}
