import { ClientOptions } from '@vendia/client';

type Config = Record<string, ClientOptions>;

export const config: Config = {
  FNMANode: {
    apiUrl: '<fnman-vendia-graphql-url>',
    websocketUrl:
      '<fnman-vendia-websocket-url>',
    apiKey: '<fnman-vendia-apikey>',
    debug: true,
  },
  COOPServicingNode: {
    apiUrl: '<coop-vendia-graphql-url>',
    websocketUrl:
      '<coop-vendia-websocket-url>',
    apiKey: '<coop-vendia-apikey>',
    debug: true,
  },
  PHHServicingNode: {
    apiUrl: '<phh-vendia-graphql-url>',
    websocketUrl:
      '<phh-vendia-websocket-url>',
    apiKey: '<phh-vendia-apikey>',
    debug: true,
  },
};

export const nodes = Object.keys(config);
