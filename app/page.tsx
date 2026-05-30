
'use client';



import { supabase } from '@/lib/supabase';


import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';


import {
  BarChart3,
  TrendingUp,
  Wallet,
  Target,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const chartData = [
  { day: 'Mon', value: 4 },
  { day: 'Tue', value: 9 },
  { day: 'Wed', value: 6 },
  { day: 'Thu', value: 14 },
  { day: 'Fri', value: 18 },
  { day: 'Sat', value: 16 },
];



export default function Page() {
  const [open, setOpen] = useState(false);
  const [tradeData, setTradeData] = useState({
  entry: '',
  exit: '',
  stoploss: '',
  target: '',
  strategy: '',
  rr: '',
  notes: '',
  result: 'WIN',
  instrument: '',
entryTime: '',
exitTime: '',
session: 'Indian Session',
direction: 'LONG',
tradeDate: '',
});

const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

const [savedTrades, setSavedTrades] = useState<any[]>([]);

const [editingTrade, setEditingTrade] =
  useState<any>(null);
  const [selectedScreenshot, setSelectedScreenshot] =
  useState<any>(null);

const [filters, setFilters] = useState({
  instrument: '',
  strategy: '',
  day: '',
  session: '',
});

const [galleryFilter, setGalleryFilter] =
  useState('ALL');

  const [strategyA, setStrategyA] = useState('');
const [strategyB, setStrategyB] = useState('');

const [selectedTrade, setSelectedTrade] =
  useState<any>(null);
useEffect(() => {
  fetchTrades();

  const channel = supabase
    .channel('trades-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'trades',
      },
      () => {
        fetchTrades();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

const fetchTrades = async () => {
  const { data, error } = await supabase
    .from('trades')
    .select('*');

  if (error) {
    console.log(error);
    return;
  }

  setSavedTrades(data || []);
};
const exportCSV = () => {
 const headers = [
  'Instrument',
  'Strategy',
  'Result',
  'RR',
  'Session',
  'Direction',
  'Day',
  'Date',
  'Entry Time',
  'Exit Time',
  'Notes',
];
const rows = filteredTrades.map((trade) => [
  trade.instrument,
  trade.strategy,
  trade.result,
  trade.rr,
  trade.session,
  trade.direction,
  trade.day,
  trade.trade_date,
  trade.entry_time,
  trade.exit_time,
  trade.notes,
]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;
  link.download = 'backtestlab-trades.csv';

  link.click();

  URL.revokeObjectURL(url);
};

const filteredTrades = savedTrades.filter((trade: any) => {
  return (
    (!filters.instrument ||
      trade.instrument
        ?.toLowerCase()
        .includes(filters.instrument.toLowerCase())) &&

    (!filters.strategy ||
      trade.strategy
        ?.toLowerCase()
        .includes(filters.strategy.toLowerCase())) &&

    (!filters.day || trade.day === filters.day) &&

    (!filters.session || trade.session === filters.session)
  );
});

const winTrades = filteredTrades.filter(
  (trade) => trade.result === 'WIN'
).length;

const lossTrades = filteredTrades.filter(
  (trade) => trade.result === 'LOSS'
).length;

const breakevenTrades = filteredTrades.filter(
  (trade) => trade.result === 'BREAKEVEN'
).length;
const totalRR = filteredTrades.reduce(
  (acc, trade) => {
    const rr = parseFloat(trade.rr) || 0;
    return acc + rr;
  },
  0
);

const avgRR =



  filteredTrades.length > 0
    ? (totalRR / savedTrades.length).toFixed(2)
    : '0';

    const getDayFromDate = (dateString: string) => {
  if (!dateString) return '';

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const date = new Date(dateString);

  return days[date.getDay()];
};


const dayStats = filteredTrades.reduce((acc: any, trade: any) => {
  if (!trade.day) return acc;

  if (!acc[trade.day]) {
    acc[trade.day] = {
      total: 0,
      wins: 0,
    };
  }

  acc[trade.day].total++;

  if (trade.result === 'WIN') {
    acc[trade.day].wins++;
  }

  return acc;
}, {});

const bestDay =
  Object.keys(dayStats).length > 0
    ? Object.entries(dayStats)
        .sort(
          (a: any, b: any) =>
            b[1].wins / b[1].total -
            a[1].wins / a[1].total
        )[0][0]
    : 'No Data';

const sessionStats = filteredTrades.reduce((acc: any, trade: any) => {
  if (!trade.session) return acc;

  if (!acc[trade.session]) {
    acc[trade.session] = {
      total: 0,
      wins: 0,
    };
  }

  acc[trade.session].total++;

  if (trade.result === 'WIN') {
    acc[trade.session].wins++;
  }

  return acc;
}, {});

const bestSession =
  Object.keys(sessionStats).length > 0
    ? Object.entries(sessionStats)
        .sort(
          (a: any, b: any) =>
            b[1].wins / b[1].total -
            a[1].wins / a[1].total
        )[0][0]
    : 'No Data';

    const strategyStats = filteredTrades.reduce(
  (acc: any, trade: any) => {
    if (!trade.strategy) return acc;

    if (!acc[trade.strategy]) {
      acc[trade.strategy] = {
        total: 0,
        wins: 0,
      };
    }

    acc[trade.strategy].total++;

    if (trade.result === 'WIN') {
      acc[trade.strategy].wins++;
    }

    return acc;
  },
  {}
);

const bestStrategy =
  Object.keys(strategyStats).length > 0
    ? Object.entries(strategyStats)
        .sort(
          (a: any, b: any) =>
            b[1].wins / b[1].total -
            a[1].wins / a[1].total
        )[0][0]
    : 'No Data';

    const strategyTable = Object.entries(
  filteredTrades.reduce((acc: any, trade: any) => {
    if (!trade.strategy) return acc;

    if (!acc[trade.strategy]) {
      acc[trade.strategy] = {
        trades: 0,
        wins: 0,
        netRR: 0,
      };
    }
   
    acc[trade.strategy].trades++;

    if (trade.result === 'WIN') {
      acc[trade.strategy].wins++;
    }

    acc[trade.strategy].netRR +=
      parseFloat(trade.rr || '0');

    return acc;
  }, {})
);

const dayTable = Object.entries(
  filteredTrades.reduce((acc: any, trade: any) => {
    if (!trade.day) return acc;

    if (!acc[trade.day]) {
      acc[trade.day] = {
        trades: 0,
        wins: 0,
        netRR: 0,
      };
    }

    acc[trade.day].trades++;

    if (trade.result === 'WIN') {
      acc[trade.day].wins++;
    }

    acc[trade.day].netRR +=
      parseFloat(trade.rr || '0');

    return acc;
  }, {})
);

const sessionTable = Object.entries(
  filteredTrades.reduce((acc: any, trade: any) => {
    if (!trade.session) return acc;

    if (!acc[trade.session]) {
      acc[trade.session] = {
        trades: 0,
        wins: 0,
        netRR: 0,
      };
    }

    acc[trade.session].trades++;

    if (trade.result === 'WIN') {
      acc[trade.session].wins++;
    }

    acc[trade.session].netRR +=
      parseFloat(trade.rr || '0');

    return acc;
  }, {})
);

const getTimeSlot = (time: string) => {
  if (!time) return 'No Time';

  const [hour, minute] = time
    .split(':')
    .map(Number);

  const totalMinutes = hour * 60 + minute;

  const slotStart =
    Math.floor(totalMinutes / 15) * 15;

  const slotEnd = slotStart + 15;

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60)
      .toString()
      .padStart(2, '0');

    const m = (mins % 60)
      .toString()
      .padStart(2, '0');

    return `${h}:${m}`;
  };

  return `${formatTime(slotStart)} - ${formatTime(
    slotEnd
  )}`;
};
const timeTable = Object.entries(
  filteredTrades.reduce((acc: any, trade: any) => {
    const slot = getTimeSlot(trade.entry_time);

    if (!acc[slot]) {
      acc[slot] = {
        trades: 0,
        wins: 0,
        netRR: 0,
      };
    }

    acc[slot].trades++;

    if (trade.result === 'WIN') {
      acc[slot].wins++;
    }

    acc[slot].netRR += parseFloat(trade.rr || '0');

    return acc;
  }, {})
);

const monthTable = Object.entries(
  filteredTrades.reduce((acc: any, trade: any) => {
    if (!trade.trade_date) return acc;

    const month = new Date(
      trade.trade_date
    ).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });

    if (!acc[month]) {
      acc[month] = {
        trades: 0,
        wins: 0,
        netRR: 0,
      };
    }

    acc[month].trades++;

    if (trade.result === 'WIN') {
      acc[month].wins++;
    }

    acc[month].netRR += parseFloat(
      trade.rr || '0'
    );



    return acc;
  }, {})
);

const screenshotTrades = filteredTrades.filter((trade: any) => {
  if (!trade.screenshot_url) return false;

  if (galleryFilter === 'ALL') return true;

  return trade.result === galleryFilter;
});

const bestEntryWindow =
  timeTable.length > 0
    ? timeTable
        .sort(
          (a: any, b: any) =>
            b[1].wins / b[1].trades -
            a[1].wins / a[1].trades
        )[0][0]
    : 'No Data';

const currentWinRate =
  filteredTrades.length > 0
    ? Math.round(
        (winTrades / filteredTrades.length) * 100
      )
    : 0;

const equityCurveData = filteredTrades.reduce(
  (acc: any[], trade: any, index: number) => {
    const rr = parseFloat(trade.rr || '0');
    const previousValue =
      acc.length > 0 ? acc[acc.length - 1].equity : 0;

    acc.push({
      trade: index + 1,
      equity: previousValue + rr,
    });

    return acc;
  },
  []
);
const strategies: string[] = [
  ...new Set(
    savedTrades
      .map((trade: any) => trade.strategy)
      .filter(Boolean)
  ),
];

const getStrategyMetrics = (strategyName: string) => {
  const trades = filteredTrades.filter(
    (trade: any) => trade.strategy === strategyName
  );

  const wins = trades.filter(
    (trade: any) => trade.result === 'WIN'
  ).length;

  const netRR = trades.reduce((acc: number, trade: any) => {
    return acc + (parseFloat(trade.rr || '0') || 0);
  }, 0);

  return {
    trades: trades.length,
    wins,
    winRate:
      trades.length > 0
        ? Math.round((wins / trades.length) * 100)
        : 0,
    netRR,
  };
};

const compareA = getStrategyMetrics(strategyA);
const compareB = getStrategyMetrics(strategyB);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0E1422] border-r border-white/10 p-6 hidden lg:flex flex-col">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            BacktestLab
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Professional Trading Analytics
          </p>
        </div>

        <nav className="mt-10 space-y-2">
          {[
            'Dashboard',
            'Trades',
            'Analytics',
            'Strategies',
            'Calendar',
            'Workspace',
            'Settings',
          ].map((item) => (
            <button
              key={item}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition border border-transparent hover:border-white/10"
            >
              {item}
              <ArrowUpRight size={16} className="text-gray-500" />
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 p-5">
          <p className="text-blue-300 text-sm">Current Performance</p>

          <h2 className="text-4xl font-bold mt-3">+18.4R</h2>

          <p className="text-gray-300 text-sm mt-2">
            Best performing month so far.
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Topbar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h2 className="text-5xl font-bold tracking-tight">
              Trading Dashboard
            </h2>

            <p className="text-gray-400 mt-3 text-lg">
              Analyze performance, review setups, and improve your edge.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
  <Input
    placeholder="Filter Instrument"
    value={filters.instrument}
    onChange={(e) =>
      setFilters({
        ...filters,
        instrument: e.target.value,
      })
    }
  />

  <Input
    placeholder="Filter Strategy"
    value={filters.strategy}
    onChange={(e) =>
      setFilters({
        ...filters,
        strategy: e.target.value,
      })
    }
  />

  <select
    className="rounded-xl bg-[#0B0F19] border border-white/10 px-3 py-2"
    value={filters.day}
    onChange={(e) =>
      setFilters({
        ...filters,
        day: e.target.value,
      })
    }
  >
    <option value="">All Days</option>
    <option>Monday</option>
    <option>Tuesday</option>
    <option>Wednesday</option>
    <option>Thursday</option>
    <option>Friday</option>
  </select>

  <select
    className="rounded-xl bg-[#0B0F19] border border-white/10 px-3 py-2"
    value={filters.session}
    onChange={(e) =>
      setFilters({
        ...filters,
        session: e.target.value,
      })
    }
  >
    <option value="">All Sessions</option>
    <option>Indian Session</option>
    <option>London Session</option>
    <option>New York Session</option>
  </select>
</div>
          </div>

          <div className="mt-4">
  <button
    onClick={() =>
      setFilters({
        instrument: '',
        strategy: '',
        day: '',
        session: '',
      })
    }
    className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5"
  >
    Reset Filters
  </button>
</div>



<div className="flex flex-wrap gap-2 mt-4">
  {filters.instrument && (
    <button
      onClick={() =>
        setFilters({
          ...filters,
          instrument: '',
        })
      }
      className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm"
    >
      {filters.instrument} ✕
    </button>
  )}

  {filters.strategy && (
    <button
      onClick={() =>
        setFilters({
          ...filters,
          strategy: '',
        })
      }
      className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm"
    >
      {filters.strategy} ✕
    </button>
  )}

  {filters.day && (
    <button
      onClick={() =>
        setFilters({
          ...filters,
          day: '',
        })
      }
      className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm"
    >
      {filters.day} ✕
    </button>
  )}

  {filters.session && (
    <button
      onClick={() =>
        setFilters({
          ...filters,
          session: '',
        })
      }
      className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm"
    >
      {filters.session} ✕
    </button>
  )}
</div>



          <div className="flex gap-3">
            <button
  onClick={exportCSV}
  className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5 transition"
>
  Export CSV
</button>

            
              <Dialog open={open} onOpenChange={setOpen}>

 <button
  onClick={() => setOpen(true)}
  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 transition font-medium shadow-lg shadow-blue-500/20"
>
   {editingTrade ? 'Edit Trade' : '+ Add Trade'}
  </button>


  <DialogContent className="bg-[#111827] border border-white/10 text-white rounded-3xl max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">
  {editingTrade ? 'Edit Trade' : 'Add New Trade'}
</DialogTitle>
    </DialogHeader>

<div className="mt-4">
  <label className="text-sm text-gray-400 mb-2 block">
    Entry Date
  </label>

<Input
  type="date"
  value={tradeData.tradeDate}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      tradeDate: e.target.value,
    })
  }
/>
</div>

    <div className="grid grid-cols-2 gap-4 mt-4">

         <Input
  placeholder="Instrument (NIFTY/BANKNIFTY)"
  value={tradeData.instrument}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      instrument: e.target.value,
    })
  }
