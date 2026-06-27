import React, { useRef, useState } from 'react';
import { Camera, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface PhotoUploaderProps {
  onPhotoSelected: (file: File) => void;
  previewUrl: string | null;
  isValidating?: boolean;
  validationIssues?: string[];
}

export default function PhotoUploader({
  onPhotoSelected,
  previewUrl,
  isValidating = false,
  validationIssues = []
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoSelected(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onPhotoSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <span className="block text-xs font-bold text-[#1F3A5F]/70 uppercase tracking-wider font-sans">
        Upload Evidence Photo (Max 48h old)
      </span>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-[2px] p-6 text-center cursor-pointer transition-all min-h-[180px] flex flex-col justify-center items-center ${
          isDragOver
            ? 'border-[#B3211E] bg-[#B3211E]/5'
            : previewUrl
            ? 'border-[#3F6B4E]/30 bg-[#3F6B4E]/5'
            : 'border-[#1F3A5F]/20 bg-white hover:border-[#1F3A5F]/40'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative w-full max-w-[240px] aspect-video rounded-[1px] overflow-hidden border border-[#1F3A5F]/15 shadow-sm">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#1F3A5F]/5 flex items-center justify-center mx-auto text-[#1F3A5F]/60">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-[#1F3A5F] font-sans">
              Drag & drop photo or click to select
            </p>
            <p className="text-[10px] text-[#1F3A5F]/60 font-mono">
              JPEG, PNG formats accepted
            </p>
          </div>
        )}
      </div>

      {isValidating && (
        <div className="p-3 bg-[#E8B33D]/10 border border-[#E8B33D]/30 text-[#1F3A5F] rounded-[1px] text-xs font-sans flex items-center gap-2 animate-pulse">
          <AlertCircle className="w-4 h-4 text-[#E8B33D]" />
          <span>Analyzing photo quality and location metadata using Gemini...</span>
        </div>
      )}

      {validationIssues.length > 0 && (
        <div className="p-3 bg-[#B3211E]/10 border border-[#B3211E]/30 text-[#B3211E] rounded-[1px] text-xs font-sans space-y-1">
          <p className="font-bold">⚠️ Quality concerns detected:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {validationIssues.map((issue, idx) => (
              <li key={idx} className="font-mono text-[10px] uppercase">{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
