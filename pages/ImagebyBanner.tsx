import image1 from "@/public/static/images/slide-1.jpg";
import React from "react";
export const images: string[] = [
  image1.src,
];

const ImagebyBanner = (index: number): string => {
  return images[index % images.length];
};

// export const images: string[] = [image1, image2, image3, image4]

// const imageByIndex = (index: number): string => images[index % images.length]


export default ImagebyBanner;
