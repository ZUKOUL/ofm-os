import { getModels } from '@/lib/db/queries/models';
import { ModelsTable } from '@/components/models/models-table';

export default async function ModelsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const filters = {
    search: params.search as string | undefined,
    status: params.status ? [params.status as string] : undefined,
    platform: params.platform as string | undefined,
    tier: params.tier as string | undefined,
    geoCountry: params.geoCountry as string | undefined,
    page,
    pageSize: 50,
  };

  const { data, total } = await getModels(filters);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Models</h1>
      <ModelsTable data={data as any} total={total} page={page} pageSize={50} />
    </div>
  );
}
