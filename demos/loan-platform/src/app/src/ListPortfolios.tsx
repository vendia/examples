import Link from 'next/link';
import { useListLoans, useListPortfolios } from './useVendiaClient';
import { useStore } from './useStore';

export function ListPortfolios() {
  const currentPortfolioId = useStore((state) => state.currentPortfolioId);
  const node = useStore((state) => state.node);
  const { data: portfoliosData } = useListPortfolios();
  const { data: loansData } = useListLoans();
  if (!loansData || !portfoliosData) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {currentPortfolioId && (
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              {
                portfoliosData?.find((p) => p._id === currentPortfolioId)
                  ?.portfolioName
              }
            </li>
          </ul>
        </div>
      )}
      {portfoliosData
        ?.filter((p) => {
          // If it's a servicer view, only show portfolio that matches node
          if (node !== 'FNMANode') {
            return node === p._owner;
          }
          // For Fannie Mae, show all portfolios unless user clicked a portfolio to see loan details
          if (currentPortfolioId) {
            return currentPortfolioId === p._id;
          }
          return true;
        })
        ?.map((portfolio, i) => (
          <div key={portfolio?._id}>
            {i !== 0 && <div className="divider"></div>}
            <div className="flex justify-between items-center mt-8 mb-8">
              {/* Left side */}
              <div>
                <div className="text-2xl font-bold">
                  {portfolio?.portfolioName}
                </div>
                <div className="text-gray-400 mb-4">
                  Portfolio ID: {portfolio?.portfolioIdentifier}
                </div>
                {node === 'FNMANode' && !currentPortfolioId && (
                  <div>
                    <Link className="btn" href={`/portfolio/${portfolio._id}`}>
                      <button className="btn">View all loans</button>
                    </Link>
                  </div>
                )}
              </div>
              {/* Right side */}
              <div>
                <div className="stats shadow">
                  <div className="stat">
                    <div className="stat-title">Number of Loans</div>
                    <div className="stat-value">
                      {
                        loansData.filter(
                          (loan) =>
                            loan.portfolioIdentifier ===
                            portfolio.portfolioIdentifier
                        ).length
                      }
                    </div>
                    <div className="stat-desc">3% more than last month</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Percent Delinquent</div>
                    <div className="stat-value">
                      {portfolio?.latePercent?.toFixed(2) ?? 0}%
                    </div>
                    <div className="stat-desc">0.125% more than last month</div>
                  </div>

                  <div className="stat">
                    <div className="stat-title">Percent Seriously Delinquent</div>
                    <div className="stat-value">
                      {portfolio?.delinquentPercent?.toFixed(2) ?? 0}%
                    </div>
                    <div className="stat-desc">0.33% more than last month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
