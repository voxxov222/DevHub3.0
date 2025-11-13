

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { GoogleCloudView } from './components/GoogleCloudView';
import { Web3View } from './components/Web3View';
import { DeployerView } from './components/DeployerView';
import { SecretsManagerView } from './components/SecretsManagerView';
import { GithubView } from './components/GithubView';
import { NewProjectWizard } from './components/NewProjectWizard';
import { Window } from './components/Window';
import { Taskbar } from './components/Taskbar';
import { 
    DashboardIcon, GcpIcon, Web3Icon, DeployIcon, SecretsIcon, GithubIcon, 
    PlusCircleIcon, LogoutIcon, SearchIcon
} from './components/Icons';

export type ViewType = 'Dashboard' | 'GoogleCloud' | 'Web3' | 'Deployer' | 'Secrets' | 'GitHub';

export interface WindowState {
  id: ViewType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  lastState?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Command Palette Component Definition
export interface Command {
    id: string;
    name: string;
    category: 'Navigation' | 'Actions';
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    action: () => void;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands: Command[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredCommands = useMemo(() => {
        if (!query) return commands;
        const lowerCaseQuery = query.toLowerCase();
        return commands.filter(cmd => 
            cmd.name.toLowerCase().includes(lowerCaseQuery) || 
            cmd.category.toLowerCase().includes(lowerCaseQuery)
        );
    }, [query, commands]);
    
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredCommands, selectedIndex, onClose]);

    const commandGroups = useMemo(() => {
        // FIX: Explicitly type the accumulator in the reduce function to prevent type inference issues.
        return filteredCommands.reduce((acc: Record<string, Command[]>, command) => {
            const category = command.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(command);
            return acc;
        }, {});
    }, [filteredCommands]);

    if (!isOpen) return null;

