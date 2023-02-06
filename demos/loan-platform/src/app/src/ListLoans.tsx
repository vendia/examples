import { useListLoans, useListPortfolios } from './useVendiaClient';
import { useStore } from './useStore';
import { useState } from 'react';

export const delinquencyColorLookup = {
  CURRENT: 'badge-success',
  LATE: 'badge-warning',
  DELINQUENT: 'badge-error',
};

export const delinquencyTextLookup = {
  CURRENT: 'Current',
  LATE: 'Delinquent',
  DELINQUENT: 'Seriously Delinquent',
};

export function ListLoans() {
  const [checkedLoanIds, setCheckedLoanIds] = useState<string[]>([]);

  // Update checked loans
  const handleCheckedLoanChange = (loanId: string) => {
    setCheckedLoanIds((prev) => {
      if (prev.includes(loanId)) {
        return prev.filter((id) => id !== loanId);
      }
      return [...prev, loanId];
    });
  };

  const store = useStore();
  const currentPortfolioId = useStore((state) => state.currentPortfolioId);
  const node = useStore((state) => state.node);
  const { isLoading, data: loansData } = useListLoans();
  const { isLoading: portfoliosLoading, data: portfoliosData } =
    useListPortfolios();

  if (isLoading || portfoliosLoading) {
    return <div>Loading...</div>;
  }

  let portfolio = portfoliosData?.[0];
  if (node === 'FNMANode') {
    portfolio = portfoliosData?.find((p) => p._id === currentPortfolioId);
  } else {
    portfolio = portfoliosData?.find((p) => p._owner === node);
  }

  return (
    <div>
      {portfolio && (
        <div
          key={portfolio?._id}
          className="overflow-x-auto mb-8 bg-base-100 rounded-2xl shadow"
        >
          <div className="flex justify-between items-center p-6">
            <div className="text-xl font-bold">
              {portfolio?.portfolioName} Details
            </div>
            <div>
              {' '}
              <button
                className="btn gap-2"
                disabled={checkedLoanIds.length === 0}
                onClick={() => {
                  setCheckedLoanIds([]);
                  store.update({
                    name: 'TRANSFER_LOANS',
                    checkedLoanIds,
                  });
                }}
              >
                Transfer Loans
              </button>
            </div>
          </div>
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="!z-0"></th>
                <th>Loan Id</th>
                <th>Originated</th>
                <th>Rate</th>
                <th>Balance</th>
                <th>Security Id</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loansData
                ?.filter(
                  (loan) =>
                    loan.portfolioIdentifier === portfolio?.portfolioIdentifier
                )
                .map((loan, i) => (
                  <tr key={loan?._id} className="">
                    {/* !z-0 to reset z-index on first column (set to 11 by daisyUI for some reason) */}
                    <td className="!z-0">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={checkedLoanIds.includes(loan?._id)}
                        onChange={() => handleCheckedLoanChange(loan?._id)}
                      />
                    </td>
                    <td>
                      <button
                        className="link"
                        onClick={() => {
                          store.update({
                            name: 'LOAN_DETAILS',
                            currentLoanId: loan?._id,
                          });
                        }}
                      >
                        {loan?.loanIdentifier}
                      </button>
                    </td>
                    <td>{loan?.originationDate}</td>
                    <td>{loan?.interestRatePercent}</td>
                    <td>
                      {loan?.unpaidPrincipalBalance === null
                        ? ''
                        : `$${loan?.unpaidPrincipalBalance?.toLocaleString()}`}
                    </td>
                    <td>
                      {loan?.securityIdentifier === null
                          ? ''
                          : `${loan?.securityIdentifier?.toLocaleString()}`}
                    </td>
                    <td>
                      <div
                        className={`badge ${
                          delinquencyColorLookup[
                            loan?.delinquencyStatus ?? 'CURRENT'
                          ]
                        }`}
                      >
                        {
                          delinquencyTextLookup[
                            loan?.delinquencyStatus ?? 'CURRENT'
                          ]
                        }
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
