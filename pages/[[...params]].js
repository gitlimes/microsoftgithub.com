import Head from "next/head";
import { SupabaseAdmin } from "../lib/supabase-admin";
import { detectRobot } from "../lib/detectRobot";

export async function getServerSideProps({ req, res, query }) {
  const isGist = req.headers.host.includes("gist");

  if (detectRobot(req.headers["user-agent"])) {
    // increment the redirect count for crawlers
    await SupabaseAdmin.rpc("increment_page_view", {
      page_slug: "rickrolled-crawler",
    });
  } else {
    // increment the redirect count for users
    await SupabaseAdmin.rpc("increment_page_view", {
      page_slug: "rickrolled-user",
    });
  }

  const githubPath = query.params?.join("/") || "";

  const actualUrl = `https://${
    isGist ? "gist.github.com" : "github.com"
  }/${githubPath}`;

  // we check if the user has been rickrolled on this page before
  const rickrolled = Boolean(req.cookies?.[actualUrl]);
  // if not, we set a cookie
  if (!rickrolled) {
    res.setHeader("Set-Cookie", `${actualUrl}=1; path=/; Max-Age=300`);
  }

  // all the needed regexes
  const regexes = {
    title: new RegExp("(?<=<title>).+?(?=</title>)", "g"),
    twitterTitle: new RegExp(
      '(?<=<meta name="twitter:title" content=").+?(?=")',
      "g"
    ),
    description: new RegExp(
      '(?<=<meta (name)?(property)?="description" content=").+?(?=" */*>)',
      "g"
    ),
    image: new RegExp(
      '(?<=<meta (name)?(property)?="twitter:image:src" content=").+?(?=" */*>)',
      "g"
    ),
    twitterCard: new RegExp(
      '(?<=<meta (name)?(property)?="twitter:card" content=").+?(?=" */*>)',
      "g"
    ),
  };

  // fetch the actual page
  const githubResponse = await fetch(actualUrl, {
    method: "GET",
  });

  const githubData = await githubResponse.text();

  // extrapolate the title, description, and image
  const pageData = {
    title:
      githubData.match(regexes.twitterTitle)?.[0] ||
      githubData.match(regexes.title)?.[0] ||
      "",
    description: githubData.match(regexes.description)?.[0] || "",
    image: githubData.match(regexes.image)?.[0] || "",
    twitterCard:
      githubData.match(regexes.twitterCard)?.[0] || "summary_large_image",
  };

  pageData.meta = Boolean(pageData.description + pageData.image); // if there's a description or image, we'll render the meta tags

  // if the user has already been rickrolled by the page, we redirect to the actual repo
  const redirectUrl = rickrolled
    ? actualUrl
    : "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  return {
    props: {
      pageData,
      githubPath,
      redirectUrl,
    },
  };
}

export default function Home({ pageData, githubPath, redirectUrl }) {
  if (typeof window !== "undefined") {
    location.assign(redirectUrl);
  }

  return (
    <div>
      <Head>
        <title>{pageData.title}</title>

        {pageData.meta && (
          <>
            <meta name="description" content={pageData.description} />
            <meta name="twitter:card" content={pageData.twitterCard} />
            <meta name="twitter:site" content="@github" />
            <meta name="twitter:title" content={pageData.title} />
            <meta name="twitter:description" content={pageData.description} />
            <meta name="twitter:image" content={pageData.image} />
            <meta property="og:title" content={pageData.title} />
            <meta property="og:description" content={pageData.description} />
            <meta property="og:image" content={pageData.image} />
            <meta property="og:image:alt" content={pageData.description} />
            <meta
              property="og:url"
              content={`https://microsoftgithub.com/${githubPath}`}
            />
            <meta property="og:site_name" content="GitHub" />
            <meta property="og:type" content="object" />

            <link
              rel="mask-icon"
              href="https://github.githubassets.com/pinned-octocat.svg"
              color="#000000"
            />
            <link
              rel="alternate icon"
              className="js-site-favicon"
              type="image/png"
              href="https://github.githubassets.com/favicons/favicon.png"
            />
            <link
              rel="icon"
              className="js-site-favicon"
              type="image/svg+xml"
              href="https://github.githubassets.com/favicons/favicon.svg"
            />

            <meta name="theme-color" content="#1e2327" />
          </>
        )}
      </Head>
      <p style={{ margin: "1em", fontSize: "18px" }}>
        Redirecting to the repository... if you aren't being redirected
        automatically, click{" "}
        <a
          style={{ fontWeight: 500, textDecoration: "underline" }}
          href={redirectUrl}
        >
          here
        </a>
        .
      </p>
      <a rel="me" style={{ display: "none" }} href="https://tech.lgbt/@ashg">
        Mastodon
      </a>
    </div>
  );
}
