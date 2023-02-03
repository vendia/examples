import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import {
  createVendiaClient,
  Self_LoanPortfolio_Partial_,
  Self_Loan_Partial_,
  Self_Payment_Partial_,
} from '@vendia/client';
import { config, nodes } from './__config';
import { VendiaClient } from './types';
import { useQuery, useQueryClient } from 'react-query';
import { useStore } from './useStore';

const defaultNode = nodes[0];
let options = config[defaultNode];

// TODO - is there a better way to do this? Need to pass a "dummy" client to context so that useVendiaClient will always return
//  a VendiaClient type. If I set type to VendiaClient | null then all components need to null check before using client...
const initialClient = createVendiaClient(options);
const VendiaClientContext = createContext<VendiaClient>(initialClient);

export const VendiaClientProvider = ({ children }: { children: ReactNode }) => {
  const node = useStore((state) => state.node);
  const [vendiaClient, setVendiaClient] = useState<VendiaClient>(initialClient);
  const queryClient = useQueryClient();
  useEffect(() => {
    console.log('updating vendia client:', node);
    const options = config[node];
    const client = createVendiaClient(options);
    setVendiaClient(client);
    setTimeout(() => {
      queryClient.invalidateQueries(['loans']);
      queryClient.invalidateQueries(['portfolios']);
    }, 500);
  }, [node]);
  return (
    <VendiaClientContext.Provider value={vendiaClient}>
      {children}
    </VendiaClientContext.Provider>
  );
};

export const useVendiaClient = () => {
  return useContext(VendiaClientContext);
};

export const useListPortfolios = () => {
  const client = useVendiaClient();
  return useQuery<Self_LoanPortfolio_Partial_[], Error>(
    ['portfolios'],
    async () => {
      const res = await client.entities.loanPortfolio.list();
      return res.items;
    }
  );
};

export const useListLoans = () => {
  const client = useVendiaClient();
  return useQuery<Self_Loan_Partial_[], Error>(['loans'], async () => {
    const res = await client.entities.loan.list();
    // @ts-ignore - loan identifier is a required field
    return res.items.sort((a, b) => (a.loanIdentifier.localeCompare(b.loanIdentifier)));
  });
};

export const useListPayments = () => {
  const client = useVendiaClient();
  return useQuery<Self_Payment_Partial_[], Error>(['payments'], async () => {
    const res = await client.entities.payment.list();
    // @ts-ignore - loan identifier is a required field
    return res.items.sort((a, b) => (a.loanIdentifier.localeCompare(b.loanIdentifier)));
  });
};
