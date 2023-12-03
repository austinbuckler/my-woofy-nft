import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { db } from "~/db";
import { env } from "~/env.mjs";
import { isWalletAddress } from "~/lib/utils";
import { UserPageView } from "~/views/user-page-view";
import { WoofyPageView } from "~/views/woofy-page-view";

type WoofyPageParams = {
  params: {
    slug: string;
  };
};

type WoofyPageProps = WoofyPageParams;

export async function generateMetadata(
  { params }: WoofyPageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  if (isWalletAddress(params.slug)) {
    return {
      title: `Wallet ${params.slug}`,
    };
  }

  const woofyRarity = Math.abs(parseInt(params.slug));

  if (isNaN(woofyRarity)) {
    return notFound();
  }

  const woofy = await db.query.woofysTable.findFirst({
    where(fields, ops) {
      return ops.eq(fields.rarity, woofyRarity);
    },
  });

  if (!woofy) {
    return notFound();
  }

  return {
    title: `${woofy.name} (#${woofy.rarity})`,
    description: `${woofy.bio ?? `#${woofy.rarity}`}${
      woofy.ownerAddress ? `owned by ${woofy.ownerAddress}` : ""
    }`,
    metadataBase: new URL(
      `${env.NEXT_PUBLIC_METADATA_BASE_URL}/woofys/${params.slug}`
    ),
  };
}

export default async function WoofyPage({ params }: WoofyPageProps) {
  if (isWalletAddress(params.slug)) {
    return <UserPageView publicAddress={params.slug} />;
  }

  const woofyRarity = Math.abs(parseInt(params.slug));

  if (isNaN(woofyRarity)) {
    return notFound();
  }

  return <WoofyPageView rarity={woofyRarity} />;
}
