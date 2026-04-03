import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Lock,
  Unlock,
  Copy,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Key,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  aesEncrypt,
  aesDecrypt,
  desEncrypt,
  desDecrypt,
  tripleDesEncrypt,
  tripleDesDecrypt,
  blowfishEncrypt,
  blowfishDecrypt,
  rc4Encrypt,
  rc4Decrypt,
  rabbitEncrypt,
  rabbitDecrypt,
  generateRSAKeyPair,
  rsaEncrypt,
  rsaDecrypt,
  getAlgorithmDescription,
  getAlgorithmSecurityLevel,
} from '@/crypto';
import { checkPasswordStrength, getPasswordStrengthTextColor, generateStrongPassword } from '@/utils/passwordStrength';
import { copyToClipboard } from '@/utils/clipboard';
import { useAppT } from '@/lib/i18n';
import type { RSAKeyPair } from '@/crypto';

const symmetricAlgorithms = [
  { value: 'AES-256-GCM', label: 'AES-256-GCM', security: 'high' },
  { value: 'AES-256-CBC', label: 'AES-256-CBC', security: 'high' },
  { value: 'AES-256-ECB', label: 'AES-256-ECB', security: 'medium' },
  { value: 'AES-256-CTR', label: 'AES-256-CTR', security: 'high' },
  { value: 'DES', label: 'DES', security: 'deprecated' },
  { value: '3DES', label: '3DES', security: 'low' },
  { value: 'Blowfish', label: 'Blowfish', security: 'medium' },
  { value: 'RC4', label: 'RC4', security: 'deprecated' },
  { value: 'Rabbit', label: 'Rabbit', security: 'medium' },
];

const asymmetricAlgorithms = [
  { value: 'RSA-2048', label: 'RSA-2048', security: 'high' },
  { value: 'RSA-3072', label: 'RSA-3072', security: 'high' },
  { value: 'RSA-4096', label: 'RSA-4096', security: 'high' },
];

