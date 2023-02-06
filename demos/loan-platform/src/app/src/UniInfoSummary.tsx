import { useQuery } from 'react-query'
import { useVendiaClient } from './useVendiaClient'
import { UniInfo } from './types'

function UniInfoSummary() {
  const client = useVendiaClient()
  const { isLoading, data } = useQuery<UniInfo, Error>(['uniInfo'], client.uniInfo.get)
  if (isLoading) {
    return <div>Loading...</div>
  }
  const summary = {
    name: data?.name,
    status: data?.status,
    node: data?.localNodeName,
  }
  return (
    <div>
      <h4>UniInfo</h4>
      <pre>{JSON.stringify(summary, null, 2)}</pre>
    </div>
  )
}
