import React, { useCallback } from 'react';

import CrawlWorkForm from './componenets/crawlWorkForm';

export default function App() {
  const handleCrawling = useCallback((query) => {}, []);

  return <CrawlWorkForm onQuery={handleCrawling}></CrawlWorkForm>;
}
