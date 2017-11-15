// @flow
export interface SyncJobData {
  hashKey: string,
  dataKey: string,
  data: string,
  operationType: 'add' | 'remove',
  channelName: string,
  channelMessage: string
}
