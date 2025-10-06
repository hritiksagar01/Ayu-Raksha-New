// src/app/patient/dashboard/doctors/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import { mockDoctors } from '@/lib/mockData';
import type { Doctor } from '@/types';

export default function FindDoctorsPage() {
  const router = useRouter();
  const { selectedLanguage } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('All');
  const [location, setLocation] = useState('Near Me');
  const [results, setResults] = useState<Doctor[]>(mockDoctors);

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  useEffect(() => {
    let filtered = mockDoctors.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const specialtyMatch = item.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const termMatch = nameMatch || specialtyMatch;

      const specialtyFilterMatch = specialty === 'All' || item.specialty === specialty;
      const locationFilterMatch = location === 'Near Me' || item.location === location;

      return termMatch && specialtyFilterMatch && locationFilterMatch;
    });

    setResults(filtered);
  }, [searchTerm, specialty, location]);

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('findDoctors', 'Find Doctors')}
        </h1>
        <p className="text-gray-600 mt-1">
          {t('findDoctorsDescription', 'Search for doctors and hospitals near you')}
        </p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t('searchDoctors', 'Search by name or specialty...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specialty">{t('specialty', 'Specialty')}</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger id="specialty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t('all', 'All')}</SelectItem>
                  <SelectItem value="General Physician">{t('generalPhysician', 'General Physician')}</SelectItem>
                  <SelectItem value="Cardiologist">{t('cardiologist', 'Cardiologist')}</SelectItem>
                  <SelectItem value="Pediatrician">{t('pediatrician', 'Pediatrician')}</SelectItem>
                  <SelectItem value="Dermatologist">{t('dermatologist', 'Dermatologist')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">{t('location', 'Location')}</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Near Me">{t('nearMe', 'Near Me')}</SelectItem>
                  <SelectItem value="Mumbai">{t('mumbai', 'Mumbai')}</SelectItem>
                  <SelectItem value="Delhi">{t('delhi', 'Delhi')}</SelectItem>
                  <SelectItem value="Kochi">{t('kochi', 'Kochi')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className={doctor.type === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}>
                      {doctor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-grow">
                    <p className="font-bold text-lg text-gray-800">{doctor.name}</p>
                    <p className="text-sm text-blue-600 font-medium">{doctor.specialty}</p>
                    <div className="mt-1">
                      <StarRating rating={doctor.rating} />
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end w-full sm:w-auto space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {doctor.distance}
                    </div>
                    <Button
                      onClick={() => router.push(`/patient/dashboard/doctors/${doctor.id}`)}
                      className="w-full sm:w-auto"
                    >
                      {t('viewProfile', 'View Profile')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-gray-500">{t('noDoctorsFound', 'No doctors found')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}