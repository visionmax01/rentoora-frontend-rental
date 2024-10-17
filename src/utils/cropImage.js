import Cropper from "react-easy-crop";
import { createCanvas } from "canvas";

const getCroppedImg = (imageSrc, pixelCrop, rotation = 0) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = createCanvas(pixelCrop.width, pixelCrop.height);
      const ctx = canvas.getContext('2d');
      ctx.translate(pixelCrop.width / 2, pixelCrop.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-pixelCrop.width / 2, -pixelCrop.height / 2);
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    };
    image.onerror = reject;
  });
};

export default getCroppedImg;