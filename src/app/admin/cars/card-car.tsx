"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export interface CarProps {
  id: string;
  name: string;
  brand: string;
  type: string;
  transmission: string;
  seats: number;
  price_per_day: number;
  image_url: string;
  is_available: boolean;
}

export default function CardCar({ car }: { car: CarProps }) {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Hapus Mobil?',
      text: "Data mobil ini akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/cars?id=${car.id}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          Swal.fire(
            'Terhapus!',
            'Data mobil berhasil dihapus.',
            'success'
          ).then(() => {
            router.refresh();
            // Since we're in a client component, we might need a better way to refresh the list 
            // but router.refresh() should trigger a re-fetch if configured correctly.
            // Alternatively, the parent component could pass a refresh function.
            window.location.reload(); 
          });
        } else {
          const data = await res.json();
          Swal.fire('Gagal!', data.error || 'Gagal menghapus mobil', 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'Terjadi kesalahan pada server', 'error');
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group animate-fade-in">
      <div className="relative h-48 w-full bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm italic z-0">
          No Image Available
        </div>
        {car.image_url && (
          <img 
            src={car.image_url} 
            alt={`${car.brand} ${car.name}`}
            className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className={`absolute top-4 right-4 z-20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${car.is_available ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
            {car.is_available ? 'Ready' : 'Booked'}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{car.brand}</span>
            <h3 className="text-xl font-black text-slate-900 leading-tight">{car.name}</h3>
            <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-2">
              <span className="bg-slate-100 px-2 py-0.5 rounded">{car.transmission}</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">{car.seats} Seats</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-slate-900 font-black text-lg">Rp {car.price_per_day.toLocaleString('id-ID')}</span>
            <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">/ day</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Link href={`/admin/cars/edit/${car.id}`} className="flex-1 bg-slate-900 text-white text-center py-3 rounded-2xl text-xs font-black transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20">
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="px-6 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black transition-all hover:bg-rose-100 border border-rose-100"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

