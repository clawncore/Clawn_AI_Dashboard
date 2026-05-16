import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Settings, 
  Database, 
  Smartphone, 
  Activity, 
  Send, 
  Terminal, 
  RefreshCw, 
  ShieldCheck, 
  Cpu, 
  ChevronDown, 
  ChevronUp,
  Zap,
  Globe,
  MessageSquare,
  Layout,
  Radio,
  Server,
  Link2,
  Bot,
  ToggleLeft as Toggle,
  Sparkles,
  ZapOff
} from 'lucide-react';

const App = () => {
  // --- State Management ---
  const [backendUrl, setBackendUrl] = useState(import.meta.env.VITE_BACKEND_URL || 'https://clawn-ai-v1-0.onrender.com');
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || 'MySecretPassword2005!');
  const [instanceName, setInstanceName] = useState('clawn-bot');
  const [qrCode, setQrCode] = useState(null);
  const [connState, setConnState] = useState('unknown'); 
  const [logs, setLogs] = useState([]);
  const [showDbDetails, setShowDbDetails] = useState(false);
  
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  
  // AI Settings State
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiModel, setAiModel] = useState('meta-llama/llama-3.1-8b-instruct');
  const [openrouterKey, setOpenrouterKey] = useState(localStorage.getItem('openrouterKey') || '');

  const logEndRef = useRef(null);

  const getCleanName = (name) => name.trim().replace(/\s+/g, '-').toLowerCase();

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('backendUrl', backendUrl);
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('openrouterKey', openrouterKey);
  }, [backendUrl, apiKey, openrouterKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      const cleanName = getCleanName(instanceName);
      if (cleanName && backendUrl) {
        checkConnection(cleanName);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [instanceName, backendUrl, apiKey]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // --- Helpers ---
  const addLog = (type, message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => {
      const newLogs = [...prev, { timestamp, type, message, data: data ? JSON.stringify(data, null, 2) : null }];
      return newLogs.slice(-10);
    });
  };

  const apiCall = async (method, path, body = null) => {
    try {
      const response = await axios({
        method,
        url: `${backendUrl}${path}`,
        headers: { apikey: apiKey },
        data: body
      });
      if (method !== 'get' || path.includes('qrcode')) {
        addLog('success', `${method.toUpperCase()} ${path.split('?')[0]}`);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status !== 404) {
        const errorMsg = error.response?.data?.response?.message || error.response?.data?.message || error.message;
        addLog('error', `${method.toUpperCase()} ${path.split('?')[0]}`, errorMsg);
      }
      throw error;
    }
  };

  const createInstance = async () => {
    const cleanName = getCleanName(instanceName);
    setInstanceName(cleanName);
    try {
      await apiCall('post', '/instance/create', { 
        instanceName: cleanName,
        integration: 'WHATSAPP-BAILEYS',
        Integration: 'WHATSAPP-BAILEYS',
        qrcode: true
      });
      fetchQrCode(cleanName);
    } catch (e) {}
  };

  const fetchQrCode = async (name) => {
    const targetName = name || getCleanName(instanceName);
    try {
      const data = await apiCall('get', `/instance/qrcode?instance=${targetName}`);
      if (data.code) {
        setQrCode(data.code);
      }
    } catch (e) {}
  };

  const checkConnection = async (name) => {
    try {
      const data = await apiCall('get', `/instance/connectionState/${name}`);
      const state = data.instance?.state || data.state;
      if (state === 'open' || state === 'connected') {
        setConnState('connected');
        setQrCode(null); // Clear QR if connected
      } else {
        setConnState('disconnected');
        // Auto-fetch QR if disconnected
        fetchQrCode(name);
      }
    } catch (e) {
      setConnState('unknown');
    }
  };

  const toggleAI = async () => {
    const cleanName = getCleanName(instanceName);
    const newState = !aiEnabled;
    try {
      if (newState) {
        let credsId;
        try {
          // 1. Register OpenAI/OpenRouter Credentials — use a unique name per instance
          const creds = await apiCall('post', `/openai/creds/${cleanName}`, {
            name: `OpenRouter-${cleanName}`,
            apiKey: openrouterKey || apiKey
          });
          credsId = creds.id || (creds.response?.id);
        } catch (e) {
          // Already registered — fetch existing credentials for this instance
          const existing = await axios.get(`${backendUrl}/openai/creds/${cleanName}`, { headers: { apikey: apiKey } });
          const list = Array.isArray(existing.data) ? existing.data : (existing.data.response || []);
          credsId = list[0]?.id;
        }

        if (!credsId) throw new Error("Could not find registered credentials. Make sure your OpenRouter API key is set.");

        // 2. Check for existing bots and update or create
        const bots = await apiCall('get', `/openai/find/${cleanName}`);
        const existingBot = bots.response?.[0] || bots[0];

        if (existingBot) {
          // Update the existing bot with the new model
          await apiCall('put', `/openai/update/${existingBot.id}/${cleanName}`, {
            enabled: true,
            openaiCredsId: credsId,
            botType: 'chatCompletion',
            triggerType: 'all',
            maxTokens: 1000,
            model: aiModel,
            keepOpen: true,
            expire: 86400, // 24 hours
            systemMessages: ['You are Clawn AI, a professional and helpful virtual assistant.']
          });
        } else {
          // Create a new bot
          await apiCall('post', `/openai/create/${cleanName}`, {
            enabled: true,
            openaiCredsId: credsId,
            botType: 'chatCompletion',
            triggerType: 'all',
            maxTokens: 1000,
            model: aiModel,
            keepOpen: true,
            expire: 86400, // 24 hours
            systemMessages: ['You are Clawn AI, a professional and helpful virtual assistant.']
          });
        }
        
        // 3. Set the status to active
        await apiCall('post', `/openai/changeStatus/${cleanName}`, {
          status: 'opened',
          remoteJid: 'all' 
        });
      } else {
        // Disable the AI Bot
        await apiCall('post', `/openai/changeStatus/${cleanName}`, {
          status: 'closed',
          remoteJid: 'all'
        });
      }

      setAiEnabled(newState);
      addLog('success', `AI Core ${newState ? 'Synchronized' : 'Offline'}`);
    } catch (e) {
      addLog('error', 'AI Activation Failed', e.response?.data?.response?.message || e.message);
    }
  };

  const sendMessage = async () => {
    if (!recipient || !message) return;
    const cleanName = getCleanName(instanceName);
    try {
      await apiCall('post', `/message/sendText/${cleanName}`, {
        number: recipient,
        text: message
      });
      setMessage('');
      addLog('success', 'Manual Signal Sent');
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 font-sans selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative">
        <header className="bg-slate-800/90 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 shadow-2xl flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex items-center gap-4 lg:border-r lg:border-slate-700 lg:pr-8">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40"><Zap className="text-white w-6 h-6" /></div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight uppercase">Clawn AI <span className="text-blue-400">v1.0</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bot Intelligence Console</p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2">
                  <Globe className="w-3 h-3 text-blue-500" /> API Gateway
                </label>
                <div className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${backendUrl.includes('render.com') ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                  {backendUrl.includes('render.com') ? '☁️ Cloud' : '🏠 Local'}
                </div>
              </div>
              <div className="relative group/url">
                <input 
                  value={backendUrl} 
                  onChange={(e) => setBackendUrl(e.target.value)} 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 pr-10 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all" 
                />
                <a 
                  href={backendUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-400 transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 px-1"><ShieldCheck className="w-3 h-3 text-blue-500" /> Master Key</label>
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-2 px-4 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-4 border-l border-slate-700 pl-8">
             <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${connState === 'connected' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'bg-slate-700 text-slate-500'}`}>
                <Activity className={`w-3 h-3 ${connState === 'connected' ? 'animate-pulse' : ''}`} />
                {connState === 'connected' ? 'Live' : 'Dead'}
             </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <section className="bg-slate-800/80 border border-slate-700/50 rounded-[2rem] p-8 shadow-xl flex flex-col gap-6 hover:border-blue-500/20 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 text-white rounded-2xl group-hover:scale-110 transition-transform"><Smartphone className="w-5 h-5" /></div>
                <h2 className="font-black text-lg text-white uppercase">Provision</h2>
              </div>
              <div className="space-y-4">
                <input value={instanceName} onChange={(e) => setInstanceName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all" placeholder="clawn-bot" />
                <button onClick={createInstance} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 uppercase text-xs">Establish Link</button>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-[2rem] p-8 bg-slate-900/50 min-h-[250px] relative overflow-hidden">
                {qrCode ? (
                  <div className="bg-white p-4 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-500"><img src={qrCode} alt="QR" className="w-full h-auto max-w-[150px]" /></div>
                ) : (
                  <div className="text-center opacity-40 group-hover:opacity-60 transition-opacity"><Radio className="w-10 h-10 text-slate-600 mx-auto mb-4 animate-pulse" /><p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Pulse...</p></div>
                )}
              </div>
            </section>

            <section className="bg-slate-800/80 border border-slate-700/50 rounded-[2rem] p-8 shadow-xl hover:border-emerald-500/20 transition-all group">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-all duration-500 ${aiEnabled ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 scale-110' : 'bg-slate-700 text-slate-500'}`}>
                      {aiEnabled ? <Sparkles className="w-5 h-5 animate-spin-slow" /> : <ZapOff className="w-5 h-5" />}
                    </div>
                    <div>
                      <h2 className="font-black text-lg text-white uppercase leading-none">AI Core</h2>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{aiEnabled ? 'Synchronized' : 'Hibernating'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={toggleAI}
                    className={`p-1.5 rounded-full transition-all duration-500 ${aiEnabled ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-slate-700 text-slate-500'}`}
                  >
                    <Toggle className={`w-10 h-10 transition-transform duration-500 ${aiEnabled ? 'rotate-180' : ''}`} />
                  </button>
               </div>
               <div className="space-y-4">
                  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-2xl group-hover:border-emerald-500/30 transition-all">
                     <label className="text-[9px] font-black text-slate-500 uppercase block mb-2">OpenRouter API Key</label>
                     <input
                       type="password"
                       value={openrouterKey}
                       onChange={(e) => setOpenrouterKey(e.target.value)}
                       className="w-full bg-transparent text-xs font-bold text-white outline-none placeholder:text-slate-600"
                       placeholder="sk-or-v1-..."
                     />
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-2xl group-hover:border-emerald-500/30 transition-all">
                     <label className="text-[9px] font-black text-slate-500 uppercase block mb-2">Neural Engine</label>
                     <select 
                        value={aiModel} 
                        onChange={(e) => setAiModel(e.target.value)}
                        className="w-full bg-transparent text-xs font-bold text-white outline-none cursor-pointer appearance-none"
                      >
                        <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 (Recommended)</option>
                        <option value="google/gemini-pro-1.5">Gemini Pro</option>
                        <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                     </select>
                  </div>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <p className="text-[10px] text-emerald-400/70 font-medium leading-relaxed italic text-center">
                      "{aiEnabled ? 'AI is now intercepting incoming signals and processing responses.' : 'AI interception is currently offline.'}"
                    </p>
                  </div>
               </div>
            </section>
          </div>

          <section className="bg-slate-800/80 border border-slate-700/50 rounded-[2rem] p-8 shadow-xl flex flex-col gap-6 hover:border-orange-500/20 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-600 text-white rounded-2xl group-hover:rotate-12 transition-transform"><Send className="w-5 h-5" /></div>
              <h2 className="font-black text-lg text-white uppercase">Sandbox</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Target ID</label>
                <input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-5 text-sm font-bold text-white focus:border-orange-500 outline-none transition-all" placeholder="Phone Number" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Payload</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-6 text-sm font-bold text-white focus:border-orange-500 outline-none resize-none transition-all" placeholder="Enter signal data..." />
              </div>
              <button onClick={sendMessage} className="w-full bg-white text-slate-900 font-black py-4 rounded-xl text-xs uppercase shadow-xl hover:shadow-white/10 active:scale-95 transition-all">Transmit</button>
            </div>
          </section>

          <section className="bg-slate-800/80 border border-slate-700/50 rounded-[2rem] p-8 shadow-xl flex flex-col group hover:border-blue-500/20 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-slate-700 text-white rounded-2xl group-hover:bg-blue-600 transition-colors"><Terminal className="w-5 h-5" /></div>
              <h2 className="font-black text-lg text-white uppercase">Kernel Trace</h2>
            </div>
            <div className="flex-1 flex flex-col bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-700 shadow-2xl relative">
              <div className="bg-slate-900/50 px-8 py-5 flex justify-between items-center border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-10">
                <span className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Telemetry Data
                </span>
                <button onClick={() => setLogs([])} className="text-[9px] text-slate-600 hover:text-white uppercase font-black tracking-widest transition-colors">Wipe</button>
              </div>
              <div className="flex-1 p-8 font-mono text-[10px] overflow-y-auto space-y-4 bg-[#05070a]">
                {logs.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 py-12 gap-4">
                     <Cpu className="w-8 h-8" />
                     <p className="text-xs font-black uppercase tracking-[0.3em]">Neural Link Ready</p>
                  </div>
                )}
                {logs.map((log, i) => (
                  <div key={i} className="border-l-2 border-slate-800/50 pl-6 py-1 group/item hover:border-blue-500/50 transition-colors">
                    <div className="flex items-center gap-4 mb-1">
                      <span className="text-slate-700 font-bold tabular-nums">{log.timestamp}</span>
                      <span className={`uppercase font-black text-[9px] px-2 py-0.5 rounded ${log.type === 'error' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>{log.message}</span>
                    </div>
                    {log.data && <pre className="text-[9px] text-slate-500 mt-2 bg-black/30 p-4 rounded-2xl border border-slate-800/30 overflow-x-auto">{log.data}</pre>}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </section>
        </main>

        <footer className="text-center pt-8 pb-12">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[1em] opacity-40 hover:opacity-100 transition-opacity cursor-default">
            Clawn AI Intelligence Network
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
