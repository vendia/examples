import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useStore } from './useStore';
import {
  useListLoans,
  useListPayments,
  useListPortfolios,
  useVendiaClient,
} from './useVendiaClient';
import { delinquencyColorLookup, delinquencyTextLookup } from './ListLoans';

function LoanDetail({ title, data }: { title: string; data: any }) {
  return (
    <div className="mb-10">
      <div className="text-md">{title}</div>
      <div className="text-sm text-gray-500">{data}</div>
    </div>
  );
}

export function LoanDetails() {
  const [selectedDestinationPortfolioId, setSelectedDestinationPortfolioId] =
    useState('');

  const store = useStore();
  const currentLoanId = useStore((state) => state?.currentLoanId);
  const currentPortfolioId = useStore((state) => state.currentPortfolioId);
  const node = useStore((state) => state.node);

  const { data: loans } = useListLoans();
  const { data: payments } = useListPayments();

  if (!loans || !payments) {
    return <div>Loading...</div>;
  }

  const loan = loans?.find((l) => l._id === currentLoanId);
  console.log(loan);
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Loan Details</h1>
        <div
          className={`badge badge-lg ${
            delinquencyColorLookup[loan?.delinquencyStatus ?? 'CURRENT']
          }`}
        >
          {delinquencyTextLookup[loan?.delinquencyStatus ?? 'CURRENT']}
        </div>
      </div>
      <div className="divider mb-8"></div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <LoanDetail title="Loan ID" data={loan?.loanIdentifier} />
          <LoanDetail title="Origination Date" data={loan?.originationDate} />
          <LoanDetail title="Interest Rate" data={loan?.interestRatePercent} />
        </div>
        <div>
          <LoanDetail
            title="Balance"
            data={'$' + loan?.unpaidPrincipalBalance?.toLocaleString()}
          />
          <LoanDetail
            title="Borrower Credit Score"
            data={loan?.borrowerCreditScore}
          />
          <LoanDetail title="Number of Units" data={loan?.numberOfUnits} />
        </div>
      </div>
      <table className="table w-full">
        <thead className="bg-base-200">
          <tr>
            <th className="!z-0">ID</th>
            <th>Last Payment</th>
            <th>Payment Amount</th>
            <th>Principal Distribution</th>
          </tr>
        </thead>
        <tbody>
          {payments
            .filter((p) => p.loanIdentifier === loan?.loanIdentifier)
            .map((payment) => (
              <tr key={payment._id} className="">
                <td>{payment._id.slice(24)}</td>
                <td>{payment.effectiveDate}</td>
                <td>${payment.principalAndInterestPaymentAmount}</td>
                <td>${payment.principalDistributionAmount}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
