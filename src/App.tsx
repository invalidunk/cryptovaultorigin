import { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navigation from '@/components/Navigation';
import './i18n';

// Lazy load sections for better performance
const Home = lazy(() => import('@/sections/Home'));
const TextEncryption = lazy(() => import('@/sections/TextEncryption'));
const ImageEncryption = lazy(() => import('@/sections/ImageEncryption'));
const Hashing = lazy(() => import('@/sections/Hashing'));
const KeyGenerator = lazy(() => import('@/sections/KeyGenerator'));
const Documentation = lazy(() => import('@/sections/Documentation'));
const About = lazy(() => import('@/sections/About'));

// Loading fallback
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
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              © 2024 CryptoVault. All rights reserved.
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
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
          <p>
            All encryption is performed client-side. Your data never leaves your device.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default App;
