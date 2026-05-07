
import allGamesData from './games.json';

const appContainer = document.getElementById('app');
const modal = document.getElementById('game-modal');
const modalContent = document.getElementById('modal-content');
const modalIframe = document.getElementById('game-iframe');
const modalTitle = document.getElementById('modal-game-title');
const modalIcon = document.getElementById('modal-game-icon');
const closeModalBtn = document.getElementById('close-modal');

let allGames = allGamesData;
let searchQuery = '';
let isCloaked = localStorage.getItem('isCloaked') === 'true';

// Cloak Metadata
const ORIGINAL_TITLE = document.title;
const ORIGINAL_FAVICON = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1470&auto=format&fit=crop"; // Placeholder for original
const CLOAK_TITLE = "Dashboard";
const CLOAK_FAVICON = "https://du11hjcvx0wq0.cloudfront.net/images/favicon.ico";

function updateCloak() {
  if (isCloaked) {
    document.title = CLOAK_TITLE;
    setFavicon(CLOAK_FAVICON);
    document.body.classList.add('cloaked');
  } else {
    document.title = ORIGINAL_TITLE;
    setFavicon(ORIGINAL_FAVICON);
    document.body.classList.remove('cloaked');
  }
}

function setFavicon(url) {
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = url;
}

// Load Games Data
async function init() {
  updateCloak();
  renderApp();
}

function renderApp() {
  const filteredGames = allGames.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasGames = allGames.length > 0;
  const featuredGame = hasGames ? allGames[0] : null;
  const trendingGames = hasGames ? allGames.slice(1, 4) : [];

  appContainer.innerHTML = `
    <!-- Header -->
    <header class="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-2xl p-4 h-16 backdrop-blur-xl">
      <div class="flex items-center gap-3">
        <button id="cloak-btn" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 mr-2 border border-slate-700" title="Cloak Site">
          <i data-lucide="eye-off" class="w-4 h-4"></i>
        </button>
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
          <i data-lucide="gamepad-2" class="w-5 h-5 text-white"></i>
        </div>
        <h1 class="text-xl font-black tracking-tighter uppercase whitespace-nowrap font-display">MRWEBS<span class="text-indigo-600">GAMES</span></h1>
      </div>
      
      <div class="flex-1 max-w-md px-4 sm:px-8">
        <div class="relative group">
          <input 
            type="text" 
            id="search-input"
            placeholder="Search unblocked library..." 
            value="${searchQuery}"
            class="w-full bg-slate-950 border border-slate-800 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-600 transition-colors text-white"
          />
          <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"></i>
        </div>
      </div>

      <div class="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <span class="hidden sm:flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> 1,284 Online</span>
        <button class="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-slate-800">Status</button>
      </div>
    </header>

    <main class="flex-1">
      ${!hasGames && !searchQuery ? renderEmptyState() : (searchQuery ? renderSearchMode(filteredGames) : renderBentoMode(featuredGame, trendingGames))}
    </main>

    ${hasGames && !searchQuery ? `
      <section class="mt-8 pb-12">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-xl font-black uppercase flex items-center gap-3 font-display">
            <span class="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
            Full Archive
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          ${allGames.map((game, idx) => renderGameCard(game, idx)).join('')}
        </div>
      </section>
    ` : ''}

    <footer class="h-12 border-t border-slate-800 flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mt-auto">
      <div>NOVA GAMES ENTERPRISE // VAULT_ACCESS</div>
      <div class="hidden sm:flex items-center gap-6">
        <span>${new Date().toLocaleTimeString()}</span>
        <span class="text-indigo-600 animate-pulse">CONNECTION: SECURE</span>
      </div>
    </footer>
  `;

  // Initialize icons
  lucide.createIcons();

  // Add event listeners
  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderApp();
    document.getElementById('search-input').focus();
    // Move cursor to end
    const val = document.getElementById('search-input').value;
    document.getElementById('search-input').value = '';
    document.getElementById('search-input').value = val;
  });

  const cloakBtn = document.getElementById('cloak-btn');
  if (cloakBtn) {
    cloakBtn.addEventListener('click', () => {
      isCloaked = !isCloaked;
      localStorage.setItem('isCloaked', isCloaked);
      updateCloak();
    });
  }

  document.querySelectorAll('[data-game-id]').forEach(el => {
    el.addEventListener('click', () => {
      const gameId = el.getAttribute('data-game-id');
      const game = allGames.find(g => g.id === gameId);
      openGame(game);
    });
  });
}

