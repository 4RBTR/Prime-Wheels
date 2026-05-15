"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Upload, Car, Settings, Users, DollarSign, Tag, Type } from "lucide-react";
import Image from "next/image";

export default function AddCarForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    type: "SUV",
    transmission: "Automatic",
    seats: 4,
    price_per_day: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!imageFile) {
      toast.error("Mohon unggah foto mobil.");
      return;
    }
    
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("brand", formData.brand);
      submitData.append("type", formData.type);
      submitData.append("transmission", formData.transmission);
      submitData.append("seats", formData.seats.toString());
      submitData.append("price_per_day", formData.price_per_day.toString());
      submitData.append("image", imageFile);

      const response = await fetch("/api/cars", {
        method: "POST",
        body: submitData,
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Gagal menambahkan mobil");
      }
      
      toast.success("Mobil berhasil ditambahkan!");
      
      setTimeout(() => {
        router.push("/admin/cars");
        router.refresh();
      }, 1500);
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menambahkan mobil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Car className="w-6 h-6 mr-2 text-blue-600" />
          Detail Kendaraan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column - Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Tag className="w-4 h-4 mr-2 text-slate-400" /> Nama Mobil
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Contoh: Avanza Veloz 2023"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Type className="w-4 h-4 mr-2 text-slate-400" /> Merek (Brand)
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Contoh: Toyota"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                  <Car className="w-4 h-4 mr-2 text-slate-400" /> Tipe Mobil
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="SUV">SUV</option>
                  <option value="MPV">MPV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sport">Sport / Luxury</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                  <Settings className="w-4 h-4 mr-2 text-slate-400" /> Transmisi
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                  <Users className="w-4 h-4 mr-2 text-slate-400" /> Kapasitas Kursi
                </label>
                <input
                  type="number"
                  name="seats"
                  min="2"
                  max="60"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2 text-slate-400" /> Harga / Hari
                </label>
                <input
                  type="number"
                  name="price_per_day"
                  min="0"
                  value={formData.price_per_day || ''}
                  onChange={handleChange}
                  placeholder="Rp..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="flex flex-col h-full">
            <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
              <Upload className="w-4 h-4 mr-2 text-slate-400" /> Foto Mobil
            </label>
            
            <div 
              className={`flex-1 min-h-[250px] border-2 border-dashed rounded-xl relative overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all ${
                imagePreview ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-slate-100'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
              />
              
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium flex items-center bg-black/50 px-4 py-2 rounded-lg">
                      <Upload className="w-4 h-4 mr-2" /> Ganti Foto
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Klik untuk mengunggah foto</p>
                  <p className="text-xs text-slate-500">PNG, JPG atau WEBP (Maks. 5MB)</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      <div className="px-6 md:px-8 py-5 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-70 flex items-center"
        >
          {loading ? (
            <>Memproses...</>
          ) : (
            <>Simpan Kendaraan</>
          )}
        </button>
      </div>
    </form>
  );
}
