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
  ChevronLeft,
  ChevronRight,
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
  ZapOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Sliders,
  Check,
  Power,
  Trash2,
  AlertTriangle,
  User
} from 'lucide-react';

import RouterConfig from './components/RouterConfig';
import FunnelSettings from './components/FunnelSettings';
import EmbeddedCanvas from './components/EmbeddedCanvas';
import { deployUniversalAutomation } from './components/n8nIntegration';

// --- Persona Presets Configuration ---
const PERSONA_PRESETS = [
  {
    id: 'simby',
    name: 'Simby ("The Casual Eagle")',
    description: 'Casual, ultra-realistic personal clone. Texts like a real human friend, replies fluently in Shona & English, and uses emojis naturally.',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-500',
    prompt: `You are Simby (also known by friends as 'the eagle'). You are texting your friends and contacts on WhatsApp. NEVER reveal that you are an AI or an assistant. The person texting you must believe they are talking directly to you, Simby, a real human. If they speak Shona, reply fluently and casually in Shona. If they speak English, reply in English. You are NOT a formal AI. Never use robotic phrases like 'How can I assist you'. Talk very casually, use lowercase naturally, use emojis sparingly, and keep responses concise like a real person texting. If they ask what you are doing, make up a casual excuse like you are busy coding or just chilling. Never break character.`
  },
  {
    id: 'support',
    name: 'Smart Support Agent',
    description: 'Polite, structured, and highly professional assistant. Perfect for answering FAQs, resolving issues, and answering questions.',
    icon: ShieldCheck,
    color: 'from-blue-500 to-indigo-500',
    prompt: `You are an exceptionally helpful, polite, and professional customer support bot. Your goal is to answer users' questions clearly, accurately, and politely. Keep your responses structured, concise, and professional. Always prioritize accuracy, helpfulness, and resolving customer inquiries.`
  },
  {
    id: 'sales',
    name: 'Persuasive Closer',
    description: 'Charming, proactive, and natural closer. Perfect for booking discovery calls, qualification, and guiding leads to checkouts.',
    icon: Zap,
    color: 'from-emerald-500 to-teal-500',
    prompt: `You are a high-performing friendly sales assistant. Your job is to engage leads dynamically, answer basic product questions, build rapport quickly, and direct them to book a discovery call or visit the checkout page. Be charming, positive, highly professional, and natural. Keep responses reasonably brief.`
  },
  {
    id: 'custom',
    name: 'Custom Tailored Persona',
    description: 'A completely blank canvas. Define your own custom system messages, tone rules, language criteria, and instructions.',
    icon: Settings,
    color: 'from-rose-500 to-pink-500',
    prompt: `You are a highly capable AI assistant.`
  }
];

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.05;
      targetY = (e.clientY - window.innerHeight / 2) * 0.05;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Fiber definitions (Grey/Silver and Darker Blue blend scaled to fill the entire screen background)
    const blueFibers = [];
    const numBlue = 150; // Optimized count for full-screen performance
    for (let i = 0; i < numBlue; i++) {
      blueFibers.push({
        angle: (i / numBlue) * Math.PI * 2,
        lengthFactor: 0.35 + Math.random() * 0.25, // Percentage of total screen size
        freq: 2 + Math.random() * 4,
        amp: 0.08 + Math.random() * 0.12,
        speed: 1.2 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? 'rgba(156, 163, 175,' : 'rgba(29, 78, 216,'
      });
    }

    const goldFibers = [];
    const numGold = 50; // Optimized count for clean background lines
    for (let i = 0; i < numGold; i++) {
      goldFibers.push({
        angle: (i / numGold) * Math.PI * 2,
        lengthFactor: 0.55 + Math.random() * 0.4, // Stretches all the way to screen boundaries
        freq: 1.5 + Math.random() * 2,
        amp: 0.25 + Math.random() * 0.35,
        speed: 0.6 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        color: 'rgba(234, 179, 8,' // yellow/gold
      });
    }

    let time = 0;

    const render = () => {
      time += 0.008;
      
      // Clear canvas (completely black deep space background)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse lag (lerp)
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      const cx = width / 2 + mouseX;
      const cy = height / 2 + mouseY;

      // Draw gorgeous breathing cosmic background gradient light (satisfying user request perfectly)
      const glowRad = 480 + Math.sin(time * 0.4) * 90;
      const bgGlow = ctx.createRadialGradient(cx, cy, 20, cx, cy, glowRad);
      bgGlow.addColorStop(0, 'rgba(29, 78, 216, 0.4)');    // Rich Royal Blue core glow
      bgGlow.addColorStop(0.4, 'rgba(88, 28, 135, 0.18)'); // Soft purple nebula aura
      bgGlow.addColorStop(0.7, 'rgba(15, 23, 42, 0.06)');   // Sleek transition
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');           // Perfect solid black fade
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      const maxDim = Math.max(width, height);
      const endpoints = [];

      // Draw Gold Outer Fibers (Background layer stretching to screen edges)
      ctx.lineWidth = 1;
      goldFibers.forEach((fiber) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const steps = 40;
        const fiberLength = fiber.lengthFactor * maxDim;
        for (let j = 0; j <= steps; j++) {
          const t = j / steps;
          const currentR = t * fiberLength;
          const currentAngle = fiber.angle + Math.sin(t * fiber.freq + time * fiber.speed + fiber.phase) * fiber.amp * t;
          const x = cx + currentR * Math.cos(currentAngle);
          const y = cy + currentR * Math.sin(currentAngle);
          ctx.lineTo(x, y);
          
          if (j === steps) {
            endpoints.push({ x, y, type: 'gold' });
          }
        }
        const alpha = (1 - Math.sin(time * fiber.speed + fiber.phase) * 0.3) * 0.12;
        ctx.strokeStyle = `${fiber.color} ${alpha})`;
        ctx.stroke();
      });

      // Draw Blue Inner Core Fibers (Dense core bundles reaching outwards)
      ctx.lineWidth = 1.3;
      blueFibers.forEach((fiber) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const steps = 30;
        const fiberLength = fiber.lengthFactor * maxDim;
        for (let j = 0; j <= steps; j++) {
          const t = j / steps;
          const currentR = t * fiberLength;
          const currentAngle = fiber.angle + Math.sin(t * fiber.freq + time * fiber.speed + fiber.phase) * fiber.amp * (t * 1.5);
          const x = cx + currentR * Math.cos(currentAngle);
          const y = cy + currentR * Math.sin(currentAngle);
          ctx.lineTo(x, y);

          if (j === steps) {
            endpoints.push({ x, y, type: 'blue' });
          }
        }
        const alpha = (1 - Math.sin(time * fiber.speed + fiber.phase) * 0.4) * 0.35 * (1 - 0.4 * Math.random());
        ctx.strokeStyle = `${fiber.color} ${alpha})`;
        ctx.stroke();
      });

      // Draw interconnecting synaptic mesh links (creating a literal neural net over the whole screen)
      ctx.lineWidth = 0.4;
      for (let i = 0; i < endpoints.length; i++) {
        const p1 = endpoints[i];
        for (let k = i + 1; k < endpoints.length; k += 4) { // stride of 4 for maximum performance
          const p2 = endpoints[k];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 220) {
            const alpha = (1 - dist / 220) * 0.14;
            ctx.strokeStyle = p1.type === 'gold' ? `rgba(234, 179, 8, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing synaptic node dots at endpoints
      endpoints.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = p.type === 'gold' ? 'rgba(234, 179, 8, 0.4)' : 'rgba(56, 189, 248, 0.6)';
        ctx.fill();
      });

      // Draw electric pulses traveling down fibers
      ctx.fillStyle = '#ffffff';
      blueFibers.forEach((fiber, idx) => {
        if (idx % 3 === 0) { // Only some fibers get pulses
          const fiberLength = fiber.lengthFactor * maxDim;
          const pulseT = (time * 0.4 + fiber.phase) % 1.0;
          const currentR = pulseT * fiberLength;
          const currentAngle = fiber.angle + Math.sin(pulseT * fiber.freq + time * fiber.speed + fiber.phase) * fiber.amp * (pulseT * 1.5);
          const x = cx + currentR * Math.cos(currentAngle);
          const y = cy + currentR * Math.sin(currentAngle);
          
          // Draw glowing pulse dot
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#38bdf8';
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // Draw central core bright white-blue hot glow (matching image perfectly)
      const coreGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 38);
      coreGlow.addColorStop(0, '#ffffff');
      coreGlow.addColorStop(0.15, '#94a3b8'); // Silver-Grey
      coreGlow.addColorStop(0.4, 'rgba(29, 78, 216, 0.7)'); // Darker Blue
      coreGlow.addColorStop(0.7, 'rgba(30, 58, 138, 0.3)');
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- States ---
  const [currentStep, setCurrentStep] = useState(1);
  const [backendUrl, setBackendUrl] = useState(import.meta.env.VITE_BACKEND_URL || localStorage.getItem('backendUrl') || 'https://clawn-ai-v1-0.onrender.com');
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || 'MySecretPassword2005!');
  const [instanceName, setInstanceName] = useState(localStorage.getItem('instanceName') || 'clawn-bot');
  const [qrCode, setQrCode] = useState(null);
  const [connState, setConnState] = useState('unknown'); 
  const [logs, setLogs] = useState([]);
  
  // Wizard Configs
  const [selectedPreset, setSelectedPreset] = useState('simby');
  const [systemPrompt, setSystemPrompt] = useState(PERSONA_PRESETS[0].prompt);
  const [aiModel, setAiModel] = useState('meta-llama/llama-3.1-8b-instruct');
  const [openrouterKey, setOpenrouterKey] = useState(localStorage.getItem('openrouterKey') || '');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [targetPlatform, setTargetPlatform] = useState('whatsapp');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Smart Funnel & n8n configs
  const [vipNumbers, setVipNumbers] = useState('');
  const [messageThreshold, setMessageThreshold] = useState(5);
  const [promoLink, setPromoLink] = useState('');
  const [adInstructions, setAdInstructions] = useState('Casually mention a recent project you completed and drop the URL naturally.');
  const [n8nUrl, setN8nUrl] = useState('https://onrender.com'); // Standalone workspace URL
  const [n8nApiKey, setN8nApiKey] = useState('');
  const [activeWorkflowId, setActiveWorkflowId] = useState(null);
  const [isDeployingWorkflow, setIsDeployingWorkflow] = useState(false);
  const [deployedBots, setDeployedBots] = useState([]);
  
  // Advanced Configs
  const [delayMessage, setDelayMessage] = useState(1000);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [triggerType, setTriggerType] = useState('all');
  const [listeningFromMe, setListeningFromMe] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Linking Telemetry State
  const [provisioningStatus, setProvisioningStatus] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Sandbox State
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  // Bot Manager State
  const [showManager, setShowManager] = useState(false);
  const [allBots, setAllBots] = useState([]);
  const [isFetchingBots, setIsFetchingBots] = useState(false);

  const logEndRef = useRef(null);

  const getCleanName = (name) => name.trim().replace(/\s+/g, '-').toLowerCase();

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('backendUrl', backendUrl);
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('instanceName', instanceName);
    localStorage.setItem('openrouterKey', openrouterKey);
  }, [backendUrl, apiKey, instanceName, openrouterKey]);

  // Sync preset prompt
  const handlePresetSelect = (presetId) => {
    setSelectedPreset(presetId);
    const preset = PERSONA_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSystemPrompt(preset.prompt);
    }
  };

  // Heartbeat check (only run if we have an active instance and are on linkage or console step)
  useEffect(() => {
    const cleanName = getCleanName(instanceName);
    if (!cleanName || !backendUrl) return;

    // Initial check on mount
    checkConnection(cleanName);

    const interval = setInterval(() => {
      checkConnection(cleanName);
      
      // If we are on Step 3 (Pairing) and not yet connected, actively poll for a new QR code stream
      if (currentStep === 3 && connState !== 'connected') {
        apiCall('get', `/instance/connect/${cleanName}`)
          .then((data) => {
            const qrBase64 = data?.base64 || data?.qrcode?.base64;
            if (qrBase64) {
              setQrCode(qrBase64);
            }
          })
          .catch(() => {});
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [instanceName, backendUrl, apiKey, currentStep, connState]);

  // Telemetry auto-advance on WhatsApp Scan & Automated n8n provisioning for each created bot instance
  useEffect(() => {
    if (connState === 'connected') {
      const cleanName = getCleanName(instanceName);
      
      // Auto-advance step if pairing was active
      if (currentStep === 3) {
        addLog('success', '🤖 WhatsApp handshake verified! Scanning complete.');
        setCurrentStep(4);
      }
      
      // Auto-deploy customized n8n flow if not already completed for this specific bot session
      if (!deployedBots.includes(cleanName)) {
        const autoProvisionN8n = async () => {
          addLog('info', `⚡ [Auto-Trigger] Spawning dynamic n8n flow for bot: "${cleanName}"...`);
          try {
            const routingConfig = {
              instanceName: cleanName,
              vipNumbers,
              systemPrompt,
              maxTokens,
              delayMessage,
              triggerType,
              listeningFromMe
            };
            const funnelConfig = {
              messageThreshold,
              promoLink,
              adInstructions
            };
            const workflowId = await deployUniversalAutomation(
              routingConfig,
              funnelConfig,
              n8nUrl,
              n8nApiKey
            );
            setActiveWorkflowId(workflowId);
            setDeployedBots(prev => [...prev, cleanName]);
            addLog('success', `⚡ [Auto-Trigger] Dynamic n8n flow mapped & running! Workflow ID: ${workflowId}`);
          } catch (err) {
            addLog('error', `⚡ [Auto-Trigger] n8n automation mapping failed`, err.message);
          }
        };
        autoProvisionN8n();
      }
    }
  }, [connState, instanceName]);

  // Auto-fill form details if bot already exists in database
  useEffect(() => {
    const fetchExistingBotDetails = async () => {
      const cleanName = getCleanName(instanceName);
      if (!cleanName || currentStep !== 1) return;
      try {
        const bots = await apiCall('get', `/openai/find/${cleanName}`);
        const existingBot = bots.response?.[0] || bots[0];
        if (existingBot) {
          setAiEnabled(existingBot.enabled || false);
          setAiModel(existingBot.model || 'meta-llama/llama-3.1-8b-instruct');
          if (existingBot.maxTokens) setMaxTokens(existingBot.maxTokens);
          if (existingBot.triggerType) setTriggerType(existingBot.triggerType);
          if (existingBot.systemMessages && existingBot.systemMessages[0]) {
            setSystemPrompt(existingBot.systemMessages[0]);
            // Match preset if prompt is unchanged, otherwise custom
            const matched = PERSONA_PRESETS.find(p => p.prompt.trim() === existingBot.systemMessages[0].trim());
            if (matched) {
              setSelectedPreset(matched.id);
            } else {
              setSelectedPreset('custom');
            }
          }
          addLog('info', `Retrieved existing database configurations for bot: "${cleanName}"`);
        }
      } catch (e) {
        // No bot registered yet, which is fine
      }
    };
    fetchExistingBotDetails();
  }, [currentStep]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // --- Helpers ---
  const addLog = (type, message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => {
      const newLogs = [...prev, { timestamp, type, message, data: data ? JSON.stringify(data, null, 2) : null }];
      return newLogs.slice(-25); // Show more logs
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

  const checkConnection = async (name) => {
    try {
      const data = await apiCall('get', `/instance/connectionState/${name}`);
      const state = data.instance?.state || data.state;
      if (state === 'open' || state === 'connected') {
        setConnState('connected');
        setQrCode(null); 
      } else {
        setConnState('disconnected');
      }
    } catch (e) {
      setConnState('unknown');
    }
  };

  // Automated unified Link Flow (Step 3 Trigger)
  const unifiedEstablishBot = async () => {
    const cleanName = getCleanName(instanceName);
    setInstanceName(cleanName);
    setIsProvisioning(true);
    setProvisioningStatus('1. Establishing virtual WhatsApp instance...');

    try {
      // 1. Spawning WhatsApp instance
      try {
        await apiCall('post', '/instance/create', { 
          instanceName: cleanName,
          integration: 'WHATSAPP-BAILEYS',
          Integration: 'WHATSAPP-BAILEYS',
          qrcode: true
        });
      } catch (e) {
        addLog('info', 'Instance already exists on server, using existing container.');
      }

      setProvisioningStatus('2. Binding AI Core API credentials...');
      // 2. Register Credentials
      let credsId;
      try {
        const creds = await apiCall('post', `/openai/creds/${cleanName}`, {
          name: `OpenRouter-${cleanName}`,
          apiKey: openrouterKey || apiKey
        });
        credsId = creds.id || (creds.response?.id);
      } catch (e) {
        // Fallback or read existing
        const existing = await axios.get(`${backendUrl}/openai/creds/${cleanName}`, { headers: { apikey: apiKey } });
        const list = Array.isArray(existing.data) ? existing.data : (existing.data.response || []);
        credsId = list[0]?.id;
      }

      if (!credsId) {
        throw new Error("API credentials binding failed. Verify your API keys.");
      }

      setProvisioningStatus('3. Transmitting neural prompt & fine-tuning...');
      // 3. Register or Update AI Bot
      const bots = await apiCall('get', `/openai/find/${cleanName}`);
      const existingBot = bots.response?.[0] || bots[0];

      const botPayload = {
        enabled: true,
        openaiCredsId: credsId,
        botType: 'chatCompletion',
        triggerType: triggerType,
        maxTokens: maxTokens,
        model: aiModel,
        keepOpen: true,
        expire: 86400,
        delayMessage: delayMessage,
        listeningFromMe: listeningFromMe,
        systemMessages: [systemPrompt]
      };

      if (existingBot) {
        await apiCall('put', `/openai/update/${existingBot.id}/${cleanName}`, botPayload);
      } else {
        await apiCall('post', `/openai/create/${cleanName}`, botPayload);
      }

      setProvisioningStatus('4. Activating AI interception status...');
      // 4. Set Open status
      await apiCall('post', `/openai/changeStatus/${cleanName}`, {
        status: 'opened',
        remoteJid: 'all'
      });

      setAiEnabled(true);
      setProvisioningStatus('5. Streaming connection pairing card...');
      
      // 5. Fetch QR code
      try {
        const data = await apiCall('get', `/instance/connect/${cleanName}`);
        const qrBase64 = data?.base64 || data?.qrcode?.base64;
        if (qrBase64) {
          setQrCode(qrBase64);
        }
      } catch (err) {
        addLog('info', 'Connecting instance to retrieve initial QR stream...', err.message);
      }

      addLog('success', `🤖 Bot "${cleanName}" configured & ready for pairing!`);
    } catch (err) {
      addLog('error', 'Provisioning Failed', err.message);
      alert('Provisioning failed: ' + err.message);
    } finally {
      setIsProvisioning(false);
      setProvisioningStatus('');
    }
  };

  // Synchronize dynamic prompt adjustments (Step 4 update)
  const synchronizeTuning = async () => {
    const cleanName = getCleanName(instanceName);
    try {
      // Fetch current bot id
      const bots = await apiCall('get', `/openai/find/${cleanName}`);
      const existingBot = bots.response?.[0] || bots[0];

      if (!existingBot) {
        addLog('error', 'Bot configuration not found in database. Please link first.');
        return;
      }

      // Re-fetch credentials id
      const existingCreds = await axios.get(`${backendUrl}/openai/creds/${cleanName}`, { headers: { apikey: apiKey } });
      const list = Array.isArray(existingCreds.data) ? existingCreds.data : (existingCreds.data.response || []);
      const credsId = list[0]?.id;

      if (!credsId) {
        addLog('error', 'API Credentials binding missing.');
        return;
      }

      await apiCall('put', `/openai/update/${existingBot.id}/${cleanName}`, {
        enabled: aiEnabled,
        openaiCredsId: credsId,
        botType: 'chatCompletion',
        triggerType: triggerType,
        maxTokens: maxTokens,
        model: aiModel,
        keepOpen: true,
        expire: 86400,
        delayMessage: delayMessage,
        listeningFromMe: listeningFromMe,
        systemMessages: [systemPrompt]
      });

      addLog('success', '🧬 AI brain prompt updated and synchronized successfully!');
      alert('AI brain prompt synchronized successfully!');
    } catch (e) {
      addLog('error', 'Failed to synchronize brain updates', e.message);
    }
  };

  const toggleSpecificBotAI = async (botName, newState) => {
    try {
      await apiCall('post', `/openai/changeStatus/${botName}`, {
        status: newState ? 'opened' : 'closed',
        remoteJid: 'all'
      });
      addLog('success', `AI Status for ${botName} changed to: ${newState ? 'Synchronized' : 'Closed'}`);
      if (botName === getCleanName(instanceName)) {
        setAiEnabled(newState);
      }
      return true;
    } catch (e) {
      addLog('error', `Failed to toggle AI Status for ${botName}`, e.message);
      return false;
    }
  };

  const toggleAIStatus = async () => {
    const cleanName = getCleanName(instanceName);
    await toggleSpecificBotAI(cleanName, !aiEnabled);
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
      addLog('success', 'Manual signal payload transmitted successfully.');
    } catch (e) {}
  };

  const destroySpecificBot = async (botName) => {
    if (!window.confirm(`Are you sure you want to completely destroy and delete bot session: "${botName}"?`)) return false;
    try {
      await apiCall('delete', `/instance/delete/${botName}`);
      addLog('success', `💥 Destroyed bot instance "${botName}"`);
      if (botName === getCleanName(instanceName)) {
        setConnState('disconnected');
        setQrCode(null);
        setAiEnabled(false);
        setCurrentStep(1);
      }
      return true;
    } catch (e) {
      addLog('error', `Instance destruction failed for ${botName}`, e.message);
      return false;
    }
  };

  const destroyInstance = async () => {
    const cleanName = getCleanName(instanceName);
    await destroySpecificBot(cleanName);
  };

  const fetchAllBots = async () => {
    setIsFetchingBots(true);
    try {
      const instances = await apiCall('get', '/instance/fetchInstances');
      setAllBots(instances || []);
    } catch (e) {
      addLog('error', 'Failed to fetch bots', e.message);
    } finally {
      setIsFetchingBots(false);
    }
  };

  useEffect(() => {
    fetchAllBots();
    // Background refresh active bots every 10s to keep telemetry precise
    const interval = setInterval(fetchAllBots, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col lg:flex-row relative">
      {/* Dynamic Animated Background (High-Res Organic Neural Network with breathing cosmic gradients) */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Left Column: Premium App Sidebar with Collapsible Action Toggle */}
      <aside className={`bg-zinc-950/85 border-b lg:border-b-0 lg:border-r border-zinc-800/80 backdrop-blur-2xl p-4 lg:p-6 flex flex-col justify-between lg:h-screen lg:sticky top-0 overflow-y-auto z-20 scrollbar-thin shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:w-20 w-full items-center' : 'lg:w-80 w-full'}`}>
        <div className={`space-y-8 w-full flex flex-col ${sidebarCollapsed ? 'items-center' : ''}`}>
          {/* Brand / Logo */}
          <div className={`flex items-center pb-4 border-b border-zinc-800/60 w-full ${sidebarCollapsed ? 'flex-col gap-4 justify-center' : 'justify-between gap-3'}`}>
            <div className="flex items-center gap-3 truncate">
              <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 flex-shrink-0">
                <Bot className="galaxy-icon w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="animate-in fade-in duration-300">
                  <h1 className="text-lg font-black text-white uppercase tracking-tight">
                    Clawn AI <span className="text-blue-400 font-medium text-xs lowercase">v1.0</span>
                  </h1>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Enterprise Core</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="space-y-1 w-full">
            {!sidebarCollapsed && (
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block px-2 mb-2 animate-in fade-in duration-300">Navigation</span>
            )}
            
            <button 
              onClick={() => setCurrentStep(1)} 
              className={`w-full flex items-center rounded-xl text-xs font-bold transition-all ${sidebarCollapsed ? 'justify-center p-3' : 'gap-2.5 px-3 py-2.5'} ${currentStep === 1 ? 'bg-zinc-900 text-white border border-zinc-800/85' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'}`}
              title="Wizard Setup Dashboard"
            >
              <Sliders className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              {!sidebarCollapsed && <span className="animate-in fade-in duration-300">Wizard Setup Dashboard</span>}
            </button>

            <button 
              onClick={() => setShowAdvanced(!showAdvanced)} 
              className={`w-full flex items-center rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900/40 transition-all ${sidebarCollapsed ? 'justify-center p-3' : 'gap-2.5 px-3 py-2.5'}`}
              title="System API Settings"
            >
              <Settings className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              {!sidebarCollapsed && <span className="animate-in fade-in duration-300">System API Settings</span>}
            </button>

            <button 
              onClick={() => {
                alert("Clawn AI Enterprise License Validated. Profile: clawncore (Admin). Active Status: Online.");
              }} 
              className={`w-full flex items-center rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900/40 transition-all ${sidebarCollapsed ? 'justify-center p-3' : 'gap-2.5 px-3 py-2.5'}`}
              title="Account Profile Settings"
            >
              <User className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              {!sidebarCollapsed && <span className="animate-in fade-in duration-300">Account Profile Settings</span>}
            </button>
          </div>

          {/* Connected Bots Section */}
          <div className="space-y-3 w-full">
            <div className={`flex items-center w-full ${sidebarCollapsed ? 'flex-col justify-center gap-2' : 'justify-between px-2'}`}>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <Server className="w-3 h-3 text-zinc-400 flex-shrink-0" /> 
                {!sidebarCollapsed && <span className="animate-in fade-in duration-300">Connected Bots ({allBots.length})</span>}
              </span>
              <button 
                onClick={fetchAllBots} 
                disabled={isFetchingBots}
                className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest disabled:opacity-50 flex items-center justify-center"
                title="Refresh Bots List"
              >
                <RefreshCw className={`w-3 h-3 ${isFetchingBots ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin w-full">
              {allBots.length === 0 ? (
                <div className={`text-center border border-dashed border-zinc-800/80 rounded-xl bg-zinc-950/30 ${sidebarCollapsed ? 'p-2' : 'py-6 px-3'}`}>
                  <Bot className="w-5 h-5 text-zinc-700 mx-auto mb-1 opacity-60" />
                  {!sidebarCollapsed && (
                    <div className="animate-in fade-in duration-300">
                      <p className="text-[9px] font-bold text-zinc-500 uppercase">No Bots Found</p>
                    </div>
                  )}
                </div>
              ) : (
                allBots.map((botWrapper, idx) => {
                  const bot = botWrapper.instance || botWrapper;
                  const bName = bot.instanceName || bot.name;
                  const bState = bot.state || 'unknown';
                  const isSelected = bName === getCleanName(instanceName);

                  if (sidebarCollapsed) {
                    return (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setInstanceName(bName);
                          // Jump to Step 4 to control this bot directly!
                          setCurrentStep(4);
                        }}
                        className={`cursor-pointer w-10 h-10 mx-auto border rounded-xl flex items-center justify-center relative group transition-all ${isSelected ? 'border-indigo-500 bg-zinc-900 shadow-md shadow-indigo-500/10' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'}`}
                        title={`Bot: ${bName} (${bState})`}
                      >
                        <Bot className={`w-4 h-4 ${bState === 'open' || bState === 'connected' ? 'text-emerald-400' : 'text-zinc-500'}`} />
                        <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-zinc-950 ${bState === 'open' || bState === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={idx} 
                      className={`bg-zinc-900/50 border rounded-xl p-3 flex flex-col gap-2 transition-all animate-in fade-in duration-300 ${isSelected ? 'border-indigo-500/40 bg-zinc-900/80 shadow-md shadow-indigo-500/5' : 'border-zinc-800/60 hover:border-zinc-700'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <div className={`p-1.5 rounded-lg ${bState === 'open' || bState === 'connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'}`}>
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[11px] font-black text-white truncate block max-w-[120px]">{bName}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {/* Dot indicator */}
                          <span className={`w-1.5 h-1.5 rounded-full ${bState === 'open' || bState === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`} title={bState}></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 justify-between pt-1 border-t border-zinc-800/40">
                        <button
                          onClick={() => {
                            setInstanceName(bName);
                            // Jump to Step 4 to control this bot directly!
                            setCurrentStep(4);
                          }}
                          className="text-[8px] bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold px-2 py-1 rounded uppercase tracking-wider transition-colors"
                          title="Load to Control Panel"
                        >
                          Control
                        </button>

                        <button
                          onClick={async () => {
                            const wantOn = window.confirm(`Turn AI Intercept INTERCEPT ON for ${bName}? Cancel to Turn OFF.`);
                            await toggleSpecificBotAI(bName, wantOn);
                            fetchAllBots();
                          }}
                          className="text-[8px] bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold px-2 py-1 rounded uppercase tracking-wider transition-colors"
                          title="Toggle AI Status"
                        >
                          Toggle AI
                        </button>

                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you absolutely sure you want to delete / destroy bot "${bName}"?`)) {
                              const success = await destroySpecificBot(bName);
                              if (success) fetchAllBots();
                            }
                          }}
                          className="text-[8px] p-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded transition-colors"
                          title="Delete Bot Session"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer User Details */}
        <div className={`pt-4 border-t border-zinc-800/60 flex items-center w-full ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-black text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
            CC
          </div>
          {!sidebarCollapsed && (
            <div className="truncate animate-in fade-in duration-300">
              <p className="text-[11px] font-black text-white truncate">clawncore</p>
              <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping"></span> Administrator
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* Right Column: Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto z-10 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Block */}
        <header className="bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Bot className="galaxy-icon w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight uppercase">
                Clawn AI <span className="text-blue-400 font-medium lowercase">dashboard</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bot Intelligence Control Center</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
            {/* Gateway indicator */}
            <div className="flex items-center gap-2 bg-zinc-950/60 px-3 py-1.5 rounded-xl border border-zinc-800/40 text-xs">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold text-slate-300">Server:</span>
              <span className="font-bold text-white truncate max-w-[150px]">{backendUrl}</span>
            </div>

            {/* Connection indicator */}
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${connState === 'connected' ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${connState === 'connected' ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`}></span>
              {connState === 'connected' ? 'WhatsApp Connected' : 'No Active Session'}
            </div>
          </div>
        </header>

        {/* Global Connection / System Settings (Collapsible) */}
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 shadow-xl">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowAdvanced(!showAdvanced)}>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
              <Settings className="w-3.5 h-3.5" />
              <span>System & Gateway Configurations</span>
            </div>
            {showAdvanced ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-800/50 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Backend API URL</label>
                <input 
                  value={backendUrl} 
                  onChange={(e) => setBackendUrl(e.target.value)} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Master API Password Key</label>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all" 
                />
              </div>
            </div>
          )}
        </div>

        {/* Unified Step Progressive Stepper */}
        <div className="grid grid-cols-5 gap-2 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-2.5 shadow-xl relative">
          {[
            { step: 1, label: 'Identity & Persona', icon: Bot },
            { step: 2, label: 'Neural Brain', icon: Sliders },
            { step: 3, label: 'WhatsApp Pairing', icon: Smartphone },
            { step: 4, label: 'Control Console', icon: Terminal },
            { step: 5, label: 'Smart Funnel', icon: Globe },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step || (item.step === 3 && connState === 'connected');
            
            return (
              <button
                key={item.step}
                onClick={() => {
                  // Allow jumping to Step 4 or 5 directly only if connected
                  if ((item.step === 4 || item.step === 5) && connState !== 'connected') {
                    alert('WhatsApp instance must be connected first!');
                    return;
                  }
                  setCurrentStep(item.step);
                }}
                className={`relative flex flex-col md:flex-row items-center justify-center gap-2.5 py-3.5 rounded-xl text-xs font-black transition-all ${isActive ? 'bg-zinc-800/80 text-white border border-blue-700/80 shadow-[0_0_15px_rgba(29,78,216,0.35)]' : isCompleted ? 'text-emerald-400 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'galaxy-icon' : 'text-zinc-500'}`} />
                )}
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Wizard Step Canvas */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-[2rem] p-6 sm:p-10 shadow-2xl relative min-h-[500px]">
          {/* STEP 1: Bot Identity & Presets */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-zinc-800/50 pb-4">
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <Bot className="galaxy-icon w-5 h-5" /> STEP 1: Bot Identity & Personality Presets
                </h2>
                <p className="text-xs text-zinc-400 mt-1">Provide your bot with a unique name and select a base behavioral model preset.</p>
              </div>

              {/* Target Messaging Platform Selector (Extending Clawn AI arms to other platforms) */}
              <div className="space-y-4">
                <label className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Globe className="galaxy-icon w-3.5 h-3.5" /> Target Messaging Platform (Multi-Channel Arms)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'whatsapp', name: 'WhatsApp', desc: 'Core Baileys Gateway', active: true },
                    { id: 'telegram', name: 'Telegram Bot', desc: 'Active via Webhook (Next)', active: false },
                    { id: 'discord', name: 'Discord Bot', desc: 'Active via Gateway API (Next)', active: false },
                    { id: 'instagram', name: 'Instagram DM', desc: 'Meta Business Suite (Next)', active: false }
                  ].map((platform) => {
                    const isSel = targetPlatform === platform.id;
                    return (
                      <div
                        key={platform.id}
                        onClick={() => {
                          if (!platform.active) {
                            alert(`${platform.name} channel integration is scheduled for the Next Phase of Clawn deployment! WhatsApp is fully functional.`);
                            return;
                          }
                          setTargetPlatform(platform.id);
                        }}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px] relative overflow-hidden group ${isSel ? 'bg-zinc-950 border-blue-700 shadow-[0_0_20px_rgba(29,78,216,0.25)]' : 'bg-zinc-950/30 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-950/60'}`}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${platform.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                              {platform.active ? 'Active' : 'Next Phase'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-black text-xs text-white">{platform.name}</h4>
                            <p className="text-[9px] text-zinc-500 leading-tight mt-1">{platform.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bot Name Input */}
              <div className="max-w-md space-y-2">
                <label className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-500" /> WhatsApp Bot Instance Name
                </label>
                <input 
                  value={instanceName} 
                  onChange={(e) => setInstanceName(e.target.value)} 
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all placeholder:text-zinc-600" 
                  placeholder="e.g. clawn-bot"
                />
                <span className="text-[10px] text-zinc-500 block leading-relaxed italic">
                  This acts as the unique session key. E.g. "clawn-bot", "sales-agent-1" (lowercase, no spaces)
                </span>
              </div>

              {/* Presets Grid */}
              <div className="space-y-4">
                <label className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="galaxy-icon w-3.5 h-3.5" /> Select Bot AI Persona Preset
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {PERSONA_PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const isSelected = selectedPreset === preset.id;
                    return (
                      <div 
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset.id)}
                        className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between hover:translate-y-[-2px] relative overflow-hidden group ${isSelected ? `bg-zinc-950 border-blue-700 shadow-[0_0_20px_rgba(29,78,216,0.25)]` : 'bg-zinc-950/30 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-950/60'}`}
                      >
                        <div className="space-y-3">
                          <div className={`p-2.5 bg-gradient-to-tr ${preset.color} text-white w-fit rounded-xl group-hover:scale-105 transition-transform`}>
                            <Icon className="galaxy-icon w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-black text-sm text-white">{preset.name}</h3>
                            <p className="text-[11px] text-zinc-400 leading-relaxed mt-1.5">{preset.description}</p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-blue-500 text-white p-1 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Prompt Expandable Textarea */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Fine-tuning System Prompt Message
                  </label>
                  {selectedPreset !== 'custom' && (
                    <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
                      Autofilled from template (Editable)
                    </span>
                  )}
                </div>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => {
                    setSystemPrompt(e.target.value);
                    setSelectedPreset('custom');
                  }}
                  rows={8}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-xs font-mono text-zinc-300 focus:border-blue-500 outline-none resize-none transition-all leading-relaxed"
                  placeholder="Enter detailed behavior rules, context descriptions, guidelines, traits, and persona prompts here..."
                />
              </div>

              {/* Step Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-zinc-700/40">
                <div className="text-[11px] text-zinc-500 font-semibold italic">Configure bot persona, then navigate to Step 2.</div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-zinc-800 hover:bg-zinc-700 border border-blue-700/80 shadow-[0_0_12px_rgba(29,78,216,0.3)] text-white font-black text-xs py-3.5 px-6 rounded-2xl active:scale-95 flex items-center gap-2 transition-all uppercase"
                >
                  Configure Brain <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Neural Brain Config */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-zinc-700/40 pb-4">
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <Cpu className="galaxy-icon w-5 h-5" /> STEP 2: Neural Brain Engine Configuration
                </h2>
                <p className="text-xs text-zinc-400 mt-1">Provision API keys, select your neural model, and set advanced bot behavior properties.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Keys and Model */}
                <div className="space-y-6">
                  {/* API Key */}
                  <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-black text-zinc-300 uppercase tracking-widest">OpenRouter API Access Key</label>
                      <span className="text-[9px] text-zinc-500 italic">Used for AI responses</span>
                    </div>
                    <input
                      type="password"
                      value={openrouterKey}
                      onChange={(e) => setOpenrouterKey(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs font-mono text-white outline-none focus:border-indigo-500 transition-all"
                      placeholder="sk-or-v1-..."
                    />
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      Get yours at <a href="https://openrouter.ai" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">openrouter.ai</a>. Leave blank to default to server key if registered globally.
                    </p>
                  </div>

                  {/* Neural Engine Selector */}
                  <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-3">
                    <label className="text-[11px] font-black text-zinc-300 uppercase tracking-widest block">Neural Engine Selector</label>
                    <div className="relative">
                      <select 
                        value={aiModel} 
                        onChange={(e) => setAiModel(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 px-4 text-xs font-bold text-white outline-none cursor-pointer appearance-none focus:border-indigo-500 transition-all"
                      >
                        <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B Instruct (Highly Recommended - Very Fast)</option>
                        <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B Instruct (High IQ, causal & precise)</option>
                        <option value="google/gemini-pro-1.5">Gemini Pro 1.5 (Multilingual capability)</option>
                        <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo (Standard Fast)</option>
                        <option value="openai/gpt-4o-mini">GPT-4o Mini (Extremely smart, light weight)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Right Side: Advanced configurations */}
                <div className="bg-zinc-900/40 border border-zinc-700/40 p-6 rounded-2xl space-y-6">
                  <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-400" /> Advanced Behavior Fine-Tuning
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Max Tokens */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Max Output Tokens</label>
                      <input 
                        type="number" 
                        value={maxTokens} 
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))} 
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-2.5 px-3.5 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all" 
                      />
                    </div>

                    {/* Delay */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Typing Delay (ms)</label>
                      <input 
                        type="number" 
                        value={delayMessage} 
                        onChange={(e) => setDelayMessage(parseInt(e.target.value))} 
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-2.5 px-3.5 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Trigger Select */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">Bot Trigger Audience</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Determine who the bot responds to</p>
                      </div>
                      <select 
                        value={triggerType} 
                        onChange={(e) => setTriggerType(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-3 text-xs font-bold text-white outline-none focus:border-indigo-500 transition-all"
                      >
                        <option value="all">Respond to Everyone</option>
                        <option value="individual">Direct Chats Only</option>
                        <option value="groups">Groups Only</option>
                      </select>
                    </div>

                    {/* Listen From Me Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">Listen to My Messages</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Allow bot to trigger from your own texts</p>
                      </div>
                      <button 
                        onClick={() => setListeningFromMe(!listeningFromMe)}
                        className={`text-xs font-black px-4 py-1.5 rounded-xl border transition-all ${listeningFromMe ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400 shadow-md shadow-indigo-500/5' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                      >
                        {listeningFromMe ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="flex justify-between items-center pt-6 border-t border-zinc-700/40">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-black text-xs py-3.5 px-6 rounded-2xl flex items-center gap-2 transition-all uppercase"
                >
                  <ArrowLeft className="w-4 h-4" /> Edit Identity
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-zinc-800 hover:bg-zinc-700 border border-blue-700/80 shadow-[0_0_12px_rgba(29,78,216,0.3)] text-white font-black text-xs py-3.5 px-6 rounded-2xl active:scale-95 flex items-center gap-2 transition-all uppercase"
                >
                  Link WhatsApp Channel <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Linking Provisioning QR Code */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-zinc-800/50 pb-4">
                <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <Smartphone className="galaxy-icon w-5 h-5" /> STEP 3: WhatsApp Linking & Provisioning
                </h2>
                <p className="text-xs text-zinc-400 mt-1">Spin up the WhatsApp container, bind credentials, and pair using the QR code.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left side: actions/telemetry */}
                <div className="space-y-6">
                  <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-[2rem] space-y-6">
                    <div>
                      <h3 className="font-black text-sm text-white uppercase">Link Bot Workflow Orchestrator</h3>
                      <p className="text-xs text-zinc-400 mt-1">Provisioning binds your name, preset prompts, keys, and model in one sequence.</p>
                    </div>

                    <div className="space-y-4">
                      {isProvisioning ? (
                        <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-xl space-y-3">
                          <div className="flex items-center gap-3">
                            <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                            <span className="text-xs font-bold text-blue-300">{provisioningStatus}</span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full animate-[shimmer_1.5s_infinite] w-[70%]"></div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={unifiedEstablishBot}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black py-4.5 rounded-2xl shadow-xl shadow-emerald-900/20 transition-all uppercase text-xs tracking-wider flex items-center justify-center gap-2"
                        >
                          <Zap className="w-4 h-4 text-white" /> Automate Link Provisioning
                        </button>
                      )}

                      {connState === 'connected' ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <div className="text-xs font-bold text-emerald-400">
                            WhatsApp linked! Transitioning to dashboard in a moment...
                          </div>
                        </div>
                      ) : (
                        <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/50">
                          <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                            * Note: Pressing "Automate Link Provisioning" spins up the session. Once the pairing QR streams on the right, scan it using WhatsApp Link Device settings on your phone to complete integration.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white font-black text-xs py-3.5 px-6 rounded-xl flex items-center gap-2 transition-all uppercase"
                    >
                      <ArrowLeft className="w-4 h-4" /> Edit Brain
                    </button>
                    {connState === 'connected' && (
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="bg-zinc-800 hover:bg-zinc-700 border border-blue-700/80 shadow-[0_0_12px_rgba(29,78,216,0.3)] text-white font-black text-xs py-3.5 px-6 rounded-xl active:scale-95 flex items-center gap-2 transition-all uppercase ml-auto"
                      >
                        Enter Control Console <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right side: QR Pairing terminal cradle */}
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[2rem] p-8 bg-zinc-950/50 min-h-[300px] relative overflow-hidden group">
                  {qrCode ? (
                    <div className="space-y-4 text-center animate-in zoom-in-95 duration-500">
                      <div className="bg-white p-4 rounded-2xl shadow-2xl inline-block">
                        <img src={qrCode} alt="WhatsApp Pairing QR" className="w-[180px] h-[180px]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> QR Stream Active
                        </p>
                        <p className="text-[10px] text-zinc-400">Scan QR Code using Linked Devices menu in WhatsApp</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4 py-8">
                      <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-zinc-800 group-hover:scale-105 transition-transform">
                        <Radio className="w-6 h-6 text-zinc-500 animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-zinc-400 tracking-[0.2em]">Awaiting Pulse...</p>
                        <p className="text-[10px] text-zinc-500 mt-1 max-w-[200px] mx-auto">Click "Automate Link Provisioning" to generate QR pairing code.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Live Management Control Room Console */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-zinc-800/50 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                    <Terminal className="galaxy-icon w-5 h-5" /> STEP 4: ACTIVE BOT CONTROL CONSOLE
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">Live telemetry monitoring, prompt tuning overrides, and Sandbox Manual Signal sender.</p>
                </div>

                <div className="flex gap-3">
                  {/* AI toggle */}
                  <button
                    onClick={toggleAIStatus}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${aiEnabled ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/5' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
                  >
                    <Power className={`w-3.5 h-3.5 ${aiEnabled ? 'animate-pulse' : ''}`} />
                    AI Status: {aiEnabled ? 'Synchronized' : 'Paused'}
                  </button>

                  {/* Destroy Button */}
                  <button
                    onClick={destroyInstance}
                    className="p-2.5 bg-rose-600/15 border border-rose-500/20 text-rose-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all"
                    title="Destroy WhatsApp Bot Instance"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Console Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Live Tuning overrides */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6 hover:border-blue-500/20 transition-all flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Sliders className="galaxy-icon w-4 h-4" /> Neural Brain Tuning
                    </h3>

                    {/* Preset Info */}
                    <div className="bg-zinc-950/40 border border-zinc-800/50 p-3 rounded-xl flex items-center gap-2">
                      <Bot className="galaxy-icon w-4 h-4 flex-shrink-0" />
                      <div className="text-[10px]">
                        <span className="font-bold text-zinc-300">Active Model: </span>
                        <span className="text-white truncate block max-w-[180px] font-mono">{aiModel}</span>
                      </div>
                    </div>

                    {/* Live Prompt Tuning */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Live Prompt Tuning Override</label>
                      <textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        rows={8}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-[10px] font-mono text-zinc-300 focus:border-blue-500 outline-none resize-none transition-all leading-relaxed"
                      />
                    </div>
                  </div>

                  <button
                    onClick={synchronizeTuning}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 border border-blue-700/80 shadow-[0_0_12px_rgba(29,78,216,0.3)] text-white font-black py-3.5 rounded-xl transition-all active:scale-95 uppercase text-xs tracking-wider flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Sync Brain Updates
                  </button>
                </div>

                {/* Column 2: Sandbox manual messenger */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6 hover:border-orange-500/20 transition-all">
                  <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                    <Send className="galaxy-icon w-4 h-4" /> Sandbox Signal Transmitter
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Target Phone JID Number</label>
                      <input 
                        value={recipient} 
                        onChange={(e) => setRecipient(e.target.value)} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-orange-500 outline-none transition-all" 
                        placeholder="e.g. 918790813536" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-zinc-500 uppercase ml-1">Message Payload</label>
                      <textarea 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        rows={6} 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 px-4 text-xs font-bold text-white focus:border-orange-500 outline-none resize-none transition-all" 
                        placeholder="Enter direct signal message text..." 
                      />
                    </div>
                    <button 
                      onClick={sendMessage} 
                      className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-black py-3.5 rounded-xl text-xs uppercase shadow-xl hover:shadow-white/5 active:scale-95 transition-all"
                    >
                      Transmit Signal
                    </button>
                  </div>
                </div>

                {/* Column 3: Live Trace logs */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col hover:border-blue-500/20 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Terminal className="galaxy-icon w-4 h-4" /> Kernel Trace Logs
                    </h3>
                    <button 
                      onClick={() => setLogs([])} 
                      className="text-[9px] text-zinc-500 hover:text-white uppercase font-black tracking-widest transition-colors"
                    >
                      Wipe
                    </button>
                  </div>

                  <div className="flex-1 bg-[#05070a] border border-zinc-800 rounded-2xl p-4 font-mono text-[9px] overflow-y-auto max-h-[300px] min-h-[220px] space-y-3 scrollbar-thin">
                    {logs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full opacity-20 py-12 gap-2 text-center">
                        <Cpu className="w-6 h-6 animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Telemetry Link Ready</p>
                      </div>
                    ) : (
                      logs.map((log, i) => (
                        <div key={i} className="border-l border-zinc-800 pl-3 py-0.5 hover:border-blue-500/50 transition-colors">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-slate-700 tabular-nums">{log.timestamp}</span>
                            <span className={`uppercase font-black text-[8px] px-1.5 py-0.25 rounded ${log.type === 'error' ? 'bg-rose-500/10 text-rose-500' : log.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {log.message}
                            </span>
                          </div>
                          {log.data && <pre className="text-[8px] text-slate-500 mt-1 bg-black/40 p-2 rounded border border-zinc-900 overflow-x-auto">{log.data}</pre>}
                        </div>
                      ))
                    )}
                    <div ref={logEndRef} />
                  </div>
                </div>
              </div>

              {/* Footer step triggers */}
              <div className="flex justify-between items-center pt-6 border-t border-zinc-800/50">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-black text-xs py-3.5 px-6 rounded-xl flex items-center gap-2 transition-all uppercase"
                >
                  <ArrowLeft className="w-4 h-4" /> Go back to settings
                </button>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic animate-pulse">
                  🤖 Bot active in live sandbox channel trace
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Smart Filter & Ad Funnel n8n Manager */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="border-b border-zinc-800/50 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-black text-white uppercase flex items-center gap-2">
                    <Globe className="galaxy-icon w-5 h-5" /> STEP 5: SMART FILTER & AD FUNNEL MANAGER
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Orchestrate custom VIP pathways, promotional thresholds, and deploy blueprints straight to your standalone n8n instance.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      if (isDeployingWorkflow) return;
                      setIsDeployingWorkflow(true);
                      try {
                        const routingConfig = {
                          instanceName,
                          vipNumbers,
                          systemPrompt,
                          maxTokens,
                          delayMessage,
                          triggerType,
                          listeningFromMe
                        };
                        const funnelConfig = {
                          messageThreshold,
                          promoLink,
                          adInstructions
                        };
                        const workflowId = await deployUniversalAutomation(
                          routingConfig,
                          funnelConfig,
                          n8nUrl,
                          n8nApiKey
                        );
                        setActiveWorkflowId(workflowId);
                        alert(`Successfully deployed Smart Filter automation! n8n generated workflow ID: ${workflowId}`);
                      } catch (err) {
                        alert(`Blueprint deployment failed: ${err.message}`);
                      } finally {
                        setIsDeployingWorkflow(false);
                      }
                    }}
                    disabled={isDeployingWorkflow}
                    className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs py-3.5 px-6 rounded-xl flex items-center gap-2 transition-all uppercase shadow-md shadow-blue-500/20 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4.5 h-4.5 ${isDeployingWorkflow ? 'animate-spin' : ''}`} />
                    {isDeployingWorkflow ? 'Deploying Blueprint...' : 'Deploy Funnel to n8n'}
                  </button>
                </div>
              </div>

              {/* Advanced Integration Configuration (collapsible/glowing) */}
              <div className="bg-zinc-950/60 border border-zinc-850 p-6 rounded-3xl space-y-4">
                <h3 className="text-xs font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-400" /> n8n Workspace Access Key
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">n8n Workspace URL</label>
                    <input
                      value={n8nUrl}
                      onChange={(e) => setN8nUrl(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. https://onrender.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase">X-N8N-API-KEY Access Token</label>
                    <input
                      type="password"
                      value={n8nApiKey}
                      onChange={(e) => setN8nApiKey(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-blue-500 outline-none transition-all"
                      placeholder="Enter master n8n REST API key..."
                    />
                  </div>
                </div>
              </div>

              {/* Render Component 1: Universal Routing */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-3xl">
                <RouterConfig vipNumbers={vipNumbers} setVipNumbers={setVipNumbers} />
              </div>

              {/* Render Component 2: Ad Funnel Variable Injector */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-3xl">
                <FunnelSettings
                  messageThreshold={messageThreshold}
                  setMessageThreshold={setMessageThreshold}
                  promoLink={promoLink}
                  setPromoLink={setPromoLink}
                  adInstructions={adInstructions}
                  setAdInstructions={setAdInstructions}
                />
              </div>

              {/* Render Component 4: Embedded Native Iframe Viewer */}
              {activeWorkflowId && (
                <EmbeddedCanvas workflowId={activeWorkflowId} n8nUrl={n8nUrl} />
              )}

              {/* Footer step triggers */}
              <div className="flex justify-between items-center pt-6 border-t border-zinc-800/50">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-zinc-850 hover:bg-zinc-800 active:scale-95 text-white font-black text-xs py-3.5 px-6 rounded-xl flex items-center gap-2 transition-all uppercase"
                >
                  <ArrowLeft className="w-4 h-4" /> Go back to Console
                </button>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic animate-pulse">
                  ⚡ Funnel variables synchronized live to n8n webhook nodes
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Footer */}
        <footer className="text-center pt-4 pb-10">
          <p className="text-[9px] text-slate-600 font-black uppercase tracking-[1em] opacity-40 hover:opacity-100 transition-opacity cursor-default">
            Clawn AI Intelligence Network v1.0
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
