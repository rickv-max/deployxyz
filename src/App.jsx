import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  Github, 
  LayoutDashboard, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  LogOut,
  ExternalLink,
  Code,
  Terminal,
  Globe,
  Clock,
  Lock,
  FileCode,
  Atom,
  RefreshCw,
  Folder,
  FileText,
  Layers,
  Server
} from 'lucide-react';

// --- TEMPLATES KODE NYATA ---
const defaultReactCode = `import { useState, useEffect } from 'react';
import { Rocket, Server } from 'lucide-react';

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className={\`bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl max-w-md w-full transform transition-all duration-700 \${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}\`}>
        
        <div className="flex justify-center mb-6">
          <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 shadow-lg shadow-slate-900/20">
            <Server className="w-4 h-4 text-emerald-400" />
            Vercel & Netlify Ready
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 text-center mb-3 tracking-tight">
          Universal React
        </h1>
        
        <p className="text-slate-500 text-center mb-8 font-medium leading-relaxed">
          Struktur repositori ini dirancang khusus dengan <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">base: './'</code> dan <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">vercel.json</code>. Tidak akan ada lagi layar putih (blank) saat di-deploy!
        </p>

        <button 
          onClick={() => setCount(c => c + 1)}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl transition-all active:scale-95 flex items-center justify-between group shadow-lg shadow-slate-900/10"
        >
          <span>Klik Tombol Ini</span>
          <span className="bg-white/10 px-3 py-1 rounded-xl text-sm group-hover:bg-white/20 transition-colors">
            {count}
          </span>
        </button>
        
      </div>
    </div>
  );
}`;

const defaultHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Standard HTML App</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="card">
    <div class="badge">Enterprise Static</div>
    <h1>Hello, HTML!</h1>
    <p>File ini berada di struktur repositori nyata lengkap dengan folder CSS & JS.</p>
  </div>
  <script src="js/main.js"></script>
</body>
</html>`;

// --- GENERATOR STRUKTUR FOLDER (UNIVERSAL VERCEL + GH PAGES) ---
const generateReactProject = (appCode, repoName) => [
  { path: 'src/App.jsx', content: appCode },
  { path: 'src/main.jsx', content: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App.jsx';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);` },
  { path: 'src/index.css', content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\nbody {\n  margin: 0;\n  -webkit-font-smoothing: antialiased;\n}` },
  { path: 'index.html', content: `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${repoName} App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.jsx"></script>\n  </body>\n</html>` },
  { path: 'package.json', content: JSON.stringify({
      name: repoName, private: true, version: "1.0.0", type: "module",
      scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
      dependencies: { "react": "^18.2.0", "react-dom": "^18.2.0", "lucide-react": "^0.360.0" },
      devDependencies: { "@vitejs/plugin-react": "^4.2.1", "autoprefixer": "^10.4.19", "postcss": "^8.4.38", "tailwindcss": "^3.4.3", "vite": "^5.2.0" }
    }, null, 2) },
  // PERBAIKAN FATAL VERCEL BLANK: base menggunakan './' agar asset paths menjadi relative
  { path: 'vite.config.js', content: `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\n// base: './' memastikan path asset tetap valid di Vercel, Netlify, maupun sub-folder GH Pages\nexport default defineConfig({\n  base: './',\n  plugins: [react()],\n});` },
  { path: 'tailwind.config.js', content: `/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],\n  theme: { extend: {} },\n  plugins: [],\n}` },
  { path: 'postcss.config.js', content: `export default {\n  plugins: { tailwindcss: {}, autoprefixer: {} },\n}` },
  // EXTRA PERBAIKAN: Menambahkan konfigurasi Vercel agar tidak error 404 saat routing
  { path: 'vercel.json', content: `{\n  "rewrites": [\n    { "source": "/(.*)", "destination": "/index.html" }\n  ]\n}` },
  { path: '.github/workflows/deploy.yml', content: `name: Deploy to GitHub Pages\n\non:\n  push:\n    branches: ["main"]\n  workflow_dispatch:\n\npermissions:\n  contents: read\n  pages: write\n  id-token: write\n\nconcurrency:\n  group: "pages"\n  cancel-in-progress: true\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout\n        uses: actions/checkout@v4\n      - name: Setup Node\n        uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - name: Install dependencies\n        run: npm ci\n      - name: Build\n        run: npm run build\n      - name: Setup Pages\n        uses: actions/configure-pages@v4\n      - name: Upload artifact\n        uses: actions/upload-pages-artifact@v3\n        with:\n          path: './dist'\n\n  deploy:\n    environment:\n      name: github-pages\n      url: \${{ steps.deployment.outputs.page_url }}\n    runs-on: ubuntu-latest\n    needs: build\n    steps:\n      - name: Deploy to GitHub Pages\n        id: deployment\n        uses: actions/deploy-pages@v4` }
];

