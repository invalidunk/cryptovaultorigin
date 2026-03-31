import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Hash, 
  Key, 
  Image as ImageIcon,
  ArrowRight,
  Server,
  Globe,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Lock,
    title: 'Text Encryption',
    description: 'Encrypt and decrypt text using AES, DES, 3DES, Blowfish, RC4, Rabbit, and RSA algorithms.',
    action: 'Start Encrypting',
    path: '/text',
    color: 'bg-blue-500',
  },
  {
    icon: ImageIcon,
    title: 'Image Encryption',
    description: 'Secure your images with strong encryption. Supports PNG, JPG, GIF, and WEBP formats.',
    action: 'Encrypt Images',
    path: '/image',
    color: 'bg-purple-500',
  },
  {
    icon: Hash,
    title: 'Data Hashing',
    description: 'Generate hash values using MD5, SHA-1, SHA-256, SHA-512, SHA-3, and RIPEMD-160.',
    action: 'Hash Data',
    path: '/hash',
    color: 'bg-green-500',
  },
  {
    icon: Key,
    title: 'Key Generator',
    description: 'Generate RSA and ECC key pairs for asymmetric encryption.',
    action: 'Generate Keys',
    path: '/keys',
    color: 'bg-orange-500',
  },
];

const algorithms = [
  { name: 'AES-256-GCM', category: 'Symmetric', security: 'High' },
  { name: 'RSA-2048/4096', category: 'Asymmetric', security: 'High' },
  { name: 'ECC', category: 'Asymmetric', security: 'High' },
  { name: 'SHA-256/512', category: 'Hash', security: 'High' },
  { name: 'SHA-3', category: 'Hash', security: 'High' },
  { name: '3DES', category: 'Symmetric', security: 'Medium' },
];

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            <Shield className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {t('app.name')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('app.tagline')}
          </p>
        </div>
        
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t('app.description')}
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/text')}>
            <Lock className="h-5 w-5 mr-2" />
            Start Encrypting
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/docs')}>
            Read Documentation
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <Card key={feature.title} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="ghost" 
                className="group-hover:translate-x-1 transition-transform"
                onClick={() => navigate(feature.path)}
              >
                {feature.action}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Algorithms Supported */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Supported Algorithms
          </CardTitle>
          <CardDescription>
            Industry-standard encryption algorithms at your fingertips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {algorithms.map((algo) => (
              <div key={algo.name} className="flex items-center gap-2 p-2 rounded-lg border bg-card">
                <span className="font-medium">{algo.name}</span>
                <Badge variant={algo.security === 'High' ? 'default' : 'secondary'}>
                  {algo.security}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto p-3 rounded-full bg-green-500/10 w-fit mb-2">
              <Server className="h-6 w-6 text-green-500" />
            </div>
            <CardTitle className="text-lg">Client-Side Only</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              All encryption happens in your browser. Your data never leaves your device.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto p-3 rounded-full bg-blue-500/10 w-fit mb-2">
              <Globe className="h-6 w-6 text-blue-500" />
            </div>
            <CardTitle className="text-lg">Multi-Language</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Available in Vietnamese and English. More languages coming soon.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto p-3 rounded-full bg-purple-500/10 w-fit mb-2">
              <Code className="h-6 w-6 text-purple-500" />
            </div>
            <CardTitle className="text-lg">Open Source</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Source code available on GitHub for transparency and community contributions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>
            Get started with encryption in 3 simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  1
                </span>
                <h4 className="font-semibold">Choose Algorithm</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-11">
                Select from various encryption algorithms based on your security needs.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  2
                </span>
                <h4 className="font-semibold">Enter Data</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-11">
                Input your text or upload files you want to encrypt or hash.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  3
                </span>
                <h4 className="font-semibold">Get Result</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-11">
                Copy or download your encrypted data, hash, or generated keys.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Ready to secure your data?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => navigate('/text')}>
            <Lock className="h-5 w-5 mr-2" />
            Encrypt Text
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/image')}>
            <ImageIcon className="h-5 w-5 mr-2" />
            Encrypt Image
          </Button>
        </div>
      </div>
    </div>
  );
}
