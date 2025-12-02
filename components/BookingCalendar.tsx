'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Users } from 'lucide-react';
import { Property } from '@/types';

interface BookingCalendarProps {
  property: Property;
  onBookingSubmit: (data: {
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => void;
}

export default function BookingCalendar({
  property,
  onBookingSubmit,
}: BookingCalendarProps) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const days = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days * property.pricePerNight;
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(calculateTotalPrice());

  const handleBookNow = () => {
    if (checkIn && checkOut && guests > 0) {
      onBookingSubmit({
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        guests,
      });
      setShowBookingForm(true);
    }
  };

  const perNightFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.pricePerNight);

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-xl">
      {/* Price Header - Airbnb Style */}
      <div className="mb-6">
        <div className="mb-1 flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-gray-900">
            {perNightFormatted}
          </span>
          <span className="text-base font-normal text-gray-600">night</span>
        </div>
      </div>

      {/* Date Selection - Airbnb Style */}
      <div className="mb-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Check-in */}
          <div className="rounded-lg border border-gray-300 p-3 hover:border-gray-900 transition-colors cursor-pointer">
            <label className="mb-1 block text-xs font-semibold text-gray-700 uppercase">
              Check-in
            </label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => {
                setCheckIn(date);
                if (checkOut && date && date >= checkOut) {
                  setCheckOut(null);
                }
              }}
              minDate={minDate}
              excludeDateIntervals={
                checkOut
                  ? [
                      {
                        start: checkOut,
                        end: new Date('2099-12-31'),
                      },
                    ]
                  : []
              }
              placeholderText="Add date"
              className="w-full border-none p-0 text-sm font-medium text-gray-900 focus:outline-none"
              dateFormat="MMM d"
            />
          </div>

          {/* Check-out */}
          <div className="rounded-lg border border-gray-300 p-3 hover:border-gray-900 transition-colors cursor-pointer">
            <label className="mb-1 block text-xs font-semibold text-gray-700 uppercase">
              Check-out
            </label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              minDate={checkIn || minDate}
              placeholderText="Add date"
              className="w-full border-none p-0 text-sm font-medium text-gray-900 focus:outline-none"
              dateFormat="MMM d"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="rounded-lg border border-gray-300 p-3 hover:border-gray-900 transition-colors">
          <label className="mb-1 block text-xs font-semibold text-gray-700 uppercase">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full border-none p-0 text-sm font-medium text-gray-900 focus:outline-none"
          >
            {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map(
              (num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'guest' : 'guests'}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Book Button - Airbnb Style */}
      <button
        onClick={handleBookNow}
        disabled={!checkIn || !checkOut || guests < 1}
        className="mb-4 w-full rounded-lg bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] px-6 py-4 text-base font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-300 disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:text-gray-500"
      >
        {showBookingForm ? 'Reserve' : 'Reserve'}
      </button>

      <p className="mb-4 text-center text-xs text-gray-600">
        You won't be charged yet
      </p>

      {/* Price Breakdown */}
      {checkIn && checkOut && (
        <div className="mb-4 space-y-3 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 underline">
              {perNightFormatted} × {Math.ceil(
                (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
              )} nights
            </span>
            <span className="text-gray-900">
              {formattedPrice}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 underline">Cleaning fee</span>
            <span className="text-gray-900">₹500</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 underline">Service fee</span>
            <span className="text-gray-900">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(calculateTotalPrice() * 0.1)}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                }).format(calculateTotalPrice() + 500 + calculateTotalPrice() * 0.1)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Report listing */}
      <button className="w-full text-center text-sm font-semibold text-gray-900 underline hover:text-gray-700">
        Report this listing
      </button>
    </div>
  );
}

