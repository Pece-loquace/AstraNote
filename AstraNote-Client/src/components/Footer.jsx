import { Link } from "react-router-dom"

export default function Footer() {
  return (
    /*Il div più esterno min-height:100vh  */
    <footer className="container-fluid d-flex flex-column">
      <hr className="border-3" />
      <div className="container text-center">
        <div className="row align-items-start">
          <div className="col-4">
            <h3>AstraNote</h3>
            <p className="container text- fs-7">
              AstraNote è il sito per le dispense dell'università La Sapienza di Roma.
              <br />
              Uno strumento creato per incentivare la condivisione tra studenti
              dello stesso corso di laurea.
            </p>
          </div>
          <div className="col-4">
            <h3>Info</h3>
            <a href="/La_nostra_Mission" className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">La nostra Mission<br /></a>
            <a href="/I_nostri_Valori" className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">I nostri Valori<br /></a>
          </div>
          <div className="col-4">
            <h3>Chi siamo</h3>
            <i className="fi fi-brands-instagram"></i>
            <a href="/Contattaci" className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Contattaci<br /></a>
            <span className="text-decoration-none text-primary">
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-decoration-none text-primary">
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clipRule="evenodd" />
              </svg>
            </span><br />
          </div>
        </div>
      </div>

      <div className="mb-5">
        &#169;2026 Copyright: AstraNote di Simone, Valerio, Alessandro   -
        <a className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="/privacy">   Licenza  </a>
        <span> - </span>
        <a className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.it"> Licenza Completa </a>
      </div>
    </footer >
  )
}
