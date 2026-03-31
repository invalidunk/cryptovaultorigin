import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import {
  Shield,
  Lock,
  Hash,
  Key,
  FileText,
  Image as ImageIcon,
  Info,
  Menu,
  Globe,
  ChevronDown,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { availableLanguages, changeLanguage, getCurrentLanguage } from '@/i18n';
import { useAppT } from '@/lib/i18n';

const navItems = [
  { path: '/', label: 'nav.home', icon: Shield },
  { path: '/text', label: 'nav.textEncryption', icon: Lock },
  { path: '/image', label: 'nav.imageEncryption', icon: ImageIcon },
  { path: '/hash', label: 'nav.hashing', icon: Hash },
  { path: '/keys', label: 'nav.keyGenerator', icon: Key },
  { path: '/docs', label: 'nav.documentation', icon: FileText },
  { path: '/about', label: 'nav.about', icon: Info },
];

export default function Navigation() {
  const { t } = useTranslation();
  const { tr } = useAppT();
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = getCurrentLanguage();

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
  };

  const currentLanguage =
    availableLanguages.find((lang) => lang.code === currentLang) || availableLanguages[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <NavLink to="/" className="flex items-center gap-2 mr-6">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg hidden sm:inline">{t('app.name')}</span>
        </NavLink>

        <nav className="hidden md:flex items-center space-x-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{t(item.label)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{currentLanguage.flag}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableLanguages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="flex items-center gap-2"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-2 px-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">{t('app.name')}</span>
                </div>

                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }: { isActive: boolean }) =>
                        `flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{t(item.label)}</span>
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-auto pt-4 border-t">
                  <div className="flex items-center gap-2 px-3">
                    <span className="text-sm text-muted-foreground">
                      {tr('common.language', 'Language')}:
                    </span>
                    <div className="flex gap-1">
                      {availableLanguages.map((lang) => (
                        <Button
                          key={lang.code}
                          variant={currentLang === lang.code ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => handleLanguageChange(lang.code)}
                        >
                          {lang.flag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
