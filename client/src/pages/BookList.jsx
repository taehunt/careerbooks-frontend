// 파일 경로: root/client/src/pages/BookList.jsx

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
const API = import.meta.env.VITE_API_BASE_URL;

export default function BookList() {
	const [books, setBooks] = useState([]);
	const [pagination, setPagination] = useState({ page: 1, pages: 1 });
	const [currentPage, setCurrentPage] = useState(1);
  
	// 설명 편집기 관련 상태
	const [showEditor, setShowEditor] = useState(false);
	const [selectedSlug, setSelectedSlug] = useState("");
	const [editorContent, setEditorContent] = useState("");
	const [loadingDesc, setLoadingDesc] = useState(false);
  
	const location = useLocation();
	const categoryLabels = {
	  frontend: "프론트엔드 개발",
	  backend: "백엔드 개발",
	  planning: "웹기획",
	  planner: "웹기획",
	  design: "웹디자인",
	};
  
	const getCategoryFromURL = () => {
	  const params = new URLSearchParams(location.search);
	  return params.get("category");
	};
	const category = getCategoryFromURL();
  
	// 1) 페이지네이션 포함한 목록 불러오기
	useEffect(() => {
	  const params = new URLSearchParams();
	  if (category) params.append("category", category);
	  params.append("page", currentPage);
	  params.append("limit", 10);
  
	  axios
		.get(`${API}/api/books?${params.toString()}`)
		.then((res) => {
		  setBooks(res.data.books);
		  setPagination(res.data.pagination);
		})
		.catch((err) => console.error("도서 목록 불러오기 실패:", err));
	}, [category, currentPage]);
  
	// 2) 설명 편집기 오픈 시, 선택된 slug의 설명 불러오기
	useEffect(() => {
	  if (showEditor && selectedSlug) {
		setLoadingDesc(true);
		axios
		  .get(`${API}/api/books/${selectedSlug}/description`)
		  .then((res) => setEditorContent(res.data.description || ""))
		  .catch((err) => console.error("설명 불러오기 실패:", err))
		  .finally(() => setLoadingDesc(false));
	  }
	}, [showEditor, selectedSlug]);
  
	const handleSave = async () => {
	  try {
		await axios.put(`${API}/api/books/${selectedSlug}/description`, {
		  description: editorContent,
		});
		alert("설명이 저장되었습니다.");
		setShowEditor(false);
	  } catch (err) {
		console.error(err);
		alert("설명 저장 중 오류 발생");
	  }
	};
  
	return (
	  <div className="space-y-8">
		{/* 상단 경로 */}
		<div className="text-sm text-blue-600 mb-4 space-x-1">
		  <Link to="/" className="hover:underline">
			홈
		  </Link>
		  <span>&gt;</span>
		  <Link to="/books" className="hover:underline">
			전자책 목록
		  </Link>
		  {category && (
			<>
			  <span>&gt;</span>
			  <Link to={`/books?category=${category}`} className="hover:underline">
				{categoryLabels[category] || category}
			  </Link>
			</>
		  )}
		</div>
  
		<h1 className="text-3xl font-bold text-gray-800">전자책 목록</h1>
  
		{/* 고정 높이 + overflow-hidden */}
		<div className="h-[600px] overflow-hidden">
		  {books.length === 0 ? (
			<p className="text-gray-500">등록된 전자책이 없습니다.</p>
		  ) : (
			books.map((book) => (
			  <div
				key={book.slug}
				className="bg-white shadow rounded-lg p-6 mb-4 transition hover:shadow-lg hover:-translate-y-1"
			  >
				<h2 className="text-xl font-semibold text-blue-600">
				  {book.titleIndex}. {book.title}
				</h2>
				<p className="text-gray-700 mt-2">{book.description}</p>
				<p className="font-semibold text-blue-600 mb-6 text-lg">
				  {book.originalPrice && book.originalPrice > book.price ? (
					<>
					  <span className="line-through text-gray-400 mr-2 text-base">
						{book.originalPrice.toLocaleString()}원
					  </span>
					  <span className="text-red-600 font-bold">
						{book.price.toLocaleString()}원
					  </span>
					  <span className="ml-2 text-sm text-green-600">
						(
						{Math.round(
						  ((book.originalPrice - book.price) /
							book.originalPrice) *
							100
						)}
						% 할인)
					  </span>
					</>
				  ) : (
					<>{book.price.toLocaleString()}원</>
				  )}
				</p>
				<Link
				  to={`/books/${book.slug}`}
				  className="inline-block mt-4 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
				>
				  자세히 보기
				</Link>
			  </div>
			))
		  )}
		</div>
  
		{/* 페이지네이션 */}
		<div className="flex justify-center space-x-2">
		  <button
			onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
			disabled={pagination.page === 1}
			className="px-3 py-1 border rounded disabled:opacity-50"
		  >
			이전
		  </button>
		  {Array.from({ length: pagination.pages }).map((_, idx) => (
			<button
			  key={idx}
			  onClick={() => setCurrentPage(idx + 1)}
			  className={`px-3 py-1 border rounded ${
				pagination.page === idx + 1
				  ? "bg-blue-500 text-white"
				  : ""
			  }`}
			>
			  {idx + 1}
			</button>
		  ))}
		  <button
			onClick={() =>
			  setCurrentPage((p) => Math.min(p + 1, pagination.pages))
			}
			disabled={pagination.page === pagination.pages}
			className="px-3 py-1 border rounded disabled:opacity-50"
		  >
			다음
		  </button>
		</div>
  
		{/* 설명 수정 버튼 */}
		<div className="text-center">
		  <button
			onClick={() => setShowEditor(true)}
			className="mt-6 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
		  >
			설명 수정
		  </button>
		</div>
  
		{/* 설명 편집 모달 */}
		{showEditor && (
		  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[80vh] overflow-auto">
			  <h2 className="text-xl font-bold mb-4">설명 수정</h2>
  
			  {/* 전자책 선택 */}
			  <select
				value={selectedSlug}
				onChange={(e) => setSelectedSlug(e.target.value)}
				className="w-full mb-4 border p-2 rounded"
			  >
				<option value="">전자책 선택</option>
				{books.map((book) => (
				  <option key={book.slug} value={book.slug}>
					{book.titleIndex}. {book.title}
				  </option>
				))}
			  </select>
  
			  {/* 설명 텍스트 에어리어 */}
			  {loadingDesc ? (
				<p>로딩 중...</p>
			  ) : (
				<textarea
				  value={editorContent}
				  onChange={(e) => setEditorContent(e.target.value)}
				  rows={10}
				  className="w-full border p-2 rounded mb-4 whitespace-pre-wrap"
				/>
			  )}
  
			  {/* 버튼 */}
			  <div className="flex justify-end space-x-2">
				<button
				  onClick={() => setShowEditor(false)}
				  className="px-4 py-2 border rounded"
				>
				  취소
				</button>
				<button
				  onClick={handleSave}
				  disabled={!selectedSlug}
				  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
				>
				  저장
				</button>
			  </div>
			</div>
		  </div>
		)}
	  </div>
	);
  }