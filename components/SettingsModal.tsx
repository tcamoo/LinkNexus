import React, { useState, useEffect } from 'react';
import { Settings, Save, X, ExternalLink, Server, AlertTriangle } from 'lucide-react';
import { TelegramConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TelegramConfig | null;
  onSave: (config: TelegramConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [apiRoot, setApiRoot] = useState('https://api.telegram.org');

  useEffect(() => {
    if (config) {
      setBotToken(config.botToken);
      setChatId(config.chatId);
      setApiRoot(config.apiRoot || 'https://api.telegram.org');
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ botToken, chatId, apiRoot });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="cyber-box w-full max-w-md p-6 relative rounded-sm">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-cyber-cyan transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6 text-cyber-cyan border-b border-cyber-cyan/20 pb-4">
          <Settings className="w-6 h-6 animate-spin-slow" />
          <h2 className="text-xl font-bold tracking-widest font-mono">SYSTEM CONFIG</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-mono">
          <div>
            <label className="block text-xs font-bold text-cyber-cyan/80 mb-1 uppercase">Telegram Bot Token</label>
            <input
              type="text"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="123456:ABC-DEF..."
              className="cyber-input w-full px-4 py-2 text-sm rounded-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-cyber-cyan/80 mb-1 uppercase">Chat ID / Username</label>
            <input
              type="text"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              placeholder="@channel or -100..."
              className="cyber-input w-full px-4 py-2 text-sm rounded-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-cyber-cyan/80 mb-1 uppercase flex items-center gap-2">
               API Gateway <span className="text-[10px] text-slate-500 lowercase font-normal">(optional for local server)</span>
            </label>
            <input
              type="text"
              value={apiRoot}
              onChange={(e) => setApiRoot(e.target.value)}
              placeholder="https://api.telegram.org"
              className="cyber-input w-full px-4 py-2 text-sm rounded-sm"
            />
          </div>

          <div className="pt-4 border-t border-cyber-cyan/20">
            <button
              type="submit"
              className="cyber-button w-full py-3 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              SAVE CONFIGURATION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
