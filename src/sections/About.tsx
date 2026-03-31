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
import { useAppT } from '@/lib/i18n';

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
    titleKey: 'about.featureTextEncryptionTitle',
    titleFallback: 'Text Encryption',
    descriptionKey: 'about.featureTextEncryptionDesc',
    descriptionFallback: 'Encrypt and decrypt text using industry-standard algorithms',
  },
  {
    icon: Shield,
    titleKey: 'about.featureImageEncryptionTitle',
    titleFallback: 'Image Encryption',
    descriptionKey: 'about.featureImageEncryptionDesc',
    descriptionFallback: 'Secure your images with strong encryption methods',
  },
  {
    icon: Hash,
    titleKey: 'about.featureHashingTitle',
    titleFallback: 'Data Hashing',
    descriptionKey: 'about.featureHashingDesc',
    descriptionFallback: 'Generate hash values for data integrity verification',
  },
  {
    icon: Key,
    titleKey: 'about.featureKeyGenerationTitle',
    titleFallback: 'Key Generation',
    descriptionKey: 'about.featureKeyGenerationDesc',
    descriptionFallback: 'Generate RSA and ECC key pairs for asymmetric encryption',
  },
];

export default function About() {
  const { tr } = useAppT();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {tr('about.title', 'About CryptoVault')}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {tr(
            'about.description',
            'CryptoVault is a comprehensive encryption tool designed to help users protect their data using modern encryption algorithms.'
          )}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {tr('about.features', 'Key Features')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.titleKey} className="flex items-start gap-3 p-4 rounded-lg border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">
                    {tr(feature.titleKey, feature.titleFallback)}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {tr(feature.descriptionKey, feature.descriptionFallback)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              {tr('about.privacy', 'Privacy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {tr(
                'about.privacyText',
                'All encryption happens in your browser. Data never leaves your device.'
              )}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {tr('about.noDataSent', 'No data sent to servers')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {tr('about.allProcessingBrowser', 'All processing in browser')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                {tr('about.noTracking', 'No tracking or analytics')}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {tr('about.openSource', 'Open Source')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {tr(
                'about.openSourceText',
                'Source code is available on GitHub for inspection and contribution.'
              )}
            </p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Github className="h-4 w-4" />
                {tr('about.viewOnGithub', 'View on GitHub')}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {tr('about.algorithms', 'Supported Algorithms')}
          </CardTitle>
          <CardDescription>
            {tr(
              'about.algorithmsDesc',
              'Comprehensive list of supported encryption and hashing algorithms'
            )}
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
                  <Badge variant="outline" className="text-xs">
                    {algo.type}
                  </Badge>
                </div>
                <Badge
                  variant={
                    algo.security === 'High'
                      ? 'default'
                      : algo.security === 'Medium'
                      ? 'secondary'
                      : 'destructive'
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

      <Card>
        <CardHeader>
          <CardTitle>{tr('about.techStack', 'Technology Stack')}</CardTitle>
          <CardDescription>
            {tr('about.techStackDesc', 'Built with modern web technologies')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Crypto-JS', 'Node-Forge'].map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          {tr('about.version', 'Version')} 1.0.0
        </p>
        <p className="flex items-center justify-center gap-1 mt-1">
          {tr('about.madeWith', 'Made with')}
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          {tr('about.by', 'by')} CryptoVault Team
        </p>
      </div>
    </div>
  );
}
