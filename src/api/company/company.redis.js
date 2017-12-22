// @flow
import Redis from 'ioredis';
import type { Company } from './company';

/**
 * keys used in the datastore
 */
export const companyKeys = {
  company: 'company'
};

/**
 * get all companies in redis
 */
export async function getAllCompanies(redis: Redis.Redis): Promise<Array<Company>> {
  try {
    const res = await redis.hgetall(companyKeys.company);
    return Object.keys(res).map(companyId => JSON.parse(res[companyId]));
  } catch (err) {
    throw err;
  }
}

/**
 * get a company by id
 */
export async function getCompanyById(
  redis: Redis.Redis,
  companyId: string
): Promise<Company> {
  try {
    const res = await redis.hget(companyKeys.company, companyId);
    return JSON.parse(res);
  } catch (err) {
    throw err;
  }
}

/**
 * add a company to redis data store
 */
export async function addCompany(
  redis: Redis.Redis,
  company: Company
): Promise<string> {
  try {
    const res = await redis.hmset(
      companyKeys.company,
      company._id,
      JSON.stringify(company)
    );
    return res;
  } catch (err) {
    throw err;
  }
}

/**
 * remove a company in the redis data store
 */
export async function removeCompany(
  redis: Redis.Redis,
  companyId: string
): Promise<string> {
  try {
    const res = await redis.hdel(companyKeys.company, companyId);
    return res;
  } catch (err) {
    throw err;
  }
}
