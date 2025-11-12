import React, { useEffect, useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, RotateCw, Check, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageLightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  showActions?: boolean;
  title?: string;
}

export function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
  onApprove,
  onReject,
  showActions = false,
  title,
}: ImageLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setZoom(1);
      setRotation(0);
      return;
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'payment-proof';
    link.click();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Image Container */}
      <div className="relative max-h-[80vh] max-w-[90vw] overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] max-w-[90vw] object-contain transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            cursor: zoom > 1 ? 'move' : 'default',
          }}
          draggable={false}
        />
      </div>

      {/* Controls - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-2 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2 bg-black/60 rounded-lg p-2 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="text-white hover:bg-white/20"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-white text-sm font-medium min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="text-white hover:bg-white/20"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-white/20 mx-2" />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRotate}
            className="text-white hover:bg-white/20"
            title="Rotate"
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="text-white hover:bg-white/20"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Action Buttons */}
        {showActions && (onApprove || onReject) && (
          <div className="flex items-center gap-2 ml-4">
            {onApprove && (
              <Button
                onClick={() => {
                  onApprove();
                  onClose();
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve Payment
              </Button>
            )}
            {onReject && (
              <Button
                onClick={() => {
                  onReject();
                  onClose();
                }}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Payment
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        Press <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd> to close
      </div>
    </div>
  );
}
