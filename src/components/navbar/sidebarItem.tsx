import React from 'react';

interface Props {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, active = false, onClick }: Props) => {
  return (
    <div
      className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 ${
        active
          ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
          : 'text-slate-400 hover:bg-slate-700/30 hover:text-white'
      } `}
      onClick={onClick}
    >
      {icon}
    </div>
  );
};

export default SidebarItem;
