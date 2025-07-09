import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { Button } from "antd";

const ThogleThemeButtons = ({ darkTheme, toggleTheme }) => {
  return (
    <div className="toggle-theme-btn">
      <Button
        onClick={toggleTheme}
        type="text"
        icon={darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}
      />
    </div>
  );
};

export default ThogleThemeButtons;
