export default function Footer(){
  return (
    /*Il div più esterno min-height:100vh  */
    <footer className="container-fluid d-flex flex-column">
      <hr className = "border-3"/>
      <div className = "container text-center">
        <div className="row align-items-start">
          <div className="col">
            <h3>Chi Siamo</h3>
            <p className="container text- fs-7">
              AstraNote è il sito per gli appunti e le dispense della facoltà Sapienza.
              Uno strumento creato per incentivare la condivisione tra studenti 
              dello stesso corso di laurea.
            </p>
          </div>
          <div className="col">
            <h3>Info</h3> 
            <span className = "text-decoration-underline text-primary" >Come funziona</span><br/>
            <span className = "text-decoration-underline text-primary">La nostra Mission</span><br/>
            <span className = "text-decoration-underline text-primary" >Blog</span><br/>
            <span className = "text-decoration-underline text-primary">I nostri valori</span><br/>
          </div>
          <div className="col">
            <h3>Community</h3>
            <i class="fi fi-brands-instagram"></i>
            <span className = "text-decoration-underline text-primary" >Instagram</span><br/>
            <span className = "text-decoration-underline text-primary">Facebook</span><br/>
            <span className = "text-decoration-underline text-primary" >Contattaci</span><br/>
            <span className = "text-decoration-underline text-primary">Invia Feedback</span><br/>
          </div>
        </div>
      </div>

      <div>
        &#169;2026 Copyright: AstraNote di Simone, Valerio, Alessandro   - 
        <span className = "text-decoration-underline text-primary">   Privacy Policy  </span>
        <span> - </span>
        <span  className = "text-decoration-underline text-primary"> Termini del servizio</span> 
      </div>
    </footer>
  )
}
