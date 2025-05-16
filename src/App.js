import React, { useState } from 'react';
import Webcam from 'react-webcam';
import './App.css';

const App = () => {
  const [images, setImages] = useState([]); // To hold captured images and their statuses
  const [isUploading, setIsUploading] = useState(false); // Flag to prevent duplicate uploads
  
  const webcamRef = React.useRef(null);

  // Capture image from webcam
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImages([...images, { src: imageSrc, status: 'Uploading...' }]); // Add new image with uploading status
    uploadImage(imageSrc); // Start upload after capture
  }, [images]);

  // Function to handle image upload
  const uploadImage = async (imageSrc) => {
    setIsUploading(true);
    
    // Form data for the image upload
    const formData = new FormData();
    const base64Data = imageSrc.split(',')[1]; // Get base64 data from image
    const imageBlob = new Blob([new Uint8Array(atob(base64Data).split("").map(c => c.charCodeAt(0)))], { type: 'image/jpeg' });
    formData.append('image', imageBlob, 'captured.jpg');

    try {
      const response = await fetch('http://https://your-backend-name.onrender.com:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Update image status to 'Uploaded'
        setImages(prevImages => prevImages.map(img => 
          img.src === imageSrc ? { ...img, status: 'Uploaded ✅' } : img
        ));
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="App">
      <h1>Event Photo Capture App</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        videoConstraints={{
          facingMode: "environment"
        }}
      />
      <button onClick={capture} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Capture'}
      </button>

      <div className="gallery">
        {images.map((image, index) => (
          <div key={index} className="image-preview">
            <img src={image.src} alt={`preview ${index}`} />
            <div>{image.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