/>
          <Input
  type="time"
  value={tradeData.entryTime}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      entryTime: e.target.value,
    })
  }
/>
          <Input
  type="time"
  value={tradeData.exitTime}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      exitTime: e.target.value,
    })
  }
/>
    <select
  className="w-full rounded-xl bg-[#0B0F19] border border-white/10 px-3 py-2 text-sm"
  value={tradeData.result}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      result: e.target.value,
    })
  }
>
  <option value="WIN">WIN</option>
  <option value="LOSS">LOSS</option>
  <option value="BREAKEVEN">BREAKEVEN</option>
</select>

<select
  className="w-full rounded-xl bg-[#0B0F19] border border-white/10 px-3 py-2 text-sm"
  value={tradeData.session}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      session: e.target.value,
    })
  }
>
  <option value="Indian Session">
    Indian Session
  </option>

  <option value="London Session">
    London Session
  </option>

  <option value="New York Session">
    New York Session
  </option>
</select>

<select
  className="w-full rounded-xl bg-[#0B0F19] border border-white/10 px-3 py-2 text-sm"
  value={tradeData.direction}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      direction: e.target.value,
    })
  }
>
  <option>LONG</option>
  <option>SHORT</option>
</select>

      <Input
  placeholder="Entry Price"
  value={tradeData.entry}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      entry: e.target.value,
    })
  }
