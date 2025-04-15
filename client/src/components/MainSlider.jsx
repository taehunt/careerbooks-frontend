/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

function MainSlider() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef(null);
  const startX = useRef(null);
  const isDragging = useRef(false);

  // ✅ 슬라이드 데이터 로딩
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/slides`)
      .then((res) => setSlides(res.data))
      .catch((err) => {
        console.error("슬라이드 불러오기 실패", err);
        setSlides([]); // 실패 시 빈 배열
      });
  }, []);

  useEffect(() => {
    if (slides.length > 0) startAutoSlide();
    return () => stopAutoSlide();
  }, [slides]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(goNext, 5000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const handleStart = (e) => {
    isDragging.current = true;
    startX.current = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
  };

  const handleEnd = (e) => {
    if (!isDragging.current) return;
    const endX =
      e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
    const deltaX = startX.current - endX;
    if (deltaX > 50) goNext();
    else if (deltaX < -50) goPrev();
    isDragging.current = false;
    startX.current = null;
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  if (slides.length === 0) return null;

  const slide = slides[index];

  return (
    <div
      className="relative w-full max-w-[100vw] overflow-hidden h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] text-white select-none"
      style={{
        backgroundImage: slide.image ? `url(${slide.image})` : "none",
        backgroundColor: slide.bgColor || "#000000",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/30 hover:bg-white/50 rounded-full z-20 transition"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/30 hover:bg-white/50 rounded-full z-20 transition"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute z-10 w-full h-full flex flex-col justify-center items-center px-4"
          style={{ textAlign: slide.textAlign || "center" }}
        >
          <h1
            className="font-bold mb-4"
            style={{
              fontSize: slide.fontSize || "40px",
            }}
          >
            {slide.title}
          </h1>
          <p className="text-lg sm:text-xl mb-6">{slide.subtitle}</p>
          <div className="flex gap-4">
            {slide.button1 && slide.button1Url && (
              <Link
                to={slide.button1Url}
                className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition duration-300 transform hover:scale-105"
              >
                {slide.button1}
              </Link>
            )}
            {slide.button2 && slide.button2Url && (
              <Link
                to={slide.button2Url}
                className="bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition duration-300 transform hover:scale-105"
              >
                {slide.button2}
              </Link>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default MainSlider;
