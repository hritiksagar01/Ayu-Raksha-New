// src/app/patient/dashboard/doctors/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Star, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';
import { translations } from '@/constants/translations';
import { getTranslation } from '@/lib/translations';
import { mockDoctors } from '@/lib/mockData';

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { selectedLanguage } = useStore();
  const doctor = mockDoctors.find((d) => d.id === params.id);

  const t = (key: string, fallback?: string) =>
    getTranslation(translations, key, selectedLanguage, fallback);

  if (!doctor) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-red-600 font-semibold">
              {t('doctorNotFound', 'Doctor not found')}
            </p>
            <Button onClick={() => router.back()} className="mt-4">
              {t('goBack', 'Go Back')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StarRating = ({ rating, showLabel = false }: { rating: number; showLabel?: boolean }) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      {showLabel && (
        <span className="text-gray-600 text-sm ml-2 font-semibold">
          {rating.toFixed(1)} / 5.0
        </span>
      )}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        ← {t('back', 'Back')}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="h-28 w-28">
                  <AvatarFallback className={`text-2xl ${doctor.type === 'doctor' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    {doctor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left flex-grow">
                  <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
                  <p className="text-md text-blue-600 font-semibold mt-1">{doctor.specialty}</p>
                  <div className="mt-2">
                    <StarRating rating={doctor.rating} showLabel />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>{t('about', 'About')} {doctor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>
                {doctor.type === 'doctor' ? t('services', 'Services') : t('facilities', 'Facilities')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {doctor.services.map((service, index) => (
                  <li key={index} className="flex items-start">
                    <Badge variant="outline" className="mr-2">
                      ✓
                    </Badge>
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contactInfo', 'Contact Information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <span className="text-gray-700">{doctor.phone}</span>
              </div>
              <Separator />
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                <span className="text-gray-700 break-all">{doctor.email}</span>
              </div>
              <Separator />
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <span className="text-gray-700">{doctor.address}</span>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>{t('reviews', 'Reviews')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-b pb-3">
                  <StarRating rating={5} />
                  <p className="text-gray-600 mt-1 text-sm">
                    "Excellent care and very professional."
                  </p>
                </div>
                <div className="border-b pb-3">
                  <StarRating rating={4} />
                  <p className="text-gray-600 mt-1 text-sm">
                    "Good experience, helpful staff."
                  </p>
                </div>
                <div>
                  <StarRating rating={5} />
                  <p className="text-gray-600 mt-1 text-sm">
                    "Highly recommended!"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Book Appointment */}
          <Button className="w-full" size="lg">
            <Calendar className="mr-2 h-5 w-5" />
            {t('bookAppointment', 'Book Appointment')}
          </Button>
        </div>
      </div>
    </div>
  );
}