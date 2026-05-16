import Link from "next/link";
import FormEditCar from "./form";
import { headers } from "next/headers";

export interface Car {
  id: string;
  name: string;
  brand: string;
  type: string;
  transmission: string;
  seats: number;
  price_per_day: number;
  quantity: number;
  admin_status: string;
  image_url: string;
  is_available: boolean;
}

async function getCarById(id: string): Promise<Car | null> {
  try {
    // Using a relative URL for internal API fetch in Server Component 
    // requires full URL if not using a proxy or certain configurations.
    // However, since we are in a server component, we can fetch from Supabase directly or call the local API.
    // Let's use the local API but we need to handle the base URL.
    // Actually, for simplicity and reliability in Server Components, let's just use Supabase directly here 
    // to avoid the "undefined URL" issue entirely.
    
    // Actually, I'll use the protocol + host from headers to construct the URL if I really want to hit the API.
    const host = (await headers()).get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const url = `${protocol}://${host}/api/cars?id=${id}`;
    
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }
    
    const responseBody = await response.json();
    return responseBody.car;
  } catch (error) {
    console.error("Error fetching car:", error);
    return null;
  }
}

type PageProp = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function EditCarPage(props: PageProp) {
  const id = (await props.params).id;
  const car = await getCarById(id);

  if (!car) {
    return (
      <div className="w-full p-10 text-center">
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl inline-block">
          <p className="text-amber-800 font-bold mb-4">
            Maaf, data mobil dengan ID {id} tidak ditemukan.
          </p>
          <Link href="/admin/cars" className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">
            Kembali ke Daftar Mobil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Edit Kendaraan</h1>
        <p className="text-slate-500 font-medium">
          Perbarui informasi unit {car.brand} {car.name} Anda.
        </p>
      </div>

      <div className="mb-8 text-sm font-bold flex items-center gap-2">
        <Link href="/admin/cars" className="text-slate-400 hover:text-slate-900 transition-colors">
          Cars
        </Link>
        <span className="text-slate-300">&gt;</span>
        <span className="text-slate-900">Edit {car.name}</span>
      </div>

      <FormEditCar car={car} />
    </div>
  );
}
