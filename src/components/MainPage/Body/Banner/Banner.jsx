import React, { useEffect, useState } from "react";
import "./Banner.css";
import Arrow_Left_Icon from "../../../Icons/Arrow_Left_Icon";
import Arrow_right_Icon from "../../../Icons/Arrow_Right_Icon";
import "../../../Default.css"

function Banner({ width = "100%", height = "300px" }) {

  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const banners = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // 배너 이전 클릭
  const prevSlide = () => {
      setCurrentIndex( (prev) => (prev - 1 + banners.length) % banners.length);
  };
  // 배너 다음 클릭
  const nextSlide = () => {
      setCurrentIndex( (prev) => (prev + 1) % banners.length);
  };
  
  const handleMouseLeftSlide = (e) => setStartX(e.clientX);
  const handleMouseRightSlide = (e) => {
      const diff = e.clientX - startX;
      if(diff > 50) prevSlide();
      if(diff < -50) nextSlide();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
   <div id="banner">    
        <div style={{ width, height }} 
            className="banner-container"
            onMouseDown={handleMouseLeftSlide}
            onMouseUp={handleMouseRightSlide}
            >
          {/* <div id="banner-content">{banners[currentIndex]}</div> */}
          <div
            className="banner-track"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {banners.map((banner, idx) => (
              <div className="banner-slide" key={idx}>
                {banner}
              </div>
            ))}
          </div>

          <div id="indicators">
            {banners.map((_, idx) => (
              <span 
                key={idx}
                className={`dot ${currentIndex === idx ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}>
              </span>
            ))}
          </div>
        </div>

        <div className="banner-arrow left" onClick={prevSlide}>
          <Arrow_Left_Icon size={50} strokeWidth={1.5} color={"white"} />
        </div>
        <div className="banner-arrow right" onClick={nextSlide}>
          <Arrow_right_Icon size={50} strokeWidth={1.5} color={"white"} />
        </div>
   </div>
  );
}

export default Banner;