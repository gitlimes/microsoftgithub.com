import { SupabaseAdmin } from "../../lib/supabase-admin";

export default async function handler(_req, res) {
  const {
    data: {
      [0]: { view_count: rickrolledUsers },
    },
  } = await SupabaseAdmin.from("pages")
    .select("view_count")
    .filter("slug", "eq", "rickrolled-user");

  const {
    data: {
      [0]: { view_count: rickrolledCrawlers },
    },
  } = await SupabaseAdmin.from("pages")
    .select("view_count")
    .filter("slug", "eq", "rickrolled-crawler");

    res.setHeader("Access-Control-Allow-Origin", "*")

  res.status(200).json({
    rickrolled: {
      users: rickrolledUsers,
      crawlers: rickrolledCrawlers,
    },
  });
}
