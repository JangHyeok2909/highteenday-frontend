import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Banner.css";
import banner1 from "../../../../assets/banner1.jpg";

const banners: string[] = [banner1];

function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => setStartX(e.clientX);
  const handleMouseUp = (e: React.MouseEvent) => {
    const diff = e.clientX - startX;
    if (diff > 50) prevSlide();
    if (diff < -50) nextSlide();
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="main-banner">
      <div
        className="main-banner__viewport"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <div
          className="main-banner__track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((src, idx) => (
            <div key={idx} className="main-banner__slide">
              <img
                src={src}
                alt={`배너 ${idx + 1}`}
                className="main-banner__image"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              className="main-banner__arrow main-banner__arrow--left"
              onClick={prevSlide}
              aria-label="이전 배너"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="main-banner__arrow main-banner__arrow--right"
              onClick={nextSlide}
              aria-label="다음 배너"
            >
              <ChevronRight size={20} />
            </button>

            <div className="main-banner__dots">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`main-banner__dot ${
                    currentIndex === idx ? "main-banner__dot--active" : ""
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`${idx + 1}번 배너로 이동`}
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
