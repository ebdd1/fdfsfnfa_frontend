import React, { useState, useRef, useEffect } from 'react';
import { X, Building2, MapPin, CheckCircle, Camera, Loader2, Navigation, AlertCircle } from 'lucide-react';
import { propertyService } from '../../services/api/property.service';
import { uploadService } from '../../services/api/upload.service';
import { getCurrentPosition, isWithinPalopo, type GeoLocation } from '../../services/geolocation.service';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProperty: any) => void;
}

// Approximate centroids per known city so a new listing's coordinates match the
// chosen city instead of always defaulting to Jakarta.
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  palopo: { lat: -2.9926, lng: 120.1923 },
  jakarta: { lat: -6.2088, lng: 106.8456 },
  bandung: { lat: -6.9175, lng: 107.6191 },
  surabaya: { lat: -7.2575, lng: 112.7521 },
};
const DEFAULT_COORDS = { lat: -2.5489, lng: 118.0149 }; // Indonesia centroid

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [modalState, setModalState] = useState<'entering' | 'open' | 'exiting' | 'closed'>('closed');
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Handle modal open/close animations
  useEffect(() => {
    if (isOpen && modalState === 'closed') {
      setModalState('entering');
      const timer = setTimeout(() => setModalState('open'), 10);
      return () => clearTimeout(timer);
    } else if (!isOpen && (modalState === 'entering' || modalState === 'open')) {
      setModalState('exiting');
      const duration = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--modal-close-dur')) || 150;
      const timer = setTimeout(() => setModalState('closed'), duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, modalState]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (modalState === 'entering' || modalState === 'open')) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalState, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    type: 'kost_campur',
    price: '',
    totalRooms: '1',
    lat: '',
    lng: '',
    facilities: [] as string[]
  });

  // Reset location state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsGettingLocation(false);
      setLocationError(null);
      setLocationSuccess(false);
    }
  }, [isOpen]);

  // Handle successful geolocation
  const handleLocationSuccess = (location: GeoLocation) => {
    setFormData(prev => ({
      ...prev,
      lat: location.latitude.toFixed(6),
      lng: location.longitude.toFixed(6)
    }));
    setIsGettingLocation(false);
    setLocationError(null);
    setLocationSuccess(true);

    // Check if within Palopo
    if (!isWithinPalopo(location.latitude, location.longitude)) {
      setLocationError('Lokasi di luar area Palopo. Kost tetap bisa ditambahkan.');
    }
  };

  // Handle geolocation error
  const handleLocationError = (error: { code: number; message: string }) => {
    setIsGettingLocation(false);
    setLocationError(error.message);
    setLocationSuccess(false);
  };

  // Share location handler
  const handleShareLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);
    setLocationSuccess(false);

    getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  if (modalState === 'closed') return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5 - photoFiles.length);
    setPhotoFiles(prev => {
      const next = [...prev, ...files];
      setPhotoPreviews(next.map(f => URL.createObjectURL(f)));
      return next;
    });
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    setFormData((prev: any) => ({ ...prev, [target.name]: target.value }));
  };

  const handleFacilityToggle = (facility: string) => {
    setFormData((prev: any) => ({
      ...prev,
      facilities: (prev.facilities || []).includes(facility)
        ? (prev.facilities || []).filter((f: string) => f !== facility)
        : [...(prev.facilities || []), facility]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Resolve coordinates: manual input wins, else city centroid, else default.
      const cityCoords = CITY_COORDS[formData.city.trim().toLowerCase()] ?? DEFAULT_COORDS;
      const lat = formData.lat !== '' ? Number(formData.lat) : cityCoords.lat;
      const lng = formData.lng !== '' ? Number(formData.lng) : cityCoords.lng;

      const payload = {
        name: formData.name,
        city: formData.city,
        address: formData.address,
        status: 'pending', // Kost is uploaded, pending admin verification
        lat,
        lng,
        facilities: formData.facilities,
        // priceMonthly seeds the room price; totalRooms creates N available rooms.
        priceMonthly: formData.price ? Number(formData.price) : undefined,
        totalRooms: Number(formData.totalRooms) || 1,
      };

      const newProperty = await propertyService.create(payload);

      // Upload photos and attach URLs to the newly created property.
      let media = [];
      if (photoFiles.length > 0) {
        setUploadingPhotos(true);
        try {
          const uploaded = await Promise.all(photoFiles.map(f => uploadService.uploadImage(f)));
          const urls = uploaded.map(r => r.url);
          const saved = await propertyService.addMedia(newProperty.id, urls);
          media = saved;
        } catch {
          // Photo upload failure is non-fatal; property is already created.
        } finally {
          setUploadingPhotos(false);
        }
      }

      onSuccess({ ...newProperty, media });
      setStep(3); // Success step
    } catch (error) {
      console.error('Failed to create property', error);
      alert('Gagal mengunggah kost. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="t-modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="t-modal bg-white w-full max-w-lg"
        data-state={modalState === 'entering' ? 'entering' : modalState === 'exiting' ? 'exiting' : 'open'}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 id="modal-title" className="text-lg font-black text-slate-800">Tambah Kost Baru</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Daftarkan kost Anda ke platform.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Tutup modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-5 animate-in slide-in-from-right-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Nama Kost</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Kost Menteng Suite"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Tipe Kost</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-all cursor-pointer"
                  >
                    <option value="kost_campur">Campur</option>
                    <option value="kost_putra">Putra</option>
                    <option value="kost_putri">Putri</option>
                    <option value="apartment">Apartemen</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Kota</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Contoh: Jakarta"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Alamat Lengkap</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap kost..."
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Photo upload strip */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Foto Kost <span className="normal-case font-normal text-slate-400">(maks 5 foto)</span></label>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {photoPreviews.map((src, i) => (
                    <div key={i} className="relative shrink-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                        <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                  {photoFiles.length < 5 && (
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 hover:border-[var(--primary-400)] flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-[var(--primary-600)] transition-colors cursor-pointer"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="text-[9px] font-bold">{photoFiles.length}/5</span>
                    </button>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.city || !formData.address}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm py-3 rounded-xl transition-all shadow-sm mt-4"
              >
                Lanjut ke Detail Kamar & Fasilitas
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-right-4">
              {/* Jumlah Kamar + Harga dalam 1 row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Jumlah Kamar</label>
                  <input
                    type="number"
                    name="totalRooms"
                    value={formData.totalRooms}
                    onChange={handleChange}
                    min="1"
                    placeholder="10"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-800 focus:outline-none focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Kamar 1–N otomatis dibuat</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Harga / Bulan</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">Rp</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="1500000"
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-800 focus:outline-none focus:border-[var(--primary-500)] focus:ring-1 focus:ring-[var(--primary-500)] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Share Location - GPS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Lokasi GPS</label>

                {/* Location status display */}
                <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-4 h-4 ${locationSuccess ? 'text-[var(--primary-500)]' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          {formData.lat && formData.lng ? (
                            <span className="text-[var(--primary-600)]">Lokasi Tersimpan</span>
                          ) : (
                            <span className="text-slate-500">Belum Ada Lokasi</span>
                          )}
                        </p>
                        {formData.lat && formData.lng && (
                          <p className="text-[10px] text-slate-400 font-mono">
                            {formData.lat}, {formData.lng}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Share Location Button */}
                    <button
                      type="button"
                      onClick={handleShareLocation}
                      disabled={isGettingLocation}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                        ${locationSuccess
                          ? 'bg-[var(--primary-100)] text-[var(--primary-700)] hover:bg-[var(--primary-200)]'
                          : 'bg-[var(--primary-600)] text-white hover:bg-[var(--primary-700)]'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      {isGettingLocation ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Mendapatkan Lokasi...
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3.5 h-3.5" />
                          {locationSuccess ? 'Update Lokasi' : 'Share Lokasi'}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Accuracy indicator */}
                  {locationSuccess && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[var(--primary-600)]">
                      <span className="w-1.5 h-1.5 bg-[var(--primary-500)] rounded-full"></span>
                      GPS aktif - Lokasi akurat
                    </div>
                  )}
                </div>

                {/* Error message */}
                {locationError && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">{locationError}</p>
                  </div>
                )}

                <p className="text-[11px] text-slate-400 mt-1">
                  Tekan "Share Lokasi" untuk otomatis mengisi koordinat GPS dari HP Anda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">Fasilitas Utama</label>
                <div className="flex flex-wrap gap-2">
                  {['WiFi', 'AC', 'Kamar Mandi Dalam', 'Parkir', 'Keamanan', 'Dapur', 'Laundry'].map(facility => (
                    <button
                      key={facility}
                      type="button"
                      onClick={() => handleFacilityToggle(facility)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        formData.facilities.includes(facility)
                          ? 'bg-[var(--primary-50)] text-[var(--primary-700)] border-[var(--primary-200)]'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {facility}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-sm py-3 rounded-xl transition-all"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingPhotos || !formData.price}
                  className="flex-[2] bg-[var(--primary-600)] hover:bg-[var(--primary-700)] disabled:bg-[var(--primary-200)] text-white font-extrabold text-sm py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting || uploadingPhotos ? (
                    <span className="flex items-center gap-2 justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {uploadingPhotos ? `Mengunggah ${photoFiles.length} foto...` : 'Mengunggah...'}
                    </span>
                  ) : 'Publish Kost'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="py-8 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 bg-[var(--primary-100)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--primary-600)]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">Kost Berhasil Diunggah!</h3>
              <p className="text-sm text-slate-500 font-medium mb-8">
                Kost Anda kini sedang dalam antrean moderasi. Jika disetujui, otomatis tampil di Dashboard Pencari.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm py-3 rounded-xl transition-all"
              >
                Kembali ke Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
