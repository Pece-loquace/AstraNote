import "../style/LoadingSpinner.css"

export default function LoadingSpinner() {
  return (
    <div className="spinner-cnt">
      <svg className="spinner" viewBox="0 0 50 50">
        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
      </svg>
      <p>Caricamento in corso...</p>
    </div>
  );
}