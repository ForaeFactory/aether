'use client'

import { Activity, Database, Sparkles, Crosshair, Cpu, Radio, Zap } from 'lucide-react'
import { useMockChat } from '@/hooks/useMockChat'
import { useAppStore } from '@/store/store'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Renders the UI overlay, including the header, system stats, chat interface, and other decorative elements.
 * The overlay is animated and interactive, allowing the user to interact with the 3D scene through the chat.
 */
export default function Overlay() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useMockChat()
  const { setFocusTarget } = useAppStore()
  const [isChatOpen, setIsChatOpen] = useState(false)

  // React to AI messages to trigger actions in the 3D scene.
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'assistant') {
      if (lastMessage.content.includes('Alpha quadrant')) {
        setFocusTarget([10, 5, 10])
      } else if (lastMessage.content.includes('Resetting')) {
        setFocusTarget([0, 0, 0])
      }
    }
  }, [messages, setFocusTarget])

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col h-full p-6 md:p-8 overflow-hidden">
      {/* Scanning lines effect for a futuristic look. */}
      <div className="scanlines" />

      {/* Top Left: Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-8 left-8 flex flex-col items-start"
      >
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-5 h-5 text-blue-500 animate-pulse" />
          <h1 className="text-4xl font-bold tracking-tighter text-white glow-text">
            AETHER
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-px w-12 bg-blue-500/50" />
          <p className="hud-text text-[10px]">
            ORBITAL ANALYTICS ENGINE v2.4
          </p>
        </div>
      </motion.header>

      {/* Top Right: System Stats */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-8 right-8 flex gap-4"
      >
        <div className="glass-panel p-3 rounded-sm flex items-center gap-3 border-l-2 border-blue-500">
          <Activity className="w-4 h-4 text-green-400" />
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 uppercase tracking-wider">Sys. Load</span>
            <span className="text-xs font-mono text-white">12%</span>
          </div>
        </div>
        <div className="glass-panel p-3 rounded-sm flex items-center gap-3 border-l-2 border-purple-500">
          <Database className="w-4 h-4 text-purple-400" />
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400 uppercase tracking-wider">Entities</span>
            <span className="text-xs font-mono text-white">10,000</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Left: Status */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-8 left-8 max-w-xs pointer-events-auto"
      >
        <div className="glass-panel p-4 rounded-sm border-b-2 border-blue-500/50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <Radio className="w-3 h-3" /> Active View
            </h3>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-mono">
            Galaxy projection active. High-dimensional clusters mapped to 3D space.
          </p>
        </div>
      </motion.div>

      {/* Bottom Right: Coordinates */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-8 right-8 text-right"
      >
        <div className="flex flex-col items-end gap-1">
          <span className="hud-text">COORDINATES</span>
          <span className="text-xl font-mono text-white tracking-widest">
            45.221 <span className="text-blue-500">::</span> -12.004
          </span>
        </div>
      </motion.div>

      {/* Center: Chat Interface */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-2xl flex flex-col gap-4 pointer-events-auto">
        <AnimatePresence>
          {(messages.length > 0 || isChatOpen) && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="glass-panel rounded-lg p-4 max-h-80 overflow-y-auto border-t-2 border-blue-500/30"
            >
              {/* Renders the chat messages. */}
              {messages.map((m: Message, i: number) => (
                <div key={i} className={`mb-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block px-3 py-2 rounded-sm text-xs font-mono ${
                    m.role === 'user' 
                      ? 'bg-blue-900/40 text-blue-100 border border-blue-500/30' 
                      : 'bg-purple-900/40 text-purple-100 border border-purple-500/30'
                  }`}>
                    {m.role === 'assistant' && <Sparkles className="w-3 h-3 inline mr-2 text-purple-400" />}
                    {m.content}
                  </span>
                </div>
              ))}
              {/* Renders a loading indicator when the AI is processing a query. */}
              {isLoading && (
                <div className="text-left">
                  <span className="inline-flex items-center px-3 py-2 rounded-sm text-xs font-mono bg-purple-900/20 text-purple-300 border border-purple-500/20">
                    <Zap className="w-3 h-3 mr-2 animate-spin" />
                    PROCESSING QUERY...
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          {/* Renders the chat input form. */}
          <form onSubmit={(e) => { setIsChatOpen(true); handleSubmit(e); }} className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg flex items-center p-1">
            <div className="pl-3 pr-2">
              <Crosshair className="w-5 h-5 text-blue-500" />
            </div>
            <input 
              value={input}
              onChange={handleInputChange}
              onFocus={() => setIsChatOpen(true)}
              type="text" 
              placeholder="ENTER COMMAND OR QUERY..." 
              className="w-full bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 px-2 py-3 outline-none font-mono text-sm"
            />
            <div className="pr-2">
              <span className="px-2 py-1 bg-blue-900/30 text-[10px] text-blue-400 border border-blue-500/30 rounded font-mono">
                AI READY
              </span>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Decorative Corner Brackets */}
      <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-white/20 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-white/20 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-white/20 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-white/20 rounded-br-lg pointer-events-none" />
    </div>
  )
}
