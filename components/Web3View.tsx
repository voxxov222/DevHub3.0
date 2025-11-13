
import React, { useState } from 'react';
import { Web3Icon, ThirdwebIcon, HardhatIcon, AlchemyIcon, EthereumIcon, BnbIcon, PolygonIcon, BaseIcon, FlareIcon, SongbirdIcon, AvalancheIcon } from './Icons';
import { NANO_BANANA_CONTRACT_CODE } from '../constants';

type Web3Tab = 'Thirdweb' | 'Hardhat' | 'Alchemy';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none ${
            active ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);


const ThirdwebTab: React.FC = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white flex items-center"><ThirdwebIcon className="w-7 h-7 mr-3" /> Thirdweb Integration</h3>
        <p className="text-gray-400">Deploy smart contracts effortlessly with the Thirdweb SDK. Here are some available templates for your project.</p>
        <div className="bg-gray-700/50 p-6 rounded-lg">
            <h4 className="font-semibold text-lg text-brand-accent">Nano Banana (NBAN) ERC-20 Token</h4>
            <p className="text-gray-400 my-2">A standard ERC-20 token with a fixed supply of 1,000,000,000, minted to the deployer's address. Ready to be deployed.</p>
            <div className="flex space-x-4 mt-4">
                <button className="bg-brand-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Deploy with Thirdweb</button>
                <button className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">View on GitHub</button>
            </div>
        </div>
    </div>
);

const networks = [
    { name: 'Ethereum', icon: EthereumIcon, rpc_part: 'eth-mainnet' },
    { name: 'BNB Chain', icon: BnbIcon, rpc_part: 'bnb-mainnet' },
    { name: 'Polygon', icon: PolygonIcon, rpc_part: 'polygon-mainnet' },
    { name: 'Base', icon: BaseIcon, rpc_part: 'base-mainnet' },
    { name: 'Avalanche', icon: AvalancheIcon, rpc_part: 'avalanche-mainnet' },
    { name: 'Flare', icon: FlareIcon, rpc_part: 'flare-mainnet' },
    { name: 'Songbird', icon: SongbirdIcon, rpc_part: 'songbird-mainnet' },
]

const HardhatTab: React.FC = () => {
    const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
    const [forkNetwork, setForkNetwork] = useState(networks[0]);
    
    const runCommand = (command: string, output: string) => {
        setConsoleOutput(prev => [...prev, `$ ${command}`, output, ' ']);
    };
    
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center"><HardhatIcon className="w-7 h-7 mr-3" /> Hardhat Local Environment</h3>
            <p className="text-gray-400">Compile, test, and deploy your Solidity contracts in a local development environment.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-lg text-white mb-2">NanoBanana.sol</h4>
                    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 h-[400px]">
                        <textarea
                            readOnly
                            value={NANO_BANANA_CONTRACT_CODE}
                            className="w-full h-full p-4 bg-transparent text-gray-300 font-mono text-xs resize-none focus:outline-none"
                        />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-lg text-white mb-2">Console</h4>
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 h-[400px] overflow-y-auto">
                        <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">
                            {consoleOutput.length > 0 ? consoleOutput.join('\n') : "Click a command to see its output..."}
                        </pre>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
                <button onClick={() => runCommand('npx hardhat compile', 'Compilation successful.')} className="bg-brand-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Compile</button>
                <button onClick={() => runCommand('npx hardhat test', '3 tests passed (5s)')} className="bg-brand-secondary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Run Tests</button>
                <div className="flex items-center gap-2">
                     <select 
                        value={forkNetwork.name}
                        onChange={(e) => setForkNetwork(networks.find(n => n.name === e.target.value)!)}
                        className="bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:ring-brand-primary focus:border-brand-primary p-2">
                        {networks.map(net => <option key={net.name}>{net.name}</option>)}
                    </select>
                    <button onClick={() => runCommand(`npx hardhat node --fork <${forkNetwork.rpc_part}_RPC_URL>`, `Started local fork of ${forkNetwork.name} on http://127.0.0.1:8545/`)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Start Local Fork</button>
                </div>
            </div>
        </div>
    );
};

const AlchemyTab: React.FC = () => (
    <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white flex items-center"><AlchemyIcon className="w-7 h-7 mr-3" /> Alchemy RPC Support</h3>
        <p className="text-gray-400">Connect to blockchain nodes with high-speed RPC endpoints from Alchemy. Manage your API keys in the Secrets Manager.</p>
        <div className="bg-gray-700/50 p-6 rounded-lg">
            <label htmlFor="alchemy-rpc" className="block text-sm font-medium text-gray-300 mb-2">Alchemy RPC URL</label>
            <input
                id="alchemy-rpc"
                type="text"
                placeholder="https://eth-mainnet.g.alchemy.com/v2/your-api-key"
                className="w-full p-3 bg-gray-800 text-gray-200 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand-primary focus:outline-none font-mono text-sm"
            />
            <button className="mt-4 bg-brand-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">Test Connection</button>
        </div>
    </div>
);


export const Web3View: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Web3Tab>('Hardhat');

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center mb-8">
        <Web3Icon className="w-10 h-10 mr-4"/>
        <div>
          <h1 className="text-3xl font-bold text-white">Web3 Suite</h1>
          <p className="text-gray-400 mt-1">Tools and integrations for your decentralized applications.</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-700 mb-6">
          <TabButton active={activeTab === 'Hardhat'} onClick={() => setActiveTab('Hardhat')}>Hardhat</TabButton>
          <TabButton active={activeTab === 'Thirdweb'} onClick={() => setActiveTab('Thirdweb')}>Thirdweb</TabButton>
          <TabButton active={activeTab === 'Alchemy'} onClick={() => setActiveTab('Alchemy')}>Alchemy</TabButton>
      </div>

      <div className="bg-gray-900 rounded-lg shadow-lg p-8">
          {activeTab === 'Thirdweb' && <ThirdwebTab />}
          {activeTab === 'Hardhat' && <HardhatTab />}
          {activeTab === 'Alchemy' && <AlchemyTab />}
      </div>
    </div>
  );
};
