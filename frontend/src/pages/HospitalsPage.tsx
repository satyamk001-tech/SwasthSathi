import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { delhiHospitals, Hospital } from '../data/hospitals';
import { Search, MapPin, Phone, Star, Clock, Shield, Building2, ExternalLink, Navigation } from 'lucide-react';

export default function HospitalsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  const filteredHospitals = delhiHospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section id="hospitals" className="min-h-screen pt-16 py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            Delhi NCR
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('hospitals.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the best hospitals in Delhi with detailed information, ratings, and cashless facilities
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12 animate-fade-in-up stagger-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('hospitals.search')}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>
        </div>

        {/* Hospital Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital, index) => (
            <div
              key={hospital.id}
              onClick={() => setSelectedHospital(hospital)}
              className={`group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer animate-fade-in-up stagger-${(index % 4) + 1}`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {hospital.name}
                  </h3>
                </div>
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-medium text-white">{hospital.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Address */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{hospital.address}</span>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1">
                  {hospital.specialties.slice(0, 3).map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                    >
                      {specialty}
                    </span>
                  ))}
                  {hospital.specialties.length > 3 && (
                    <span className="px-2 py-1 text-xs text-muted-foreground">
                      +{hospital.specialties.length - 3}
                    </span>
                  )}
                </div>

                {/* Features */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Navigation className="w-4 h-4" />
                    <span>{hospital.distance} {t('hospitals.distance')}</span>
                  </div>
                  {hospital.cashless && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Shield className="w-4 h-4" />
                      {t('hospitals.cashless')}
                    </span>
                  )}
                  {hospital.emergency && (
                    <span className="flex items-center gap-1 text-red-600">
                      <Clock className="w-4 h-4" />
                      24/7
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No hospitals found matching your search</p>
          </div>
        )}
      </div>

      {/* Hospital Detail Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedHospital(null)}
          />
          <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-xl animate-scale-in overflow-hidden">
            {/* Image */}
            <div className="relative h-64">
              <img
                src={selectedHospital.image}
                alt={selectedHospital.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <button
                onClick={() => setSelectedHospital(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                ×
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {selectedHospital.rating}
                  </span>
                  {selectedHospital.emergency && (
                    <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">
                      24/7 Emergency
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">{selectedHospital.name}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{selectedHospital.address}</p>
                  <p className="text-sm text-muted-foreground">{selectedHospital.distance} km away</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{selectedHospital.phone}</p>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedHospital.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <a
                  href={`tel:${selectedHospital.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {t('hospitals.call')}
                </a>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors">
                  <MapPin className="w-4 h-4" />
                  {t('hospitals.viewMap')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
