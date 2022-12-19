import './App.css';
import AccountPage from './components/AccountPage/AccountPage';
import SearchPage from './components/SearchPage/SearchPage';
import SubscriptionPage from './components/SubscriptionPage/SubscriptionPage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import UserContext, { useUserContext } from './context/UserContext';
import Signin from "./components/Signin/Signin";
import Signup from "./components/Signup/Signup";
import StudioPage from './components/StudioPage/StudioPage';
import IntroLayout from "./components/Layout/IntroLayout";
import View from "./components/View/View";
import Edit from "./components/Edit/Edit";
import PaymentHistory from "./components/Payment/PaymentHistory/PaymentHistory";
import FuturePayment from "./components/Payment/FuturePayment/FuturePayment";
import UpdateCard from "./components/Edit/UpdateCard";
import ClassHistory from "./components/View/ClassHistory";
import ClassSchedule from "./components/View/ClassSchedule";
import ClassContext, {useClassContext} from "./context/ClassContext";

function App() {

	return (
		<UserContext.Provider value={useUserContext()}>
			<ClassContext.Provider value={useClassContext()}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<AccountPage />} />
						<Route path="account" element={<AccountPage />} />
						<Route path="plans" element={<SubscriptionPage />} />
						<Route path="search" element={<SearchPage />} />
						<Route path="studio" element={<StudioPage />} />
						<Route path="view" element={<View />} />
						<Route path="edit/:username" element={<Edit />} />
						<Route path="paymentHistory" element={<PaymentHistory />} />
						<Route path="futurePayment" element={<FuturePayment />} />
						<Route path="updateCard" element={<UpdateCard />} />
						<Route path="classHistory" element={<ClassHistory />} />
						<Route path="classSchedule" element={<ClassSchedule />} />


					</Route>
					<Route path="/" element={<IntroLayout />}>
						<Route index element={<Signin />} />
						<Route path="signIn" element={<Signin />} />
						<Route path="signUp" element={<Signup />} />

					</Route>
				</Routes>

			</BrowserRouter>
			</ClassContext.Provider>
		</UserContext.Provider>
	);
}

export default App;