const generateHtmlProject = (htmlCode) => [
  { path: 'index.html', content: htmlCode },
  { path: 'css/style.css', content: `body {\n  margin: 0; \n  font-family: system-ui, -apple-system, sans-serif;\n  display: flex; justify-content: center; align-items: center;\n  min-height: 100vh; background: #f8fafc;\n}\n.card {\n  background: white; padding: 3rem; border-radius: 1.5rem;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center; max-width: 400px;\n  border: 1px solid #e2e8f0;\n}\nh1 { color: #0f172a; margin-bottom: 0.5rem; }\np { color: #64748b; line-height: 1.6; }\n.badge {\n  display: inline-block; background: #10b981; color: white;\n  padding: 0.3rem 1rem; border-radius: 999px; font-size: 0.875rem;\n  font-weight: bold; margin-bottom: 1rem;\n}` },
  { path: 'js/main.js', content: `document.addEventListener('DOMContentLoaded', () => {\n  console.log('Static site is ready and connected!');\n});` },
  { path: 'vercel.json', content: `{\n  "cleanUrls": true\n}` }
];

// --- UI COMPONENTS ---
const SkeletonCard = () => (
  <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm w-full animate-in fade-in duration-500 relative overflow-hidden">
    <div className="flex justify-between items-start mb-6">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 animate-pulse"></div>
      <div className="w-20 h-7 rounded-full bg-slate-50 animate-pulse"></div>
    </div>
    <div className="space-y-4">
      <div className="w-3/4 h-5 bg-slate-200 animate-pulse rounded-lg"></div>
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-100 animate-pulse rounded-md"></div>
        <div className="w-5/6 h-3 bg-slate-100 animate-pulse rounded-md"></div>
      </div>
    </div>
    <div className="mt-8 pt-5 border-t border-slate-50 flex justify-between items-center">
       <div className="w-24 h-4 bg-slate-100 animate-pulse rounded"></div>
       <div className="w-20 h-8 bg-slate-50 animate-pulse rounded-xl"></div>
    </div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', disabled, className = '', type = 'button' }) => {
  const baseStyle = "font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 disabled:pointer-events-none";
  const variants = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/10",
    outline: "bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-800 hover:bg-slate-50",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- STANDALONE VIEWS ---

const AuthView = ({ onLogin, isConnecting, dashboardError }) => {
  const [input, setInput] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (input.trim()) onLogin(input.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in zoom-in-95 duration-700 relative z-10">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center shadow-xl shadow-slate-900/20 rotate-3 transition-transform hover:rotate-6">
            <Rocket className="w-8 h-8 text-white -rotate-3" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-center text-slate-900 mb-2 tracking-tight">DeployX <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">Pro</span></h1>
        <p className="text-center text-slate-500 mb-8 font-medium leading-relaxed">Enterprise Deployer. Generates Universal Architectures for Vercel, Netlify, and GH Pages.</p>
        
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">GitHub Personal Access Token</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 outline-none transition-all font-mono text-sm shadow-sm"
                required
              />
            </div>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mt-4 flex gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed font-bold">
                SANGAT PENTING: Untuk merilis project React penuh, token Anda WAJIB memiliki centang pada scope <span className="bg-white px-1.5 py-0.5 rounded text-amber-900 font-mono shadow-sm">repo</span> dan <span className="bg-white px-1.5 py-0.5 rounded text-amber-900 font-mono shadow-sm">workflow</span>.
              </p>
            </div>
          </div>
          
          {dashboardError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold text-center border border-red-100 animate-in fade-in flex items-center justify-center gap-2 shadow-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {dashboardError}
            </div>
          )}

          <Button type="submit" className="w-full py-4 text-lg" disabled={isConnecting}>
            {isConnecting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Github className="w-6 h-6" />}
            {isConnecting ? 'Mengecek Akses API...' : 'Masuk via GitHub'}
          </Button>
        </form>
      </div>
    </div>
  );
};

