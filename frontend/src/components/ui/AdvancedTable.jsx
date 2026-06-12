import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  MoreVertical, 
  Search, 
  Filter, 
  Download,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import Skeleton from './Skeleton';

const AdvancedTable = ({ 
  columns, 
  data, 
  loading, 
  title, 
  subtitle,
  onAdd = () => {},
  actions = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-sm text-text-muted">{subtitle}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onAdd} className="btn-premium px-6 py-2.5 text-xs font-bold flex items-center gap-2">
            <Plus size={16} />
            Add New
          </button>
          <button className="glass px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search within table..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 glass text-white rounded-2xl font-bold text-xs border border-white/10 hover:bg-white/5 transition-all">
          <Filter size={18} />
          Advance Filters
        </button>
      </div>

      <div className="glass-surface rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                {columns.map((col) => (
                  <th 
                    key={col.key} 
                    className={`px-8 py-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] cursor-pointer hover:text-white transition-colors ${col.className || ''}`}
                    onClick={() => requestSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {sortConfig?.key === col.key ? (
                        sortConfig.direction === 'ascending' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>
                      ) : <ChevronDown size={12} className="opacity-0 group-hover:opacity-100"/>}
                    </div>
                  </th>
                ))}
                <th className="px-8 py-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i}>
                    {columns.map(col => (
                      <td key={col.key} className="px-8 py-6"><Skeleton className="h-4 w-full" /></td>
                    ))}
                    <td className="px-8 py-6"><Skeleton className="h-4 w-8 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    {columns.map(col => (
                      <td key={col.key} className={`px-8 py-6 text-sm ${col.className || ''}`}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 glass rounded-lg text-text-muted hover:text-primary border border-white/5 hover:border-primary/20 transition-all">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-2 glass rounded-lg text-text-muted hover:text-accent-rose border border-white/5 hover:border-accent-rose/20 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="px-8 py-16 text-center">
                    <p className="text-text-muted font-bold">No records found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
            Showing {filteredData.length} of {data.length} entries
          </p>
          <div className="flex items-center gap-3">
            <button className="p-2 glass rounded-xl border border-white/10 opacity-50 cursor-not-allowed text-white"><ChevronLeft size={16}/></button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-primary text-white text-[10px] font-bold">1</button>
              <button className="w-8 h-8 rounded-lg glass text-text-muted text-[10px] font-bold hover:text-white">2</button>
            </div>
            <button className="p-2 glass rounded-xl border border-white/10 text-white hover:bg-white/5"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTable;
