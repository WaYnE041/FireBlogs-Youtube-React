import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { UserContext } from './contexts/UserContext.tsx';


ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<UserContext>
			<BrowserRouter>
				<App/>
			</BrowserRouter>
		</UserContext>
	</React.StrictMode>,
)
