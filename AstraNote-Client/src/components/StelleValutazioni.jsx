import { useState } from "react";

export default function StelleValutazioni({ stelleAttuali, onChange }) {
    const [hover, setHover] = useState(0);

    return (
        <div>
            {[1, 2, 3, 4, 5].map((stella) => (
                <span
                    key={stella}
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    onClick={() => onChange(stella)}
                    onMouseEnter={() => setHover(stella)}
                    onMouseLeave={() => setHover(0)}
                >
                    {stella <= (hover || stelleAttuali) ? "⭐" : "☆"}
                </span>
            ))}
        </div>
    );
}