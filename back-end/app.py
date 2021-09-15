from flask import Flask, request
import urllib.request
import urllib.parse
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/finance/search/<symbol>')
def finance(symbol):
    yahoo_api = 'https://query2.finance.yahoo.com/v1/finance/search'
    query = f'{yahoo_api}?q={urllib.parse.quote(symbol)}'

    with urllib.request.urlopen(query) as response:
        html = response.read()
        return html


@app.route('/finance/stock')
def stock():
    yahoo_api = 'https://query1.finance.yahoo.com/v7/finance/download'
    symbol = request.args.get('symbol')
    start = request.args.get('start')
    end = request.args.get('end')
    events = request.args.get('events')
    interval = request.args.get('interval')
    query = f'{yahoo_api}/{symbol}?period1={start}&period2={end}&interval={interval}&events={events}&includedAdjustedClose=true'

    print(query)
    with urllib.request.urlopen(query) as response:
        html = response.read()
        return html
