"use client";

export default function ContactButton() {
  return (
    <button
      style={{
        width: "100%",
        padding: "15px",
        backgroundColor: "#00638e",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "20px",
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#004d6d")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#00638e")}
    >
      Contactar
    </button>
  );
}