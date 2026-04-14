import React, { useEffect, useState, useCallback } from "react";
import "./Banner.css";
import banner1 from "../../../../assets/banner1.jpg";
// import banner2 from "../../../../assets/banner2.jpg";
// import banner3 from "../../../../assets/banner3.jpg";

const banners = [
  banner1,
  // banner2,
  // banner3,
];

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, []);

  const handleMouseDown = (e) => setStartX(e.clientX);
  const handleMouseUp = (e) => {
    const diff = e.clientX - startX;
    if (diff > 50) prevSlide();
    if (diff < -50) nextSlide();
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div id="banner">
      <div
        className="banner-container"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div
          className="banner-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((src, idx) => (
            <div key={idx} className="banner-slide">
              <img src={src} alt={`배너 ${idx + 1}`} className="banner-image" draggable={false} />
            </div>
          ))}
        </div>

        {banners.length > 1 && (
          <>
            <button className="banner-arrow left" onClick={prevSlide} aria-label="이전">
              &#8249;
            </button>
            <button className="banner-arrow right" onClick={nextSlide} aria-label="다음">
              &#8250;
            </button>

            <div className="banner-indicators">
              {banners.map((_, idx) => (
                <span
                  key={idx}
                  className={`dot ${currentIndex === idx ? "active" : ""}`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Banner;
