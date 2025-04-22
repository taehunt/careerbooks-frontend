// 파일 경로: root/client/src/pages/About.jsx

import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">📘 커리어북스 소개</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📌 커리어북스란?</h2>
        <p>
          커리어북스는 <strong>비전공자도 실전 웹 개발을 배워 바로 포트폴리오를 만들 수 있게 돕는 전자책 시리즈</strong>입니다.
          코딩 1도 몰라도 단계별로 따라오면 홈페이지 하나 뚝딱 완성됩니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">💡 시작하게 된 계기</h2>
        <p>
          부트캠프나 학원은 비싸고 진입 장벽도 높습니다. <br />
          <strong>누구나, 어디서든, 빠르게 시작할 수 있는 방법</strong>을 고민하다가 이 전자책을 만들게 되었습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🎯 전자책 구매 시 기대 효과</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>실제 프로젝트 완성으로 실무 흐름 체득</li>
          <li>완전 초보도 가능한 단계별 가이드</li>
          <li>결과물 = 포트폴리오로 바로 활용 가능</li>
          <li>현업에서 쓰는 실무 기술만 골라 담음</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🔥 왜 지금 이 전자책을 사야 할까요?</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>❌ 불필요한 이론 No! 실전 위주로 구성</li>
          <li>💬 이해를 돕는 친절한 설명과 예시</li>
          <li>⏱ 단기간에 실무 능력 습득 가능</li>
          <li>✅ 개발자 이직 성공률 UP!</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">💸 패키지 구매 시 이런 혜택이!</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>📦 단권보다 <strong>최대 50% 할인</strong></li>
          <li>🚀 전체 커리큘럼 빠르게 정리 가능</li>
          <li>🆕 <strong>추가 전자책 자동 제공</strong> (업데이트 시)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🌱 앞으로 기대해 주세요</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>📚 다양한 시리즈 지속 업데이트 예정</li>
          <li>🧭 개발자 로드맵 + 학습 자료 제공</li>
          <li>🎙 실무자 인터뷰, Q&A 콘텐츠도 준비 중</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🙋 회원가입은 선택이지만…</h2>
        <p>
          비회원도 구매는 가능하지만, <strong>회원가입 후 구매 시</strong>에는
          <br />
          <span className="text-blue-600">✅ 내가 구매한 전자책 확인</span> <br />
          <span className="text-blue-600">✅ 새로운 혜택 및 전자책 알림 제공</span> <br />
          <span className="text-blue-600">✅ 추후 강의/템플릿 혜택까지</span> 받을 수 있습니다!
        </p>
      </section>

      <div className="text-center">
        <Link
          to="/books"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded shadow transition"
        >
          전자책 둘러보기
        </Link>
      </div>
    </div>
  );
}
