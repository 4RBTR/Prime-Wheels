"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Settings, ChevronRight } from 'lucide-react';
import styles from './page.module.css';

import { supabase } from '@/lib/supabase';

export default function CatalogPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Semua');
  const [categories, setCategories] = useState<string[]>(['Semua']);

  const [cars, setCars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, error } = await supabase.from('cars').select('*');
        if (data && !error) {
          setCars(data);
          const uniqueCategories = ['Semua', ...Array.from(new Set(data.map(c => c.type)))];
          setCategories(uniqueCategories as string[]);
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = activeTab === 'Semua' 
    ? cars 
    : cars.filter(c => c.type === activeTab);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const handleRentClick = (carId: string) => {
    router.push(`/checkout?carId=${carId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Katalog Kendaraan</h1>
        <p className={styles.subtitle}>Pilih dari berbagai koleksi kendaraan berkualitas kami, mulai dari mobil keluarga hingga kendaraan eksklusif layaknya VIP.</p>
      </div>

      <div className={styles.tabs}>
        {categories.map(cat => (
          <button 
            key={cat}
            className={`${styles.tab} ${activeTab === cat ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {isLoading ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '2rem 0' }}>Memuat katalog kendaraan...</div>
        ) : filteredCars.length === 0 ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '2rem 0' }}>Kategori ini sedang kosong.</div>
        ) : filteredCars.map(car => (
          <div key={car.id} className={styles.card}>
            <div className={styles.imagePlaceholder}>
              {car.image_url ? (
                <img src={car.image_url} alt={car.name} className={styles.carImage} loading="lazy" />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No Image</div>
              )}
              <span className={`${styles.badge} ${car.type === 'SUV' ? styles.exclusiveBadge : car.type === 'Sedan' ? styles.premiumBadge : ''}`}>
                {car.type}
              </span>
            </div>
            
            <div className={styles.content}>
              <h3 className={styles.carName}>{car.brand} {car.name}</h3>
              <p className={styles.carType}>{car.type}</p>
              
              <div className={styles.features}>
                <div className={styles.feature}>
                  <Users size={16} />
                  <span>{car.seats} Kursi</span>
                </div>
                <div className={styles.feature}>
                  <Settings size={16} />
                  <span>{car.transmission}</span>
                </div>
              </div>

              <div className={styles.priceContainer}>
                <div>
                  <div className={styles.priceLabel}>Mulai dari</div>
                  <div className={styles.priceValue}>{formatPrice(car.price_per_day)}<span className={styles.pricePeriod}>/hari</span></div>
                </div>
                <button onClick={() => handleRentClick(car.id)} className={styles.rentBtn} aria-label="Sewa Sekarang">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
