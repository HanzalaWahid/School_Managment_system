import PublicNavbar from './PublicNavbar';

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#1F1B4E] font-sans selection:bg-[#5B45F2]/30">
      <PublicNavbar />
      <main className="w-full h-full relative">
        {children}
      </main>
    </div>
  );
};

export default PublicLayout;
