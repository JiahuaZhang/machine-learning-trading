import axios, { AxiosResponse } from 'axios';
import { StockQuery } from '../model/stock';
import { YahooQueryResult } from '../model/yahoo_api';

const local_api = 'http://localhost:5000/finance';

export const querySymbol = async (symbol: string) => {
  const response = await axios.get<YahooQueryResult>(`${local_api}/search/${symbol}`).catch(err => {
    console.error(`failed to fetch result for ${local_api} with ${symbol}`);
    console.error(err);
  }) as AxiosResponse<YahooQueryResult>;

  return response.data;
};

export const fetchStock = async (info: StockQuery) => {
  const { symbol, start, end, events, interval } = info;
  const url = `${local_api}/stock?symbol=${symbol}&start=${start}&end=${end}&events=${events}&interval=${interval}`;

  const response = await axios.get(url).catch(
    err => {
      console.error(`failed to fetch result for ${url}`);
      console.error(err);
    }
  ) as AxiosResponse<string>;

  return response.data;
};