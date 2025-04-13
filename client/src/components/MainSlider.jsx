import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "비전공자도 쉽게 따라하는",
    subtitle: "누구나 이직 가능한 실전 웹사이트 제작 가이드",
    button1: { text: "미리보기 보기", to: "/books/frontend01" },
    button2: { text: "전체 전자책 보기", to: "/books" },
  },
  {
    title: "지금 시작하는 웹개발 포트폴리오",
    subtitle: "나만의 웹서비스 만들기, 처음이어도 가능합니다",
    button1: { text: "0탄 무료 전자책", to: "/books/frontend00" },
    button2: { text: "포트폴리오 전자책", to: "/books?category=frontend" },
  },
  {
    title: "실전 프로젝트 기반 전자책",
    subtitle: "React, MongoDB 기반 클론 코딩 완벽 수록",
    button1: { text: "실전 프로젝트 보기", to: "/books/frontend02" },
    button2: { text: "전체 전자책 보기", to: "/books" },
  },
  {
    title: "HTML부터 Express까지 완전 정복",
    subtitle: "기초부터 실무까지 단계별 가이드 제공",
    button1: { text: "입문서 보기", to: "/books/frontend01" },
    button2: { text: "실무서 보기", to: "/books/frontend03" },
  },
];

function MainSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef(null);
  const startX = useRef(null);
  const isDragging = useRef(false);

  // 자동 슬라이드
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      goNext();
    }, 5000);
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
    const endX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
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

  const slide = slides[index];

  return (
    <div
      className="relative w-full overflow-hidden h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex justify-center items-center text-center px-4 select-none"
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
    >
      {/* 좌우 화살표 */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition z-10"
        onClick={goPrev}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full transition z-10"
        onClick={goNext}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* 슬라이드 콘텐츠 */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute w-full flex flex-col items-center select-none"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{slide.title}</h1>
          <p className="text-lg sm:text-xl mb-6">{slide.subtitle}</p>
          <div className="flex gap-4">
            <Link
              to={slide.button1.to}
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition duration-300 transform hover:scale-105"
            >
              {slide.button1.text}
            </Link>
            <Link
              to={slide.button2.to}
              className="bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition duration-300 transform hover:scale-105"
            >
              {slide.button2.text}
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 flex gap-2 z-10">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              i === index ? "bg-white" : "bg-white/50"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default MainSlider;