export default function TextEncryption() {
  const { t } = useTranslation();
  const { tr } = useAppT();
  const [activeTab, setActiveTab] = useState('encrypt');

  const [encryptText, setEncryptText] = useState('');
  const [encryptKey, setEncryptKey] = useState('');
  const [encryptAlgorithm, setEncryptAlgorithm] = useState('AES-256-GCM');
  const [encryptedResult, setEncryptedResult] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);

  const [decryptText, setDecryptText] = useState('');
  const [decryptKey, setDecryptKey] = useState('');
  const [decryptAlgorithm, setDecryptAlgorithm] = useState('AES-256-GCM');
  const [decryptedResult, setDecryptedResult] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  const [rsaKeyPair, setRsaKeyPair] = useState<RSAKeyPair | null>(null);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);

  const passwordStrength = checkPasswordStrength(activeTab === 'encrypt' ? encryptKey : decryptKey);
  const strengthPercentage = (passwordStrength.score / 7) * 100;

  const handleEncrypt = async () => {
    if (!encryptText.trim()) {
      toast.error(tr('errors.emptyInput', 'Please enter data'));
      return;
    }
    if (!encryptKey.trim() && !isAsymmetric(encryptAlgorithm)) {
      toast.error(tr('errors.missingKey', 'Please enter a key'));
      return;
    }

    setIsEncrypting(true);
    try {
      let result = '';

      switch (encryptAlgorithm) {
        case 'AES-256-GCM':
        case 'AES-256-CBC':
        case 'AES-256-ECB':
        case 'AES-256-CTR': {
          const mode = encryptAlgorithm.split('-')[2];
          result = await aesEncrypt(encryptText, encryptKey, mode);
          break;
        }
        case 'DES':
          result = desEncrypt(encryptText, encryptKey);
          break;
        case '3DES':
          result = tripleDesEncrypt(encryptText, encryptKey);
          break;
        case 'Blowfish':
          result = blowfishEncrypt(encryptText, encryptKey);
          break;
        case 'RC4':
          result = rc4Encrypt(encryptText, encryptKey);
          break;
        case 'Rabbit':
          result = rabbitEncrypt(encryptText, encryptKey);
          break;
        case 'RSA-2048':
        case 'RSA-3072':
        case 'RSA-4096':
          if (!rsaKeyPair) {
            toast.error(tr('textEncryption.generateKeysFirst', 'Please generate RSA keys first'));
            setIsEncrypting(false);
            return;
          }
          result = rsaEncrypt(encryptText, rsaKeyPair.publicKey);
          break;
        default:
          result = await aesEncrypt(encryptText, encryptKey);
      }

      setEncryptedResult(result);
      toast.success(tr('success.encrypted', 'Encryption successful'));
    } catch (error) {
      toast.error(tr('errors.encryptionFailed', 'Encryption failed'));
      console.error(error);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!decryptText.trim()) {
      toast.error(tr('errors.emptyInput', 'Please enter data'));
      return;
    }
    if (!decryptKey.trim() && !isAsymmetric(decryptAlgorithm)) {
      toast.error(tr('errors.missingKey', 'Please enter a key'));
      return;
    }

    setIsDecrypting(true);
    try {
      let result = '';

      switch (decryptAlgorithm) {
        case 'AES-256-GCM':
        case 'AES-256-CBC':
        case 'AES-256-ECB':
        case 'AES-256-CTR': {
          const mode = decryptAlgorithm.split('-')[2];
          result = await aesDecrypt(decryptText, decryptKey, mode);
          break;
        }
        case 'DES':
          result = desDecrypt(decryptText, decryptKey);
          break;
        case '3DES':
          result = tripleDesDecrypt(decryptText, decryptKey);
          break;
        case 'Blowfish':
          result = blowfishDecrypt(decryptText, decryptKey);
          break;
        case 'RC4':
          result = rc4Decrypt(decryptText, decryptKey);
          break;
        case 'Rabbit':
          result = rabbitDecrypt(decryptText, decryptKey);
          break;
        case 'RSA-2048':
        case 'RSA-3072':
        case 'RSA-4096':
          if (!rsaKeyPair) {
            toast.error(tr('textEncryption.providePrivateKey', 'Please provide RSA private key'));
            setIsDecrypting(false);
            return;
          }
          result = rsaDecrypt(decryptText, rsaKeyPair.privateKey);
          break;
        default:
          result = await aesDecrypt(decryptText, decryptKey);
      }

      if (!result) {
        toast.error(tr('errors.decryptionFailed', 'Decryption failed. Check your key and algorithm.'));
      } else {
        setDecryptedResult(result);
        toast.success(tr('success.decrypted', 'Decryption successful'));
      }
    } catch (error) {
      toast.error(tr('errors.decryptionFailed', 'Decryption failed. Check your key and algorithm.'));
      console.error(error);
    } finally {
      setIsDecrypting(false);
    }
  };

  const generateRSAKeys = async () => {
    setIsGeneratingKeys(true);
    try {
      const bits = parseInt(encryptAlgorithm.split('-')[1]) as 2048 | 3072 | 4096;
      const keyPair = generateRSAKeyPair(bits);
      setRsaKeyPair(keyPair);
      toast.success(tr('success.keysGenerated', 'Key pair generated successfully'));
    } catch (error) {
      toast.error(tr('textEncryption.keyGenerationFailed', 'Failed to generate RSA keys'));
      console.error(error);
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword();
    if (activeTab === 'encrypt') {
      setEncryptKey(newPassword);
    } else {
      setDecryptKey(newPassword);
    }
    toast.success(tr('textEncryption.strongPasswordGenerated', 'Strong password generated!'));
  };

  const handleCopy = async (text: string) => {
    try {
      await copyToClipboard(text);
      toast.success(tr('success.copied', 'Copied to clipboard'));
    } catch (error) {
      toast.error(tr('errors.generic', 'An error occurred'));
    }
  };

  const clearAll = () => {
    if (activeTab === 'encrypt') {
      setEncryptText('');
      setEncryptKey('');
      setEncryptedResult('');
    } else {
      setDecryptText('');
      setDecryptKey('');
      setDecryptedResult('');
    }
  };

  const swapText = () => {
    if (activeTab === 'encrypt' && encryptedResult) {
      setDecryptText(encryptedResult);
      setDecryptKey(encryptKey);
      setDecryptAlgorithm(encryptAlgorithm);
      setActiveTab('decrypt');
      setDecryptedResult('');
    } else if (activeTab === 'decrypt' && decryptedResult) {
      setEncryptText(decryptedResult);
      setEncryptKey(decryptKey);
      setEncryptAlgorithm(decryptAlgorithm);
      setActiveTab('encrypt');
      setEncryptedResult('');
    }
  };

  const isAsymmetric = (algorithm: string) => algorithm.startsWith('RSA');
  const currentAlgorithm = activeTab === 'encrypt' ? encryptAlgorithm : decryptAlgorithm;
  const securityLevel = getAlgorithmSecurityLevel(currentAlgorithm);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{t('textEncryption.title')}</h1>
        <p className="text-muted-foreground">{t('textEncryption.subtitle')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {t('textEncryption.encryptSection')}
          </TabsTrigger>
          <TabsTrigger value="decrypt" className="flex items-center gap-2">
            <Unlock className="h-4 w-4" />
            {t('textEncryption.decryptSection')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {t('textEncryption.encryptSection')}
              </CardTitle>
              <CardDescription>{t('textEncryption.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="encrypt-algorithm">{t('textEncryption.algorithmLabel')}</Label>
                <Select value={encryptAlgorithm} onValueChange={setEncryptAlgorithm}>
                  <SelectTrigger id="encrypt-algorithm">
                    <SelectValue placeholder={t('textEncryption.selectAlgorithm')} />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {t('textEncryption.symmetricAlgorithms')}
                    </div>
                    {symmetricAlgorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{algo.label}</span>
                          {algo.security === 'deprecated' && (
                            <AlertTriangle className="h-3 w-3 text-yellow-500 ml-2" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground mt-2">
                      {t('textEncryption.asymmetricAlgorithms')}
                    </div>
                    {asymmetricAlgorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value}>
                        {algo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 text-sm">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-muted-foreground cursor-help">
                          <Info className="h-4 w-4" />
                          <span>{getAlgorithmDescription(encryptAlgorithm)}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {tr('textEncryption.securityLabel', 'Security')}: {securityLevel}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {securityLevel === 'deprecated' && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {tr(
                        'textEncryption.deprecatedWarning',
                        'This algorithm is deprecated and should not be used for security purposes.'
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {isAsymmetric(encryptAlgorithm) && (
                <div className="space-y-2">
                  <Button
                    onClick={generateRSAKeys}
                    disabled={isGeneratingKeys}
                    variant="outline"
                    className="w-full"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    {isGeneratingKeys
                      ? tr('textEncryption.generating', 'Generating...')
                      : t('textEncryption.generateKeys')}
                  </Button>
                  {rsaKeyPair && (
                    <Alert className="mt-2">
                      <span className="text-green-500">✓</span>
                      <AlertDescription>
                        {tr('textEncryption.rsaKeysGenerated', 'RSA keys generated successfully!')}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="encrypt-input">{t('textEncryption.inputLabel')}</Label>
                <Textarea
                  id="encrypt-input"
                  placeholder={t('textEncryption.inputPlaceholder')}
                  value={encryptText}
                  onChange={(e) => setEncryptText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              {!isAsymmetric(encryptAlgorithm) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="encrypt-key">{t('textEncryption.keyLabel')}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleGeneratePassword}
                      className="h-6 text-xs"
                    >
                      {t('common.generate')}
                    </Button>
                  </div>
                  <Input
                    id="encrypt-key"
                    type="password"
                    placeholder={t('textEncryption.keyPlaceholder')}
                    value={encryptKey}
                    onChange={(e) => setEncryptKey(e.target.value)}
                  />

                  {encryptKey && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('textEncryption.passwordStrength')}</span>
                        <span className={getPasswordStrengthTextColor(passwordStrength.level)}>
                          {t(`common.${passwordStrength.message}`)}
                        </span>
                      </div>
                      <Progress value={strengthPercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {t('textEncryption.passwordHint')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleEncrypt}
                  disabled={isEncrypting || !encryptText.trim()}
                  className="flex-1"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {isEncrypting ? t('common.processing') : t('textEncryption.encryptButton')}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearAll}
                  disabled={!encryptText && !encryptKey && !encryptedResult}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {encryptedResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="encrypt-result">{t('textEncryption.outputLabel')}</Label>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(encryptedResult)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {t('common.copy')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={swapText}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        {t('textEncryption.swap')}
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="encrypt-result"
                    value={encryptedResult}
                    readOnly
                    className="min-h-[100px] font-mono text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="h-5 w-5" />
                {t('textEncryption.decryptSection')}
              </CardTitle>
              <CardDescription>{t('textEncryption.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="decrypt-algorithm">{t('textEncryption.algorithmLabel')}</Label>
                <Select value={decryptAlgorithm} onValueChange={setDecryptAlgorithm}>
                  <SelectTrigger id="decrypt-algorithm">
                    <SelectValue placeholder={t('textEncryption.selectAlgorithm')} />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {t('textEncryption.symmetricAlgorithms')}
                    </div>
                    {symmetricAlgorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value}>
                        {algo.label}
                      </SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground mt-2">
                      {t('textEncryption.asymmetricAlgorithms')}
                    </div>
                    {asymmetricAlgorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value}>
                        {algo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="decrypt-input">{t('textEncryption.inputLabel')}</Label>
                <Textarea
                  id="decrypt-input"
                  placeholder={t('textEncryption.inputPlaceholder')}
                  value={decryptText}
                  onChange={(e) => setDecryptText(e.target.value)}
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>

              {!isAsymmetric(decryptAlgorithm) && (
                <div className="space-y-2">
                  <Label htmlFor="decrypt-key">{t('textEncryption.keyLabel')}</Label>
                  <Input
                    id="decrypt-key"
                    type="password"
                    placeholder={t('textEncryption.keyPlaceholder')}
                    value={decryptKey}
                    onChange={(e) => setDecryptKey(e.target.value)}
                  />
                </div>
              )}

              {isAsymmetric(decryptAlgorithm) && (
                <div className="space-y-2">
                  <Label htmlFor="private-key">{t('textEncryption.privateKey')}</Label>
                  <Textarea
                    id="private-key"
                    placeholder={tr('textEncryption.privateKeyPlaceholder', 'Paste RSA private key here...')}
                    value={rsaKeyPair?.privateKey || ''}
                    onChange={(e) => {
                      if (rsaKeyPair) {
                        setRsaKeyPair({ ...rsaKeyPair, privateKey: e.target.value });
                      }
                    }}
                    className="min-h-[100px] font-mono text-xs"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleDecrypt}
                  disabled={isDecrypting || !decryptText.trim()}
                  className="flex-1"
                  variant="secondary"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  {isDecrypting ? t('common.processing') : t('textEncryption.decryptButton')}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearAll}
                  disabled={!decryptText && !decryptKey && !decryptedResult}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {decryptedResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="decrypt-result">{t('textEncryption.outputLabel')}</Label>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(decryptedResult)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {t('common.copy')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={swapText}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        {t('textEncryption.swap')}
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="decrypt-result"
                    value={decryptedResult}
                    readOnly
                    className="min-h-[100px]"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
