# Property Videos

This directory stores uploaded video files for properties.

## Supported Formats

- MP4 (recommended)
- WebM
- OGG
- QuickTime (MOV)

## File Size Limit

- Maximum file size: 100MB per video

## Upload via Admin Panel

Videos can be uploaded through the property management form at `/admin/properties/new` or `/admin/properties/[id]/edit`.

## File Naming

Uploaded files are automatically renamed with a timestamp and random string to prevent conflicts:
- Format: `{timestamp}-{random}.{extension}`
- Example: `1703123456789-abc123def456.mp4`

## Access

Uploaded videos are accessible via:
- URL: `/videos/{filename}`
- Example: `/videos/1703123456789-abc123def456.mp4`

