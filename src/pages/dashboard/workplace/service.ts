import { request } from '@umijs/max';
import type { ActivitiesType, AnalysisData, NoticeType } from './data';

export async function queryProjectNotice(): Promise<{ data: NoticeType[] }> {
  return request('/api/v1/clue/getClueByUserId?userId=1');
}

export async function queryActivities(): Promise<{ data: ActivitiesType[] }> {
  // return request('/api/activities');
  return request('/api/v1/customer/getCustomerByLastTime');
}

export async function fakeChartData(): Promise<{ data: AnalysisData }> {
  return request('/api/fake_workplace_chart_data');
}
