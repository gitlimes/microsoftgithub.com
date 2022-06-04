import Head from "next/head";
import styles from "../styles/Home.module.css";

import { useState } from "react";

export async function getServerSideProps() {
  async function getStats() {
    const statsFetch = await fetch("https://microsoftgithub.com/api/stats");
    const statsJson = await statsFetch.json();
    return statsJson;
  }
  const { rickrolled } = await getStats();

  return {
    props: {
      rickrolled,
    },
  };
}

export default function Home({ rickrolled }) {
  const [extendedStats, setExtendedStats] = useState(false);
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>NotHub</title>
        <meta
          name="description"
          content="This isn't GitHub, and isn't affiliated with Microsoft in any way. It's just a website that lets you create legit-looking GitHub links that
          rickroll the visitor."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NotHub" />
        <meta
          name="twitter:description"
          content="This isn't GitHub, and isn't affiliated with Microsoft in any way. It's just a website that lets you create legit-looking GitHub links that
          rickroll the visitor."
        />
        <meta
          name="twitter:image"
          content="https://www.microsoftgithub.com/twimg.png"
        />
      </Head>

      <div className={styles.content}>
        <div className={styles.hero}>
          <h1>NotHub</h1>
          <p>
            A website that lets you create legit-looking GitHub links that
            rickroll the visitor.
          </p>
        </div>

        <div className={styles.section}>
          <h1>Usage</h1>
          <p>
            Just replace <code className="bg">github.com</code> with{" "}
            <code className="bg">microsoftgithub.com</code>. Yeah, that's all!
            The resulting url will redirect to the rickroll link. For example,{" "}
            <code>github.com/ashmonty/website</code> becomes{" "}
            <code>microsoftgithub.com/ashmonty/website</code>.
            <br />
            When embedded on Twitter, Discord and other social sites, the link
            will display the official social preview, for extra realism.
          </p>
        </div>

        <div className={styles.section}>
          <h1>Why?</h1>
          <p>
            When I found this domain I decided to buy it because I didn't want
            it to end up in the hands of a scammer to be used as a phishing
            link, and it was dirt cheap. With the domain in my hands, I figured
            it would've been a shame not to use it to rickroll people.
            <br />
            <i>How many people, you ask?</i>{" "}
            <code
              className="bg clickable"
              onClick={() => setExtendedStats(!extendedStats)}
            >
              {extendedStats ? rickrolled.users : `${rickrolled.kusers}k`}
            </code>{" "}
            and counting!
          </p>
        </div>
      </div>

      <footer>
        <p>
          Made with{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0.9em"
            height="0.9em"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>{" "}
          by{" "}
          <a href="https://www.ashmonty.com" target="_blank" rel="noreferrer">
            ash
          </a>{" "}
          • This website is in no way affiliated with Microsoft or any of its
          subsidiaries •{" "}
          <a
            href="https://github.com/ashmonty/microsoftgithub.com"
            target="_blank"
            rel="noreferrer"
          >
            Source code
          </a>
        </p>
      </footer>
    </div>
  );
}
