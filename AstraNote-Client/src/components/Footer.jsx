import { Link } from "react-router-dom";

export default function Footer() {
  return (
    /*Il div più esterno min-height:100vh  */
    <footer className="container-fluid d-flex flex-column">
      <hr className="border-3" />
      <div className="container text-center">
        <div className="row align-items-start">
          <div className="col">
            <h3>AstraNote</h3>
            <p className="container text- fs-7">
              AstraNote è il sito per gli appunti e le dispense dell'università La Sapienza di Roma.
              <br />
              Uno strumento creato per incentivare la condivisione tra studenti
              dello stesso corso di laurea.
            </p>
          </div>
          <div className="col">
            <h3>Info</h3>
            <span className="text-decoration-none text-primary" >Come funziona</span><br />
            <Link to="/La_nostra_Mission"><span className="text-decoration-none text-primary">La nostra Mission</span><br /></Link>
            <Link to="/I_nostri_Valori"><span className="text-decoration-none text-primary">I nostri Valori</span><br /></Link>
          </div>
          <div className="col">
            <h3>Chi siamo</h3>
            <i class="fi fi-brands-instagram"></i>
            <span className="text-decoration-none text-primary" >I membri del team</span><br />
            <span className="text-decoration-none text-primary">Contattaci</span><br />
            <span className="text-decoration-none text-primary" >
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd" />
              </svg>
            </span>
            <span className="text-decoration-none text-primary">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd" />
              </svg>
            </span><br />
          </div>
        </div>
      </div>

      <div>
        &#169;2026 Copyright: AstraNote di Simone, Valerio, Alessandro   -
        <span className="text-decoration-none text-primary">   Privacy Policy  </span>
        <span> - </span>
        <span className="text-decoration-none text-primary"> Termini del servizio</span>
      </div>
    </footer>
  )
}
