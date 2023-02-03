import { createVendiaClient } from '@vendia/client';

export type VendiaClient = ReturnType<typeof createVendiaClient>;
export type BlockItems = Awaited<ReturnType<VendiaClient['blocks']['list']>>;
export type UniInfo = Awaited<ReturnType<VendiaClient['uniInfo']['get']>>;
