import React from "react";

const WATERMARK_IMAGE_PATH = "/images/LaDante.png";

const Home = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={WATERMARK_IMAGE_PATH}
        alt="Logo de la empresa como sello de agua"
        style={{
          width: "50%",
          height: "auto",
          opacity: 0.2,
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export default Home;
