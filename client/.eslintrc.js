module.exports = {
	root: true,
	env: {
	  browser: true,
	  es2021: true,
	},
	extends: [
	  "eslint:recommended",
	  "plugin:react/recommended",
	],
	parserOptions: {
	  ecmaVersion: "latest",
	  sourceType: "module",
	  ecmaFeatures: {
		jsx: true,
	  },
	},
	plugins: ["react"],
	rules: {
	  // 🔧 사용하지 않는 변수 무시 (밑줄 시작 변수는 무시)
	  "no-unused-vars": ["warn", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
	  // 🔧 React import 없더라도 JSX 허용 (React 17+)
	  "react/react-in-jsx-scope": "off",
	  // 🔧 JSX에서 props 정렬 등 warning 무시
	  "react/prop-types": "off",
	},
	settings: {
	  react: {
		version: "detect",
	  },
	},
  };
  