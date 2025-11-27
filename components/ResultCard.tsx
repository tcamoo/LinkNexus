import React, { useState } from 'react';
import { UploadState } from '../types';
import { Copy, Check, RefreshCw, ExternalLink, FileAudio, FileVideo } from 'lucide-react';

interface ResultCardProps {
  state: UploadState;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ state, onReset }) => {
  const [copied, setCopied] = useState(false);

  if (!state.telegramLink) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(state.telegramLink!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVideo = state.fileType === 'video';

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="cyber-box rounded-sm overflow-hidden relative group">
        
        {/* Header Bar */}
        <div className="h-8 bg-cyber-dark border-b border-cyber-cyan/20 flex items-center justify-between px-3">
            <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
            </div>
            <div className="text-[10px] font-mono text-cyber-cyan/50 tracking-widest">TRANSMISSION COMPLETE</div>
        </div>

        {/* Preview Area */}
        <div className="bg-black/50 aspect-video flex flex-col items-center justify-center relative p-8">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.02)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            
            {isVideo && state.previewUrl ? (
                <video 
                    src={state.previewUrl} 
                    controls 
                    className="max-h-full max-w-full shadow-[0_0_20px_rgba(0,243,255,0.2)] border border-cyber-cyan/20"
                />
            ) : (
                <div className="flex flex-col items-center gap-4 animate-float">
                    <div className="p-6 rounded-full bg-cyber-purple/10 border border-cyber-purple shadow-[0_0_30px_rgba(188,19,254,0.3)]">
                        <FileAudio className="w-16 h-16 text-cyber-purple" />
                    </div>
                    <div className="h-1 w-32 bg-cyber-purple/20 rounded-full overflow-hidden">
                        <div className="h-full bg-cyber-purple w-2/3 animate-pulse"></div>
                    </div>
                </div>
            )}
        </div>

        {/* Data & Actions */}
        <div className="p-6 border-t border-cyber-cyan/20 bg-cyber-black/40">
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full space-y-2">
                    <label className="text-xs font-mono text-cyber-cyan/60 uppercase">Secure Link</label>
                    <div className="flex bg-black/50 border border-cyber-cyan/30 p-1 rounded-sm">
                        <input 
                            type="text" 
                            readOnly 
                            value={state.telegramLink} 
                            className="bg-transparent border-none text-cyber-cyan font-mono text-sm w-full focus:ring-0 px-2"
                        />
                    </div>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={handleCopy}
                        className="cyber-button flex-1 md:flex-none px-6 py-2 flex items-center justify-center gap-2 text-sm"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'COPIED' : 'COPY'}
                    </button>
                    <a
                        href={state.telegramLink}
                        target="_blank"
                        rel="noreferrer"
                        className="cyber-button px-3 py-2 flex items-center justify-center"
                        title="Open External"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                        onClick={onReset}
                        className="p-2 border border-cyber-gray hover:border-cyber-cyan text-cyber-gray hover:text-cyber-cyan transition-colors"
                        title="New Upload"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="mt-6 flex gap-4 text-xs font-mono text-cyber-cyan/40">
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse"></div>
                    STATUS: ONLINE
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full"></div>
                    ENCRYPTION: NONE
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ResultCard;
