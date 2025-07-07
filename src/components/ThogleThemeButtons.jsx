import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { Button } from "antd";

const ThogleThemeButtons = ({ darkTheme, toggleTheme }) => {
  return (
    <div className="toggle-theme-btn">
      <Button onClick={toggleTheme}>
        {darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}
      </Button>
    </div>
  );
};
export default ThogleThemeButtons;
