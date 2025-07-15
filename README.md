# DevTinder Web Frontend

A React-based frontend for DevTinder, a developer networking platform built with Vite.

## Features

### Profile Photo Upload
- **Interactive Upload**: Click on the profile photo in the Edit Profile section to upload a new image
- **Preview**: See a preview of your selected image before uploading
- **Validation**: Supports image files up to 5MB
- **Cloud Storage**: Images are automatically uploaded to Cloudinary and optimized
- **Real-time Update**: Profile photo updates immediately after successful upload

### How to Use Photo Upload
1. Navigate to the Edit Profile section
2. Hover over your profile photo in the preview card
3. Click "Change Photo" when the overlay appears
4. Select an image file from your device
5. Click "Upload Photo" to save the image
6. The photo will be automatically updated in your profile

## Tech Stack

- **React 18** with Vite for fast development
- **HeroUI** for modern UI components
- **Redux Toolkit** for state management
- **Axios** for API communication
- **Clerk** for authentication
- **Tailwind CSS** for styling

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## API Integration

The frontend communicates with the DevTinder backend API for:
- User authentication and profile management
- Image uploads via Cloudinary
- Real-time chat functionality
- Connection requests and networking features