function renderBentoMode(featured, trending) {
  return `
    <div class="grid grid-cols-12 grid-rows-none lg:grid-rows-6 gap-6 h-full min-h-[800px]">
      <!-- Featured -->
      <div 
        data-game-id="${featured.id}"
        class="col-span-12 lg:col-span-8 lg:row-span-4 relative group bento-card-base cursor-pointer"
      >
        <div class="absolute inset-0 z-0">
          <img src="${featured.thumbnail}" class="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        </div>
        <div class="absolute bottom-0 left-0 p-8 z-20 w-full text-left">
          <span class="bg-indigo-600 text-[10px] font-bold px-2 py-1 rounded mb-3 inline-block uppercase animate-pulse">Featured Vault Entry</span>
          <h2 class="text-4xl md:text-5xl font-black mb-2 uppercase font-display">${featured.title}</h2>
          <p class="text-slate-300 text-sm max-w-md mb-6 leading-relaxed">${featured.description}</p>
          <button class="bg-white text-black font-extrabold px-8 py-3 rounded-full flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all transform active:scale-95">
            <i data-lucide="play" class="w-5 h-5 fill-current"></i>
            Launch Game
          </button>
        </div>
      </div>

      <!-- Trending -->
      <div class="col-span-12 lg:col-span-4 lg:row-span-3 bento-card-base bg-slate-900/50 p-6">
        <h3 class="text-sm font-bold uppercase text-slate-500 mb-6 flex items-center justify-between">
          Trending Recently
          <i data-lucide="trending-up" class="w-4 h-4 text-indigo-600"></i>
        </h3>
        <div class="space-y-4 text-left">
          ${trending.map(game => `
            <div 
              data-game-id="${game.id}"
              class="flex items-center gap-4 p-3 rounded-2xl bg-slate-950/50 border border-slate-800 cursor-pointer hover:border-indigo-600/50 hover:bg-slate-950 transition-all group"
            >
              <div class="w-14 h-14 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all flex-shrink-0">
                <img src="${game.thumbnail}" class="w-full h-full object-cover" />
              </div>
              <div class="overflow-hidden">
                <div class="text-sm font-bold group-hover:text-indigo-600 transition-colors truncate">${game.title}</div>
                <div class="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Ready to Play</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Stats -->
      <div class="col-span-6 lg:col-span-2 lg:row-span-3 bg-indigo-600 rounded-3xl p-6 flex flex-col justify-between text-white overflow-hidden relative">
        <div class="text-xs font-bold uppercase opacity-80 z-10">Vault Capacity</div>
        <div class="text-5xl font-black z-10">${allGames.length * 12}k</div>
        <div class="text-[10px] leading-tight opacity-70 font-medium z-10">Optimized index serving 800+ nodes globally.</div>
      </div>

      <!-- Tags -->
      <div class="col-span-6 lg:col-span-2 lg:row-span-3 bento-card-base p-6 flex flex-col">
        <div class="text-xs font-bold uppercase text-slate-500 mb-6">Archive Tags</div>
        <div class="flex flex-wrap gap-2">
          ${['Action', 'Retro', 'IO', 'Puzzle', 'Sport', 'WebGL'].map(tag => `
            <span class="text-[10px] bg-slate-800 border border-slate-800 px-2.5 py-1.5 rounded-lg hover:border-indigo-600 transition-colors cursor-default whitespace-nowrap">
              ${tag}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- System -->
      <div class="col-span-12 lg:col-span-8 lg:row-span-2 bento-card-base bg-slate-900/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex flex-wrap gap-8">
          <div>
            <div class="text-[10px] font-bold text-slate-500 uppercase mb-2 text-left">Proxy Engine</div>
            <div class="flex items-center gap-2 font-mono text-xs text-emerald-400">
              <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              nova-core v4.0 (Stable)
            </div>
          </div>
          <div>
            <div class="text-[10px] font-bold text-slate-500 uppercase mb-2 text-left">Network Health</div>
            <div class="flex items-center gap-2 font-mono text-xs text-indigo-400 font-bold uppercase">
              99.8% Latency Score
            </div>
          </div>
        </div>
        <div class="flex -space-x-3">
          <div class="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-700 flex items-center justify-center text-[10px] font-bold">+12</div>
          <div class="w-10 h-10 rounded-full border-2 border-slate-950 bg-indigo-600 flex items-center justify-center text-[10px] font-bold">JD</div>
          <div class="w-10 h-10 rounded-full border-2 border-slate-950 bg-rose-500 flex items-center justify-center text-[10px] font-bold">KA</div>
          <div class="w-10 h-10 rounded-full border-2 border-slate-950 bg-emerald-500 flex items-center justify-center text-[10px] font-bold">SK</div>
        </div>
      </div>
    </div>
  `;
}

function renderSearchMode(games) {
  return `
    <section>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl flex items-center gap-3 font-display">
          <i data-lucide="search" class="text-indigo-600"></i>
          Results for "${searchQuery}"
        </h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${games.map((game, idx) => renderGameCard(game, idx)).join('')}
      </div>
      ${games.length === 0 ? `
        <div class="py-20 text-center bento-card-base w-full">
          <i data-lucide="search" class="w-16 h-16 text-slate-800 mx-auto mb-4"></i>
          <p class="text-slate-500">No matches found in the vault.</p>
        </div>
      ` : ''}
    </section>
  `;
}

function renderGameCard(game, idx) {
  return `
    <div
      data-game-id="${game.id}"
      class="group bento-card-base p-4 cursor-pointer hover:bg-slate-800 transform active:scale-95"
    >
      <div class="aspect-[16/10] rounded-2xl overflow-hidden mb-4 relative">
        <img 
          src="${game.thumbnail}" 
          alt="${game.title}" 
          class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40"></div>
      </div>
      <h3 class="text-sm font-bold uppercase tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1 text-left font-display">${game.title}</h3>
      <p class="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1 text-left">Indexed Node</p>
    </div>
  `;
}

function renderEmptyState() {
  return `
    <div class="flex flex-col items-center justify-center py-32 bento-card-base bg-slate-900/20 text-center px-6">
      <i data-lucide="box" class="w-16 h-16 text-slate-800 mb-6"></i>
      <h2 class="text-3xl font-black uppercase font-display mb-2">Vault is Empty</h2>
      <p class="text-slate-500 max-w-sm">No games are currently indexed in the Nova database. Add game entries to the central repository to populate this vault.</p>
    </div>
  `;
}

function openGame(game) {
  modalTitle.textContent = game.title;
  modalIcon.innerHTML = `<img src="${game.thumbnail}" class="w-full h-full object-cover">`;
  modalIframe.src = game.iframeUrl;
  
  modal.classList.remove('hidden');
  setTimeout(() => {
    modalContent.classList.remove('scale-95', 'opacity-0');
    modalContent.classList.add('scale-100', 'opacity-100');
  }, 10);
}

function closeGame() {
  modalContent.classList.remove('scale-100', 'opacity-100');
  modalContent.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    modal.classList.add('hidden');
    modalIframe.src = '';
  }, 300);
}

closeModalBtn.addEventListener('click', closeGame);
document.getElementById('modal-backdrop').addEventListener('click', closeGame);

// Cloak Overlay Listener
document.getElementById('cloak-overlay').addEventListener('click', () => {
  isCloaked = false;
  localStorage.setItem('isCloaked', false);
  updateCloak();
});

// Keyboard Shortcut (Alt + C)
window.addEventListener('keydown', (e) => {
  if (e.altKey && e.key.toLowerCase() === 'c') {
    isCloaked = !isCloaked;
    localStorage.setItem('isCloaked', isCloaked);
    updateCloak();
  }
});

// Initializer
init();
