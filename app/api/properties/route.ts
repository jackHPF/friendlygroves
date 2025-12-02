import { NextResponse } from 'next/server';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  togglePropertyVisibility,
  getAllPropertiesForAdmin,
} from '@/lib/data';
import { Property, PropertyFormData } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const slug = searchParams.get('slug');
  const admin = searchParams.get('admin') === 'true';

  const { getPropertyById, getPropertyBySlug, getAllPropertiesForAdmin, getAllProperties } = await import('@/lib/data');

  if (id) {
    const property = await getPropertyById(id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  }

  if (slug) {
    const property = await getPropertyBySlug(slug);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  }

  // Admin view includes hidden properties
  const properties = admin ? await getAllPropertiesForAdmin() : await getAllProperties();
  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  try {
    const data: PropertyFormData = await request.json();

    // Validate required fields
    if (
      !data.name ||
      !data.location ||
      !data.city ||
      !data.description ||
      !data.slug ||
      typeof data.pricePerNight !== 'number' ||
      typeof data.maxGuests !== 'number' ||
      typeof data.bedrooms !== 'number' ||
      typeof data.bathrooms !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { getPropertyBySlug, createProperty } = await import('@/lib/data');
    const existing = await getPropertyBySlug(data.slug);
    if (existing) {
      return NextResponse.json(
        { error: 'Property with this slug already exists' },
        { status: 409 }
      );
    }

    const newProperty = await createProperty({
      name: data.name,
      location: data.location,
      city: data.city,
      address: data.address,
      description: data.description,
      pricePerNight: data.pricePerNight,
      maxGuests: data.maxGuests,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      images: data.images || [],
      videos: data.videos || [],
      amenities: data.amenities || [],
      slug: data.slug,
      featured: data.featured || false,
      hidden: data.hidden || false,
      googleMapsUrl: data.googleMapsUrl,
      airbnbUrl: data.airbnbUrl,
      houseRules: data.houseRules || [],
      cancellationPolicy: data.cancellationPolicy || '',
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data: PropertyFormData & { id: string } = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Check if slug is being changed and if it conflicts
    const { getPropertyById, getPropertyBySlug, updateProperty } = await import('@/lib/data');
    const existingProperty = await getPropertyById(data.id);
    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    if (data.slug && data.slug !== existingProperty.slug) {
      const existing = await getPropertyBySlug(data.slug);
      if (existing) {
        return NextResponse.json(
          { error: 'Property with this slug already exists' },
          { status: 409 }
        );
      }
    }

    const updatedProperty = await updateProperty(data.id, {
      name: data.name,
      location: data.location,
      city: data.city,
      address: data.address,
      description: data.description,
      pricePerNight: data.pricePerNight,
      maxGuests: data.maxGuests,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      images: data.images || [],
      videos: data.videos || [],
      amenities: data.amenities || [],
      slug: data.slug,
      featured: data.featured || false,
      hidden: data.hidden || false,
      googleMapsUrl: data.googleMapsUrl,
      airbnbUrl: data.airbnbUrl,
      houseRules: data.houseRules || [],
      cancellationPolicy: data.cancellationPolicy || '',
    });

    if (!updatedProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const { deleteProperty } = await import('@/lib/data');
    const deleted = await deleteProperty(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    if (action === 'toggle-visibility') {
      const { togglePropertyVisibility } = await import('@/lib/data');
      const updatedProperty = await togglePropertyVisibility(id);
      if (!updatedProperty) {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(updatedProperty);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

