import { Download, FileArchive, FileCode, Github, Check } from 'lucide-react';
import { stat } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-static';

async function getFileSize(filePath: string): Promise<number> {
  try {
    const s = await stat(filePath);
    return s.size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default async function DownloadPage() {
  const publicDir = path.join(process.cwd(), 'public', 'downloads');
  const tarPath = path.join(publicDir, 'brazil-fiscal-dashboard-src.tar.gz');
  const zipPath = path.join(publicDir, 'brazil-fiscal-dashboard-src.zip');

  const [tarSize, zipSize] = await Promise.all([
    getFileSize(tarPath),
    getFileSize(zipPath),
  ]);

  const gitCommands = `# 1. Baixe e extraia o arquivo .zip
# 2. No terminal, dentro da pasta extraída:

git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main

# Para rodar o projeto localmente:
bun install    # ou: npm install
bun run dev    # ou: npm run dev
# Abra http://localhost:3000`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500 text-white mb-4 shadow-lg">
            <Download className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Brazil Fiscal Intelligence
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Baixe o código-fonte completo do projeto
          </p>
        </header>

        {/* Download cards */}
        <section className="space-y-4 mb-10">
          {/* ZIP - recommended */}
          <a
            href="/downloads/brazil-fiscal-dashboard-src.zip"
            download
            className="block group"
          >
            <div className="border-2 border-emerald-500 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <FileArchive className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Baixar .ZIP
                    </h2>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Recomendado p/ Windows
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    brazil-fiscal-dashboard-src.zip
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {formatBytes(zipSize)} • 148 arquivos • Código-fonte completo
                  </p>
                </div>
                <Download className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:translate-y-0.5 transition-transform flex-shrink-0" />
              </div>
            </div>
          </a>

          {/* TAR.GZ */}
          <a
            href="/downloads/brazil-fiscal-dashboard-src.tar.gz"
            download
            className="block group"
          >
            <div className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:-translate-y-0.5">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  <FileCode className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Baixar .TAR.GZ
                    </h2>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      Linux / Mac
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    brazil-fiscal-dashboard-src.tar.gz
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {formatBytes(tarSize)} • 148 arquivos • Mesmo conteúdo
                  </p>
                </div>
                <Download className="w-6 h-6 text-slate-500 dark:text-slate-400 group-hover:translate-y-0.5 transition-transform flex-shrink-0" />
              </div>
            </div>
          </a>
        </section>

        {/* What's inside */}
        <section className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            O que tem dentro do pacote
          </h3>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span><strong>README.md</strong> — documentação completa</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span><strong>.gitignore</strong> e <strong>.env.example</strong> já configurados</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span><strong>src/app/</strong> — 8 páginas: home, receitas, despesas, investimentos, municípios, simulador, calculadora, glossário + APIs</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span><strong>src/components/</strong> — 47 componentes shadcn/ui + 17 do dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span><strong>src/lib/</strong> — brazil-data.ts, db.ts, utils.ts, api-client.ts</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span><strong>prisma/schema.prisma</strong>, <strong>package.json</strong>, <strong>next.config.ts</strong>, etc.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>Stack: <strong>Next.js 16</strong>, TypeScript, Tailwind CSS 4, shadcn/ui, Prisma</span>
            </li>
          </ul>
        </section>

        {/* GitHub instructions */}
        <section className="bg-slate-900 dark:bg-black rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <Github className="w-5 h-5" />
            Como subir para o seu GitHub
          </h3>
          <pre className="text-xs sm:text-sm text-emerald-400 font-mono overflow-x-auto leading-relaxed">{gitCommands}</pre>
        </section>

        {/* Footer note */}
        <footer className="text-center text-xs text-slate-400 dark:text-slate-600 pb-8">
          <p>Brazil Fiscal Intelligence Dashboard • Next.js 16 • TypeScript</p>
        </footer>
      </div>
    </main>
  );
}
