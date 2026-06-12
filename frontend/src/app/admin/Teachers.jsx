import { motion } from 'framer-motion';
import { 
  Users, 
  Mail, 
  Phone, 
  BookOpen, 
  MoreVertical, 
  UserPlus, 
  Star, 
  Award,
  Calendar,
  Search,
  ArrowUpRight
} from 'lucide-react';

const mockTeachers = [
  { id: 1, name: 'Dr. Sarah Connor', subject: 'Mathematics (Calculus)', experience: '12 Years', rating: 4.9, students: 120, avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 2, name: 'Mr. James Bond', subject: 'Security & Ethics', experience: '8 Years', rating: 4.8, students: 85, avatar: 'https://i.pravatar.cc/150?u=james' },
  { id: 3, name: 'Prof. Albus Dumbledore', subject: 'History of Magic', experience: '45 Years', rating: 5.0, students: 450, avatar: 'https://i.pravatar.cc/150?u=albus' },
  { id: 4, name: 'Dr. Bruce Banner', subject: 'Physics & Gamma Rays', experience: '15 Years', rating: 4.7, students: 110, avatar: 'https://i.pravatar.cc/150?u=bruce' },
  { id: 5, name: 'Ms. Mary Jane', subject: 'English Literature', experience: '6 Years', rating: 4.6, students: 95, avatar: 'https://i.pravatar.cc/150?u=mary' },
  { id: 6, name: 'Coach Ted Lasso', subject: 'Physical Education', experience: '10 Years', rating: 4.9, students: 200, avatar: 'https://i.pravatar.cc/150?u=ted' },
];

const TeacherCard = ({ teacher }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-panel p-6 group transition-all duration-500 overflow-hidden relative"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
    
    <div className="flex justify-between items-start mb-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 group-hover:border-primary transition-all p-1">
          <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover rounded-xl" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-bg-dark flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </div>
      </div>
      <button className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-xl">
        <MoreVertical size={20} />
      </button>
    </div>

    <div className="mb-6">
      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-all mb-1">{teacher.name}</h3>
      <p className="text-xs text-primary font-bold tracking-wider uppercase mb-3 flex items-center gap-1">
        <BookOpen size={12} />
        {teacher.subject}
      </p>
      
      <div className="flex gap-4">
        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg text-[10px] font-bold">
          <Star size={10} />
          {teacher.rating}
        </div>
        <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-lg text-[10px] font-bold">
          <Users size={10} />
          {teacher.students} Students
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
      <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 p-3 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition-all border border-white/5">
        <Mail size={14} />
        Message
      </button>
      <button className="flex-1 flex items-center justify-center gap-2 glass p-3 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-all border border-white/10">
        Profile
        <ArrowUpRight size={14} />
      </button>
    </div>
  </motion.div>
);

function Teachers() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Faculty Directory</h1>
          <p className="text-text-muted">Explore and manage your teaching staff across departments.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-[1.25rem] font-bold shadow-lg shadow-primary-glow"
        >
          <UserPlus size={20} />
          Invite Teacher
        </motion.button>
      </div>

      {/* Faculty Summary Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-primary">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Total Faculty</p>
          <h3 className="text-3xl font-bold text-white">482</h3>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-emerald-500">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Active Now</p>
          <h3 className="text-3xl font-bold text-white">324</h3>
        </div>
        <div className="glass-panel p-6 border-l-4 border-l-amber-500">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Average Exp</p>
          <h3 className="text-3xl font-bold text-white">8.5 Yrs</h3>
        </div>
      </div>

      {/* Search & Tool Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted pr-2 border-r border-white/10" />
          <input 
            type="text" 
            placeholder="Search by name, subject, or department..." 
            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 pl-14 pr-4 transition-all focus:border-primary/50 text-white font-medium"
          />
        </div>
        <select className="bg-white/5 border border-white/10 rounded-[1.5rem] px-8 text-text-muted font-bold focus:outline-none focus:border-primary/50 cursor-pointer">
          <option>All Departments</option>
          <option>Science</option>
          <option>Arts</option>
        </select>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTeachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </motion.div>
  );
}

export default Teachers;
