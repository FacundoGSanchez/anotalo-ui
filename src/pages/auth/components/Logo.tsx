import logo from "/images/Logo.png";

interface AnotaloLogoProps {
  width: string;
}

const AnotaloLogo = ({ width }: AnotaloLogoProps) => (
  <div className="anotalo-logo-container">
    <div>
      <img src={logo} alt="Anotalo Logo" style={{ width, height: "auto" }} />
    </div>
  </div>
);

export default AnotaloLogo;
