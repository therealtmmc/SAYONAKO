import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { KahootButton } from './KahootButton';
import { PopupModal } from './PopupModal';

interface InstallPWAProps {
  children?: React.ReactNode;
  className?: string;
}

export function InstallPWA({ children, className }: InstallPWAProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // If no prompt available (already installed, or not supported/triggered), show instructions
      setShowInstructions(true);
    }
  };

  return (
    <>
      {children ? (
        <button onClick={handleInstallClick} className={className} title="Install App">
          {children}
        </button>
      ) : (
        <KahootButton 
          variant="success" 
          onClick={handleInstallClick}
          className="flex items-center gap-2 text-sm px-3 py-2 h-10 shadow-lg shadow-green-200"
        >
          <Download className="w-5 h-5" />
          <span className="hidden sm:inline">Install App</span>
        </KahootButton>
      )}

      <PopupModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)}
        title="Install App"
        variant="default"
      >
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto flex items-center justify-center">
            <Download className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="font-bold text-lg">How to Install</h3>
          
          {isIOS ? (
            <div className="text-left bg-slate-50 p-4 rounded-xl border-2 border-slate-100 text-sm space-y-2">
              <p>1. Tap the <strong>Share</strong> button <span className="inline-block px-1 bg-slate-200 rounded">⎋</span> in Safari</p>
              <p>2. Scroll down and tap <strong>Add to Home Screen</strong> <span className="inline-block px-1 bg-slate-200 rounded">＋</span></p>
            </div>
          ) : (
            <div className="text-left bg-slate-50 p-4 rounded-xl border-2 border-slate-100 text-sm space-y-2">
              <p>1. Tap the browser menu (three dots <strong>⋮</strong>)</p>
              <p>2. Select <strong>Install App</strong> or <strong>Add to Home Screen</strong></p>
            </div>
          )}
          
          <p className="text-xs text-slate-400">Note: This feature works best in Chrome (Android/Desktop) or Safari (iOS).</p>

          <KahootButton variant="primary" onClick={() => setShowInstructions(false)} className="w-full">
            Got it!
          </KahootButton>
        </div>
      </PopupModal>
    </>
  );
}
