import style from "./Error.module.scss";

import Button from "../../Components/Button";
import { ImgIllustration } from "../../Assets";

export default function Error() {
  return (
    <div className={style.container}>
      <img src={ImgIllustration} alt="" />
      <h3>Oops! page not found</h3>
      <p>
        Ut consequat ac tortor eu vehicula. Aenean accumsan purus eros. Maecenas
        sagittis tortor at metus mollis
      </p>
      <Button fill className={style.btn}>Back to Home</Button>
    </div>
  );
}
