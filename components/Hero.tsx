'use client';

export default function Hero() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {/* Background Image with Coastal Landscape */}
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.15)), url('/images/coastal-landscape.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundAttachment: 'fixed',
          }}
        />
        {/* Fallback gradient background for when image is loading */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-green-600 opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold md:text-6xl lg:text-7xl">
          Welcome to Friendly Groves
        </h1>
        <p className="mb-8 max-w-2xl text-lg md:text-xl lg:text-2xl">
          Discover your perfect stay in Vizag. Beautiful apartments, amazing
          amenities, and unforgettable experiences await you.
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <div className="h-8 w-8 rounded-full border-2 border-white"></div>
        </div>
      </div>
    </div>
  );
}

