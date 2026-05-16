"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Upload, Car, Settings, Users, DollarSign, Tag, Type } from "lucide-react";
import Image from "next/image";
import { Car as CarType } from "./page";

type Props = {
  car: CarType;
};

export default function FormEditCar({ car }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(car.image_url);
  
  const [formData, setFormData] = useState({
    id: car.id,
    name: car.name,
    brand: car.brand,
    type: car.type,
    transmission: car.transmission,
    seats: car.seats,
    price_per_day: car.price_per_day,
    quantity: car.quantity || 1,
    admin_status: car.admin_status || "Available",
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
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("id", formData.id);
      submitData.append("name", formData.name);
      submitData.append("brand", formData.brand);
      submitData.append("type", formData.type);
      submitData.append("transmission", formData.transmission);
      submitData.append("seats", formData.seats.toString());
      submitData.append("price_per_day", formData.price_per_day.toString());
      submitData.append("quantity", formData.quantity.toString());
      submitData.append("admin_status", formData.admin_status);
      
      if (imageFile) {
        submitData.append("image", imageFile);
      }

      const response = await fetch("/api/cars", {
        method: "PATCH",
        body: submitData,
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Gagal memperbarui mobil");
      }
      
      toast.success("Mobil berhasil diperbarui!");
      
      setTimeout(() => {
        router.push("/admin/cars");
        router.refresh();
      }, 1500);
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal memperbarui mobil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl animate-fade-in">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                <Tag className="w-3 h-3 mr-2" /> Nama Mobil
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                <Type className="w-3 h-3 mr-2" /> Merek (Brand)
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <Car className="w-3 h-3 mr-2" /> Tipe
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-900"
                >
                  <option value="SUV">SUV</option>
                  <option value="MPV">MPV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sport">Sport / Luxury</option>
                </select>
              </div>

              <div>
                <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <Settings className="w-3 h-3 mr-2" /> Transmisi
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-900"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <Users className="w-3 h-3 mr-2" /> Kursi
                </label>
                <input
                  type="number"
                  name="seats"
                  min="2"
                  value={formData.seats}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <DollarSign className="w-3 h-3 mr-2" /> Harga / Hari
                </label>
                <input
                  type="number"
                  name="price_per_day"
                  min="0"
                  value={formData.price_per_day}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <Settings className="w-3 h-3 mr-2" /> Jumlah Unit
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <Car className="w-3 h-3 mr-2" /> Status Admin
                </label>
                <select
                  name="admin_status"
                  value={formData.admin_status}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-900"
                >
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="flex flex-col h-full">
            <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              <Upload className="w-3 h-3 mr-2" /> Foto Unit
            </label>
            
            <div 
              className={`flex-1 min-h-[300px] border-2 border-dashed rounded-3xl relative overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-all ${
                imagePreview ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 bg-slate-50'
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
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white font-black flex items-center bg-slate-900/60 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/20">
                      <Upload className="w-4 h-4 mr-2" /> Ganti Foto Unit
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <Upload className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-600">Klik untuk unggah foto</p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 text-slate-500 font-bold hover:text-slate-900 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
