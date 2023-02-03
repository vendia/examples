import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import App from '../../src/App';
import { useStore } from '../../src/useStore';

const Page: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const currentPortfolioId = Array.isArray(id) ? id[0] : id;
  const node = useStore((state) => state.node);
  const store = useStore();

  useEffect(() => {
    // Only FNMA can see different portfolios, protect against changing to servicer then using back button
    if (node === 'FNMANode') {
      store.update({ currentPortfolioId });
    } else {
      router.replace('/');
    }
  }, []);

  return <App />;
};

export default Page;
