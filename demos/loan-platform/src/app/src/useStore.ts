import create from 'zustand';

interface AppState {
  name:
    | 'IDLE'
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'TRANSFER_LOANS'
    | 'LOAN_DETAILS';
  node: 'FNMANode' | 'COOPServicingNode' | 'PHHServicingNode';
  currentPortfolioId: string | null;
  currentLoanId?: string | null;
  checkedLoanIds?: string[];
  data?: any;
  blocks: any[];
  addBlock: (block: any) => void;
  update: (state: Partial<AppState>) => void;
}

export const useStore = create<AppState>()((set, get) => ({
  name: 'IDLE',
  node: 'FNMANode',
  currentPortfolioId: null,
  blocks: [],
  addBlock: (block) => {
    const blocks = [block, ...get().blocks];
    set({ blocks });
  },
  update: (state) => {
    set((prevState) => {
      const newState = { ...prevState, ...state };
      console.log('update!', newState);
      return newState;
    });
  },
}));
