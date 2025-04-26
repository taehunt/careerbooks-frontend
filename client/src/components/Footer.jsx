// 파일: client/src/components/Footer.jsx

import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12 py-8 text-sm text-gray-600">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div>&copy; {new Date().getFullYear()} CareerBooks. All rights reserved.</div>
        <div className="flex space-x-4">
          <span className="hover:underline">
            예금주 : 장태훈  |  은행명 : 기업은행  |  계좌번호 : 688-014027-01-011
          </span>
        </div>
      </div>
    </footer>
  );
}
