// 파일 경로: root/client/src/pages/About.jsx

import React from "react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">📘 커리어북스 소개</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📌 커리어북스란?</h2>
        <p>
          커리어북스는 개발 완전 생초보도, 실무에 필요한 핵심 지식만 빠르게 배우고
          취업 및 이직까지 이어질 수 있도록 돕는 실무형 전자책 시리즈입니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">💡 시작하게 된 계기</h2>
        <p>
          개발을 배우고 싶지만 학원이나 부트캠프 비용이 부담되는 분들, 기초를 아예
          모르는 분들이 혼자서도 실무에 가까운 결과물을 만들 수 있도록 돕고자
          전자책을 만들게 되었습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🎯 구매 시 기대할 수 있는 점</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>실제 프로젝트를 통해 실무 흐름을 익힐 수 있음</li>
          <li>완전 초보자도 따라할 수 있도록 단계별 설명</li>
          <li>직접 사용 가능한 결과물 (포트폴리오 제작용)</li>
          <li>업계에서 실제 사용하는 기술 위주로 구성</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🔥 왜 이 전자책을 구매해야 하나요?</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>수많은 강의/책을 요약한 실전 중심 구성</li>
          <li>코드 복붙이 아닌 이해를 돕는 친절한 설명</li>
          <li>시간과 비용을 아끼고 빠르게 시작 가능</li>
          <li>현직자가 직접 집필한 신뢰도 높은 콘텐츠</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🎁 패키지 구매 시 혜택</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>단권 구매보다 더 저렴한 가격</li>
          <li>전체 흐름을 빠르게 정리할 수 있음</li>
          <li>지속적으로 추가될 전자책도 빠르게 습득</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🌱 앞으로 기대할 수 있는 점</h2>
        <ul className="list-disc ml-5 space-y-1">
          <li>지속적인 시리즈 확장</li>
          <li>기술별 로드맵 제공</li>
          <li>실무자 인터뷰, Q&A, 템플릿 제공 등 부가 콘텐츠</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">🙋 회원가입은 선택이지만...</h2>
        <p>
          비회원도 구매, 크몽에서 구매도 가능하지만, 회원가입 후 구매하시면 마이페이지에서 내가
          구매한 책을 바로 확인할 수 있으며, 추후 추가되는 전자책 및 혜택에 대한
          알림도 받아보실 수 있습니다.
        </p>
      </section>
    </div>
  );
}
