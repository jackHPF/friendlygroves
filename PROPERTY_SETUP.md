# Property Setup Instructions

## Airbnb Listings Added

The following properties have been added to the system based on your Airbnb listings:

1. **Friendly Groves MVP** (`fgmvp`)
   - Location: MVP Colony, Visakhapatnam
   - Airbnb: https://www.airbnb.co.in/h/fgmvp

2. **Panorama Sea View Apartment** (`panoramaseaviewappt`)
   - Location: Beach Road, Visakhapatnam
   - Airbnb: https://www.airbnb.co.in/h/panoramaseaviewappt

3. **Rishikonda Bay View** (`rishikondabayview`)
   - Location: Rishikonda, Visakhapatnam
   - Airbnb: https://www.airbnb.co.in/h/rishikondabayview

4. **Century View** (`centuryview`)
   - Location: Century Towers, Visakhapatnam
   - Airbnb: https://www.airbnb.co.in/h/centuryview

5. **Mangroves Farm House** (`mangrovesframhouse`)
   - Location: Mangroves Area, Visakhapatnam
   - Airbnb: https://www.airbnb.co.in/h/mangrovesframhouse

## Next Steps

### 1. Add Property Images

You need to add images for each property to the `public/images/` directory:

- `fgmvp-1.jpg`, `fgmvp-2.jpg`, `fgmvp-3.jpg`, `fgmvp-4.jpg`
- `panoramaseaviewappt-1.jpg`, `panoramaseaviewappt-2.jpg`, `panoramaseaviewappt-3.jpg`, `panoramaseaviewappt-4.jpg`
- `rishikondabayview-1.jpg`, `rishikondabayview-2.jpg`, `rishikondabayview-3.jpg`, `rishikondabayview-4.jpg`
- `centuryview-1.jpg`, `centuryview-2.jpg`, `centuryview-3.jpg`, `centuryview-4.jpg`
- `mangrovesframhouse-1.jpg`, `mangrovesframhouse-2.jpg`, `mangrovesframhouse-3.jpg`, `mangrovesframhouse-4.jpg`

**To get images from Airbnb:**
1. Visit each Airbnb listing
2. Right-click on images and save them
3. Rename them according to the pattern above
4. Place them in the `public/images/` directory

### 2. Update Property Details

Edit `lib/data.ts` to update:
- Property descriptions (currently using placeholder text)
- Prices (currently using estimated prices)
- Bedrooms, bathrooms, max guests (verify from Airbnb listings)
- Amenities (add/remove based on actual property features)

### 3. Update Google Maps URLs

Each property has a Google Maps URL that opens when clicking the location icon. Update these in `lib/data.ts` with the exact coordinates or address:

1. Go to Google Maps
2. Search for the property address
3. Click "Share" → "Copy link"
4. Update the `googleMapsUrl` field in `lib/data.ts`

Or use coordinates format:
```
https://www.google.com/maps/search/?api=1&query=LATITUDE,LONGITUDE
```

### 4. Verify Property Information

Double-check all property information matches your Airbnb listings:
- Property names
- Locations
- Prices
- Descriptions
- Amenities
- Images

## Features Implemented

✅ All 5 Airbnb listings added to the system
✅ Contact Us page created at `/contact`
✅ About Us page created at `/about`
✅ Location icon now opens Google Maps when clicked
✅ Navigation updated to include Contact and About pages

## Testing

After adding images and updating details:
1. Run `npm run dev` to start the development server
2. Visit http://localhost:3000
3. Check the Properties page to see all listings
4. Click on location icons to verify Google Maps opens
5. Test the Contact and About pages
6. Verify all property detail pages load correctly

