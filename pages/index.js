export async function getServerSideProps() {
  return {
    /*
     * temporary redirect, will actually work on the whole ordeal later. 
     * also, if you're reading this: hi, welcome to the first commit! Or, well, second really, but you get what I mean.
     */
    redirect: {
      destination: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 
      permanent: false,
    },
  };
}

export default function Home() {
  return null;
}
