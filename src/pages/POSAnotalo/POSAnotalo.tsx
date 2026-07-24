import { useDevice } from "../../context/DeviceContext";
import POSAnotaloMobile from "./POSAnotaloMobile";
import POSAnotaloDesktop from "./POSAnotaloDesktop";

const POSAnotalo = () => {
  const { isDesktop } = useDevice();
  return isDesktop ? <POSAnotaloDesktop /> : <POSAnotaloMobile />;
};

export default POSAnotalo;
