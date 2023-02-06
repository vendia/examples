import type { NextPage } from 'next';
import { useEffect } from 'react';
import App from '../src/App';
import { useStore } from '../src/useStore';

const Home: NextPage = () => {
  const store = useStore();
  useEffect(() => {
    store.update({ currentPortfolioId: null });
  }, []);
  return <App />;
};

export default Home;
