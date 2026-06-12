import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  Wallet,
  Download,
  Filter,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const revenueData = [
  { name: 'Week 1', amount: 45000 },
  { name: 'Week 2', amount: 52000 },
  { name: 'Week 3', amount: 48000 },
  { name: 'Week 4', amount: 61000 },
];

const feeStatusData = [
  { category: 'Paid', value: 75, color: '#34d399' },
  { category: 'Pending', value: 15, color: '#fbbf24' },
  { category: 'Overdue', value: 10, color: '#f87171' },
];

const transactions = [
  { id: 1, student: 'Alice Johnson', type: 'Tuition Fee', amount: '$1,200', date: 'Oct 12, 2026', status: 'Completed' },
  { id: 2, student: 'Bob Smith', type: 'Library Fine', amount: '$15', date: 'Oct 11, 2026', status: 'Pending' },
  { id: 3, student: 'Charlie Davis', type: 'Tuition Fee', amount: '$1,200', date: 'Oct 10, 2026', status: 'Completed' },
  { id: 4, student: 'Diana Prince', type: 'Exam Fee', amount: '$250', date: 'Oct 09, 2026', status: 'Completed' },
];

const FinanceStat = ({ icon: Icon, label, value, trend, isPositive, color }) => (
  <div className="glass-panel p-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl" />
    <div className="flex justify-between items-start relative z-10">
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <Icon size={20} className="text-white" style={{ color }} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <div className="mt-6">
      <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
    </div>
  </div>
);

function Finance() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Financial Insights</h1>
          <p className="text-text-muted">Monitor school revenue, fee collections, and expenditures.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 glass text-white rounded-[1rem] font-bold border border-white/10 hover:bg-white/5 transition-all">
            <Download size={20} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-[1rem] font-bold shadow-lg shadow-primary-glow">
            <CreditCard size={20} />
            Payment Settings
          </button>
        </div>
      </div>

      {/* Financial Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <FinanceStat icon={DollarSign} label="Total Revenue" value="$428,000" trend="12.5%" isPositive={true} color="#818cf8" />
        <FinanceStat icon={TrendingUp} label="Monthly Growth" value="+24.2%" trend="4.2%" isPositive={true} color="#34d399" />
        <FinanceStat icon={Wallet} label="Expenditures" value="$185,400" trend="8.1%" isPositive={false} color="#f87171" />
        <FinanceStat icon={PieChartIcon} label="Fee Collection" value="92.4%" trend="2.1%" isPositive={true} color="#fbbf24" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-panel p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Revenue Analysis</h3>
              <p className="text-sm text-text-muted">Weekly revenue breakdown for October 2026</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 glass rounded-lg text-white hover:bg-white/5"><BarChart3 size={18}/></button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Area type="monotone" dataKey="amount" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Status Breakdown */}
        <div className="glass-panel p-8">
          <h3 className="text-xl font-bold text-white mb-2">Fee Collection Status</h3>
          <p className="text-sm text-text-muted mb-8">Current enrollment fee status</p>
          
          <div className="space-y-6">
            {feeStatusData.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-white">{item.category}</span>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Goal Update</p>
            <p className="text-sm text-text-main leading-relaxed">You are <span className="text-primary font-bold">2.4%</span> ahead of your fee collection target for this month.</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-panel p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <button className="text-primary text-sm font-bold hover:underline">View History</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-6 text-sm font-bold text-text-muted uppercase">Student</th>
                <th className="pb-6 text-sm font-bold text-text-muted uppercase">Type</th>
                <th className="pb-6 text-sm font-bold text-text-muted uppercase">Amount</th>
                <th className="pb-6 text-sm font-bold text-text-muted uppercase">Date</th>
                <th className="pb-6 text-sm font-bold text-text-muted uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((t) => (
                <tr key={t.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="py-5 text-white font-bold">{t.student}</td>
                  <td className="py-5 text-sm text-text-muted font-medium">{t.type}</td>
                  <td className="py-5 text-sm text-white font-bold">{t.amount}</td>
                  <td className="py-5 text-sm text-text-muted font-medium">{t.date}</td>
                  <td className="py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default Finance;
