import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";
import { getFirebaseStorage, isFirebaseActive } from "./firebase";

/**
 * Compresses an image file and uploads it to Firebase Storage, or returns a Base64 string fallback.
 * @param {File} file Original image file uploaded by citizen
 * @returns {Promise<string>} Download URL from storage or base64 data string
 */
export async function uploadIssuePhoto(file: File): Promise<string> {
  // Compression options
  const options = {
    maxSizeMB: 0.8, // Maximum file size of 800KB
    maxWidthOrHeight: 1200, // Reasonable sizing
    useWebWorker: true,
  };

  try {
    console.log("Compressing image...");
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed from ${file.size / 1024 / 1024}MB to ${compressedFile.size / 1024 / 1024}MB`);

    if (isFirebaseActive()) {
      const storage = getFirebaseStorage();
      const filename = `issues/${Date.now()}_${compressedFile.name}`;
      const fileRef = ref(storage, filename);
      
      console.log("Uploading compressed file to Firebase storage...");
      const snapshot = await uploadBytes(fileRef, compressedFile);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } else {
      // Offline base64 fallback so the application remains 100% functional
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = (err) => {
          reject(err);
        };
      });
    }
  } catch (err) {
    console.error("Failed to compress or upload image:", err);
    throw new Error("Could not process photo evidence. Ensure it is a valid JPG/PNG.");
  }
}
