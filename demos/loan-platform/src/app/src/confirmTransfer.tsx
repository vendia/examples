import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useStore } from './useStore';
import {
  useListLoans,
  useListPortfolios,
  useVendiaClient,
} from './useVendiaClient';

export function ConfirmTransfer() {
  const [selectedDestinationPortfolioId, setSelectedDestinationPortfolioId] =
    useState('');

  const store = useStore();
  const checkedLoanIds = useStore((state) => state?.checkedLoanIds);
  const currentPortfolioId = useStore((state) => state.currentPortfolioId);
  const node = useStore((state) => state.node);

  const { data: loans } = useListLoans();
  const { data: portfolios } = useListPortfolios();

  const router = useRouter();
  const client = useVendiaClient();
  const queryclient = useQueryClient();
  const mutation = useMutation(
    () => {
      const destinationPortfolio = portfolios?.find(
        (p) => p._id === selectedDestinationPortfolioId
      );
      const currentPortfolio = portfolios?.find((p) => {
        if (node === 'FNMANode') {
          return p._id === currentPortfolioId;
        }
        return p._owner === node;
      });
      const selectedLoans = loans?.filter((l) =>
        checkedLoanIds?.includes(l._id)
      );
      const selectedLoanIdentifiers =
        selectedLoans?.map((l) => l.loanIdentifier ?? '') ?? [];

      console.log(
        destinationPortfolio?._owner,
        currentPortfolio?._owner,
        selectedLoanIdentifiers
      );

      const loanPromises =
        selectedLoans?.map((loan) => {
          return client.entities.loan.update(
            {
              _id: loan._id,
              portfolioIdentifier: destinationPortfolio?.portfolioIdentifier,
              loanCollaborators: {
                servicerIdentifier: destinationPortfolio?._owner,
              },
            },
            {
              aclInput: {
                acl: [
                  {
                    principal: { nodes: ['JPMCLenderNode', 'FNMANode'] },
                    operations: ['ALL', 'UPDATE_ACL'],
                  },
                  {
                    principal: { nodes: [destinationPortfolio?._owner ?? ''] },
                    operations: ['ALL', 'UPDATE_ACL'],
                  }
                ],
              },
            }
          );
        }) ?? [];
      // const destPortfolioRes = client.entities.loanPortfolio.update({
      //   _id: destinationPortfolio?._id ?? '',
      //   loanIdentifiers: [
      //     ...(destinationPortfolio?.loanIdentifiers ?? []),
      //     ...selectedLoanIdentifiers,
      //   ],
      // });
      // const currentPortfolioRes = client.entities.loanPortfolio.update({
      //   _id: currentPortfolio?._id ?? '',
      //   loanIdentifiers: currentPortfolio?.loanIdentifiers?.filter(
      //     (identifier) =>
      //       !selectedLoanIdentifiers.includes(identifier as string)
      //   ),
      // });
      return Promise.all([
        ...loanPromises,
        // destPortfolioRes,
        // currentPortfolioRes,
      ]);
    },
    {
      onSuccess: () => {
        console.log('SUCCESS!');
        queryclient.invalidateQueries(['loans']);
        queryclient.invalidateQueries(['portfolios']);
        store.update({ name: 'IDLE', currentPortfolioId: null });
        router.push('/');
      },
      onError: (err: Error) => {
        // setError(err.message)
        console.log('TRANSFER ERROR', err.message);
      },
    }
  );

  if (!loans || !portfolios) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-8">Transfer Loans</h1>
      <div>Transfer the following loans:</div>
      <ul className="list-disc pl-8 mb-8">
        {loans
          .filter((l) => checkedLoanIds?.includes(l._id))
          .map((loan) => (
            <li key={loan._id}>{loan.loanIdentifier}</li>
          ))}
      </ul>
      <div className="mb-4">To:</div>
      <div>
        <select
          className="select select-outline"
          onChange={(e) => setSelectedDestinationPortfolioId(e.target.value)}
          value={selectedDestinationPortfolioId}
        >
          <option disabled value="">
            Select Portfolio
          </option>
          {portfolios
            .filter((p) => p._id !== currentPortfolioId && p._owner !== node)
            .map((portfolio) => (
              <option key={portfolio._id} value={portfolio._id}>
                {portfolio.portfolioName}
              </option>
            ))}
        </select>
      </div>
      <div className="mt-16 flex space-x-2">
        <button
          className="btn btn-error"
          disabled={mutation.isLoading}
          onClick={() => store.update({ name: 'IDLE' })}
        >
          Cancel
        </button>
        <button
          className={`btn ${mutation.isLoading && 'loading'}`}
          disabled={mutation.isLoading || selectedDestinationPortfolioId === ''}
          onClick={() => mutation.mutate()}
        >
          Transfer Loans
        </button>
      </div>
    </div>
  );
}
