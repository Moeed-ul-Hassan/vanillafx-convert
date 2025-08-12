import { useState, useEffect } from 'react';
import { ArrowUpDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Popular currencies for the converter
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
];

// Fallback rates if API fails
const FALLBACK_RATES: Record<string, number> = {
  'USD': 1,
  'EUR': 0.85,
  'GBP': 0.73,
  'JPY': 110.12,
  'CAD': 1.25,
  'AUD': 1.35,
  'CHF': 0.92,
  'CNY': 6.45,
  'INR': 74.50,
  'BRL': 5.20,
};

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const { toast } = useToast();

  // Fetch exchange rates from API
  const fetchExchangeRate = async (from: string, to: string): Promise<number> => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.exchangerate.host/latest?base=${from}&symbols=${to}`);
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      if (data.success && data.rates && data.rates[to]) {
        return data.rates[to];
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('API Error:', error);
      
      // Fallback to hardcoded rates
      const fromRate = FALLBACK_RATES[from] || 1;
      const toRate = FALLBACK_RATES[to] || 1;
      const fallbackRate = toRate / fromRate;
      
      toast({
        title: "Using Offline Rates",
        description: "Live rates unavailable, using fallback data",
        variant: "destructive",
      });
      
      return fallbackRate;
    } finally {
      setIsLoading(false);
    }
  };

  // Convert currency
  const convertCurrency = async () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
      setConvertedAmount(numAmount);
      setLastUpdated(new Date().toLocaleTimeString());
      return;
    }

    const rate = await fetchExchangeRate(fromCurrency, toCurrency);
    const converted = numAmount * rate;
    
    setExchangeRate(rate);
    setConvertedAmount(converted);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    
    // If we have a rate, calculate the inverse
    if (exchangeRate && convertedAmount) {
      const newRate = 1 / exchangeRate;
      const newConverted = parseFloat(amount) * newRate;
      setExchangeRate(newRate);
      setConvertedAmount(newConverted);
    }
  };

  // Auto-convert when currencies change
  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [fromCurrency, toCurrency]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const getCurrencySymbol = (code: string): string => {
    return CURRENCIES.find(curr => curr.code === code)?.symbol || code;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border-0">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Currency Converter
          </CardTitle>
          <p className="text-muted-foreground">
            Convert currencies with live exchange rates
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="currency-input text-lg font-semibold"
              min="0"
              step="0.01"
            />
          </div>

          {/* From Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">From</label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="currency-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-muted-foreground">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapCurrencies}
              className="swap-button rounded-full"
              disabled={isLoading}
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">To</label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="currency-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{currency.symbol}</span>
                      <span>{currency.code}</span>
                      <span className="text-muted-foreground">- {currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Convert Button */}
          <Button
            onClick={convertCurrency}
            disabled={isLoading || !amount}
            className="w-full convert-button py-6 text-lg"
          >
            {isLoading ? 'Converting...' : 'Convert'}
          </Button>

          {/* Result Display */}
          {convertedAmount !== null && exchangeRate !== null && (
            <div className="result-display rounded-lg p-4 space-y-2">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">
                  {getCurrencySymbol(toCurrency)} {formatNumber(convertedAmount)}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  1 {fromCurrency} = {formatNumber(exchangeRate)} {toCurrency}
                </div>
                {lastUpdated && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Last updated: {lastUpdated}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};