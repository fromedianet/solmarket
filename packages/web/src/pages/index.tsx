import dynamic from 'next/dynamic';
import React from 'react';

const CreateReactAppEntryPoint = dynamic(() => import('../App'), {
  ssr: false,
});

function App() {
  return <CreateReactAppEntryPoint />;
}

export default App;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {
      time: new Date().toISOString(),
    },
  }
}
