// ✅ CORS 설정
app.use(cors({
	origin: ['http://localhost:5173', 'https://careerbooks.shop'],
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true
  }));
  