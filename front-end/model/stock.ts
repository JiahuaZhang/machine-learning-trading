export interface StockQuery {
  symbol: string;
  start: number;
  end: number;
  events: string;
  interval: string
}