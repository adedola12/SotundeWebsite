import { useState } from "react";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23172035' width='400' height='300'/%3E%3Ctext fill='%23C9A96E' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function SafeImage({ src, alt = "", className = "", ...rest }) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(PLACEHOLDER)}
      loading="lazy"
      {...rest}
    />
  );
}
