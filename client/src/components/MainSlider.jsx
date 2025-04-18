/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

axios.defaults.withCredentials = true;

const API = import.meta.env.VITE_API_BASE_URL;

function MainSlider() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    axios
      .get(`${API}/api/admin/slides`)
      .then((res) => setSlides(res.data))
      .catch((err) => {
        console.error("슬라이드 불러오기 실패", err);
        setSlides([]);
      });
  }, []);

  useEffect(() => {
    if (slides.length > 0) startAutoSlide();
    return () => stopAutoSlide();
  }, [slides]);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => goNext(), 5000);
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
    startX.current =
      e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
  };
  const handleEnd = (e) => {
    if (!isDragging.current) return;
    const endX =
      e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
    const delta = startX.current - endX;
    if (delta > 50) goNext();
    else if (delta < -50) goPrev();
    isDragging.current = false;
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  if (slides.length === 0) return null;

  const slide = slides[index];
  // ★ 이미지 URL을 API가 아닌 클라이언트 퍼블릭 경로로만 사용
  const imageUrl = slide.image;  

  return (
    <div
      className="relative w-full overflow-hidden h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] select-none"
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      <button
        onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 p-2 rounded-full"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 p-2 rounded-full"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute w-full h-full bg-center bg-cover z-10"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/60 z-0" />
          <div
            className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-white"
            style={{ textAlign: slide.textAlign || "center" }}
          >
            <h1
              className="font-bold mb-4"
              style={{ fontSize: slide.fontSize || "40px" }}
            >
              {slide.title}
            </h1>
            <p className="text-lg sm:text-xl mb-6">{slide.subtitle}</p>
            <div className="flex gap-4">
              {slide.button1 && slide.button1Url && (
                <Link
                  to={slide.button1Url}
                  className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-white/50 transition"
                >
                  {slide.button1}
                </Link>
              )}
              {slide.button2 && slide.button2Url && (
                <Link
                  to={slide.button2Url}
                  className="bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition"
                >
                  {slide.button2}
                </Link>
              )}
            </div>
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
          />
        ))}
      </div>
    </div>
  );
}

export default MainSlider;