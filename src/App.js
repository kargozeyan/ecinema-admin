import logo from './logo.svg';
import './App.css';
import LoginPage from "./pages/login-page";
import MovieEdit from "./pages/movie-edit";

function App() {
    if (!localStorage.getItem("refreshToken")) {
        return (<LoginPage/>);
    }

    return <MovieEdit />
}

export default App;