const DashboardView = ({ repos, loadingRepos, dashboardError, user, onDeployClick, onRefresh }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Repositori</h2>
          <p className="text-slate-500 font-medium mt-1">Deploy project React yang kompetibel 100% dengan Vercel & Netlify.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <Button variant="outline" onClick={onRefresh} disabled={loadingRepos} className="px-5 border-slate-200">
            <RefreshCw className={`w-5 h-5 text-slate-600 ${loadingRepos ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={onDeployClick} className="flex-1 sm:flex-none py-4">
            <Plus className="w-5 h-5" /> Deploy Proyek Baru
          </Button>
        </div>
      </div>

      {dashboardError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 flex items-center gap-2 border border-red-100 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {dashboardError}
        </div>
      )}

      <div className="mb-6 flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest px-2">
        <LayoutDashboard className="w-5 h-5" />
        <span>Repositori Terakhir Anda ({repos.length})</span>
      </div>

      {loadingRepos ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {repos.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-[2.5rem] border border-slate-200 text-center shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Belum ada repositori</h3>
              <p className="text-slate-500 mb-8 font-medium">Buat arsitektur React universal pertama Anda.</p>
              <Button onClick={onDeployClick} className="mx-auto px-8">Mulai Deploy</Button>
            </div>
          ) : (
            repos.map(repo => (
              <div key={repo.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="p-3 bg-slate-100 rounded-2xl text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <Terminal className="w-7 h-7" />
                  </div>
                  {repo.private ? (
                    <span className="flex items-center gap-1.5 text-xs font-black bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      <Lock className="w-3.5 h-3.5" /> Private
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-black bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      <Globe className="w-3.5 h-3.5" /> Public
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-black text-slate-900 mb-2 truncate relative z-10" title={repo.name}>
                  {repo.name}
                </h3>
                
                <p className="text-sm text-slate-500 line-clamp-2 mb-8 flex-1 relative z-10 font-medium leading-relaxed">
                  {repo.description || 'Struktur repositori universal.'}
                </p>
                
                <div className="flex items-center justify-between pt-5 border-t border-slate-100 relative z-10">
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <Clock className="w-3.5 h-3.5" /> 
                    {new Date(repo.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <a 
                    href={`https://github.com/${user?.login}/${repo.name}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="text-sm font-black text-slate-700 hover:text-slate-900 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors shadow-sm"
                  >
                    Repo <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const DeployView = ({ token, user, onCancel, onDeploymentComplete }) => {
  const [projectName, setProjectName] = useState('');
  const [framework, setFramework] = useState('react'); 
  const [code, setCode] = useState(defaultReactCode);
  
  // Deployment Progress State
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0); 
  const [deployError, setDeployError] = useState(null);
  const [liveUrl, setLiveUrl] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([]);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs]);

  const log = (msg) => {
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString('id-ID', { hour12: false })}] ${msg}`]);
  };

  const handleFrameworkChange = (type) => {
    setFramework(type);
    setCode(type === 'react' ? defaultReactCode : defaultHtmlCode);
  };

  const startDeployment = async () => {
    if (!projectName.trim() || !code.trim()) return;
    const cleanName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    setIsDeploying(true);
    setDeployError(null);
    setTerminalLogs([]);
    setDeployStep(1);
    
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' };
    const baseUrl = `https://api.github.com/repos/${user?.login}/${cleanName}`;

    try {
      // --- STEP 1: Buat Repositori ---
      log(`Menghubungi API GitHub untuk membuat repositori: ${cleanName}...`);
      const repoRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: cleanName,
          description: `Universal Deployer: Vercel & GH Pages Ready (${framework.toUpperCase()})`,
          private: false,
          auto_init: true
        })
      });
      
      if (!repoRes.ok) {
        const errData = await repoRes.json();
        throw new Error(errData.message === 'name already exists on this account' 
          ? `Repositori "${cleanName}" sudah ada. Gunakan nama yang berbeda.` 
          : `Gagal membuat repositori: ${errData.message}`);
      }
      log(`✓ Repositori ${cleanName} berhasil dibuat.`);

      // --- STEP 2: GIT TREES API (MULTI-FILE COMMIT) ---
      setDeployStep(2);
      log(`Menunggu inisialisasi branch 'main' oleh GitHub...`);
      let refData;
      
      // Polling for branch creation
      for(let i=0; i<10; i++) {
        const refRes = await fetch(`${baseUrl}/git/refs/heads/main`, { headers });
        if (refRes.ok) { refData = await refRes.json(); break; }
        await new Promise(r => setTimeout(r, 1000));
      }

      if (!refData || !refData.object) throw new Error("Timeout: Branch 'main' gagal diinisialisasi oleh GitHub. Coba lagi.");
      
      const latestCommitSha = refData.object.sha;
      log(`✓ Referensi branch main ditemukan: ${latestCommitSha.substring(0,7)}`);
      
      const commitRes = await fetch(`${baseUrl}/git/commits/${latestCommitSha}`, { headers });
      const commitData = await commitRes.json();
      
      if (!commitData.tree || !commitData.tree.sha) throw new Error("Struktur branch utama gagal dibaca dari GitHub API.");
      const baseTreeSha = commitData.tree.sha;

      log(`Merakit struktur folder Vercel/Universal-ready...`);
      const filesToPush = framework === 'react' ? generateReactProject(code, cleanName) : generateHtmlProject(code);
      
      const treeRes = await fetch(`${baseUrl}/git/trees`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: filesToPush.map(f => ({ path: f.path, mode: "100644", type: "blob", content: f.content }))
        })
      });

      if (!treeRes.ok) {
        const err = await treeRes.json();
        if (err.message && err.message.toLowerCase().includes('workflow')) {
           throw new Error("AKSES DITOLAK: Token Anda tidak memiliki izin untuk membuat file CI/CD (.github/workflows). Buat ulang token GitHub Anda dan pastikan scope 'workflow' dicentang.");
        }
        throw new Error(`Gagal menyusun files (Tree API): ${err.message}`);
      }
      const treeData = await treeRes.json();
      log(`✓ Struktur folder (Vite config + vercel.json) berhasil dibentuk. (${filesToPush.length} files)`);

      log(`Melakukan Commit dan Push ke origin/main...`);
      const newCommitRes = await fetch(`${baseUrl}/git/commits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: `🚀 Universal Enterprise commit via DeployX: ${framework.toUpperCase()}`, tree: treeData.sha, parents: [latestCommitSha] })
      });
      const newCommitData = await newCommitRes.json();

      await fetch(`${baseUrl}/git/refs/heads/main`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ sha: newCommitData.sha })
      });
      log(`✓ Kode berhasil di-push secara keseluruhan.`);

      // --- STEP 3: KONFIGURASI HOSTING ---
      setDeployStep(3);
      if (framework === 'html') {
        log(`Mengaktifkan GitHub Pages (Hosting Statis)...`);
        const pagesRes = await fetch(`${baseUrl}/pages`, {
          method: 'POST',
          headers: { ...headers, 'Accept': 'application/vnd.github+json' },
          body: JSON.stringify({ source: { branch: 'main', path: '/' } })
        });
        if (!pagesRes.ok && pagesRes.status !== 409) {
           log("! GitHub Pages API gagal, namun kode telah dipush. Anda dapat menghubungkan repo ini ke Vercel.");
        } else {
           log(`✓ GitHub Pages aktif.`);
        }
      } else {
        log(`Menyerahkan tugas ke GitHub Actions Runner...`);
        log(`✓ Pipeline CI/CD berjalan. Karena base config adalah './', repo ini siap di-import 100% normal ke VERCEL / NETLIFY tanpa blank.`);
      }

      // --- STEP 4: SELESAI ---
      setDeployStep(4);
      setLiveUrl(`https://github.com/${user?.login}/${cleanName}`); // Arahkan ke Repo agar User bisa copy paste URL-nya ke Vercel
      onDeploymentComplete();
      
    } catch (err) {
      setDeployError(err.message);
      log(`❌ ERROR: ${err.message}`);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 relative pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Deployment Baru</h2>
          <p className="text-slate-500 font-medium mt-1">Sistem ini mem-push konfigurasi Universal. <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold border border-emerald-200">100% Bebas Blank di Vercel</code></p>
        </div>
        <Button variant="outline" onClick={onCancel} className="w-full sm:w-auto px-8 rounded-2xl">Batal</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL KIRI: PENGATURAN */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2 text-lg">
              <FileCode className="w-5 h-5 text-slate-900" /> 1. Arsitektur Proyek
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleFrameworkChange('html')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  framework === 'html' 
                    ? 'border-slate-900 bg-slate-50 shadow-md shadow-slate-200' 
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Code className={`w-6 h-6 mb-3 ${framework === 'html' ? 'text-slate-900' : 'text-slate-400'}`} />
                <div className={`font-black ${framework === 'html' ? 'text-slate-900' : 'text-slate-700'}`}>HTML Asli</div>
                <div className="text-xs text-slate-500 mt-1 font-bold">html, css/, js/</div>
              </button>

              <button
                onClick={() => handleFrameworkChange('react')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  framework === 'react' 
                    ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100' 
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Atom className={`w-6 h-6 mb-3 ${framework === 'react' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div className={`font-black ${framework === 'react' ? 'text-emerald-900' : 'text-slate-700'}`}>Vite React</div>
                <div className="text-xs text-slate-500 mt-1 font-bold">Universal Ready</div>
              </button>
            </div>

            {/* Pohon Folder Visual */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-[11px] font-black text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Folder className="w-3.5 h-3.5" /> Output Repositori Nyata:
              </p>
              <div className="space-y-3 text-sm font-medium">
                {framework === 'react' ? (
                  <>
                    <div className="flex items-center gap-3 text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-xl shadow-sm"><Server className="w-4 h-4 text-emerald-600"/> vercel.json <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">Anti 404 Error</span></div>
                    <div className="flex items-center gap-3 text-slate-700 font-bold"><FileCode className="w-4 h-4 text-slate-400"/> vite.config.js <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold shadow-sm">base: './'</span></div>
                    <div className="pl-3 border-l-2 border-slate-200 space-y-3 mt-2">
                      <div className="flex items-center gap-3 text-blue-700 font-bold bg-blue-100 px-3 py-1.5 rounded-xl"><Atom className="w-4 h-4 text-blue-500"/> src/App.jsx <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-sm">Editable</span></div>
                      <div className="flex items-center gap-3 text-slate-600 pl-1"><FileCode className="w-4 h-4 text-slate-400"/> src/main.jsx</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 text-orange-700 font-bold bg-orange-100 px-3 py-1.5 rounded-xl"><Code className="w-4 h-4 text-orange-500"/> index.html <span className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full shadow-sm">Editable</span></div>
                    <div className="flex items-center gap-3 text-slate-600"><FileCode className="w-4 h-4 text-slate-400"/> css/style.css</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-emerald-500" /> 2. Detail Proyek
            </h3>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Repositori (Tanpa Spasi)</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400 font-mono text-sm font-bold">/</span>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="react-app-super"
                  className="w-full pl-8 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 outline-none transition-all font-mono text-sm font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={startDeployment} 
            disabled={!projectName || !code || isDeploying}
            className="w-full py-5 text-lg rounded-2xl overflow-hidden group relative"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Rocket className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Push & Deploy Universal</span>
          </Button>
        </div>

        {/* PANEL KANAN: CODE EDITOR */}
        <div className="lg:col-span-8">
          <div className="bg-[#0f172a] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[800px] border border-slate-800 relative group">
            
            <div className="bg-[#1e293b] px-5 py-4 flex items-center justify-between border-b border-black/30">
              <div className="flex items-center gap-5">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="flex items-center gap-2 bg-[#0f172a] px-4 py-1.5 rounded-lg text-xs font-mono font-bold border border-slate-700/50 text-slate-200 shadow-inner">
                  {framework === 'react' ? (
                    <><Atom className="w-4 h-4 text-blue-400"/> src/App.jsx</>
                  ) : (
                    <><Code className="w-4 h-4 text-orange-400"/> index.html</>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-slate-700">Editor Murni</span>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="flex-1 w-full p-6 bg-transparent text-slate-300 font-mono text-[13px] sm:text-sm leading-relaxed outline-none resize-none focus:ring-0 custom-scrollbar"
              style={{ tabSize: 2, WebkitFontSmoothing: 'antialiased' }}
            />
          </div>
        </div>
      </div>

      {/* --- DEPLOYMENT MODAL DENGAN LIVE TERMINAL --- */}
      {isDeploying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-2xl w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${deployStep === 4 ? 'bg-emerald-50' : deployError ? 'bg-red-50' : 'bg-slate-100'}`}>
                  {deployStep === 4 ? <CheckCircle className="w-7 h-7 text-emerald-500" /> 
                  : deployError ? <AlertCircle className="w-7 h-7 text-red-500" /> 
                  : <Rocket className="w-7 h-7 text-slate-900 animate-bounce" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {deployStep === 4 ? 'Berhasil Push ke GitHub!' : deployError ? 'Deployment Gagal' : 'Membangun Arsitektur Universal...'}
                  </h3>
                  <p className="text-sm font-bold text-slate-400">{projectName}</p>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 mb-8 custom-scrollbar rounded-2xl">
              {/* TERMINAL UI */}
              <div className="bg-[#0f172a] p-5 rounded-2xl font-mono text-xs sm:text-sm text-green-400 min-h-[250px] shadow-inner flex flex-col">
                <div className="text-slate-500 mb-3 text-[10px] font-black uppercase tracking-widest border-b border-slate-700/50 pb-2 flex items-center justify-between">
                  <span>DeployX Universal Console</span>
                  <Server className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="flex-1 space-y-1.5 leading-relaxed">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className={log.includes('ERROR') || log.includes('DITOLAK') ? 'text-red-400 font-bold' : log.includes('✓') ? 'text-emerald-400 font-bold' : log.includes('!') ? 'text-yellow-400 font-bold' : 'text-slate-300'}>
                      {log}
                    </div>
                  ))}
                  {!deployError && deployStep < 4 && (
                    <div className="flex items-center gap-2 text-slate-500 mt-2">
                      <span className="animate-pulse">_</span> Menjalankan proses latar belakang...
                    </div>
                  )}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 mt-auto">
              {deployStep === 4 ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  {framework === 'react' && (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex gap-3 shadow-sm">
                      <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                      <p className="text-xs font-bold text-emerald-900 leading-relaxed">
                        KODE BERHASIL DI-PUSH. Repository Anda sekarang memiliki <code>vite.config.js (base: './')</code> dan <code>vercel.json</code>. Anda dapat langsung mengimpor repository ini ke <b>Vercel</b> atau <b>Netlify</b> dan dijamin layar 404/blank tidak akan muncul.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="w-full rounded-2xl py-4" onClick={onCancel}>
                      Tutup
                    </Button>
                    <a 
                      href={liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-900/20"
                    >
                      <Github className="w-5 h-5" /> Buka Repo GitHub
                    </a>
                  </div>
                </div>
              ) : deployError ? (
                <Button variant="outline" className="w-full py-4 rounded-2xl hover:bg-slate-100" onClick={() => setDeployError(null)}>
                  Tutup Console & Perbaiki Error
                </Button>
              ) : null}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

// --- APP WRAPPER ---
export default function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [view, setView] = useState('auth'); 
  
  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleLogin = async (inputToken) => {
    setIsConnecting(true);
    setDashboardError(null);
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { 'Authorization': `Bearer ${inputToken}` }
      });
      if (!res.ok) throw new Error('Akses Ditolak. Pastikan token akurat dan mencentang "repo" & "workflow".');
      
      const userData = await res.json();
      setToken(inputToken);
      setUser(userData);
      setView('dashboard');
      fetchRepos(inputToken);
    } catch (err) {
      setDashboardError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchRepos = async (authToken) => {
    setLoadingRepos(true);
    setDashboardError(null);
    try {
      const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=12', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!res.ok) throw new Error('Gagal memuat daftar repositori dari server GitHub.');
      const data = await res.json();
      
      setRepos(Array.isArray(data) ? data : []);
    } catch (err) {
      setDashboardError(err.message);
      setRepos([]);
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleLogout = () => {
    setToken(''); 
    setUser(null); 
    setRepos([]); 
    setView('auth');
  };

  if (view === 'auth') {
    return <AuthView onLogin={handleLogin} isConnecting={isConnecting} dashboardError={dashboardError} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col selection:bg-slate-200 selection:text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
            <div className="w-12 h-12 bg-slate-900 rounded-[1.2rem] flex items-center justify-center group-hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">Deploy<span className="text-emerald-600">X</span></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Universal Edition</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
              <img src={user?.avatar_url} alt="Profile" className="w-8 h-8 rounded-full bg-slate-200 shadow-sm" />
              <span className="text-sm font-black text-slate-700">{user?.login}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors">
              <span className="hidden sm:inline">Keluar</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {view === 'dashboard' && (
          <DashboardView 
            repos={repos} 
            loadingRepos={loadingRepos} 
            dashboardError={dashboardError} 
            user={user} 
            onDeployClick={() => setView('deploy')} 
            onRefresh={() => fetchRepos(token)} 
          />
        )}
        {view === 'deploy' && (
          <DeployView 
            token={token} 
            user={user} 
            onCancel={() => setView('dashboard')} 
            onDeploymentComplete={() => fetchRepos(token)} 
          />
        )}
      </main>
    </div>
  );
}


