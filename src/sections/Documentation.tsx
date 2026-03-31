import { useTranslation } from 'react-i18next';
import { 
  Book, 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const algorithmList = [
  {
    category: 'Symmetric Encryption',
    algorithms: [
      { name: 'AES-256-GCM', status: 'recommended', description: 'Advanced Encryption Standard with Galois/Counter Mode' },
      { name: 'AES-256-CBC', status: 'secure', description: 'AES with Cipher Block Chaining' },
      { name: 'AES-256-CTR', status: 'secure', description: 'AES with Counter mode' },
      { name: 'AES-256-ECB', status: 'notRecommended', description: 'AES with Electronic Codebook (not recommended for multiple blocks)' },
      { name: '3DES', status: 'legacy', description: 'Triple DES - legacy algorithm' },
      { name: 'DES', status: 'deprecated', description: 'Data Encryption Standard - obsolete' },
      { name: 'Blowfish', status: 'legacy', description: 'Symmetric block cipher' },
      { name: 'RC4', status: 'deprecated', description: 'Stream cipher - has vulnerabilities' },
      { name: 'Rabbit', status: 'secure', description: 'High-speed stream cipher' },
    ],
  },
  {
    category: 'Asymmetric Encryption',
    algorithms: [
      { name: 'RSA-2048', status: 'recommended', description: 'RSA with 2048-bit key' },
      { name: 'RSA-3072', status: 'recommended', description: 'RSA with 3072-bit key' },
      { name: 'RSA-4096', status: 'recommended', description: 'RSA with 4096-bit key' },
      { name: 'ECC-secp256r1', status: 'recommended', description: 'Elliptic Curve Cryptography' },
      { name: 'ECC-secp384r1', status: 'recommended', description: 'ECC with P-384 curve' },
    ],
  },
  {
    category: 'Hash Algorithms',
    algorithms: [
      { name: 'SHA-256', status: 'recommended', description: 'Secure Hash Algorithm 256-bit' },
      { name: 'SHA-512', status: 'recommended', description: 'Secure Hash Algorithm 512-bit' },
      { name: 'SHA-3', status: 'recommended', description: 'Latest SHA family' },
      { name: 'RIPEMD-160', status: 'secure', description: 'RIPE Message Digest' },
      { name: 'SHA-1', status: 'deprecated', description: 'Being phased out' },
      { name: 'MD5', status: 'deprecated', description: 'Use only for checksums' },
    ],
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'recommended':
      return <Badge className="bg-green-500">Recommended</Badge>;
    case 'secure':
      return <Badge className="bg-blue-500">Secure</Badge>;
    case 'legacy':
      return <Badge variant="secondary">Legacy</Badge>;
    case 'notRecommended':
      return <Badge variant="outline">Not Recommended</Badge>;
    case 'deprecated':
      return <Badge variant="destructive">Deprecated</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Documentation() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{t('documentation.title')}</h1>
        <p className="text-muted-foreground">{t('documentation.subtitle')}</p>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-6 pr-4">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                {t('documentation.introduction')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t('documentation.introText')}
              </p>
              
              <div className="space-y-2">
                <h3 className="font-semibold">{t('documentation.features')}</h3>
                <ul className="space-y-2">
                  {(t('documentation.featureList', { returnObjects: true }) as string[]).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How to Encrypt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {t('documentation.howToEncrypt')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {(t('documentation.encryptSteps', { returnObjects: true }) as string[]).map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* How to Decrypt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                {t('documentation.howToDecrypt')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {(t('documentation.decryptSteps', { returnObjects: true }) as string[]).map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Algorithm Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('documentation.algorithmDescriptions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {algorithmList.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h3 className="font-semibold text-lg">{category.category}</h3>
                  <div className="grid gap-2">
                    {category.algorithms.map((algo) => (
                      <div
                        key={algo.name}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{algo.name}</div>
                          <div className="text-sm text-muted-foreground">{algo.description}</div>
                        </div>
                        {getStatusBadge(algo.status)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {t('documentation.securityNotice')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {t('documentation.securityText')}
              </p>
              
              <ul className="space-y-2">
                {(t('documentation.securityTips', { returnObjects: true }) as string[]).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Password Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                {t('documentation.passwordRequirements')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {(t('documentation.passwordTips', { returnObjects: true }) as string[]).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Algorithm Details */}
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Details</CardTitle>
              <CardDescription>
                Detailed information about supported algorithms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">AES (Advanced Encryption Standard)</h4>
                <p className="text-sm text-muted-foreground">
                  {t('documentation.aesDescription')}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">DES (Data Encryption Standard)</h4>
                <p className="text-sm text-muted-foreground">
                  {t('documentation.desDescription')}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">RSA (Rivest–Shamir–Adleman)</h4>
                <p className="text-sm text-muted-foreground">
                  {t('documentation.rsaDescription')}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">ECC (Elliptic Curve Cryptography)</h4>
                <p className="text-sm text-muted-foreground">
                  {t('documentation.eccDescription')}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">SHA (Secure Hash Algorithm)</h4>
                <p className="text-sm text-muted-foreground">
                  {t('documentation.shaDescription')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
