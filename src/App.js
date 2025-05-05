import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

// Set the server URL (where your backend is running)
const SERVER_URL = 'http://localhost:3001'; // Make sure your backend is running here

function App() {
  const webcamRef = useRef(null);  // Webcam reference
  const [uploaded, setUploaded] = useState(false); // Track if the photo was uploaded
  const [preview, setPreview] = useState(null);    // Store the preview image
  const [uploading, setUploading] = useState(false); // Track the upload state

  // Function to capture image from webcam and upload it
  const captureAndUpload = () => {
    const imageSrc = webcamRef.current.getScreenshot(); // Get screenshot from webcam
    setPreview(imageSrc); // Set the preview image

    setUploading(true); // Start the upload process

    // Create a FormData object to send the image to the server
    fetch(imageSrc)
      .then(res => res.blob()) // Convert image to blob
      .then(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'photo.jpg'); // Append image to FormData

        // Send the image to the backend server
        fetch(`${SERVER_URL}/upload`, {
          method: 'POST',
          body: formData,
        })
          .then(res => res.json()) // Check server response
          .then(() => {
            setUploaded(true); // Mark upload as successful
            setUploading(false); // Stop the uploading state
          })
          .catch(err => {
            console.error('Upload failed:', err); // Handle errors
            setUploading(false); // Stop the uploading state
          });
      });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Event Photo Capture</h2>

      {/* Webcam component */}
      <Webcam
        audio={false}  // No audio
        ref={webcamRef}  // Reference to the webcam
        screenshotFormat="image/jpeg" // Screenshot format
        width={800}  // Width of the webcam display
        height={600} // Height of the webcam display
        style={{ marginBottom: '10px' }} // Style for spacing
      />

      {/* Button to trigger image capture and upload */}
      <div>
        <button onClick={captureAndUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Capture & Upload'}
        </button>
      </div>

      {/* Display preview of the captured image */}
      {preview && (
        <div style={{ marginTop: '20px' }}>
          <h4>Preview</h4>
          <img
            src={preview}  // Display the preview image
            alt="Captured"
            width="400"  // Set the width of the image
            style={{
              border: uploaded ? '4px solid green' : '4px solid gray',  // Green border if uploaded
              borderRadius: '10px',  // Round the corners of the image
            }}
          />
          {uploaded && <p style={{ color: 'green' }}>✅ Uploaded</p>}  {/* Display success message */}
        </div>
      )}
    </div>
  );
}

export default App;
