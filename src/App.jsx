/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Gamepad2, 
  Play, 
  X, 
  Maximize2, 
  Trophy, 
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isIframeFullscreen, setIsIframeFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const featuredGame = gamesData[0];
  const trendingGames = gamesData.slice(1, 4);

  return (
    <div className="min-h-screen bg-arcade-bg text-slate-100 flex flex-col p-4 md:p-6 gap-6 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between bg-slate-900/50 border border-arcade-border rounded-2xl p-4 h-16 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-arcade-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">NOVA<span className="text-arcade-accent">GAMES</span></h1>
        </div>
        
        <div className="flex-1 max-w-md px-4 sm:px-8">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search unblocked library..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-arcade-border rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-arcade-accent transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-arcade-accent transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span className="hidden sm:flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> 1,284 Online</span>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-arcade-border">Status</button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {searchQuery ? (
          /* Search Results View */
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl flex items-center gap-3">
                <Search className="text-arcade-accent" />
                Results for "{searchQuery}"
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode='popLayout'>
                {filteredGames.map((game, idx) => (
                  <GameCard key={game.id} game={game} idx={idx} onClick={() => setSelectedGame(game)} />
                ))}
              </AnimatePresence>
            </div>
          </section>
        ) : (
          /* Bento Dashboard View */
          <div className="grid grid-cols-12 grid-rows-none lg:grid-rows-6 gap-6 h-full min-h-[800px]">
            {/* Featured Game Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-12 lg:col-span-8 lg:row-span-4 relative group bento-card cursor-pointer"
              onClick={() => setSelectedGame(featuredGame)}
            >
              <div className="absolute inset-0 z-0">
                <img src={featuredGame.thumbnail} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                <span className="bg-arcade-accent text-[10px] font-bold px-2 py-1 rounded mb-3 inline-block uppercase animate-pulse">Featured Vault Entry</span>
                <h2 className="text-4xl md:text-5xl font-black mb-2 uppercase">{featuredGame.title}</h2>
                <p className="text-slate-300 text-sm max-w-md mb-6 leading-relaxed">{featuredGame.description}</p>
                <button className="bg-white text-black font-extrabold px-8 py-3 rounded-full flex items-center gap-2 hover:bg-arcade-accent hover:text-white transition-all transform active:scale-95">
                  <Play className="w-5 h-5 fill-current" />
                  Launch Game
                </button>
              </div>
              {/* Decoration */}
              <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
                <Gamepad2 className="w-32 h-32" />
              </div>
            </motion.div>

            {/* Trending Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="col-span-12 lg:col-span-4 lg:row-span-3 bento-card bg-slate-900/50 p-6"
            >
              <h3 className="text-sm font-bold uppercase text-slate-500 mb-6 flex items-center justify-between">
                Trending Recently
                <TrendingUp className="w-4 h-4 text-arcade-accent" />
              </h3>
              <div className="space-y-4">
                {trendingGames.map((game) => (
                  <div 
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950/50 border border-arcade-border cursor-pointer hover:border-arcade-accent/50 hover:bg-slate-950 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                      <img src={game.thumbnail} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-bold group-hover:text-arcade-accent transition-colors">{game.title}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Ready to Play</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="col-span-6 lg:col-span-2 lg:row-span-3 bg-arcade-accent rounded-3xl p-6 flex flex-col justify-between text-white overflow-hidden relative"
            >
              <div className="absolute -right-4 -bottom-4 opacity-20 transform -rotate-12">
                <Trophy className="w-24 h-24" />
              </div>
              <div className="text-xs font-bold uppercase opacity-80 z-10">Vault Capacity</div>
              <div className="text-5xl font-black z-10">{gamesData.length * 12}k</div>
              <div className="text-[10px] leading-tight opacity-70 font-medium z-10">Optimized index serving 800+ nodes globally.</div>
            </motion.div>

            {/* Tags Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="col-span-6 lg:col-span-2 lg:row-span-3 bento-card p-6 flex flex-col"
            >
              <div className="text-xs font-bold uppercase text-slate-500 mb-6">Archive Tags</div>
              <div className="flex flex-wrap gap-2">
                {['Action', 'Retro', 'IO', 'Puzzle', 'Sport', 'WebGL'].map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-800 border border-arcade-border px-2.5 py-1.5 rounded-lg hover:border-arcade-accent transition-colors cursor-default whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Proxy/System Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-12 lg:col-span-8 lg:row-span-2 bento-card bg-arcade-card/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Proxy Engine</div>
                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    nova-core v4.0 (Stable)
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Network Health</div>
                  <div className="flex items-center gap-2 font-mono text-xs text-arcade-accent font-bold uppercase">
                    99.8% Latency Score
                  </div>
                </div>
              </div>
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold ${['bg-slate-700', 'bg-arcade-accent', 'bg-rose-500', 'bg-emerald-500'][i-1]}`}>
                    {['+12', 'JD', 'KA', 'SK'][i-1]}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Full Library Section (Optional, showing more games) */}
      {!searchQuery && (
        <section className="mt-8 pb-12">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-xl font-black uppercase flex items-center gap-3">
              <span className="w-1.5 h-6 bg-arcade-accent rounded-full"></span>
              Full Archive
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gamesData.map((game, idx) => (
              <GameCard key={game.id} game={game} idx={idx} onClick={() => setSelectedGame(game)} />
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="h-12 border-t border-arcade-border flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mt-auto">
        <div>NOVA GAMES ENTERPRISE // VAULT_ACCESS</div>
        <div className="hidden sm:flex items-center gap-6">
          <span>{new Date().toLocaleTimeString()}</span>
          <span className="text-arcade-accent animate-pulse">CONNECTION: SECURE</span>
        </div>
      </footer>

      {/* Game Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8"
          >
            <div 
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
              onClick={() => setSelectedGame(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative w-full h-full glass-card overflow-hidden flex flex-col ${isIframeFullscreen ? 'rounded-none border-none' : ''}`}
            >
              <div className="p-4 border-b border-arcade-border flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-arcade-border">
                    <img src={selectedGame.thumbnail} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-lg leading-none uppercase tracking-tight">{selectedGame.title}</h2>
                    <p className="text-[10px] text-arcade-accent uppercase font-black tracking-widest mt-1">Live Feed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => setIsIframeFullscreen(!isIframeFullscreen)} className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a href={selectedGame.iframeUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button 
                    onClick={() => { setSelectedGame(null); setIsIframeFullscreen(false); }}
                    className="p-2.5 bg-slate-800 hover:bg-rose-500 hover:text-white rounded-xl transition-all text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-black relative">
                <iframe src={selectedGame.iframeUrl} className="w-full h-full border-none" allow="autoplay; fullscreen; pointer-lock" title={selectedGame.title} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GameCard({ game, idx, onClick }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      onClick={onClick}
      className="group bento-card p-4 cursor-pointer hover:bg-slate-900 transform active:scale-95"
    >
      <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 relative">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40" />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-tight group-hover:text-arcade-accent transition-colors line-clamp-1">{game.title}</h3>
      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Indexed Node</p>
    </motion.div>
  );
}
