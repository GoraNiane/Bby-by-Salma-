import React, { useRef, useState } from 'react';
import { Upload, X, Star, ArrowLeft, ArrowRight, Image as ImageIcon, CheckCircle, RefreshCw, Smartphone } from 'lucide-react';
import { compressImage } from '../../services/api';

export interface UploadedPhoto {
  id: string;
  url: string;
  file?: File;
  isPrimary: boolean;
  position: number;
}

interface PhotoUploaderProps {
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
  maxPhotos?: number;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onChange,
  maxPhotos = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = maxPhotos - photos.length;
    if (availableSlots <= 0) {
      alert(`Vous avez déjà atteint le maximum de ${maxPhotos} photos.`);
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);
    setIsCompressing(true);
    setUploadProgress(15);

    try {
      // Simulate progressive upload with real compression
      const processedPhotos: UploadedPhoto[] = [];

      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        
        // Advance progress bar
        setUploadProgress(Math.round(20 + ((i + 1) / filesToProcess.length) * 50));

        // Compress image on mobile client
        const compressed = await compressImage(file, 1200, 0.85);
        const objectUrl = URL.createObjectURL(compressed);

        // Also create base64 for persistent preview if needed
        processedPhotos.push({
          id: `local_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
          url: objectUrl,
          file: compressed,
          isPrimary: photos.length === 0 && i === 0,
          position: photos.length + i + 1
        });
      }

      setUploadProgress(90);
      await new Promise(r => setTimeout(r, 200));
      setUploadProgress(100);

      const updated = [...photos, ...processedPhotos].map((p, idx) => ({
        ...p,
        position: idx + 1,
        isPrimary: idx === 0 ? true : p.isPrimary
      }));

      // Ensure one primary
      if (!updated.some(p => p.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true;
      }

      onChange(updated);

      setTimeout(() => {
        setUploadProgress(null);
        setIsCompressing(false);
      }, 600);
    } catch (err) {
      console.error(err);
      setIsCompressing(false);
      setUploadProgress(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replacingIndex === null) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setUploadProgress(50);

    try {
      const compressed = await compressImage(file, 1200, 0.85);
      const objectUrl = URL.createObjectURL(compressed);

      setUploadProgress(100);

      const updated = [...photos];
      updated[replacingIndex] = {
        ...updated[replacingIndex],
        url: objectUrl,
        file: compressed
      };

      onChange(updated);

      setTimeout(() => {
        setUploadProgress(null);
        setIsCompressing(false);
        setReplacingIndex(null);
      }, 400);
    } catch (err) {
      console.error(err);
      setIsCompressing(false);
      setUploadProgress(null);
    }

    if (replaceInputRef.current) {
      replaceInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index).map((p, idx) => ({
      ...p,
      position: idx + 1,
      isPrimary: idx === 0 ? true : p.isPrimary
    }));

    if (!updated.some(p => p.isPrimary) && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    onChange(updated);
  };

  const setPrimary = (index: number) => {
    const updated = photos.map((p, i) => ({
      ...p,
      isPrimary: i === index
    }));
    onChange(updated);
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= photos.length) return;
    const updated = [...photos];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    const final = updated.map((p, idx) => ({
      ...p,
      position: idx + 1,
      isPrimary: idx === 0 ? true : (idx === toIndex && moved.isPrimary ? true : false)
    }));

    onChange(final);
  };

  // Drag & Drop handlers for desktop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    movePhoto(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Hidden native input for opening phone camera or gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        multiple
        className="hidden"
        onChange={handleFileSelection}
      />

      <input
        ref={replaceInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
        onChange={handleReplaceFile}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-semibold text-bbs-900">
            Galerie Photos du produit
          </label>
          <p className="text-xs text-bbs-600">
            {photos.length} / {maxPhotos} photos sélectionnées • La 1ère photo est l'image principale
          </p>
        </div>

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-bbs-900 hover:bg-bbs-800 text-white rounded-xl text-xs font-semibold shadow-md active:scale-95 transition-transform"
          >
            <Smartphone className="w-3.5 h-3.5 text-gold-300" />
            + Ajouter des photos
          </button>
        )}
      </div>

      {/* Upload Progress Bar */}
      {uploadProgress !== null && (
        <div className="p-3 bg-bbs-100 rounded-xl border border-bbs-300 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-semibold text-bbs-900 mb-1.5">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-bbs-600" />
              {uploadProgress < 100 ? `Optimisation & Upload... ${uploadProgress}%` : '✓ Photos ajoutées avec succès'}
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-bbs-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-bbs-600 to-gold-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {photos.map((photo, index) => (
          <div
            key={photo.id || index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative group bg-white rounded-2xl p-2 border-2 transition-all shadow-sm ${
              photo.isPrimary
                ? 'border-gold-500 ring-2 ring-gold-200 shadow-md'
                : 'border-bbs-200 hover:border-bbs-400'
            } ${draggedIndex === index ? 'opacity-40 scale-95' : 'opacity-100'}`}
          >
            {/* Position Badge */}
            <div className="absolute top-3 left-3 z-10 bg-bbs-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              #{index + 1}
            </div>

            {/* Primary Image Badge */}
            {photo.isPrimary && (
              <div className="absolute top-3 right-3 z-10 bg-gold-500 text-bbs-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-current" />
                Principale
              </div>
            )}

            {/* Image Thumbnail */}
            <div
              onClick={() => setPreviewImage(photo.url)}
              className="w-full aspect-square rounded-xl overflow-hidden bg-bbs-50 cursor-pointer relative"
            >
              <img
                src={photo.url}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Controls Bar (Mobile & Desktop) */}
            <div className="mt-2 flex items-center justify-between gap-1 pt-1 border-t border-bbs-100">
              {/* Set as Primary Button */}
              {!photo.isPrimary && (
                <button
                  type="button"
                  title="Définir comme photo principale"
                  onClick={() => setPrimary(index)}
                  className="p-1 text-bbs-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors text-xs"
                >
                  <Star className="w-4 h-4" />
                </button>
              )}

              {/* Move Left / Up */}
              <button
                type="button"
                disabled={index === 0}
                onClick={() => movePhoto(index, index - 1)}
                className={`p-1 rounded-lg ${
                  index === 0 ? 'text-bbs-300 cursor-not-allowed' : 'text-bbs-700 hover:bg-bbs-100'
                }`}
                title="Déplacer vers la gauche"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>

              {/* Move Right / Down */}
              <button
                type="button"
                disabled={index === photos.length - 1}
                onClick={() => movePhoto(index, index + 1)}
                className={`p-1 rounded-lg ${
                  index === photos.length - 1 ? 'text-bbs-300 cursor-not-allowed' : 'text-bbs-700 hover:bg-bbs-100'
                }`}
                title="Déplacer vers la droite"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Replace */}
              <button
                type="button"
                title="Remplacer cette photo"
                onClick={() => {
                  setReplacingIndex(index);
                  replaceInputRef.current?.click();
                }}
                className="p-1 text-bbs-600 hover:text-bbs-900 hover:bg-bbs-100 rounded-lg"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                type="button"
                title="Supprimer la photo"
                onClick={() => removePhoto(index)}
                className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Add photo slot button */}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-bbs-300 hover:border-bbs-600 bg-bbs-50/50 hover:bg-bbs-100/50 p-4 transition-all text-center group active:scale-95"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-bbs-600 group-hover:text-bbs-900 mb-2 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-bbs-900">
              + Photo {photos.length + 1}
            </span>
            <span className="text-[10px] text-bbs-500 mt-0.5">
              Galerie mobile ou glisser
            </span>
          </button>
        )}
      </div>

      {/* Full Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden p-2 shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Prévisualisation haute résolution"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
