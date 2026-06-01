import {
  BarChart3,
  TrendingUp,
  Wallet,
  Target,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from 'recharts';


export default function DashboardSection({
  filteredTrades,
  avgRR,
  totalRR,
  winTrades,
  lossTrades,
  bestDay,
  bestSession,
  bestStrategy,
  bestEntryWindow,
  chartData,
}: any) {
  return (
    
      <>
      
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
                {[
                  {
                    title: 'Win Rate',
                    value:
        filteredTrades.length > 0
          ? `${Math.round(
              (filteredTrades.filter(
                (trade: any) => trade.result === 'WIN'
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
      
                </>
    
  );
}