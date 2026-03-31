import { toast } from 'sonner';

export const copyToClipboard = async (text: string, successMessage?: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage || 'Copied to clipboard!');
    return true;
  } catch (error) {
    toast.error('Failed to copy to clipboard');
    return false;
  }
};

export const readFromClipboard = async (): Promise<string | null> => {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    toast.error('Failed to read from clipboard');
    return null;
  }
};
