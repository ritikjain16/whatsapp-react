import imageCompression from "browser-image-compression";

export const CompressImage = async (imageFile) => {
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };
    try {
        // console.log(
        //   "originalFile instanceof Blob",
        //   imageFile instanceof Blob
        // ); // true
        // console.log(
        //   `originalFile size ${imageFile.size / 1024 / 1024} MB`
        // );
        const compressedFile = await imageCompression(
            imageFile,
            options
        );
        // console.log(
        //   "compressedFile instanceof Blob",
        //   compressedFile instanceof Blob
        // ); // true
        // console.log(
        //   `compressedFile size ${
        //     compressedFile.size / 1024 / 1024
        //   } MB`
        // ); // smaller than maxSizeMB
        //   console.log(compressedFile);
        return compressedFile;

    } catch (error) {
        console.log(error);
        return error;
    }
}