/>

      <Input
  placeholder="Exit Price"
  value={tradeData.exit}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      exit: e.target.value,
    })
  }
/>

      <Input
  placeholder="Stoploss"
  value={tradeData.stoploss}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      stoploss: e.target.value,
    })
  }
/>

      <Input
  placeholder="Target"
  value={tradeData.target}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      target: e.target.value,
    })
  }
/>

      <Input
  placeholder="Strategy Name"
  value={tradeData.strategy}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      strategy: e.target.value,
    })
  }
/>

      <Input
  placeholder="Risk Reward (RR)"
  value={tradeData.rr}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      rr: e.target.value,
    })
  }
/>
    </div>

    <div className="mt-4">
  <label className="text-sm text-gray-400 mb-2 block">
    Trade Screenshot
  </label>

  <Input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (file) {
      setScreenshotFile(file);
    }
  }}
/>
</div>

    <Textarea
  placeholder="Trade Notes..."
  className="mt-4"
  value={tradeData.notes}
  onChange={(e) =>
    setTradeData({
      ...tradeData,
      notes: e.target.value,
    })
  }
/>

    <div className="flex justify-end gap-3 mt-6">
      <Button
        variant="outline"
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>

      <Button
        className="bg-blue-600 hover:bg-blue-500"
onClick={async () => {

let screenshotUrl = editingTrade?.screenshot_url || '';

if (screenshotFile) {
  const fileName = `${Date.now()}-${screenshotFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from('trade-screenshots')
    .upload(fileName, screenshotFile);

  if (uploadError) {
    alert(uploadError.message);
    console.log(uploadError);
    return;
  }

  const { data } = supabase.storage
    .from('trade-screenshots')
    .getPublicUrl(fileName);

  screenshotUrl = data.publicUrl;
}

  const newTrade = {
  strategy: tradeData.strategy,
  entry: tradeData.entry,
  exit: tradeData.exit,
  rr: tradeData.rr,
  result: tradeData.result,
  notes: tradeData.notes,

  instrument: tradeData.instrument,
  entry_time: tradeData.entryTime,
  exit_time: tradeData.exitTime,
  session: tradeData.session,
  direction: tradeData.direction,
  trade_date: tradeData.tradeDate,
  day: getDayFromDate(tradeData.tradeDate),
  
  screenshot_url: screenshotUrl,
};

  const { error } = editingTrade
  ? await supabase
      .from('trades')
      .update(newTrade)
      .eq('id', editingTrade.id)
  : await supabase.from('trades').insert([newTrade]);

  if (error) {
    alert(error.message);
    console.log(error);
    return;
  }

await fetchTrades();

 setTradeData({
  entry: '',
  exit: '',
  stoploss: '',
  target: '',
  strategy: '',
  rr: '',
  notes: '',
  result: 'WIN',

  instrument: '',
  entryTime: '',
  exitTime: '',
  session: 'Indian Session',
direction: 'LONG',
  tradeDate: '',
});
setScreenshotFile(null);
setEditingTrade(null);

  setOpen(false);
}}
      >
        {editingTrade ? 'Update Trade' : 'Save Trade'}
      </Button>
    </div>
  </DialogContent>
</Dialog>
            
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <h3 className="text-xl font-semibold">
    Current View Summary
  </h3>

  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
    <div>
      <p className="text-gray-400 text-sm">
        Trades
      </p>

      <p className="text-2xl font-bold">
        {filteredTrades.length}
      </p>
    </div>

    <div>
      <p className="text-gray-400 text-sm">
        Win Rate
      </p>

      <p className="text-2xl font-bold">
        {currentWinRate}%
      </p>
    </div>

    <div>
      <p className="text-gray-400 text-sm">
        Net RR
      </p>

      <p className="text-2xl font-bold">
        {totalRR.toFixed(2)}R
      </p>
    </div>

    <div>
      <p className="text-gray-400 text-sm">
        Best Day
      </p>

      <p className="text-lg font-semibold">
        {bestDay}
      </p>
    </div>

    <div>
      <p className="text-gray-400 text-sm">
        Best Session
      </p>

      <p className="text-lg font-semibold">
        {bestSession}
      </p>
    </div>

    <div>
      <p className="text-gray-400 text-sm">
        Best Entry Window
      </p>

      <p className="text-lg font-semibold">
        {bestEntryWindow}
      </p>
    </div>
  </div>
</div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
          {[
            {
              title: 'Win Rate',
              value:
  filteredTrades.length > 0
    ? `${Math.round(
        (filteredTrades.filter(
          (trade) => trade.result === 'WIN'
        ).length /
          filteredTrades.length) *
          100
      )}%`
    : '0%',
              icon: TrendingUp,
              change: '+4.2%',
            },
            {
              title: 'Avg RR',
              value: `${avgRR}R`,
              icon: Wallet,
              change: '+0.18',
            },
            {
              title: 'Total Trades',
              value: filteredTrades.length,
              icon: BarChart3,
              change: '+12',
            },
            {
              title: 'Net RR',
              value: `${totalRR.toFixed(2)}R`,
              icon: Target,
              change: '+6R',
            },
            {
  title: 'Wins',
  value: winTrades,
  icon: TrendingUp,
  change: 'Winning Trades',
},
{
  title: 'Losses',
  value: lossTrades,
  icon: Target,
  change: 'Losing Trades',
},
{
  title: 'Best Day',
  value: bestDay,
  icon: TrendingUp,
  change: 'Highest Win Rate',
},
{
  title: 'Best Session',
  value: bestSession,
  icon: Activity,
  change: 'Highest Win Rate',
},
{
  title: 'Best Strategy',
  value: bestStrategy,
  icon: Target,
  change: 'Highest Win Rate',
},
{
  title: 'Best Entry Window',
  value: bestEntryWindow,
  icon: Activity,
  change: 'Best Time Slot',
},

          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl bg-white/[0.03] border border-white/10 p-6 backdrop-blur-xl hover:border-blue-500/20 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {item.title}
                    </p>

                    <h3 className="text-4xl font-bold mt-4">
                      {item.value}
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Icon className="text-blue-400" size={22} />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-green-400 text-sm">
                  <ArrowUpRight size={16} />
                  {item.change} this month
                </div>
              </div>
            );
          })}
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-8">
          {/* Chart */}
          <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">
                  Equity Curve
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  Performance overview over time.
                </p>
              </div>

              <Activity className="text-blue-400" />
            </div>

            <div className="h-[320px] mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorValue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3B82F6"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3B82F6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <XAxis dataKey="day" stroke="#6B7280" />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold">
                  Recent Activity
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  Latest trading updates.
                </p>
              </div>

              <button className="text-sm text-blue-400">
                View All
              </button>
            </div>

            <div className="space-y-5 mt-8">
              {[
                'Breakout Retest trade hit full target.',
                'New strategy added to workspace.',
                'Monthly analytics updated.',
                'Friend commented on your trade.',
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start"
                >
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-2" />

                  <div>
                    <p className="text-sm">{activity}</p>

                    <p className="text-xs text-gray-500 mt-1">
                      2 hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trades Table */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold">
                Recent Trades
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                Latest manually backtested trades.
              </p>
            </div>

            <button className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-sm">
              View All
            </button>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="pb-4 font-medium">Instrument</th>
                  <th className="pb-4 font-medium">Strategy</th>
                  <th className="pb-4 font-medium">Result</th>
                  <th className="pb-4 font-medium">RR</th>
                  <th className="pb-4 font-medium">Screenshot</th>
                  <th className="pb-4 font-medium">
  Delete
</th>
<th className="pb-4 font-medium">Edit</th>
                </tr>
              </thead>

              <tbody>
                {filteredTrades.map((trade, index) => (
                 <tr
  key={index}
  onClick={() => setSelectedTrade(trade)}
  className="cursor-pointer border-b border-white/5 hover:bg-white/[0.02]"
>
                    <td className="py-5">{trade.instrument || 'No Instrument'}</td>

                    <td className="py-5">{trade.strategy || 'No Strategy'}</td>

                    <td className="py-5">
                     <span className="px-3 py-1 rounded-full text-sm border bg-blue-500/10 text-blue-400 border-blue-500/20">
  {trade.rr || 'No RR'}
</span>
                    </td>

                    <td className="py-5">{trade.entry} → {trade.exit}</td>
                    <td className="py-5">
  {trade.screenshot_url ? (
    <div
  onClick={() =>
    setSelectedScreenshot(trade)
  }
  className="cursor-pointer"
>
      View
    </div>
  ) : (
    'No Screenshot'
  )}
</td>

<td className="py-5">
  <button
   onClick={(e) => {
  e.stopPropagation();

  setEditingTrade(trade);

  setTradeData({
    entry: trade.entry || '',
    exit: trade.exit || '',
    stoploss: trade.stoploss || '',
    target: trade.target || '',
    strategy: trade.strategy || '',
    rr: trade.rr || '',
    notes: trade.notes || '',
    result: trade.result || 'WIN',

    instrument: trade.instrument || '',
    entryTime: trade.entry_time || '',
    exitTime: trade.exit_time || '',
    session: trade.session || 'Indian Session',
    direction: trade.direction || 'LONG',
    tradeDate: trade.trade_date || '',
  });

  setOpen(true);
}}
    className="text-blue-400 hover:text-blue-300"
  >
    Edit
  </button>
</td>

<td className="py-5">
  <button
    onClick={async (e) => {
      e.stopPropagation();

      const confirmDelete = window.confirm(
        'Delete this trade?'
      );

      if (!confirmDelete) return;

      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', trade.id);

      if (error) {
        alert(error.message);
        return;
      }

      fetchTrades();
    }}
    className="text-red-400 hover:text-red-300"
  >
    Delete
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>

 <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <h3 className="text-2xl font-semibold">
    Strategy Analytics
  </h3>

  <p className="text-gray-400 text-sm mt-1">
    Strategy-wise win rate and RR performance.
  </p>

  <div className="overflow-x-auto mt-6">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-400 border-b border-white/10">
          <th className="pb-4">Strategy</th>
          <th className="pb-4">Trades</th>
          <th className="pb-4">WR</th>
          <th className="pb-4">Net RR</th>
        </tr>
      </thead>

      <tbody>
        {strategyTable.map(([name, stats]: any) => (
          <tr
            key={name}
            className="border-b border-white/5"
          >
            <td className="py-4">{name}</td>
            <td className="py-4">{stats.trades}</td>
            <td className="py-4">
              {Math.round((stats.wins / stats.trades) * 100)}%
            </td>
            <td className="py-4">
              {stats.netRR.toFixed(2)}R
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <h3 className="text-2xl font-semibold">
    Day-wise Analytics
  </h3>

  <div className="overflow-x-auto mt-6">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-400 border-b border-white/10">
          <th className="pb-4">Day</th>
          <th className="pb-4">Trades</th>
          <th className="pb-4">WR</th>
          <th className="pb-4">Net RR</th>
        </tr>
      </thead>

      <tbody>
        {dayTable.map(([day, stats]: any) => (
          <tr
            key={day}
            className="border-b border-white/5"
          >
            <td className="py-4">{day}</td>

            <td className="py-4">
              {stats.trades}
            </td>

            <td className="py-4">
              {Math.round(
                (stats.wins / stats.trades) * 100
              )}
              %
            </td>

            <td className="py-4">
              {stats.netRR.toFixed(2)}R
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <h3 className="text-2xl font-semibold">
    Session Analytics
  </h3>

  <div className="overflow-x-auto mt-6">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-400 border-b border-white/10">
          <th className="pb-4">Session</th>
          <th className="pb-4">Trades</th>
          <th className="pb-4">WR</th>
          <th className="pb-4">Net RR</th>
        </tr>
      </thead>

      <tbody>
        {sessionTable.map(([session, stats]: any) => (
          <tr
            key={session}
            className="border-b border-white/5"
          >
            <td className="py-4">{session}</td>

            <td className="py-4">
              {stats.trades}
            </td>

            <td className="py-4">
              {Math.round(
                (stats.wins / stats.trades) * 100
              )}
              %
            </td>

            <td className="py-4">
              {stats.netRR.toFixed(2)}R
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <h3 className="text-2xl font-semibold">
    Time-wise Analytics
  </h3>

  <p className="text-gray-400 text-sm mt-1">
    Entry time performance breakdown.
  </p>

  <div className="overflow-x-auto mt-6">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-400 border-b border-white/10">
          <th className="pb-4">Time Slot</th>
          <th className="pb-4">Trades</th>
          <th className="pb-4">WR</th>
          <th className="pb-4">Net RR</th>
        </tr>
      </thead>

      <tbody>
        {timeTable.map(([slot, stats]: any) => (
          <tr
            key={slot}
            className="border-b border-white/5"
          >
            <td className="py-4">{slot}</td>
            <td className="py-4">{stats.trades}</td>
            <td className="py-4">
              {Math.round((stats.wins / stats.trades) * 100)}%
            </td>
            <td className="py-4">
              {stats.netRR.toFixed(2)}R
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <h3 className="text-2xl font-semibold">
    Monthly Analytics
  </h3>

  <p className="text-gray-400 text-sm mt-1">
    Performance breakdown by month.
  </p>

  <div className="overflow-x-auto mt-6">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-400 border-b border-white/10">
          <th className="pb-4">Month</th>
          <th className="pb-4">Trades</th>
          <th className="pb-4">WR</th>
          <th className="pb-4">Net RR</th>
        </tr>
      </thead>

      <tbody>
        {monthTable.map(([month, stats]: any) => (
          <tr
            key={month}
            className="border-b border-white/5"
          >
            <td className="py-4">{month}</td>

            <td className="py-4">
              {stats.trades}
            </td>

            <td className="py-4">
              {Math.round(
                (stats.wins / stats.trades) * 100
              )}
              %
            </td>

            <td className="py-4">
              {stats.netRR.toFixed(2)}R
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <div className="flex items-center justify-between gap-4">
    <div>
      <h3 className="text-2xl font-semibold">
        Screenshot Gallery
      </h3>

      <p className="text-gray-400 text-sm mt-1">
        Review winning and losing setups visually.
      </p>
    </div>

    <select
      className="rounded-xl bg-[#0B0F19] border border-white/10 px-3 py-2 text-sm"
      value={galleryFilter}
      onChange={(e) => setGalleryFilter(e.target.value)}
    >
      <option value="ALL">All</option>
      <option value="WIN">Wins</option>
      <option value="LOSS">Losses</option>
      <option value="BREAKEVEN">Breakeven</option>
    </select>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
    {screenshotTrades.map((trade: any) => (
      <div
        key={trade.id}
        className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden"
      >
       <div
  onClick={() => setSelectedScreenshot(trade)}
  className="cursor-pointer"
>
  <img
    src={trade.screenshot_url}
    alt="Trade Screenshot"
    className="w-full h-48 object-cover hover:scale-105 transition"
  />
</div>

        <div className="p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">
              {trade.instrument || 'No Instrument'}
            </h4>

            <span className="text-sm text-blue-400">
              {trade.result}
            </span>
          </div>

          <p className="text-sm text-gray-400 mt-1">
            {trade.strategy || 'No Strategy'}
          </p>

          <p className="text-sm text-gray-500 mt-2">
            {trade.trade_date} • {trade.entry_time}
          </p>

          <p className="text-sm text-gray-300 mt-2">
            RR: {trade.rr}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <h3 className="text-2xl font-semibold">
    Equity Curve
  </h3>

  <p className="text-gray-400 text-sm mt-1">
    Cumulative RR growth trade by trade.
  </p>

  <div className="h-[320px] mt-6">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={equityCurveData}>
        <XAxis dataKey="trade" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip />

        <Area
          type="monotone"
          dataKey="equity"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.15}
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>

<div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
  <h3 className="text-2xl font-semibold">
    Compare Strategies
  </h3>

  <div className="grid grid-cols-2 gap-4 mt-6">
    <select
      className="rounded-xl bg-[#0B0F19] border border-white/10 px-3 py-2"
      value={strategyA}
      onChange={(e) => setStrategyA(e.target.value)}
    >
      <option value="">Select Strategy A</option>

      {strategies.map((strategy: string) => (
  <option
    key={strategy}
    value={strategy}
  >
    {strategy}
  </option>
))}
    </select>

    <select
      className="rounded-xl bg-[#0B0F19] border border-white/10 px-3 py-2"
      value={strategyB}
      onChange={(e) => setStrategyB(e.target.value)}
    >
      <option value="">Select Strategy B</option>

      {strategies.map((strategy: string) => (
  <option
    key={strategy}
    value={strategy}
  >
    {strategy}
  </option>
))}
    </select>
  </div>

  {strategyA && strategyB && (
  <div className="overflow-x-auto mt-6">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-400 border-b border-white/10">
          <th className="pb-4">Metric</th>
          <th className="pb-4">{strategyA}</th>
          <th className="pb-4">{strategyB}</th>
        </tr>
      </thead>

      <tbody>
        <tr className="border-b border-white/5">
          <td className="py-4">Trades</td>
          <td>{compareA.trades}</td>
          <td>{compareB.trades}</td>
        </tr>

        <tr className="border-b border-white/5">
          <td className="py-4">Win Rate</td>
          <td>{compareA.winRate}%</td>
          <td>{compareB.winRate}%</td>
        </tr>

        <tr className="border-b border-white/5">
          <td className="py-4">Wins</td>
          <td>{compareA.wins}</td>
          <td>{compareB.wins}</td>
        </tr>

        <tr>
          <td className="py-4">Net RR</td>
          <td>{compareA.netRR.toFixed(2)}R</td>
          <td>{compareB.netRR.toFixed(2)}R</td>
        </tr>
      </tbody>
    </table>
  </div>
)}

</div>

{selectedScreenshot && (
  <Dialog
    open={!!selectedScreenshot}
    onOpenChange={() =>
      setSelectedScreenshot(null)
    }
  >
    <DialogContent className="bg-[#111827] text-white border border-white/10 max-w-5xl">

      <DialogHeader>
        <DialogTitle>
          Screenshot Review
        </DialogTitle>
      </DialogHeader>

     <a
  href={selectedScreenshot.screenshot_url}
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src={selectedScreenshot.screenshot_url}
    alt="Trade Screenshot"
    className="w-full rounded-2xl border border-white/10 cursor-zoom-in hover:opacity-90 transition"
  />
</a>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

        <div>
          <p className="text-gray-400 text-sm">
            Instrument
          </p>

          <p>
            {selectedScreenshot.instrument}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            Strategy
          </p>

          <p>
            {selectedScreenshot.strategy}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            RR
          </p>

          <p>
            {selectedScreenshot.rr}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            Result
          </p>

          <p>
            {selectedScreenshot.result}
          </p>
        </div>

      </div>

      <div className="mt-4">
        <p className="text-gray-400 text-sm">
          Notes
        </p>

        <p className="mt-2">
          {selectedScreenshot.notes ||
            'No Notes'}
        </p>
      </div>

    </DialogContent>
  </Dialog>
)}

            {selectedTrade && (
  <Dialog
    open={!!selectedTrade}
    onOpenChange={() => setSelectedTrade(null)}
  >
    <DialogContent className="bg-[#111827] text-white border border-white/10 max-w-3xl">
      <DialogHeader>
        <DialogTitle>
          {selectedTrade.instrument}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">

        <p>
          <strong>Strategy:</strong>{' '}
          {selectedTrade.strategy}
        </p>

        <p>
          <strong>Date:</strong>{' '}
          {selectedTrade.trade_date}
        </p>

        <p>
          <strong>Day:</strong>{' '}
          {selectedTrade.day}
        </p>

        <p>
          <strong>Session:</strong>{' '}
          {selectedTrade.session}
        </p>

        <p>
          <strong>Direction:</strong>{' '}
          {selectedTrade.direction}
        </p>

        <p>
          <strong>Entry:</strong>{' '}
          {selectedTrade.entry}
        </p>

        <p>
          <strong>Exit:</strong>{' '}
          {selectedTrade.exit}
        </p>

        <p>
          <strong>RR:</strong>{' '}
          {selectedTrade.rr}
        </p>

        <p>
          <strong>Notes:</strong>{' '}
          {selectedTrade.notes}
        </p>

        {selectedTrade.screenshot_url && (
          <img
            src={selectedTrade.screenshot_url}
            alt="Trade Screenshot"
            className="rounded-xl border border-white/10"
          />
        )}
      </div>
    </DialogContent>
  </Dialog>
)}

          </div>
        </div>
      </main>
    </div>
  );
}