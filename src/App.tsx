import { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/Navigation';
import { useTranslation } from 'react-i18next';
import './i18n';

const Home = lazy(() => import('@/sections/Home'));
const TextEncryption = lazy(() => import('@/sections/TextEncryption'));
const ImageEncryption = lazy(() => import('@/sections/ImageEncryption'));
const Hashing = lazy(() => import('@/sections/Hashing'));
const KeyGenerator = lazy(() => import('@/sections/KeyGenerator'));
const Documentation = lazy(() => import('@/sections/Documentation'));
const About = lazy(() => import('@/sections/About'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-6 max-w-6xl">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/text" element={<TextEncryption />} />
              <Route path="/image" element={<ImageEncryption />} />
              <Route path="/hash" element={<Hashing />} />
              <Route path="/keys" element={<KeyGenerator />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster position="top-right" richColors />
      </div>
    </Router>
  );
}

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              © 2024 CryptoVault. {t('footer.rightsReserved')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              {t('footer.privacyPolicy')}
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              {t('footer.termsOfService')}
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>{t('footer.clientSideNotice')}</p>
        </div>
      </div>
    </footer>
  );
}

export default App;
