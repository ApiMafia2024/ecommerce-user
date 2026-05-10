'use client';

import { useState, useRef, useEffect, useCallback, DragEvent, ChangeEvent } from 'react';
import { AlertCircle, Upload, CheckCircle2, ImageIcon, FileText, File, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface UploadedFile {
  id: string;
  name: string;
  progress: number;
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  maxSize?: number; // in MB
  className?: string;
  uploadUrl?: string; // Optional: URL for actual file upload
}

export function FileUpload({
  onFilesChange,
  maxSize = 10,
  className = '',
  uploadUrl,
}: FileUploadProps) {
  const t = useTranslations('FileUpload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  // Cleanup intervals and abort controllers on unmount
  useEffect(() => {
    return () => {
      // Clear all intervals
      intervalRefs.current.forEach((interval) => clearInterval(interval));
      intervalRefs.current.clear();
      
      // Abort all ongoing uploads
      abortControllersRef.current.forEach((controller) => controller.abort());
      abortControllersRef.current.clear();
    };
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return t('errors.sizeLimit', { maxSize });
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/log',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return t('errors.typeNotAllowed');
    }

    return null;
  }, [maxSize, t]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
      // Reset input to allow selecting the same file again
      e.target.value = '';
    }
  };

  const uploadFile = useCallback(async (fileId: string, file: File) => {
    if (!uploadUrl) {
      // Simulate upload if no URL provided
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          intervalRefs.current.delete(fileId);
          
          setUploadedFiles((prev) =>
            prev.map((f) => 
              f.id === fileId 
                ? { ...f, progress: 100, status: 'completed' as const }
                : f
            )
          );
        } else {
          setUploadedFiles((prev) =>
            prev.map((f) => 
              f.id === fileId 
                ? { ...f, progress: Math.min(progress, 100), status: 'uploading' as const }
                : f
            )
          );
        }
      }, 200);
      
      intervalRefs.current.set(fileId, interval);
      return;
    }

    // Real file upload
    const formData = new FormData();
    formData.append('file', file);
    
    const abortController = new AbortController();
    abortControllersRef.current.set(fileId, abortController);

    try {
      setUploadedFiles((prev) =>
        prev.map((f) => 
          f.id === fileId 
            ? { ...f, status: 'uploading' as const }
            : f
        )
      );

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadedFiles((prev) =>
            prev.map((f) => 
              f.id === fileId 
                ? { ...f, progress: Math.min(progress, 99), status: 'uploading' as const }
                : f
            )
          );
        }
      });

      await new Promise<void>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadedFiles((prev) =>
              prev.map((f) => 
                f.id === fileId 
                  ? { ...f, progress: 100, status: 'completed' as const }
                  : f
              )
            );
            abortControllersRef.current.delete(fileId);
            resolve();
          } else {
            reject(new Error(t('errors.uploadFailedStatus', { status: xhr.status })));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error(t('errors.uploadFailed')));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error(t('errors.uploadCancelled')));
        });

        xhr.open('POST', uploadUrl);
        xhr.send(formData);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('errors.uploadFailed');
      setUploadedFiles((prev) =>
        prev.map((f) => 
          f.id === fileId 
            ? { ...f, status: 'error' as const, error: errorMessage }
            : f
        )
      );
      abortControllersRef.current.delete(fileId);
    }
  }, [t, uploadUrl]);

  const handleFiles = useCallback((files: File[]) => {
    setErrorMessage(null);
    const errors: string[] = [];
    const validFiles: File[] = [];

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setErrorMessage(errors.join('; '));
    }

    if (validFiles.length === 0) return;

    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      progress: 0,
      file,
      status: 'pending' as const,
    }));

    setUploadedFiles((prev) => {
      const next = [...prev, ...newFiles];
      onFilesChange?.(next.map(f => f.file));
      return next;
    });

    // Start uploads
    newFiles.forEach((file) => {
      uploadFile(file.id, file.file);
    });
  }, [validateFile, onFilesChange, uploadFile]);

  const removeFile = useCallback((id: string) => {
    // Clear interval if exists
    const interval = intervalRefs.current.get(id);
    if (interval) {
      clearInterval(interval);
      intervalRefs.current.delete(id);
    }

    // Abort upload if in progress
    const controller = abortControllersRef.current.get(id);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(id);
    }

    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    
    // Update parent component
    const remainingFiles = uploadedFiles.filter((f) => f.id !== id).map((f) => f.file);
    onFilesChange?.(remainingFiles);
  }, [uploadedFiles, onFilesChange]);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return ImageIcon;
    }
    if (ext === 'pdf') {
      return FileText;
    }
    if (['doc', 'docx'].includes(ext || '')) {
      return FileText;
    }
    if (['txt', 'log'].includes(ext || '')) {
      return FileText;
    }
    return File;
  };

  return (
    <div className={className}>
      <label 
        htmlFor="file-upload-input"
        className="text-sm font-bold uppercase tracking-wide text-[#4e8597] dark:text-gray-400 block mb-2"
      >
        {t('label')}
      </label>
      
      {errorMessage && (
        <div 
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mr-2 align-middle inline-block" />
          {errorMessage}
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={t('aria.dropzone')}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center 
          cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${isDragging
            ? 'border-primary bg-primary/5'
            : 'border-[#d0e1e7] dark:border-[#3a424a] hover:border-primary/50'
          }
          bg-background-light/50 dark:bg-background-dark/30
        `}
      >
        <input
          id="file-upload-input"
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
          accept="image/*,.pdf,.doc,.docx,.txt,.log"
          aria-label={t('aria.input')}
        />
        
        <Upload className="w-10 h-10 text-[#4e8597] dark:text-gray-400 mb-2 block mx-auto" />
        <p className="text-sm font-bold text-[#0f141a] dark:text-white">
          {t('dropzone.prefix')}{' '}
          <span className="text-primary">{t('dropzone.browse')}</span>
        </p>
        <p className="text-xs text-[#4e8597] dark:text-gray-400 mt-1">
          {t('dropzone.hint', { maxSize })}
        </p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2" role="list" aria-label={t('aria.uploadedFiles')}>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              role="listitem"
              className={`p-4 border rounded-lg flex items-center gap-4 ${
                file.status === 'error'
                  ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                  : 'border-[#d0e1e7] dark:border-[#3a424a] bg-background-light/30 dark:bg-background-dark/30'
              }`}
            >
              {file.status === 'error' ? (
                <AlertCircle className={`w-5 h-5 text-red-500`} aria-hidden="true" />
              ) : file.status === 'completed' ? (
                <CheckCircle2 className={`w-5 h-5 text-green-500`} aria-hidden="true" />
              ) : (
                (() => {
                  const IconComponent = getFileIcon(file.name);
                  return <IconComponent className="w-5 h-5 text-primary" aria-hidden="true" />;
                })()
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="truncate max-w-[200px] text-[#0f141a] dark:text-white" title={file.name}>
                    {file.name}
                  </span>
                  <span className={`ml-2 ${
                    file.status === 'error' 
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-primary'
                  }`}>
                    {file.status === 'error' 
                      ? t('status.failed')
                      : file.status === 'completed'
                      ? t('status.done')
                      : `${Math.round(file.progress)}%`
                    }
                  </span>
                </div>
                {file.status === 'error' && file.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mb-1">
                    {file.error}
                  </p>
                )}
                {file.status !== 'completed' && file.status !== 'error' && (
                  <div className="w-full bg-[#e7f0f3] dark:bg-[#3a424a] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        file.status === 'pending'
                          ? 'bg-red-500'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${file.progress}%` }}
                      role="progressbar"
                      aria-valuenow={Math.round(file.progress)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={t('aria.progress', { fileName: file.name })}
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="text-[#4e8597] dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded"
                aria-label={t('aria.remove', { fileName: file.name })}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
