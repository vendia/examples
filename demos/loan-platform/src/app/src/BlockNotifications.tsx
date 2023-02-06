import { useEffect, useState } from 'react';
import { useStore } from './useStore';
import { useVendiaClient } from './useVendiaClient';

export function BlockNotifications() {
  const client = useVendiaClient();
  const store = useStore();
  const blocks = useStore((state) => state.blocks);
  useEffect(() => {
    const unsubscribe = client.blocks.onAdd((data) => {
      store.addBlock(data?.result);
    });
    return unsubscribe;
  }, [client.blocks, store]);
  return (
    <div className="mt-[300px]">
      <h1>DEBUG: Latest Blocks</h1>
      <div className="text-xs">
        {blocks.map((block) => (
          <div key={block?._id}>
            Block _id: {block?._id}
            {block?.transactions?.map((tx: any) =>
              tx?.mutations?.map((m: any, i: number) => (
                <div key={`${block?._id}${tx?._id}${i}`}>{m}</div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
