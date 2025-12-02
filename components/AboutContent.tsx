'use client';

import { useEffect, useState } from 'react';
import { StaticContent } from '@/types';
import { Home, Users, Award, Heart } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Users,
  Award,
  Heart,
};

export default function AboutContent() {
  const [content, setContent] = useState<StaticContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/static-content')
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <>
      {/* Main Story */}
      <section className="mb-12 rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">{content.ourStory.title}</h2>
        <div className="prose prose-lg max-w-none text-gray-700">
          {content.ourStory.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mb-12">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          {content.whatWeStandFor.title}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {content.whatWeStandFor.values.map((value, index) => {
            const IconComponent = value.icon ? iconMap[value.icon] || Home : Home;
            return (
              <div key={index} className="rounded-lg bg-white p-6 text-center shadow-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

