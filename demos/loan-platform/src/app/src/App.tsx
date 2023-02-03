import Image from 'next/image';
import { useQuery } from 'react-query';
import { UniInfo } from './types';
import { useVendiaClient } from './useVendiaClient';
import { LogoutButton } from './LogoutButton';
import { Drawer } from './Drawer';
import { ListLoans as PortfolioDetails } from './ListLoans';
import { ListPortfolios as Portfolios } from './ListPortfolios';
import { ConfirmTransfer } from './confirmTransfer';
import { useStore } from './useStore';
import { nodes } from './__config';
import { useRouter } from 'next/router';
import { BlockNotifications } from './BlockNotifications';
import { LoanDetails } from './LoanDetails';

function AppContent() {
  const client = useVendiaClient();
  const { data } = useQuery<UniInfo, Error>(['uniInfo'], client.uniInfo.get);

  const store = useStore();
  const node = useStore((state) => state.node);
  const stateName = useStore((state) => state.name);
  const router = useRouter();

  const closeDrawer = () => {
    store.update({ name: 'IDLE', currentLoanId: null });
  };

  const theme = node === 'FNMANode' ? 'light' : 'winter';
  return (
    <div className="bg-base-200 h-[100vh]" data-theme={theme}>
      {/* Header */}
      <div className="bg-base-100 border-b border-gray-400">
        <div className="flex justify-between pt-4 pb-5 px-4 max-w-7xl mx-auto">
          {/* Left Side */}
          <div>
            <div className="h-[40px] max-w-[200px]">
              <img src={`/logo_${node}.png`} alt="Logo" />
            </div>
          </div>
          {/* Right Side */}
          <div className="flex items-center gap-4">
            <select
              className="select select-ghost select-sm"
              value={node}
              onChange={(e) => {
                router.push('/');
                store.update({
                  //@ts-ignore
                  node: e.target.value,
                  currentPortfolioId: null,
                });
              }}
            >
              {nodes.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))}
            </select>
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Main content */}
        <div className="grid gap-5 mt-5 px-4">
          <div className="">
            <Portfolios />
            <PortfolioDetails />
            {/* <BlockNotifications /> */}
          </div>
        </div>
        <Drawer
          isOpen={stateName !== 'IDLE'}
          setIsOpen={closeDrawer}
          isWide={stateName === 'LOAN_DETAILS'}
          theme={theme}
        >
          {stateName === 'TRANSFER_LOANS' && <ConfirmTransfer />}
          {stateName === 'LOAN_DETAILS' && <LoanDetails />}
        </Drawer>
      </div>
      <VendiaFooter />
    </div>
  );
}

function LoginScreen() {
  return (
    <div>
      <h1 className="text-xl">Welcome!</h1>
      <button
        className="btn btn-primary"
        onClick={() => console.log('logging in')}
      >
        Login
      </button>
    </div>
  );
}

function VendiaFooter() {
  return (
    <div className="bottom-0 w-full flex justify-center my-3">
      <div className="flex justify-center">
        <div className="text-center">
          <a href="https://vendia.net" target="_blank" rel="noreferrer">
            <img src="/logo-dark.svg" alt="Vendia Logo" width={100} />
          </a>
        </div>
      </div>
    </div>
  );
}
//{ currentPortfolioId }: { currentPortfolioId: string }
function App() {
  // if (error || isLoading) {
  //   return <div>Loading...</div>
  // }

  return <AppContent />;
}

export default App;