    let commandIndex = -1;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={onClose}>
            <div
                className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl mx-auto mt-[15vh] overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center p-4 border-b border-gray-700">
                    <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Type a command or search..."
                        className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                    />
                </div>
                <div className="max-h-[50vh] overflow-y-auto">
                    {filteredCommands.length > 0 ? (
                         Object.entries(commandGroups).map(([category, cmds]) => (
                            <div key={category} className="p-2">
                                <h3 className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">{category}</h3>
                                <ul>
                                    {cmds.map(cmd => {
                                        commandIndex++;
                                        const isSelected = commandIndex === selectedIndex;
                                        return (
                                            <li
                                                key={cmd.id}
                                                onClick={() => { cmd.action(); onClose(); }}
                                                className={`flex items-center p-3 mx-2 my-1 rounded-md cursor-pointer transition-colors ${
                                                    isSelected ? 'bg-brand-primary/50 text-white' : 'hover:bg-gray-700'
                                                }`}
                                            >
                                                <cmd.icon className="w-5 h-5 mr-4 text-gray-300" />
                                                <span className="font-medium">{cmd.name}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                         ))
                    ) : (
                        <div className="p-10 text-center text-gray-500">
                            No results found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const VIEW_CONFIG: Record<ViewType, { title: string; defaultWidth: number; defaultHeight: number; }> = {
    Dashboard: { title: 'Dashboard', defaultWidth: 800, defaultHeight: 600 },
    GoogleCloud: { title: 'Google Cloud', defaultWidth: 900, defaultHeight: 650 },
    Web3: { title: 'Web3 Suite', defaultWidth: 850, defaultHeight: 700 },
    Deployer: { title: 'Deployer', defaultWidth: 950, defaultHeight: 600 },
    Secrets: { title: 'Secrets Manager', defaultWidth: 800, defaultHeight: 550 },
    GitHub: { title: 'GitHub Repos', defaultWidth: 750, defaultHeight: 650 },
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<ViewType | null>(null);
  const zIndexCounter = useRef(10);
  const desktopRef = useRef<HTMLElement>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);


  const openWindow = useCallback((id: ViewType) => {
    setWindows(prev => {
        const existingWindow = prev.find(w => w.id === id);
        const newZIndex = ++zIndexCounter.current;

        if (existingWindow) {
            return prev.map(w => w.id === id ? { ...w, zIndex: newZIndex, isMinimized: false } : w);
        }

        const config = VIEW_CONFIG[id];
        const desktopWidth = desktopRef.current?.clientWidth ?? window.innerWidth;
        const desktopHeight = desktopRef.current?.clientHeight ?? window.innerHeight;
        
        const newWindow: WindowState = {
            id,
            title: config.title,
            width: Math.min(config.defaultWidth, desktopWidth - 40),
            height: Math.min(config.defaultHeight, desktopHeight - 40),
            x: (desktopWidth - Math.min(config.defaultWidth, desktopWidth - 40)) / 2,
            y: (desktopHeight - Math.min(config.defaultHeight, desktopHeight - 40)) / 2 - 20, // Move up slightly
            zIndex: newZIndex,
            isMinimized: false,
            isMaximized: false,
        };
        return [...prev, newWindow];
    });
    setActiveWindowId(id);
  }, []);

  const closeWindow = (id: ViewType) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
        setActiveWindowId(null);
    }
  };

  const focusWindow = (id: ViewType) => {
     setWindows(prev => {
        const newZIndex = ++zIndexCounter.current;
        return prev.map(w => w.id === id ? { ...w, zIndex: newZIndex, isMinimized: false } : w);
    });
    setActiveWindowId(id);
  };

  const minimizeWindow = (id: ViewType) => {
     setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
     if(activeWindowId === id) setActiveWindowId(null);
  };
  
  const toggleMaximizeWindow = (id: ViewType) => {
    if (!desktopRef.current) return;
    const { clientWidth, clientHeight } = desktopRef.current;
    
    setWindows(prev => prev.map(w => {
        if (w.id === id) {
            if (w.isMaximized) {
                return {
                    ...w,
                    isMaximized: false,
                    ...w.lastState,
                }
            } else {
                return {
                    ...w,
                    isMaximized: true,
                    lastState: { x: w.x, y: w.y, width: w.width, height: w.height },
                    x: 0,
                    y: 0,
                    width: clientWidth,
                    height: clientHeight,
                }
            }
        }
        return w;
    }));
    focusWindow(id);
  }

  const restoreWindow = (id: ViewType) => {
    focusWindow(id);
  };
  
  const updateWindowState = (id: ViewType, newPosition: { x: number; y: number }, newSize?: { width: number; height: number; }) => {
    setWindows(prev => prev.map(w => {
        if (w.id === id) {
            return {
                ...w,
                x: newPosition.x,
                y: newPosition.y,
                width: newSize?.width ?? w.width,
                height: newSize?.height ?? w.height,
            };
        }
        return w;
    }));
  };

  const renderViewComponent = (viewId: ViewType) => {
    switch (viewId) {
      case 'Dashboard': return <Dashboard onNewProject={() => setIsWizardOpen(true)} />;
      case 'GoogleCloud': return <GoogleCloudView />;
      case 'Web3': return <Web3View />;
      case 'Deployer': return <DeployerView />;
      case 'Secrets': return <SecretsManagerView />;
      case 'GitHub': return <GithubView />;
      default: return null;
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    openWindow('Dashboard');
  };

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setWindows([]);
    setActiveWindowId(null);
  }, []);

  const commands: Command[] = useMemo(() => [
      { id: 'open-dashboard', name: 'Open Dashboard', category: 'Navigation', icon: DashboardIcon, action: () => openWindow('Dashboard') },
      { id: 'open-gcp', name: 'Open Google Cloud', category: 'Navigation', icon: GcpIcon, action: () => openWindow('GoogleCloud') },
      { id: 'open-web3', name: 'Open Web3 Suite', category: 'Navigation', icon: Web3Icon, action: () => openWindow('Web3') },
      { id: 'open-deployer', name: 'Open Deployer', category: 'Navigation', icon: DeployIcon, action: () => openWindow('Deployer') },
      { id: 'open-github', name: 'Open GitHub Repos', category: 'Navigation', icon: GithubIcon, action: () => openWindow('GitHub') },
      { id: 'open-secrets', name: 'Open Secrets Manager', category: 'Navigation', icon: SecretsIcon, action: () => openWindow('Secrets') },
      { id: 'new-project', name: 'Create New Project', category: 'Actions', icon: PlusCircleIcon, action: () => setIsWizardOpen(true) },
      { id: 'logout', name: 'Logout', category: 'Actions', icon: LogoutIcon, action: handleLogout },
  ], [openWindow, handleLogout]);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
              e.preventDefault();
              setIsCommandPaletteOpen(prev => !prev);
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      {isAuthenticated && <Sidebar onOpenView={openWindow} onNewProject={() => setIsWizardOpen(true)} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isAuthenticated && <Header onLogout={handleLogout} onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />}
        <main ref={desktopRef} className="flex-1 bg-gray-800 relative select-none">
          {windows.filter(w => !w.isMinimized).map(win => (
            <Window
              key={win.id}
              state={win}
              boundsRef={desktopRef}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onMaximize={() => toggleMaximizeWindow(win.id)}
              onFocus={() => focusWindow(win.id)}
              onUpdate={updateWindowState}
            >
              {renderViewComponent(win.id)}
            </Window>
          ))}
        </main>
        {isAuthenticated && <Taskbar windows={windows} onRestore={restoreWindow} onFocus={focusWindow} activeWindowId={activeWindowId}/>}
      </div>
      {isWizardOpen && <NewProjectWizard onClose={() => setIsWizardOpen(false)} />}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        commands={commands}
      />
      {!isAuthenticated && <LoginScreen onLogin={handleLogin} />}
    </div>
  );
};

interface LoginScreenProps {
  onLogin: () => void;
}
const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-800 z-[1000]">
        <div className="text-center p-8 bg-gray-900 rounded-lg shadow-2xl max-w-md">
            <h1 className="text-4xl font-bold text-brand-primary mb-2">DevHub</h1>
            <p className="text-lg text-gray-300 mb-6">Your Integrated Google Cloud + Web3 Workspace</p>
            <p className="text-gray-400 mb-8">Connect your GitHub account to access your projects, deployments, and integrations.</p>
            <button
                onClick={onLogin}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
            >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path></svg>
                Sign in with GitHub
            </button>
        </div>
    </div>
);


export default App;