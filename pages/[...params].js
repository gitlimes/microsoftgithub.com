import Head from "next/head";
import { SupabaseAdmin } from "../lib/supabase-admin";

export async function getServerSideProps({ req, res, query }) {
  // increment the redirect count
  await SupabaseAdmin.rpc("increment_page_view", { page_slug: "redirect" });

  const githubPath = query.params.join("/");

  // we check if the user has been rickrolled on this page before
  const rickrolled = Boolean(req.cookies?.[githubPath]);
  // if not, we set a cookie
  if (!rickrolled) {
    res.setHeader("Set-Cookie", `${githubPath}=1; path=/;`);
  }

  // all the needed regexes
  const regexes = {
    title: new RegExp("(?<=<title>).+?(?=</title>)", "g"),
    description: new RegExp(
      '(?<=<meta (name)?(property)?="description" content=").+?(?=" */*>)',
      "g"
    ),
    image: new RegExp(
      '(?<=<meta (name)?(property)?="twitter:image:src" content=").+?(?=" */*>)',
      "g"
    ),
  };

  // fetch the actual page
  const githubResponse = await fetch(`https://github.com/${githubPath}`, {
    method: "GET",
  });

  const githubData = await githubResponse.text();

  // extrapolate the title, description, and image
  const pageData = {
    title: githubData.match(regexes.title)?.[0] || "",
    description: githubData.match(regexes.description)?.[0] || "",
    image: githubData.match(regexes.image)?.[0] || "",
  };

  pageData.meta = Boolean(pageData.description + pageData.image); // if there's a description or image, we'll render the meta tags

  return {
    props: {
      pageData,
      githubPath,
      rickrolled,
    },
  };
}

export default function Home({ pageData, githubPath, rickrolled }) {
  if (typeof window !== "undefined") {
    // if the user has already been rickrolled by the page, we redirect to the actual repo
    location.assign(
      rickrolled
        ? `https://www.github.com/${githubPath}`
        : "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
  }

  return (
    <div>
      <Head>
        <title>{pageData.title}</title>

        {pageData.meta && (
          <>
            <meta name="description" content={pageData.description} />
            <meta name="twitter:card" content="summary_large_image" />
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
              content={`https://www.microsoftgithub.com/${githubPath}`}
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
      <p>
        Redirecting to the repository... if this doesn't work, click{" "}
        <a
          href={
            rickrolled
              ? `https://www.github.com/${githubPath}`
              : "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        >
          here
        </a>
        .
      </p>
    </div>
  );
}
