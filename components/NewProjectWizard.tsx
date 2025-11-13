
import React, { useState } from 'react';
import { GcpIcon, HardhatIcon, ThirdwebIcon, GithubIcon, EthereumIcon, BnbIcon, PolygonIcon, BaseIcon, FlareIcon, SongbirdIcon, AvalancheIcon } from './Icons';

interface NewProjectWizardProps {
  onClose: () => void;
}

const repos = [
  { name: 'project-alpha-backend' },
  { name: 'gamma-protocol-contracts' },
  { name: 'zeta-webapp-frontend' },
  { name: 'infra-as-code' },
];

const frameworks = [
    { name: 'Hardhat', icon: HardhatIcon },
    { name: 'Thirdweb', icon: ThirdwebIcon },
];

const networks = [
    { name: 'Ethereum', icon: EthereumIcon },
    { name: 'BNB Chain', icon: BnbIcon },
    { name: 'Polygon', icon: PolygonIcon },
    { name: 'Base', icon: BaseIcon },
    { name: 'Avalanche', icon: AvalancheIcon },
    { name: 'Flare', icon: FlareIcon },
    { name: 'Songbird', icon: SongbirdIcon },
];


type SelectionCardProps = {
    name: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
};

const SelectionCard: React.FC<SelectionCardProps> = ({ name, icon: Icon, selected, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`p-4 rounded-lg border-2 text-center transition-all duration-200 flex flex-col items-center justify-center space-y-2 aspect-square
            ${disabled ? 'bg-gray-700/50 border-gray-700 cursor-not-allowed opacity-50' : 
            selected ? 'border-brand-primary bg-blue-500/10' : 'border-gray-700 bg-gray-700/50 hover:border-gray-500'}`}
    >
        <Icon className={`w-10 h-10 ${selected ? 'text-brand-primary': 'text-gray-300'}`} />
        <p className={`font-semibold text-sm ${selected ? 'text-brand-primary' : 'text-white'}`}>{name}</p>
    </button>
);


export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
      name: '',
      description: '',
      repo: repos[0].name,
      framework: frameworks[0].name,
      network: networks[0].name,
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  
  const handleCreateProject = () => {
    setIsCreating(true);
    setTimeout(() => {
        setIsCreating(false);
        onClose();
    }, 2000);
  }

  const handleChange = (field: keyof typeof projectData, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };
  
  const totalSteps = 4;
  const progress = `${(step / totalSteps) * 100}%`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Create New Project</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
            </div>
             <p className="text-sm text-gray-400 mt-1">Step {step} of {totalSteps}</p>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-3">
                <div className="bg-brand-primary h-1.5 rounded-full transition-all duration-300" style={{ width: progress }}></div>
            </div>
        </div>

        <div className="p-8 overflow-y-auto flex-grow">
            {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <h3 className="text-xl font-semibold text-white">1. Project Details</h3>
                    <div>
                        <label htmlFor="project-name" className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                        <input
                            id="project-name" type="text" value={projectData.name} onChange={e => handleChange('name', e.target.value)}
                            placeholder="my-awesome-dapp"
                            className="w-full p-3 bg-gray-900 text-gray-200 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                        />
                    </div>
                     <div>
                        <label htmlFor="project-desc" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            id="project-desc" value={projectData.description} onChange={e => handleChange('description', e.target.value)}
                            rows={3} placeholder="A short description of your project."
                            className="w-full p-3 bg-gray-900 text-gray-200 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-primary focus:outline-none"
                        />
                    </div>
                </div>
            )}
             {step === 2 && (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">2. Cloud & Code</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <SelectionCard name="Google Cloud" icon={GcpIcon} selected={true} onClick={() => {}} />
                             <SelectionCard name="AWS" icon={GcpIcon} selected={false} onClick={() => {}} disabled />
                             <SelectionCard name="Azure" icon={GcpIcon} selected={false} onClick={() => {}} disabled />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Link Repository</h3>
                        <div className="flex items-center space-x-3">
                            <GithubIcon className="w-6 h-6 text-gray-300"/>
                            <select 
                                value={projectData.repo}
                                onChange={e => handleChange('repo', e.target.value)}
                                className="w-full max-w-sm bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:ring-brand-primary focus:border-brand-primary p-3">
                                {repos.map(r => <option key={r.name}>{r.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}
             {step === 3 && (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-4">3. Web3 Configuration</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {frameworks.map(f => (
                               <SelectionCard key={f.name} name={f.name} icon={f.icon} selected={projectData.framework === f.name} onClick={() => handleChange('framework', f.name)} />
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Deployment Network</h3>
                         <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                            {networks.map(n => (
                               <SelectionCard key={n.name} name={n.name} icon={n.icon} selected={projectData.network === n.name} onClick={() => handleChange('network', n.name)} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
             {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                    <h3 className="text-xl font-semibold text-white">4. Review and Create</h3>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 space-y-3">
                        <div className="flex justify-between"><span className="text-gray-400">Project Name:</span> <span className="font-semibold text-white">{projectData.name || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Repository:</span> <span className="font-semibold text-white">{projectData.repo}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Cloud Provider:</span> <span className="font-semibold text-white">Google Cloud</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Web3 Framework:</span> <span className="font-semibold text-white">{projectData.framework}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Contract Template:</span> <span className="font-semibold text-white">Nano Banana (ERC-20)</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Deployment Network:</span> <span className="font-semibold text-white">{projectData.network}</span></div>
                    </div>
                     <p className="text-sm text-gray-500">By clicking "Create Project", a new GitHub repository will be initialized with your selected templates and a Google Cloud project will be provisioned. Billing charges may apply.</p>
                </div>
            )}
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-900/50 rounded-b-lg">
             <div className="flex justify-between">
                <button onClick={handleBack} disabled={step === 1} className="px-6 py-2 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Back</button>
                {step < 4 && <button onClick={handleNext} className="px-6 py-2 rounded-lg text-white bg-brand-primary hover:bg-blue-600 transition-colors">Next</button>}
                {step === 4 && <button onClick={handleCreateProject} disabled={isCreating} className="px-6 py-2 rounded-lg text-white bg-brand-secondary hover:bg-green-600 transition-colors w-40 disabled:bg-gray-600">
                    {isCreating ? 'Creating...' : 'Create Project'}
                </button>}
            </div>
        </div>
      </div>
    </div>
  );
};
