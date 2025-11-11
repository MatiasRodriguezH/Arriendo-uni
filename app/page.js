import Header from "../components/Header";
import Rentalview from "../components/Rentalview";
import '../styles/home.css'

export default function Home() {
  return (
    <div>
      <Header/>
        <div className="catalog">
          <span style={{fontSize:'125%', fontWeight:'bold', marginBottom:'1%'}}>Principales Arriendos</span>
          <Rentalview/>
        </div>
    </div>
  );
}
