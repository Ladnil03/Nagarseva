import React, { useState } from 'react';
import { CivicIssue } from '../../types';
import { ShieldAlert, Image, Calendar, User, Save, X, Sparkles } from 'lucide-react';

interface StatusUpdateModalProps {
  issue: CivicIssue;
  onClose: () => void;
  onUpdate: (payload: any) => Promise<void>;
}

export default function StatusUpdateModal({ issue, onClose, onUpdate }: StatusUpdateModalProps) {
  const [status, setStatus] = useState<string>(issue.status);
  const [workerName, setWorkerName] = useState<string>((issue as any).assignedWorker || '');
  const [expectedDate, setExpectedDate] = useState<string>((issue as any).expectedCompletionDate || '');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [actionComment, setActionComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available status transitions based on current state
  const allowedStatuses = (() => {
    switch (issue.status) {
      case 'reported':
        return ['verified', 'assigned'];
      case 'verified':
        return ['assigned'];
      case 'assigned':
        return ['in_progress'];
      case 'in_progress':
        return ['resolved'];
      case 'disputed':
      case 'falsely_closed':
      case 'chronic':
        return ['assigned', 'in_progress'];
      default:
        return [issue.status];
    }
  })();

  const handleSimulatePhotoUpload = (keyword: string) => {
    // Generate realistic stock photo
    const mapKeywords: Record<string, string> = {
      pothole: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
      work: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
      resolved: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80',
    };
    setImageUrl(mapKeywords[keyword] || mapKeywords.work);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Enforce matching evidence checks
    if (status === 'assigned') {
      if (!workerName.trim() || !expectedDate) {
        setError('Assignment requires filling Worker Name and expected Completion Date.');
        return;
      }
    } else if (status === 'in_progress') {
      if (!imageUrl) {
        setError('Repair initiation requires uploading a photo proof of crew arriving/commencing.');
        return;
      }
    } else if (status === 'resolved') {
      if (!imageUrl) {
        setError('Grievance closure requires uploading a final photo proof of the completed repair.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onUpdate({
        id: issue.id,
        status,
        workerName,
        expectedDate,
        imageUrl,
        actionComment
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update ticket status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 text-slate-800 font-sans">
      <div className="bg-white border border-slate-200 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1F3A5F] text-white p-4 flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono tracking-wider text-sky-200 uppercase font-bold">BBMP OFFICIAL TRANSITION LOGS</span>
            <h3 className="font-bold text-sm">Update Status: #{issue.id}</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleFormSubmit} className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[75vh]">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-[#FF4858] rounded text-xs font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> {error}
            </div>
          )}

          {/* Current State Info */}
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded text-xs font-mono">
            <div>📌 Ticket: <span className="font-bold text-slate-900">{issue.title}</span></div>
            <div className="mt-1">💼 Current Status: <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 font-bold rounded uppercase text-[10px]">{issue.status.replace('_', ' ')}</span></div>
          </div>

          {/* Status Select dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase font-mono">Set New Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#1F3A5F]"
            >
              <option value={issue.status}>-- Keep Current State ({issue.status}) --</option>
              {allowedStatuses.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Assignment Inputs (Conditioned) */}
          {status === 'assigned' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-md">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Crew / Worker Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. M. S. Kumar"
                  value={workerName}
                  onChange={e => setWorkerName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Target Resolution Date
                </label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={e => setExpectedDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-xs focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Evidence Upload Simulator (Conditioned) */}
          {(status === 'in_progress' || status === 'resolved') && (
            <div className="space-y-2 p-3 bg-rose-50/20 border border-rose-100 rounded-md">
              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
                <Image className="w-3.5 h-3.5" /> Photo Proof Required
              </label>
              
              {imageUrl ? (
                <div className="h-28 bg-slate-950 rounded-md overflow-hidden relative border border-slate-300">
                  <img src={imageUrl} alt="Uploaded Proof" className="w-full h-full object-contain" />
                  <button 
                    type="button" 
                    onClick={() => setImageUrl('')}
                    className="absolute top-1.5 right-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-700"
                  >
                    Clear Proof
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-500 italic">Select stock proof simulation (representing on-site camera clicks) to pass criteria:</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSimulatePhotoUpload('work')}
                      className="flex-1 py-2 border border-dashed border-slate-200 hover:border-slate-400 bg-white text-[10px] font-bold font-mono rounded text-slate-600 flex items-center justify-center gap-1"
                    >
                      🚧 Work Commenced
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSimulatePhotoUpload('resolved')}
                      className="flex-1 py-2 border border-dashed border-slate-200 hover:border-slate-400 bg-white text-[10px] font-bold font-mono rounded text-slate-600 flex items-center justify-center gap-1"
                    >
                      ✓ Repairs Finished
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase font-mono">Action Comment / Notes</label>
            <textarea
              placeholder="Provide transition comments, e.g. 'Crew arriving at location...'"
              value={actionComment}
              onChange={e => setActionComment(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1F3A5F]"
            />
          </div>

          {/* Submit Row */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#1F3A5F] hover:bg-[#152840] text-white font-bold text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSubmitting ? 'Recording Updates...' : 'Submit Official Action'}
          </button>
        </form>
      </div>
    </div>
  );
}
