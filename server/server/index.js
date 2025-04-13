app.use(cors({
	origin: [
	  'http://localhost:5173',          // 로컬 개발용
	  'https://careerbooks.vercel.app', // Vercel 기본 배포 도메인
	  'https://careerbooks.shop'        // 사용자 맞춤 도메인
	],
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true
  }));
  