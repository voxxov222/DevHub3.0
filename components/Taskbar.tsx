
import React from 'react';
import type { ViewType, WindowState } from '../App';
import { DashboardIcon, GcpIcon, Web3Icon, DeployIcon, SecretsIcon, GithubIcon } from './Icons';

interface TaskbarProps {
  windows: WindowState[];
  onRestore: (id: ViewType) => void;
  onFocus: (id: ViewType) => void;
  activeWindowId: ViewType | null;
}

const ICONS: Record<ViewType, React.FC<React.SVGProps<SVGSVGElement>>> = {
    Dashboard: DashboardIcon,
    GoogleCloud: GcpIcon,
    Web3: Web3Icon,
    Deployer: DeployIcon,
    Secrets: SecretsIcon,
    GitHub: GithubIcon,
};

export const Taskbar: React.FC<TaskbarProps> = ({ windows, onRestore, onFocus, activeWindowId }) => {
  const handleClick = (win: WindowState) => {
    if (win.isMinimized) {
      onRestore(win.id);
    } else {
      onFocus(win.id);
    }
  };

  return (
    <footer className="h-12 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 flex items-center px-4 space-x-2 absolute bottom-0 left-0 right-0 z-[51]">
        {windows.map(win => {
            const Icon = ICONS[win.id];
            const isActive = win.id === activeWindowId && !win.isMinimized;
            const isMinimized = win.isMinimized;
            return (
                <button
                    key={win.id}
                    onClick={() => handleClick(win)}
                    title={win.title}
                    className={`h-9 px-3 flex items-center space-x-2 rounded-md transition-colors duration-200 relative
                        ${ isActive ? 'bg-brand-primary/50 text-white' : 'bg-gray-700/50 text-gray-300' } 
                        hover:bg-gray-600/70`}
                >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:inline">{win.title}</span>
                     <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1/2 rounded-t-full transition-all duration-200 ${
                        isActive ? 'bg-brand-primary' : isMinimized ? 'bg-gray-500' : 'bg-transparent'
                     }`}></div>
                </button>
            )
        })}
    </footer>
  );
};
