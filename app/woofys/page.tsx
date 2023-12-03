import { db } from "~/db";
import { WoofyCard } from "./_components/woofy-card";
import Link from "next/link";
import { FilterDock } from "./_components/filter-dock";

type WoofysPageProps = {
  searchParams: {};
};

export default async function WoofysPage({ searchParams }: WoofysPageProps) {
  const woofys = await db.query.woofysTable.findMany();
  return (
    <div>
      <div className="grid lg:grid-cols-11 gap-4 container mx-auto">
        {woofys.map((woofy) => (
          <Link key={woofy.rarity} href={`/woofys/${woofy.rarity}`}>
            <WoofyCard woofy={woofy} />
          </Link>
        ))}
      </div>
      <FilterDock />
    </div>
  );
}
