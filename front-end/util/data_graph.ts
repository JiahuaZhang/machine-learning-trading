import { parse } from 'papaparse';
import palette from 'google-palette';

export const toGraphData = (csv: string) => {
  const data = parse<string[]>(csv).data;
  const columns = data.shift();
  const result = columns.map((name, index) => {
    return { name, values: data.map((row) => row[index]) };
  });

  const labels = result.shift().values;
  const colors = palette('mpn65', result.length);
  const datasets = result.map((r, index) => ({
    label: r.name,
    data: r.values,
    hidden: r.name === 'Volume',
    backgroundColor: `#${colors[index]}`,
    borderColor: `#${colors[index]}`,
  }));

  return { labels, datasets };
};