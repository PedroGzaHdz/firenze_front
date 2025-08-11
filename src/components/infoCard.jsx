import { ChevronRightIcon } from '@heroicons/react/24/outline';

const InfoCard = ({ 
  title, 
  description, 
  status, 
  statusColor 
}) => {
  const getStatusColorClass = (color) => {
    switch (color) {
      case 'blue':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'green':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'purple':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getButtonColorClass = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'green':
        return 'bg-green-500 hover:bg-green-600';
      case 'purple':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-white font-medium text-lg leading-tight mb-3">
            {title}
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <button className={`
          w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
          ${getButtonColorClass(statusColor)} group-hover:scale-110
        `}>
          <ChevronRightIcon className="w-5 h-5 text-white" />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <span className={`
          inline-flex px-3 py-1.5 rounded-full text-xs font-medium border
          ${getStatusColorClass(statusColor)}
        `}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;