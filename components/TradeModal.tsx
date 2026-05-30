 'use client';

 <Dialog open={open} onOpenChange={setOpen}>

 <button
  onClick={() => setOpen(true)}
  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 transition font-medium shadow-lg shadow-blue-500/20"
>
    + Add Trade
  </button>


  <DialogContent className="bg-[#111827] border border-white/10 text-white rounded-3xl max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">
        Add New Trade
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

  <Input type="file" />
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
};

  const { error } = await supabase.from('trades').insert([newTrade]);

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

  setOpen(false);
}}
      >
        Save Trade
      </Button>
    </div>
  </DialogContent>
</Dialog>