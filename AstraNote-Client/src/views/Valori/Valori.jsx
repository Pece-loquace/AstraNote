import logo from '../../assets/AstraNote_Banner_IT_720.png'
import centralita from '../../assets/centrality.svg'
import condivisione from '../../assets/connection-relation.svg'
import qualita from '../../assets/star.svg'
import './Valori.css'
import '../../style/bootstrap.css'

function Valori() {
    return (
        <div className="container py-2">
            <div className="text-center mb-5">
                <a href="/homepage">
                    <img src={logo} alt="Logo di AstraNote" className="image-fix" />
                </a>
                <hr />
                <h1 className="mt-4">I nostri Valori</h1>
            </div>

            <div className="row g-4 justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card text-center p-4">
                        <img className="mb-4" src={centralita} alt="Icona centralità" />
                        <h3>Centralità</h3>
                        <hr />
                        <p>Un unico sito gratuito e facile da usare su tutti i tuoi dispositivi.</p>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card text-center p-4">
                        <img className="mb-3" src={condivisione} alt="Icona condivisione" />
                        <h3>Condivisione</h3>
                        <hr />
                        <p>Traccia e condividi tutti i tuoi dati e i tuoi appunti in sicurezza.</p>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card text-center p-4">
                        <img className="mb-3" src={qualita} alt="Icona qualità" />
                        <h3>Qualità</h3>
                        <hr />
                        <p>La comunità gestisce uno spazio unico e positivo per tutti.</p>
                    </div>
                </div>

            </div>
        </div >
    )
}

export default Valori