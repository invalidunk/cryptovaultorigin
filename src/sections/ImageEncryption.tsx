import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image as ImageIcon,
  Upload,
  Lock,
  Unlock,
  Download,
  Trash2,
  FileImage
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  encryptImage,
  decryptImage,
  downloadEncryptedImage,
  downloadDecryptedImage,
  getImageAlgorithms,
} from '@/crypto';
import { checkPasswordStrength } from '@/utils/passwordStrength';
import { useAppT } from '@/lib/i18n';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];

export default function ImageEncryption() {
  const { t } = useTranslation();
  const { tr } = useAppT();
  const [activeTab, setActiveTab] = useState('encrypt');

  const [encryptFile, setEncryptFile] = useState<File | null>(null);
  const [encryptPreview, setEncryptPreview] = useState('');
  const [encryptKey, setEncryptKey] = useState('');
  const [encryptAlgorithm, setEncryptAlgorithm] = useState('AES-256-GCM');
  const [encryptedData, setEncryptedData] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptProgress, setEncryptProgress] = useState(0);

  const [decryptFile, setDecryptFile] = useState<File | null>(null);
  const [decryptKey, setDecryptKey] = useState('');
  const [decryptAlgorithm, setDecryptAlgorithm] = useState('AES-256-GCM');
  const [decryptedImage, setDecryptedImage] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [originalFileName, setOriginalFileName] = useState('');
  const [originalMimeType, setOriginalMimeType] = useState('image/png');

  const encryptInputRef = useRef<HTMLInputElement>(null);
  const decryptInputRef = useRef<HTMLInputElement>(null);

  const passwordStrength = checkPasswordStrength(activeTab === 'encrypt' ? encryptKey : decryptKey);
  const strengthPercentage = (passwordStrength.score / 7) * 100;

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(tr('imageEncryption.invalidImage', 'Please select a valid image file'));
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(tr('imageEncryption.fileTooLarge', 'File too large. Maximum size is 10MB'));
      return false;
    }
    return true;
  };

  const loadEncryptPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setEncryptPreview((event.target?.result as string) || '');
    };
    reader.readAsDataURL(file);
  };

  const handleEncryptFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFile(file)) return;

    setEncryptFile(file);
    setEncryptedData('');
    setEncryptProgress(0);
    loadEncryptPreview(file);
    toast.success(tr('success.imageUploaded', 'Image uploaded successfully'));
  };

  const handleDecryptFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDecryptFile(file);
    setDecryptedImage('');
    setOriginalFileName(file.name.replace(/\.encrypted(\.txt)?$/i, ''));
    setOriginalMimeType('image/png');
  };

  const handleEncrypt = async () => {
    if (!encryptFile) {
      toast.error(tr('errors.missingFile', 'Please select a file'));
      return;
    }
    if (!encryptKey.trim()) {
      toast.error(tr('errors.missingKey', 'Please enter a key'));
      return;
    }

    setIsEncrypting(true);
    setEncryptProgress(25);

    try {
      const result = await encryptImage(encryptFile, encryptKey, encryptAlgorithm);
      setEncryptProgress(70);

      setEncryptedData(result.encryptedData);
      setOriginalFileName(result.originalName);
      setOriginalMimeType(result.mimeType);

      setEncryptProgress(100);
      toast.success(tr('imageEncryption.encryptionSuccess', 'Image encrypted successfully'));
    } catch (error) {
      toast.error(tr('errors.encryptionFailed', 'Encryption failed'));
      console.error(error);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!decryptFile) {
      toast.error(tr('errors.missingFile', 'Please select a file'));
      return;
    }
    if (!decryptKey.trim()) {
      toast.error(tr('errors.missingKey', 'Please enter a key'));
      return;
    }

    setIsDecrypting(true);

    try {
      const encryptedText = await decryptFile.text();

      let algorithmToUse = decryptAlgorithm;
      let mimeTypeToUse = originalMimeType;
      let fileNameToUse = originalFileName;

      try {
        const parsed = JSON.parse(encryptedText);

        if (parsed?.alg && typeof parsed.alg === 'string') {
          algorithmToUse = parsed.alg;
        }

        if (parsed?.mimeType && typeof parsed.mimeType === 'string') {
          mimeTypeToUse = parsed.mimeType;
        }

        if (parsed?.originalName && typeof parsed.originalName === 'string') {
          fileNameToUse = parsed.originalName;
        }
      } catch {
        // file không phải JSON thì giữ nguyên state hiện tại
      }

      const result = await decryptImage(
        encryptedText,
        decryptKey,
        algorithmToUse,
        mimeTypeToUse
      );

      setDecryptAlgorithm(algorithmToUse);
      setOriginalMimeType(mimeTypeToUse);
      setOriginalFileName(fileNameToUse);
      setDecryptedImage(result);

      toast.success(tr('imageEncryption.decryptionSuccess', 'Image decrypted successfully'));
    } catch (error) {
      toast.error(tr('errors.decryptionFailed', 'Decryption failed. Check your key and algorithm.'));
      console.error(error);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDownloadEncrypted = () => {
    if (!encryptedData || !encryptFile) return;
    downloadEncryptedImage(encryptedData, encryptFile.name);
    toast.success(tr('success.fileDownloaded', 'File downloaded successfully'));
  };

  const handleDownloadDecrypted = () => {
    if (!decryptedImage) return;

    const fallbackName = originalFileName || 'decrypted_image';
    downloadDecryptedImage(decryptedImage, `decrypted_${fallbackName}`);
    toast.success(tr('success.fileDownloaded', 'File downloaded successfully'));
  };

  const clearEncrypt = () => {
    setEncryptFile(null);
    setEncryptPreview('');
    setEncryptKey('');
    setEncryptedData('');
    setEncryptProgress(0);
    setOriginalFileName('');
    setOriginalMimeType('image/png');

    if (encryptInputRef.current) {
      encryptInputRef.current.value = '';
    }
  };

  const clearDecrypt = () => {
    setDecryptFile(null);
    setDecryptKey('');
    setDecryptedImage('');
    setOriginalFileName('');
    setOriginalMimeType('image/png');

    if (decryptInputRef.current) {
      decryptInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'encrypt' | 'decrypt') => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (type === 'encrypt') {
      if (!validateFile(file)) return;
      setEncryptFile(file);
      setEncryptedData('');
      setEncryptProgress(0);
      loadEncryptPreview(file);
      toast.success(tr('success.imageUploaded', 'Image uploaded successfully'));
      return;
    }

    setDecryptFile(file);
    setDecryptedImage('');
    setOriginalFileName(file.name.replace(/\.encrypted(\.txt)?$/i, ''));
    setOriginalMimeType('image/png');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{t('imageEncryption.title')}</h1>
        <p className="text-muted-foreground">{t('imageEncryption.subtitle')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encrypt" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {t('imageEncryption.encryptSection')}
          </TabsTrigger>
          <TabsTrigger value="decrypt" className="flex items-center gap-2">
            <Unlock className="h-4 w-4" />
            {t('imageEncryption.decryptSection')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                {t('imageEncryption.encryptSection')}
              </CardTitle>
              <CardDescription>{t('imageEncryption.subtitle')}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDrop={(e) => handleDrop(e, 'encrypt')}
                onDragOver={handleDragOver}
                onClick={() => encryptInputRef.current?.click()}
              >
                <input
                  ref={encryptInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleEncryptFileSelect}
                  className="hidden"
                />

                {encryptPreview ? (
                  <div className="space-y-4">
                    <img
                      src={encryptPreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground">
                      {encryptFile?.name} ({(encryptFile?.size! / 1024 / 1024).toFixed(2)} MB)
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearEncrypt();
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('imageEncryption.removeImage')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-lg font-medium">{t('imageEncryption.dragDropImage')}</p>
                    <p className="text-sm text-muted-foreground">{t('imageEncryption.supportedFormats')}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-algorithm">{t('imageEncryption.algorithmLabel')}</Label>
                <Select value={encryptAlgorithm} onValueChange={setEncryptAlgorithm}>
                  <SelectTrigger id="image-algorithm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getImageAlgorithms().map((algo) => (
                      <SelectItem key={algo} value={algo}>
                        {algo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-encrypt-key">{t('imageEncryption.keyLabel')}</Label>
                <Input
                  id="image-encrypt-key"
                  type="password"
                  placeholder={t('imageEncryption.keyPlaceholder')}
                  value={encryptKey}
                  onChange={(e) => setEncryptKey(e.target.value)}
                />

                {encryptKey && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t('textEncryption.passwordStrength')}</span>
                      <span
                        className={
                          passwordStrength.level === 'weak'
                            ? 'text-red-500'
                            : passwordStrength.level === 'medium'
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }
                      >
                        {t(`common.${passwordStrength.message}`)}
                      </span>
                    </div>
                    <Progress value={strengthPercentage} className="h-2" />
                  </div>
                )}
              </div>

              {isEncrypting && (
                <div className="space-y-2">
                  <Progress value={encryptProgress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">{t('common.processing')}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleEncrypt}
                  disabled={isEncrypting || !encryptFile || !encryptKey.trim()}
                  className="flex-1"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  {isEncrypting ? t('common.processing') : t('imageEncryption.encryptButton')}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearEncrypt}
                  disabled={!encryptFile && !encryptKey && !encryptedData}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {encryptedData && (
                <Alert className="mt-4">
                  <span className="text-green-500">✓</span>
                  <AlertDescription className="flex items-center justify-between">
                    <span>{t('imageEncryption.encryptionSuccess')}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadEncrypted}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t('imageEncryption.downloadEncrypted')}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                {t('imageEncryption.decryptSection')}
              </CardTitle>
              <CardDescription>{t('imageEncryption.subtitle')}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onDrop={(e) => handleDrop(e, 'decrypt')}
                onDragOver={handleDragOver}
                onClick={() => decryptInputRef.current?.click()}
              >
                <input
                  ref={decryptInputRef}
                  type="file"
                  onChange={handleDecryptFileSelect}
                  className="hidden"
                />

                {decryptFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <FileImage className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {decryptFile.name} ({(decryptFile.size / 1024).toFixed(2)} KB)
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearDecrypt();
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('imageEncryption.removeImage')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-lg font-medium">{t('imageEncryption.dragDropImage')}</p>
                    <p className="text-sm text-muted-foreground">
                      {tr('imageEncryption.selectEncryptedFile', 'Select encrypted file')}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-decrypt-algorithm">{t('imageEncryption.algorithmLabel')}</Label>
                <Select value={decryptAlgorithm} onValueChange={setDecryptAlgorithm}>
                  <SelectTrigger id="image-decrypt-algorithm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getImageAlgorithms().map((algo) => (
                      <SelectItem key={algo} value={algo}>
                        {algo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-decrypt-key">{t('imageEncryption.keyLabel')}</Label>
                <Input
                  id="image-decrypt-key"
                  type="password"
                  placeholder={t('imageEncryption.keyPlaceholder')}
                  value={decryptKey}
                  onChange={(e) => setDecryptKey(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleDecrypt}
                  disabled={isDecrypting || !decryptFile || !decryptKey.trim()}
                  className="flex-1"
                  variant="secondary"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  {isDecrypting ? t('common.processing') : t('imageEncryption.decryptButton')}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearDecrypt}
                  disabled={!decryptFile && !decryptKey && !decryptedImage}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {decryptedImage && (
                <div className="space-y-4 mt-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">{t('imageEncryption.decryptedImage')}</p>
                    <img
                      src={decryptedImage}
                      alt="Decrypted"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDownloadDecrypted}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('imageEncryption.downloadDecrypted')}
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
