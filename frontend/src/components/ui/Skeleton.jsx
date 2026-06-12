const Skeleton = ({ className = "" }) => {
  return (
    <div className={`shimmer bg-white/5 rounded-lg ${className}`} />
  );
};

export default Skeleton;
