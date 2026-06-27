import React, { useState } from 'react';
import { Camera, Check, AlertTriangle, X, Upload } from 'lucide-react';

interface VerificationPhotoProps {
  issueTitle: string;
  verdict: 'confirmed' | 'disputed';
  onPhotoSubmitted: (photoURL: string) => Promise<void>;
  onCancel: () => void;
}

export default function VerificationPhoto({
  issueTitle,
  verdict,
  onPhotoSubmitted,
  onCancel,
}: VerificationPhotoProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick preset sample photos to simulate camera/capture on standard devices
  const samplePhotos = [
    {
      name: 'Resolved patch',
      url: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a523?auto=format&fit=crop&w=600&q=80',
      label: 'Clear asphalt (Resolved proof)',
    },
    {
      name: 'Still dirty / Active issue',
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      label: 'Overflowing dump (Active dispute proof)',
    },
  ];

  const handleSubmit = async () => {
    if (!selectedPhoto) return;
    setIsSubmitting(true);
    try {
      await onPhotoSubmitted(selectedPhoto);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FFFBF4] border-2 border-[#1F3A5F] p-6 max-w-md w-full rounded-[2px] card-shadow space-y-5 animate-fade-in">
      <div className="flex justify-between items-start border-b border-[#1F3A5F]/15 pb-3">
        <div>
          <span className="font-mono text-[9px] font-bold text-[#1F3A5F]/60 uppercase tracking-widest block">
            NagarSeva Verification Camera
          </span>
          <h3 className="text-sm font-serif font-black text-[#1F3A5F] uppercase mt-0.5">
            Audit Case Proof Submission
          </h3>
        </div>
        <button onClick={onCancel} className="text-[#1F3A5F]/60 hover:text-[#1F3A5F]">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-1 bg-white p-3 border border-[#1F3A5F]/10">
        <span className="text-[8px] font-mono font-bold text-[#1F3A5F]/55 uppercase block">
          TARGET COMPLAINT TITLE
        </span>
        <p className="text-xs font-bold text-[#1F3A5F] truncate">{issueTitle}</p>
        <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase mt-1 px-1.5 py-0.5 rounded-[1px] ${
          verdict === 'confirmed' ? 'bg-[#3F6B4E]/10 text-[#3F6B4E]' : 'bg-[#B3211E]/10 text-[#B3211E]'
        }`}>
          {verdict === 'confirmed' ? '✓ CONFIRMING RESOLUTION' : '⚠️ DISPUTING CLOSURE'}
        </span>
      </div>

      {/* Select Photo Simulation / Real Drag Drop */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-[#1F3A5F]/75 uppercase block">
          Select or Capture Evidence Proof
        </span>

        {selectedPhoto ? (
          <div className="relative aspect-video rounded-[1px] overflow-hidden border border-[#1F3A5F]/20">
            <img src={selectedPhoto} alt="Selected proof" className="w-full h-full object-cover" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/85 text-white p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {samplePhotos.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhoto(photo.url)}
                className="border border-[#1F3A5F]/15 p-2 rounded-[1px] cursor-pointer bg-white hover:border-[#1F3A5F]/40 hover:shadow-xs transition-all space-y-1.5"
              >
                <img src={photo.url} alt={photo.name} className="w-full aspect-video object-cover rounded-[1px]" />
                <span className="text-[9px] font-mono text-[#1F3A5F]/70 block leading-tight truncate">
                  {photo.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 border-t border-[#1F3A5F]/15 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 border border-[#1F3A5F]/25 text-[#1F3A5F] py-2 text-xs font-bold uppercase tracking-wider rounded-[1px] hover:bg-[#1F3A5F]/5 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedPhoto || isSubmitting}
          className="flex-1 bg-[#1F3A5F] text-[#FFFBF4] py-2 text-xs font-bold uppercase tracking-wider rounded-[1px] hover:bg-[#152842] transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
        >
          <Camera className="w-4 h-4" /> {isSubmitting ? 'UPLOADING...' : 'Submit Proof'}
        </button>
      </div>
    </div>
  );
}
