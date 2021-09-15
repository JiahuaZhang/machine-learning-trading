import _ from 'lodash';
import { useState } from 'react';
import { AutoComplete, Button, DatePicker, Input, Popover, Select } from 'antd';
import moment from 'moment';
import { toGraphData } from '../util/data_graph';
import { fetchStock, querySymbol } from '../util/yahoo_finance';
import { YahooQuote } from '../model/yahoo_api';
import { Line } from 'react-chartjs-2';

const searchStock = async (stock: string, update: (arg: YahooQuote[]) => void) => {
  if (!stock) {
    update([]);
    return;
  }

  const result = await querySymbol(stock);
  update(result.quotes);
};

const debounceSearchStock = _.debounce(searchStock, 500);

const { RangePicker } = DatePicker;

const defaultDateRanges: [moment.Moment, moment.Moment] = [moment().subtract(1, 'month'), moment()];

const Home = () => {
  const [symbol, setSymbol] = useState('');
  const [stocks, setStocks] = useState<YahooQuote[]>([]);
  const [dateRanges, setdateRanges] = useState(defaultDateRanges);
  const [events, setEvents] = useState('history');
  const [interval, setInterval] = useState('1d');
  const [graphData, setGraphData] = useState(null);

  const updateDateRange = (range: string) => {
    let start: moment.Moment;
    if (/ytd/i.test(range)) {
      start = moment().endOf('year').subtract(1, 'year');
    } else if (/\dd/i.test(range)) {
      const result = /(?<day>\d)d/i.exec(range);
      const day = Number(result.groups.day);
      start = moment().subtract(day, 'days');
    } else if (/\dm/i.test(range)) {
      const result = /(?<month>\d)m/i.exec(range);
      const month = Number(result.groups.month);
      start = moment().subtract(month, 'months');
    } else if (/\dy/i.test(range)) {
      const result = /(?<year>\d)y/i.exec(range);
      const year = Number(result.groups.year);
      start = moment().subtract(year, 'years');
    }

    setdateRanges([start, moment()]);
  };

  return (
    <div>
      <AutoComplete
        style={{ width: '100%', padding: 10 }}
        onSelect={(value) => setSymbol(value)}
        options={stocks.map((stock) => ({
          label: `${stock.symbol} - ${stock.shortname}`,
          value: stock.symbol,
        }))}>
        <Input
          onChange={(event) => {
            if (!event.target.value) {
              setSymbol('');
              setStocks([]);
              return;
            }

            debounceSearchStock(event.target.value, setStocks);
          }}
          placeholder='🔍 Search stock'
          style={{ fontSize: '1.5rem' }}
        />
      </AutoComplete>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, max-content)', gap: 10 }}>
        <div>
          <span>Time period: </span>
          <RangePicker
            value={dateRanges}
            onChange={(e) => {
              setdateRanges(e);
            }}
          />
          <Popover
            trigger='click'
            content={
              <ul style={{ display: 'inline-block', listStyle: 'none', padding: 0 }}>
                <li>
                  <Button onClick={() => updateDateRange('1D')}>1D</Button>
                  <Button onClick={() => updateDateRange('5d')}>5D</Button>
                  <Button onClick={() => updateDateRange('1m')}>1M</Button>
                  <Button onClick={() => updateDateRange('3M')}>3M</Button>
                  <Button onClick={() => updateDateRange('6m')}>6M</Button>
                </li>
                <li>
                  <Button onClick={() => updateDateRange('ytd')}>YTD</Button>
                  <Button onClick={() => updateDateRange('1y')}>1Y</Button>
                  <Button onClick={() => updateDateRange('2Y')}>2Y</Button>
                  <Button onClick={() => updateDateRange('5y')}>5Y</Button>
                </li>
              </ul>
            }>
            <Button type='link'>⬇️</Button>
          </Popover>
        </div>

        <div>
          <span>Show: </span>
          <Select value={events} onChange={(e) => setEvents(e)} style={{ width: 150 }}>
            <Select.Option value='history'>Historical Prices</Select.Option>
            <Select.Option value='div'>Dividends only</Select.Option>
            <Select.Option value='split'>Stock split</Select.Option>
          </Select>
        </div>

        <div>
          <span>Frequency: </span>
          <Select value={interval} onChange={(e) => setInterval(e)} style={{ width: 100 }}>
            <Select.Option value='1d'>Daily</Select.Option>
            <Select.Option value='1wk'>Weekly</Select.Option>
            <Select.Option value='1mo'>Monthly</Select.Option>
          </Select>
        </div>

        <div>
          <Button
            type='primary'
            style={{ borderRadius: 5 }}
            disabled={!symbol}
            onClick={async () => {
              const csv = await fetchStock({
                symbol,
                start: Math.floor(Number(dateRanges[0]) / 1000),
                end: Math.floor(Number(dateRanges[1]) / 1000),
                events,
                interval,
              });

              const data = toGraphData(csv);
              setGraphData(data);
            }}>
            Submit
          </Button>
        </div>
      </section>

      <Line data={graphData} />
    </div>
  );
};

export default Home;
