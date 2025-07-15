// import React, { useState, useRef } from 'react';
// import { Button, Spinner } from '@heroui/react';
// import { FaCamera, FaUpload } from 'react-icons/fa';
// import axios from 'axios';
// import { BASE_URL } from '../utils/constants';

// const ImageUpload = ({ onImageUpload, currentImageUrl, className = "" }) => {
//   const [isUploading, setIsUploading] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleFileSelect = (event) => {
//     console.log('File select handler called', event.target.files);
//     const file = event.target.files[0];
//     if (file) {
//       console.log('File selected:', file.name, file.type, file.size);
//       // Validate file type
//       if (!file.type.startsWith('image/')) {
//         alert('Please select an image file');
//         return;
//       }
      
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size must be less than 5MB');
//         return;
//       }
      
//       // Create preview
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         console.log('File preview created');
//         setPreviewUrl(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const uploadImage = async () => {
//     if (!previewUrl) return;

//     setIsUploading(true);
//     try {
//       const response = await axios.post(
//         `${BASE_URL}/profile/upload/profile`,
//         { image: previewUrl },
//         { withCredentials: true }
//       );

//       if (response.data.success) {
//         onImageUpload(response.data.imageUrl);
//         setPreviewUrl(null);
//         if (fileInputRef.current) {
//           fileInputRef.current.value = '';
//         }
//       }
//     } catch (error) {
//       console.error('Upload failed:', error);
//       const errorMessage = error.response?.data?.error || error.message || 'Failed to upload image. Please try again.';
//       alert(errorMessage);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleUploadClick = () => {
//     console.log('Upload click handler called');
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className={`relative ${className}`}>
//       {/* Image Display with Click Handler */}
//       <div className="relative">
//         <img
//           alt="Profile photo"
//           className="object-cover rounded-xl w-full h-80 cursor-pointer transition-all duration-200 hover:opacity-80"
//           src={previewUrl || currentImageUrl || 'https://via.placeholder.com/400x400?text=Upload+Photo'}
//           onClick={handleUploadClick}
//         />
        
//         {/* Upload Overlay - Always visible on hover */}
//         <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/30 rounded-xl">
//           <Button
//             color="primary"
//             variant="flat"
//             startContent={<FaCamera />}
//             onPress={handleUploadClick}
//             className="bg-black/70 text-white hover:bg-black/80"
//           >
//             Change Photo
//           </Button>
//         </div>
//       </div>

//       {/* Hidden File Input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={handleFileSelect}
//         className="hidden"
//       />

//       {/* Upload Button (shown when preview is available) */}
//       {previewUrl && (
//         <div className="mt-4 flex gap-2">
//           <Button
//             color="primary"
//             startContent={isUploading ? <Spinner size="sm" /> : <FaUpload />}
//             onPress={uploadImage}
//             isLoading={isUploading}
//             className="flex-1"
//           >
//             {isUploading ? 'Uploading...' : 'Upload Photo'}
//           </Button>
//           <Button
//             color="default"
//             variant="flat"
//             onPress={() => {
//               setPreviewUrl(null);
//               if (fileInputRef.current) {
//                 fileInputRef.current.value = '';
//               }
//             }}
//           >
//             Cancel
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUpload; 