import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Lock, 
  Hash, 
  Key, 
  Heart,
  Github,
  Globe,
  Server,
  Code,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const supportedAlgorithms = [
  { name: 'AES-256-GCM', type: 'Symmetric', security: 'High' },
  { name: 'AES-256-CBC', type: 'Symmetric', security: 'High' },
  { name: 'AES-256-CTR', type: 'Symmetric', security: 'High' },
  { name: 'DES', type: 'Symmetric', security: 'Deprecated' },
  { name: '3DES', type: 'Symmetric', security: 'Low' },
  { name: 'Blowfish', type: 'Symmetric', security: 'Medium' },
  { name: 'RC4', type: 'Stream', security: 'Deprecated' },
  { name: 'Rabbit', type: 'Stream', security: 'Medium' },
  { name: 'RSA-2048', type: 'Asymmetric', security: 'High' },
  { name: 'RSA-3072', type: 'Asymmetric', security: 'High' },
  { name: 'RSA-4096', type: 'Asymmetric', security: 'High' },
  { name: 'ECC-secp256r1', type: 'Asymmetric', security: 'High' },
  { name: 'ECC-secp384r1', type: 'Asymmetric', security: 'High' },
  { name: 'MD5', type: 'Hash', security: 'Deprecated' },
  { name: 'SHA-1', type: 'Hash', security: 'Deprecated' },
  { name: 'SHA-256', type: 'Hash', security: 'High' },
  { name: 'SHA-512', type: 'Hash', security: 'High' },
  { name: 'SHA-3', type: 'Hash', security: 'High' },
  { name: 'RIPEMD-160', type: 'Hash', security: 'Medium' },
];

const features = [
  {
    icon: Lock,
    title: 'Text Encryption',
    description: 'Encrypt and decrypt text using industry-standard algorithms',
  },
  {
    icon: Shield,
    title: 'Image Encryption',
    description: 'Secure your images with strong encryption methods',
  },
  {
    icon: Hash,
    title: 'Data Hashing',
    description: 'Generate hash values for data integrity verification',
  },
  {
    icon: Key,
    title: 'Key Generation',
    description: 'Generate RSA and ECC key pairs for asymmetric encryption',
  },
];

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{t('about.title')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('about.description')}
        </p>
      </div>

      {/* Main Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('about.features')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-3 p-4 rounded-lg border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security & Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              {t('about.privacy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('about.privacyText')}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">No data sent to servers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">All processing in browser</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">No tracking or analytics</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {t('about.openSource')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('about.openSourceText')}
            </p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Supported Algorithms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('about.algorithms')}
          </CardTitle>
          <CardDescription>
            Comprehensive list of supported encryption and hashing algorithms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {supportedAlgorithms.map((algo) => (
              <div
                key={algo.name}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{algo.name}</span>
                  <Badge variant="outline" className="text-xs">{algo.type}</Badge>
                </div>
                <Badge 
                  variant={
                    algo.security === 'High' ? 'default' : 
                    algo.security === 'Medium' ? 'secondary' : 
                    'destructive'
                  }
                  className="text-xs"
                >
                  {algo.security}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>
            Built with modern web technologies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Crypto-JS', 'Node-Forge'].map((tech) => (
              <Badge key={tech} variant="secondary">{tech}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Version Info */}
      <div className="text-center text-sm text-muted-foreground">
        <p>{t('about.version')} 1.0.0</p>
        <p className="flex items-center justify-center gap-1 mt-1">
          {t('about.madeWith')} <Heart className="h-4 w-4 text-red-500 fill-red-500" /> {t('about.by')} CryptoVault Team
        </p>
      </div>
    </div>
  );
}
