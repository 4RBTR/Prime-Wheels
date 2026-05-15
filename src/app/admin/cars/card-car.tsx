import Image from "next/image";
import Link from "next/link";

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
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
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
        <div className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${car.is_available ? 'bg-emerald-500 text-slate-900' : 'bg-rose-500 text-slate-900'}`}>
            {car.is_available ? 'Available' : 'Booked'}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{car.brand} {car.name}</h3>
            <p className="text-xs font-medium text-slate-500 bg-slate-50 uppercase px-2 py-1 inline-block rounded mt-1">
              {car.transmission} • {car.seats} Seats
            </p>
          </div>
          <div className="text-right">
            <span className="text-amber-500 font-extrabold text-xl">Rp {car.price_per_day.toLocaleString('id-ID')}</span>
            <span className="text-slate-500 text-xs block">/ day</span>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Link href={`/admin/cars/edit/${car.id}`} className="flex-1 bg-slate-50 hover:bg-slate-200 text-slate-600 text-center py-2 rounded-lg text-sm font-semibold transition-colors">
            Edit
          </Link>
          <button className="px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-sm font-semibold transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
