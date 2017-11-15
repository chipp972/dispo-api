// @flow
import { Queue } from 'bull';
import { SyncJobData } from '../../config/queue/queue.type';

export interface CompanyJobData extends SyncJobData {
  channelName: 'company',
  channelMessage: | 'companyAdded'
    | 'companyRemoved'
    | 'companyUpdated'
    | 'company'
    | 'allCompanies'
}

export const syncCompany = (queue: Queue, data: CompanyJobData) => {
  queue.add(data);
};
