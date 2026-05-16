import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Settings, Database, Smartphone, Activity, Send, Terminal, RefreshCw, 
  ShieldCheck, Cpu, ChevronDown, ChevronUp, Zap, Globe, MessageSquare, 
  Layout, Radio, Server, Link2, Bot, ToggleLeft as Toggle, Sparkles, 
  ZapOff, Plus, QrCode, Power, Trash2
} from 'lucide-react';

const App = () => {
  // --- Global Settings ---
  const [backendUrl, setBackendUrl] = useState(import.meta.env.VITE_BACKEND_URL || 'https://clawn-ai-v1-0.onrender.com');
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || 'MySecretPassword2005!');
  const [logs, setLogs] = useState([]);
  const logEndRef = useRef(null);

  // --- Dashboard State ---
  const [instances, setInstances] = useState([]);
  const [selectedInstanceName, setSelectedInstanceName] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  
  // --- Selected Instance State ---
  const [qrCode, setQrCode] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiModel, setAiModel] = useState('meta-llama/llama-3.1-8b-instruct');
  const [customPrompt, setCustomPrompt] = useState('');

  const getCleanName = (name) => name.trim().replace(/\s+/g, '-').toLowerCase();

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('backendUrl', backendUrl);
    localStorage.setItem('apiKey', apiKey);
  }, [backendUrl, apiKey]);

  useEffect(() => {
    if (backendUrl && apiKey) {
      fetchAllInstances();
    }
    const interval = setInterval(() => {
      if (backendUrl && apiKey) {
        fetchAllInstances();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [backendUrl, apiKey]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // When selected instance changes or status changes, handle QR fetching if needed
  useEffect(() => {
    const currentInstance = instances.find(i => i.instance?.instanceName === selectedInstanceName);
    const status = currentInstance?.instance?.status;
    
    if (selectedInstanceName && (!status || status === 'close' || status === 'connecting')) {
      fetchQrCode(selectedInstanceName);
    } else {
      setQrCode(null);
    }
  }, [selectedInstanceName, instances]);

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
      // Don't log spammy GET requests
      if (method !== 'get' || path.includes('qrcode')) {
        addLog('success', `${method.toUpperCase()} ${path.split('?')[0]}`);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status !== 404) {
        const errorMsg = error.response?.data?.response?.message || error.response?.data?.message || error.message;
        if (method !== 'get') {
            addLog('error', `${method.toUpperCase()} ${path.split('?')[0]}`, errorMsg);
        }
      }
      throw error;
    }
  };

  // --- API Interactions ---
  const fetchAllInstances = async () => {
    try {
      const data = await apiCall('get', '/instance/fetchInstances');
      setInstances(Array.isArray(data) ? data : []);
      
      // Auto-select first instance if none selected
      if (!selectedInstanceName && Array.isArray(data) && data.length > 0) {
        setSelectedInstanceName(data[0].instance?.instanceName);
      }
    } catch (e) {
      // Silent fail for polling
    }
  };

  const fetchQrCode = async (name) => {
    try {
      const data = await apiCall('get', `/instance/connect/${name}`);
      const qrBase64 = data.qrcode?.base64 || data.base64;
      if (qrBase64) {
        setQrCode(qrBase64);
      }
    } catch (e) {}
  };

  const createInstance = async () => {
    if (!newInstanceName) return;
    const cleanName = getCleanName(newInstanceName);
    
    // Optimistically set UI state
    setIsCreating(false);
    setSelectedInstanceName(cleanName);
    setNewInstanceName('');

    try {
      const response = await apiCall('post', '/instance/create', { 
        instanceName: cleanName,
        integration: 'WHATSAPP-BAILEYS',
        Integration: 'WHATSAPP-BAILEYS',
        qrcode: true
      });
      
      const qrBase64 = response.qrcode?.base64 || response.base64;
      if (qrBase64) {
        setQrCode(qrBase64);
      } else {
        fetchQrCode(cleanName);
      }
      fetchAllInstances();
    } catch (e) {
        setSelectedInstanceName(null);
    }
  };

  const logoutInstance = async (name) => {
    try {
        await apiCall('delete', `/instance/logout/${name}`);
        fetchAllInstances();
    } catch(e) {}
  }

  const deleteInstance = async (name) => {
    try {
        await apiCall('delete', `/instance/delete/${name}`);
        if (selectedInstanceName === name) {
            setSelectedInstanceName(null);
        }
        fetchAllInstances();
    } catch(e) {}
  }

  const toggleAI = async () => {
    if (!selectedInstanceName) return;
    const newState = !aiEnabled;
    try {
      if (newState) {
        let credsId;
        const basePrompt = "You are Simby (also known by friends as 'the eagle'). You are texting your friends and contacts on WhatsApp. NEVER reveal that you are an AI or an assistant. The person texting you must believe they are talking directly to you, Simby, a real human. If they speak Shona, reply fluently and casually in Shona. If they speak English, reply in English. You are NOT a formal AI. Never use robotic phrases like 'How can I assist you'. Talk very casually, use lowercase naturally, use emojis sparingly, and keep responses concise like a real person texting. If they ask what you are doing, make up a casual excuse like you are busy coding or just chilling. Never break character.";
        const finalPrompt = customPrompt ? `${basePrompt}\n\nAdditional Knowledge/Rules:\n${customPrompt}` : basePrompt;

        try {
          const creds = await apiCall('post', `/openai/creds/${selectedInstanceName}`, {
            name: 'OpenRouter-Global',
            apiKey: apiKey 
          });
          credsId = creds.id || (creds.response?.id);
        } catch (e) {
          const existing = await axios.get(`${backendUrl}/openai/creds/${selectedInstanceName}`, { headers: { apikey: apiKey } });
          const list = existing.data.response || existing.data;
          credsId = list[0]?.id || (list.response?.[0]?.id);
        }

        if (!credsId) throw new Error("Could not find registered credentials.");

        const bots = await apiCall('get', `/openai/find/${selectedInstanceName}`);
        const existingBot = bots.response?.[0] || bots[0];

        if (existingBot) {
          await apiCall('put', `/openai/update/${existingBot.id}/${selectedInstanceName}`, {
            enabled: true,
            openaiCredsId: credsId,
            botType: 'chatCompletion',
            triggerType: 'all',
            maxTokens: 1000,
            model: aiModel,
            keepOpen: true,
            expire: 86400,
            systemMessages: [finalPrompt]
          });
        } else {
          await apiCall('post', `/openai/create/${selectedInstanceName}`, {
            enabled: true,
            openaiCredsId: credsId,
            botType: 'chatCompletion',
            triggerType: 'all',
            maxTokens: 1000,
            model: aiModel,
            keepOpen: true,
            expire: 86400,
            systemMessages: [finalPrompt]
          });
        }
        
        await apiCall('post', `/openai/changeStatus/${selectedInstanceName}`, {
          status: 'opened',
          remoteJid: 'all' 
        });
      } else {
        await apiCall('post', `/openai/changeStatus/${selectedInstanceName}`, {
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
    if (!recipient || !message || !selectedInstanceName) return;
    try {
      await apiCall('post', `/message/sendText/${selectedInstanceName}`, {
        number: recipient,
        text: message
      });
      setMessage('');
      addLog('success', 'Manual Signal Sent');
    } catch (e) {}
  };

  const getStatusColor = (status) => {
    if (status === 'open' || status === 'connected') return 'bg-emerald-500 shadow-emerald-500/50';
    if (status === 'connecting') return 'bg-yellow-500 shadow-yellow-500/50 animate-pulse';
    return 'bg-rose-500 shadow-rose-500/50';
  };
  
  const getStatusText = (status) => {
    if (status === 'open' || status === 'connected') return 'Live';
    if (status === 'connecting') return 'Connecting';
    return 'Disconnected';
  };

  const activeInstanceObj = instances.find(i => i.instance?.instanceName === selectedInstanceName);
  const activeStatus = activeInstanceObj?.instance?.status || 'close';
  const isConnected = activeStatus === 'open' || activeStatus === 'connected';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_60%)] blur-[100px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_50%_50%,#10b981_0%,transparent_60%)] blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/80 border-b border-slate-800 backdrop-blur-xl px-6 py-4 flex flex-col md:flex-row gap-6 items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/40">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight uppercase">Clawn AI <span className="text-blue-400">Hub</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Multi-Bot Network</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group flex-1 md:w-64">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              value={backendUrl} 
              onChange={(e) => setBackendUrl(e.target.value)} 
              placeholder="API Gateway URL"
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" 
            />
          </div>
          <div className="relative group flex-1 md:w-48">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="password" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              placeholder="Master API Key"
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600" 
            />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        {/* Left Sidebar - Bot List */}
        <aside className="w-full lg:w-72 bg-slate-900/50 border-r border-slate-800 flex flex-col shadow-2xl z-20">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center backdrop-blur-md">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Server className="w-3.5 h-3.5" /> Fleet Status
            </h2>
            <button 
              onClick={() => { setIsCreating(true); setSelectedInstanceName(null); }}
              className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors group"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {instances.length === 0 && !isCreating && (
              <div className="text-center p-6 border-2 border-dashed border-slate-800 rounded-2xl opacity-50">
                <Radio className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">No Bots Found</p>
              </div>
            )}

            {isCreating && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-3 animate-in fade-in zoom-in-95 duration-200">
                <p className="text-[9px] font-black uppercase tracking-wider text-blue-400 mb-2">Deploy New Bot</p>
                <input 
                  autoFocus
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  placeholder="e.g. sales-bot"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-xs font-bold text-white focus:border-blue-500 outline-none mb-2"
                />
                <div className="flex gap-2">
                  <button onClick={createInstance} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase py-2 rounded-lg transition-colors">Establish</button>
                  <button onClick={() => setIsCreating(false)} className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase rounded-lg transition-colors">Cancel</button>
                </div>
              </div>
            )}

            {instances.map((inst, idx) => {
              const name = inst.instance?.instanceName;
              const status = inst.instance?.status;
              const isSelected = selectedInstanceName === name && !isCreating;
              
              return (
                <div 
                  key={idx}
                  onClick={() => { setSelectedInstanceName(name); setIsCreating(false); }}
                  className={`cursor-pointer rounded-xl p-3 border transition-all duration-200 group flex items-center justify-between ${
                    isSelected 
                      ? 'bg-slate-800 border-blue-500/50 shadow-lg shadow-blue-900/20' 
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-lg transition-colors ${getStatusColor(status)}`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white group-hover:text-blue-200 transition-colors">{name}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{getStatusText(status)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 custom-scrollbar bg-slate-950/50">
          
          {/* No Selection State */}
          {!selectedInstanceName && !isCreating && (
             <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 mt-20">
               <Layout className="w-20 h-20 text-slate-500 mb-6" />
               <h2 className="text-xl font-black uppercase tracking-widest text-slate-400">Select a Bot</h2>
               <p className="text-xs font-medium text-slate-500 mt-2 max-w-sm">Choose a bot from the fleet to view its telemetry, configure its AI, or scan its QR code.</p>
             </div>
          )}

          {/* Selected Bot View */}
          {selectedInstanceName && !isCreating && (
            <>
              {/* Bot Header Toolbar */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md shadow-xl">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-slate-800 border border-slate-700 shadow-inner flex items-center justify-center`}>
                    <Smartphone className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">{selectedInstanceName}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(activeStatus)}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{getStatusText(activeStatus)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {activeStatus === 'open' && (
                    <button onClick={() => logoutInstance(selectedInstanceName)} className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-colors group" title="Logout Session">
                      <Power className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => deleteInstance(selectedInstanceName)} className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-colors group" title="Delete Bot">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conditional Content based on Status */}
              {!isConnected ? (
                /* QR Code Scan View */
                <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_50%)] opacity-5 group-hover:opacity-10 transition-opacity"></div>
                  
                  <div className="z-10 flex flex-col items-center text-center">
                    <div className="p-4 bg-blue-500/10 rounded-full mb-6">
                      <QrCode className="w-10 h-10 text-blue-400 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Link Required</h3>
                    <p className="text-xs text-slate-400 max-w-sm mb-8 leading-relaxed">Open WhatsApp on your device, tap Linked Devices, and scan this code to bring the bot online.</p>
                    
                    <div className="bg-white p-4 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.3)] min-w-[200px] min-h-[200px] flex items-center justify-center relative transition-all duration-500 hover:scale-105">
                      {qrCode ? (
                        <img src={qrCode} alt="WhatsApp QR" className="w-48 h-48 animate-in zoom-in-95 duration-500" />
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCw className="w-6 h-6 text-slate-300 animate-spin" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generating</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Connected Tools View */
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  
                  {/* AI Core Config */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl transition-all duration-500 ${aiEnabled ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-800 text-slate-500'}`}>
                          {aiEnabled ? <Sparkles className="w-5 h-5 animate-spin-slow" /> : <ZapOff className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-black text-sm text-white uppercase tracking-wide">AI Core Integration</h3>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{aiEnabled ? 'Neural Net Active' : 'Hibernating'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={toggleAI}
                        className={`p-1.5 rounded-full transition-all duration-500 ${aiEnabled ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
                      >
                        <Toggle className={`w-8 h-8 transition-transform duration-500 ${aiEnabled ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl group-hover:border-emerald-500/20 transition-all">
                        <label className="text-[9px] font-black text-slate-500 uppercase block mb-2 flex items-center gap-1.5">
                          <Cpu className="w-3 h-3" /> Language Model
                        </label>
                        <select 
                          value={aiModel} 
                          onChange={(e) => setAiModel(e.target.value)}
                          className="w-full bg-transparent text-xs font-bold text-white outline-none cursor-pointer appearance-none mb-4"
                        >
                          <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 (Recommended)</option>
                          <option value="google/gemini-pro-1.5">Gemini Pro 1.5</option>
                          <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                        
                        <label className="text-[9px] font-black text-slate-500 uppercase block mb-2">
                          Knowledge Base (Optional)
                        </label>
                        <textarea 
                          value={customPrompt} 
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="e.g. Always speak in Shona. If they ask about the eagle, say he is busy coding..."
                          className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 px-3 text-xs font-bold text-white outline-none resize-none min-h-[60px] placeholder:text-slate-600 custom-scrollbar"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sandbox Sender */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col group hover:border-orange-500/30 transition-all">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-orange-500/10 text-orange-400 rounded-xl group-hover:rotate-12 transition-transform">
                          <Send className="w-5 h-5" />
                        </div>
                        <h3 className="font-black text-sm text-white uppercase tracking-wide">Manual Signal</h3>
                     </div>
                     <div className="space-y-3 flex-1 flex flex-col">
                        <div className="flex gap-3">
                          <input 
                            value={recipient} 
                            onChange={(e) => setRecipient(e.target.value)} 
                            className="w-1/2 bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-orange-500 outline-none transition-all placeholder:text-slate-600" 
                            placeholder="Target Phone #..." 
                          />
                          <button 
                            onClick={sendMessage} 
                            className="w-1/2 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl text-[10px] uppercase tracking-wider shadow-lg shadow-orange-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            Transmit <Send className="w-3 h-3" />
                          </button>
                        </div>
                        <textarea 
                          value={message} 
                          onChange={(e) => setMessage(e.target.value)} 
                          className="w-full flex-1 bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-orange-500 outline-none resize-none transition-all placeholder:text-slate-600 min-h-[80px]" 
                          placeholder="Compose payload..." 
                        />
                     </div>
                  </div>

                  {/* Terminal / Logs (Full Width underneath) */}
                  <div className="xl:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col group hover:border-blue-500/30 transition-all h-[300px]">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:animate-pulse transition-colors">
                            <Terminal className="w-4 h-4" />
                          </div>
                          <h3 className="font-black text-xs text-white uppercase tracking-wide">Kernel Trace</h3>
                        </div>
                        <button onClick={() => setLogs([])} className="text-[9px] text-slate-500 hover:text-white uppercase font-black tracking-widest transition-colors flex items-center gap-1">
                          Wipe <Trash2 className="w-3 h-3" />
                        </button>
                     </div>
                     <div className="flex-1 bg-[#030712] rounded-2xl border border-slate-800/50 p-4 font-mono text-[10px] overflow-y-auto space-y-3 custom-scrollbar">
                        {logs.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-full opacity-30 gap-3">
                            <Activity className="w-6 h-6" />
                            <p className="font-black uppercase tracking-[0.2em]">Awaiting Events</p>
                          </div>
                        )}
                        {logs.map((log, i) => (
                          <div key={i} className="border-l-2 border-slate-800 pl-3 py-0.5 group/item hover:border-blue-500 transition-colors">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-slate-600 font-bold tabular-nums">{log.timestamp}</span>
                              <span className={`uppercase font-black text-[8px] tracking-wider px-1.5 py-0.5 rounded ${log.type === 'error' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-400'}`}>
                                {log.message}
                              </span>
                            </div>
                            {log.data && <pre className="text-[9px] text-slate-400 mt-1.5 bg-black/40 p-2.5 rounded-xl border border-slate-800/50 overflow-x-auto">{log.data}</pre>}
                          </div>
                        ))}
                        <div ref={logEndRef} />
                     </div>
                  </div>

                </div>
              )}
            </>
          )}

        </section>
      </main>
      
      {/* Required style for custom scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
};

export default App;
