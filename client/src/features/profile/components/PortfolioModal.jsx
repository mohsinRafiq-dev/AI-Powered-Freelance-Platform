

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input, Textarea } from '../../../components/ui/input';
import { useUploadPortfolioImage } from '../hooks/usePortfolio';
import { toast } from 'react-hot-toast';

export const PortfolioModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const uploadImage = useUploadPortfolioImage();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    image: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setImagePreview(initialData.image || '');
      setImageFile(null);
    } else {
      setFormData({
        title: '',
        description: '',
        url: '',
        image: '',
      });
      setImagePreview('');
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a project title');
      return;
    }
    
    try {
      let finalFormData = { ...formData };
      
      // If user uploaded a new image file, upload it first
      if (imageFile) {
        const loadingToast = toast.loading('Uploading image...');
        try {
          const uploadResult = await uploadImage.mutateAsync(imageFile);
          toast.dismiss(loadingToast);
          
          if (uploadResult?.data?.imageUrl) {
            // The imageUrl already includes /uploads/filename
            // Just need to prepend the server base URL
            const apiBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const serverBaseURL = apiBaseURL.replace('/api', '');
            finalFormData.image = `${serverBaseURL}${uploadResult.data.imageUrl}`;
            console.log('Uploaded image URL:', finalFormData.image);
            toast.success('Image uploaded successfully! 📸');
          }
        } catch (uploadError) {
          toast.dismiss(loadingToast);
          toast.error('Failed to upload image');
          console.error('Upload error:', uploadError);
          return; // Don't proceed if image upload fails
        }
      }
      
      // Save the portfolio item with the image URL
      onSave(finalFormData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        url: '',
        image: '',
      });
      setImageFile(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error submitting portfolio:', error);
      toast.error('Failed to save portfolio item');
    }
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      console.log('File selected:', file.name, file.size, 'bytes');
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        console.log('Preview created for:', file.name);
      };
      reader.readAsDataURL(file);
      
      // Clear the URL field since we're using file upload
      setFormData({ ...formData, image: '' });
    }
  };
  
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, image: url });
    setImagePreview(url);
    // Clear file if user enters URL
    if (url) {
      setImageFile(null);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      image: '',
    });
    setImageFile(null);
    setImagePreview('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-brand/20 dark:border-brand-light/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
                    {initialData ? (
                      <Save className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-white" />
                    )}
                  </div>
                  {initialData ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="E.g., E-commerce Platform"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your project, technologies used, and your role..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project URL
                  </label>
                  <Input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Image
                  </label>
                  
                  {/* File Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="flex-1 border-2 border-brand text-brand hover:bg-brand hover:text-white"
                      disabled={uploadImage.isPending}
                    >
                      {uploadImage.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      {imageFile ? 'Change Image' : 'Upload Image'}
                    </Button>
                  </div>
                  
                  {/* Or divider */}
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">or enter URL</span>
                    </div>
                  </div>
                  
                  {/* Image URL Input */}
                  <Input
                    type="url"
                    value={formData.image}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={!!imageFile}
                  />
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-3 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {imageFile && (
                        <div className="absolute top-2 right-2 bg-brand text-white text-xs px-2 py-1 rounded-md">
                          New Upload
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Upload an image (max 5MB) or enter an image URL
                  </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand-deepest text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={uploadImage.isPending}
                  >
                    {uploadImage.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {uploadImage.isPending ? 'Uploading...' : (initialData ? 'Update' : 'Add') + ' Portfolio Item'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleClose}
                    variant="outline"
                    className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    disabled={uploadImage.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
