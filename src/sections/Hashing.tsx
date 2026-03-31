import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Hash, 
  Copy, 
  FileText, 
  Upload, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import {
  md5Hash,
  sha1Hash,
  sha256Hash,
  sha512Hash,
  sha3Hash,
  ripemd160Hash,
  hmacMD5,
  hmacSHA1,
  hmacSHA256,
  hmacSHA512,
} from '@/crypto';
import { copyToClipboard } from '@/utils/clipboard';

const hashAlgorithms = [
  { value: 'MD5', label: 'MD5', security: 'deprecated' },
  { value: 'SHA-1', label: 'SHA-1', security: 'deprecated' },
  { value: 'SHA-256', label: 'SHA-256', security: 'high' },
  { value: 'SHA-512', label: 'SHA-512', security: 'high' },
  { value: 'SHA-3', label: 'SHA-3', security: 'high' },
  { value: 'RIPEMD-160', label: 'RIPEMD-160', security: 'medium' },
];

export default function Hashing() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('text');
  
  // Text hashing state
  const [textInput, setTextInput] = useState('');
  const [hashAlgorithm, setHashAlgorithm] = useState('SHA-256');
  const [hashResult, setHashResult] = useState('');
  const [useHMAC, setUseHMAC] = useState(false);
  const [hmacKey, setHmacKey] = useState('');
  
  // File hashing state
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  
  // Verification state
  const [compareHash, setCompareHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<'match' | 'noMatch' | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextHash = () => {
    if (!textInput.trim()) {
      toast.error(t('errors.emptyInput'));
      return;
    }

    let result = '';
    
    try {
      if (useHMAC && hmacKey) {
        switch (hashAlgorithm) {
          case 'MD5':
            result = hmacMD5(textInput, hmacKey);
            break;
          case 'SHA-1':
            result = hmacSHA1(textInput, hmacKey);
            break;
          case 'SHA-256':
            result = hmacSHA256(textInput, hmacKey);
            break;
          case 'SHA-512':
            result = hmacSHA512(textInput, hmacKey);
            break;
          default:
            result = hmacSHA256(textInput, hmacKey);
        }
      } else {
        switch (hashAlgorithm) {
          case 'MD5':
            result = md5Hash(textInput);
            break;
          case 'SHA-1':
            result = sha1Hash(textInput);
            break;
          case 'SHA-256':
            result = sha256Hash(textInput);
            break;
          case 'SHA-512':
            result = sha512Hash(textInput);
            break;
          case 'SHA-3':
            result = sha3Hash(textInput);
            break;
          case 'RIPEMD-160':
            result = ripemd160Hash(textInput);
            break;
          default:
            result = sha256Hash(textInput);
        }
      }
      
      setHashResult(result);
      setVerificationResult(null);
      toast.success(t('common.success'));
    } catch (error) {
      toast.error('Hashing failed');
    }
  };

  const handleFileHash = async () => {
    if (!file) {
      toast.error(t('errors.missingFile'));
      return;
    }

    setIsHashing(true);
    
    try {
      const text = await file.text();
      let result = '';
      
      switch (hashAlgorithm) {
        case 'MD5':
          result = md5Hash(text);
          break;
        case 'SHA-1':
          result = sha1Hash(text);
          break;
        case 'SHA-256':
          result = sha256Hash(text);
          break;
        case 'SHA-512':
          result = sha512Hash(text);
          break;
        case 'SHA-3':
          result = sha3Hash(text);
          break;
        case 'RIPEMD-160':
          result = ripemd160Hash(text);
          break;
        default:
          result = sha256Hash(text);
      }
      
      setFileHash(result);
      toast.success(t('common.success'));
    } catch (error) {
      toast.error('File hashing failed');
    } finally {
      setIsHashing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileHash('');
    }
  };

  const verifyHash = () => {
    if (!compareHash || !hashResult) return;
    
    if (compareHash.toLowerCase() === hashResult.toLowerCase()) {
      setVerificationResult('match');
    } else {
      setVerificationResult('noMatch');
    }
  };

  const clearText = () => {
    setTextInput('');
    setHashResult('');
    setCompareHash('');
    setVerificationResult(null);
  };

  const clearFile = () => {
    setFile(null);
    setFileHash('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{t('hashing.title')}</h1>
        <p className="text-muted-foreground">{t('hashing.subtitle')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('hashing.textHashing')}
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {t('hashing.fileHashing')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                {t('hashing.textHashing')}
              </CardTitle>
              <CardDescription>
                Generate hash values for text input
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Algorithm Selection */}
              <div className="space-y-2">
                <Label htmlFor="hash-algorithm">{t('hashing.algorithmLabel')}</Label>
                <Select value={hashAlgorithm} onValueChange={setHashAlgorithm}>
                  <SelectTrigger id="hash-algorithm">
                    <SelectValue placeholder={t('hashing.selectAlgorithm')} />
                  </SelectTrigger>
                  <SelectContent>
                    {hashAlgorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{algo.label}</span>
                          {algo.security === 'deprecated' && (
                            <AlertCircle className="h-3 w-3 text-yellow-500 ml-2" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* HMAC Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-hmac"
                  checked={useHMAC}
                  onCheckedChange={setUseHMAC}
                />
                <Label htmlFor="use-hmac">{t('hashing.hmacSection')}</Label>
              </div>

              {/* HMAC Key */}
              {useHMAC && (
                <div className="space-y-2">
                  <Label htmlFor="hmac-key">{t('hashing.hmacKey')}</Label>
                  <Input
                    id="hmac-key"
                    type="password"
                    placeholder="Enter HMAC key..."
                    value={hmacKey}
                    onChange={(e) => setHmacKey(e.target.value)}
                  />
                </div>
              )}

              {/* Text Input */}
              <div className="space-y-2">
                <Label htmlFor="hash-input">{t('hashing.inputLabel')}</Label>
                <Textarea
                  id="hash-input"
                  placeholder={t('hashing.inputPlaceholder')}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleTextHash}
                  disabled={!textInput.trim()}
                  className="flex-1"
                >
                  <Hash className="h-4 w-4 mr-2" />
                  {t('hashing.hashButton')}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearText}
                  disabled={!textInput && !hashResult}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Hash Result */}
              {hashResult && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hash-result">{t('hashing.resultLabel')}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(hashResult)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {t('common.copy')}
                      </Button>
                    </div>
                    <Textarea
                      id="hash-result"
                      value={hashResult}
                      readOnly
                      className="min-h-[80px] font-mono text-sm"
                    />
                  </div>

                  {/* Verification */}
                  <div className="space-y-2 border-t pt-4">
                    <Label htmlFor="compare-hash">{t('hashing.verifyHash')}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="compare-hash"
                        placeholder={t('hashing.compareHash')}
                        value={compareHash}
                        onChange={(e) => setCompareHash(e.target.value)}
                      />
                      <Button
                        variant="secondary"
                        onClick={verifyHash}
                        disabled={!compareHash}
                      >
                        {t('common.verify')}
                      </Button>
                    </div>
                    
                    {verificationResult && (
                      <Alert variant={verificationResult === 'match' ? 'default' : 'destructive'}>
                        <AlertDescription className="flex items-center gap-2">
                          {verificationResult === 'match' ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span className="text-green-600">{t('hashing.match')}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-red-600">{t('hashing.noMatch')}</span>
                            </>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                {t('hashing.fileHashing')}
              </CardTitle>
              <CardDescription>
                Calculate hash for any file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Algorithm Selection */}
              <div className="space-y-2">
                <Label htmlFor="file-hash-algorithm">{t('hashing.algorithmLabel')}</Label>
                <Select value={hashAlgorithm} onValueChange={setHashAlgorithm}>
                  <SelectTrigger id="file-hash-algorithm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hashAlgorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value}>
                        {algo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>{t('hashing.fileUpload')}</Label>
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {file ? (
                    <div className="space-y-2">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFile();
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('common.clear')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{t('hashing.dragDropFile')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleFileHash}
                disabled={isHashing || !file}
                className="w-full"
              >
                <Hash className="h-4 w-4 mr-2" />
                {isHashing ? t('common.processing') : t('hashing.calculateFileHash')}
              </Button>

              {/* File Hash Result */}
              {fileHash && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="file-hash-result">{t('hashing.fileHashResult')}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(fileHash)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      {t('common.copy')}
                    </Button>
                  </div>
                  <Textarea
                    id="file-hash-result"
                    value={fileHash}
                    readOnly
                    className="min-h-[80px] font-mono text-sm"
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
