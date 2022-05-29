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

  let jsonStats = {
    rickrolled: {
      users: rickrolledUsers,
      bots: rickrolledCrawlers,
    },
  };

  jsonStats.rickrolled.total =
    jsonStats.rickrolled.users + jsonStats.rickrolled.bots;

  // we convert to thousands (e.g. 1275 => 1.3)
  function calcK(key) {
    return Math.round(jsonStats.rickrolled[key] / 100) / 10;
  }

  jsonStats.rickrolled.kusers = calcK("users");
  jsonStats.rickrolled.kbots = calcK("bots");
  jsonStats.rickrolled.ktotal = calcK("total");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(jsonStats);
}
