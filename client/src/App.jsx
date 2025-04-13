import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import MyBooks from './pages/MyBooks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import RequireAuth from './components/RequireAuth';
import RedirectIfAuth from './components/RedirectIfAuth';
import RequirePurchase from './components/RequirePurchase';
import PaymentSuccess from './pages/PaymentSuccess';

function App() {
	return (
		<div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
			<Navbar />
			<main className="max-w-3xl mx-auto px-4 py-10">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/books" element={<BookList />} />
				<Route path="/books/:slug" element={<BookDetail />} />
				<Route
					path="/mybooks"
					element={
					<RequireAuth>
					<MyBooks />
					</RequireAuth>
					}
				/>
				<Route
					path="/login"
					element={
					<RedirectIfAuth>
					<Login />
					</RedirectIfAuth>
					}
				/>
				<Route
					path="/signup"
					element={
					<RedirectIfAuth>
					<Signup />
					</RedirectIfAuth>
					}
					/>
					
				<Route
					path="/books/:slug"
					element={
					<RequirePurchase>
					<BookDetail />
					</RequirePurchase>
					}
				/>
				<Route path="/payment/success" element={<PaymentSuccess />} />
			</Routes>
			</main>
		</div>
	);
}

export default App;