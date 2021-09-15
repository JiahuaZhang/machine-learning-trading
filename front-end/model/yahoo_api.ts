export interface YahooQuote {
  exchange: string;
  shortname: string;
  quoteType: string;
  symbol: string;
  index: string;
  score: number;
  typeDisp: string;
  longname: string;
  isYahooFinance: boolean;
}

export interface YahooNews {
  uuid: string;
  title: string;
  publisher: string;
  link: string
  providerPublishTime: number;
  type: string
}

export interface YahooQueryResult {
  explains: any[],
  count: number,
  quotes: YahooQuote[];
  news: YahooNews[];
  nav: any[],
  lists: any[],
  researchReports: any[],
  totalTime: number;
  timeTakenForQuotes: number;
  timeTakenForNews: number;
  timeTakenForAlgowatchlist: number;
  timeTakenForPredefinedScreener: number;
  timeTakenForCrunchbase: number;
  timeTakenForNav: number;
  timeTakenForResearchReports: number;
}