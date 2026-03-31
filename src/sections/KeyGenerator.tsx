import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Key,
  Copy,
  Download,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  generateRSAKeyPair,
  generateECCKeyPair,
  getECCCurves,
  type RSAKeyPair,
  type ECCKeyPair,
} from '@/crypto';
import { copyToClipboard } from '@/utils/clipboard';
import { useAppT } from '@/lib/i18n';

export default function KeyGenerator() {
  const { t } = useTranslation();
  const { tr } = useAppT();
  const [activeTab, setActiveTab] = useState('rsa');

  const [rsaKeySize, setRsaKeySize] = useState('2048');
  const [rsaKeyPair, setRsaKeyPair] = useState<RSAKeyPair | null>(null);
  const [isGeneratingRSA, setIsGeneratingRSA] = useState(false);
  const [rsaProgress, setRsaProgress] = useState(0);

  const [eccCurve, setEccCurve] = useState('secp256r1');
  const [eccKeyPair, setEccKeyPair] = useState<ECCKeyPair | null>(null);
  const [isGeneratingECC, setIsGeneratingECC] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await copyToClipboard(text);
      toast.success(tr('success.copied', 'Copied to clipboard'));
    } catch (error) {
      toast.error(tr('errors.generic', 'An error occurred'));
    }
  };

  const generateRSA = async () => {
    setIsGeneratingRSA(true);
    setRsaProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setRsaProgress((prev) => Math.min(prev + 10, 80));
      }, 200);

      const bits = parseInt(rsaKeySize) as 2048 | 3072 | 4096;
      const keyPair = generateRSAKeyPair(bits);

      clearInterval(progressInterval);
      setRsaProgress(100);
      setRsaKeyPair(keyPair);
      toast.success(tr('success.keysGenerated', 'Key pair generated successfully'));
    } catch (error) {
      toast.error(tr('keyGenerator.rsaGenerationFailed', 'Failed to generate RSA keys'));
    } finally {
      setIsGeneratingRSA(false);
    }
  };

  const generateECC = async () => {
    setIsGeneratingECC(true);

    try {
      const keyPair = generateECCKeyPair(eccCurve);
      setEccKeyPair(keyPair);
      toast.success(tr('success.keysGenerated', 'Key pair generated successfully'));
    } catch (error) {
      toast.error(tr('keyGenerator.eccGenerationFailed', 'Failed to generate ECC keys'));
    } finally {
      setIsGeneratingECC(false);
    }
  };

  const downloadKeys = (keyPair: RSAKeyPair | ECCKeyPair | null, prefix: string) => {
    if (!keyPair) return;

    const publicKeyBlob = new Blob([keyPair.publicKey], { type: 'text/plain' });
    const privateKeyBlob = new Blob([keyPair.privateKey], { type: 'text/plain' });

    const publicUrl = URL.createObjectURL(publicKeyBlob);
    const privateUrl = URL.createObjectURL(privateKeyBlob);

    const publicLink = document.createElement('a');
    publicLink.href = publicUrl;
    publicLink.download = `${prefix}_public_key.pem`;
    document.body.appendChild(publicLink);
    publicLink.click();

    const privateLink = document.createElement('a');
    privateLink.href = privateUrl;
    privateLink.download = `${prefix}_private_key.pem`;
    document.body.appendChild(privateLink);
    privateLink.click();

    document.body.removeChild(publicLink);
    document.body.removeChild(privateLink);

    URL.revokeObjectURL(publicUrl);
    URL.revokeObjectURL(privateUrl);

    toast.success(tr('success.fileDownloaded', 'File downloaded successfully'));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{t('keyGenerator.title')}</h1>
        <p className="text-muted-foreground">{t('keyGenerator.subtitle')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rsa" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            RSA
          </TabsTrigger>
          <TabsTrigger value="ecc" className="flex items-center gap-2">
            <span className="font-bold text-xs">ECC</span>
            ECC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rsa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                {t('keyGenerator.rsaSection')}
              </CardTitle>
              <CardDescription>
                {tr('keyGenerator.rsaDescription', 'Generate RSA key pairs for asymmetric encryption')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rsa-key-size">{t('keyGenerator.keySizeLabel')}</Label>
                <Select value={rsaKeySize} onValueChange={setRsaKeySize}>
                  <SelectTrigger id="rsa-key-size">
                    <SelectValue placeholder={t('keyGenerator.selectKeySize')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2048">{t('keyGenerator.keySize2048')}</SelectItem>
                    <SelectItem value="3072">{t('keyGenerator.keySize3072')}</SelectItem>
                    <SelectItem value="4096">{t('keyGenerator.keySize4096')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateRSA}
                disabled={isGeneratingRSA}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGeneratingRSA ? 'animate-spin' : ''}`} />
                {isGeneratingRSA ? t('common.generating') : t('keyGenerator.generateButton')}
              </Button>

              {isGeneratingRSA && (
                <div className="space-y-2">
                  <Progress value={rsaProgress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    {tr('keyGenerator.generatingHint', 'Generating keys... This may take a moment')}
                  </p>
                </div>
              )}

              {rsaKeyPair && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {t('keyGenerator.saveWarning')}
                  </AlertDescription>
                </Alert>
              )}

              {rsaKeyPair && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rsa-public-key">{t('keyGenerator.publicKeyLabel')}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(rsaKeyPair.publicKey)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {t('common.copy')}
                      </Button>
                    </div>
                    <Textarea
                      id="rsa-public-key"
                      value={rsaKeyPair.publicKey}
                      readOnly
                      className="min-h-[150px] font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rsa-private-key" className="text-red-600">
                        {t('keyGenerator.privateKeyLabel')}
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(rsaKeyPair.privateKey)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {t('common.copy')}
                      </Button>
                    </div>
                    <Textarea
                      id="rsa-private-key"
                      value={rsaKeyPair.privateKey}
                      readOnly
                      className="min-h-[250px] font-mono text-xs border-red-200 bg-red-50/50"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => downloadKeys(rsaKeyPair, 'rsa')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('keyGenerator.downloadKeys')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ecc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="font-bold">ECC</span>
                {t('keyGenerator.eccSection')}
              </CardTitle>
              <CardDescription>
                {tr('keyGenerator.eccDescription', 'Generate ECC key pairs for efficient asymmetric encryption')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ecc-curve">{t('keyGenerator.curveLabel')}</Label>
                <Select value={eccCurve} onValueChange={setEccCurve}>
                  <SelectTrigger id="ecc-curve">
                    <SelectValue placeholder={t('keyGenerator.selectCurve')} />
                  </SelectTrigger>
                  <SelectContent>
                    {getECCCurves().map((curve) => (
                      <SelectItem key={curve} value={curve}>
                        {curve}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={generateECC}
                disabled={isGeneratingECC}
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGeneratingECC ? 'animate-spin' : ''}`} />
                {isGeneratingECC ? t('common.generating') : t('keyGenerator.generateButton')}
              </Button>

              {eccKeyPair && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {t('keyGenerator.saveWarning')}
                  </AlertDescription>
                </Alert>
              )}

              {eccKeyPair && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ecc-public-key">{t('keyGenerator.publicKeyLabel')}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(eccKeyPair.publicKey)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {t('common.copy')}
                      </Button>
                    </div>
                    <Textarea
                      id="ecc-public-key"
                      value={eccKeyPair.publicKey}
                      readOnly
                      className="min-h-[150px] font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ecc-private-key" className="text-red-600">
                        {t('keyGenerator.privateKeyLabel')}
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(eccKeyPair.privateKey)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {t('common.copy')}
                      </Button>
                    </div>
                    <Textarea
                      id="ecc-private-key"
                      value={eccKeyPair.privateKey}
                      readOnly
                      className="min-h-[150px] font-mono text-xs border-red-200 bg-red-50/50"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => downloadKeys(eccKeyPair, 'ecc')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('keyGenerator.downloadKeys')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
