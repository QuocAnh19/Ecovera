import style from "./Contact.module.scss";

import { IconEmail, IconMapPin, IconPhoneCall } from "../../Assets";
import Button from "../../Components/Button";

export default function Contact() {
  return (
    <div className={style.contactContainer}>
      <div className={style.left}>
        <div className={style.address}>
          <IconMapPin />
          <p>
            2715 Ash Dr. San Jose, South <br /> Dakota 83475
          </p>
        </div>
        <hr />
        <div className={style.email}>
          <IconEmail />
          <p>
            Proxy@gmail.com <br /> Help.proxy@gmail.com
          </p>
        </div>
        <hr />
        <div className={style.call}>
          <IconPhoneCall />
          <p>
            (219) 555-0114 <br /> (164) 333-0487
          </p>
        </div>
      </div>
      <div className={style.right}>
        <h5>Just Say Hello!</h5>
        <p>
          Do you fancy saying hi to me or you want to get started with your{" "}
          <br /> project and you need my help? Feel free to contact me.
        </p>
        <div className={style.row}>
          <input
            type="text"
            placeholder="Template Cookie"
            name="templateCookie"
            className={style.inputRow}
          />
          <input
            type="email"
            placeholder="Your email"
            name="email"
            className={style.inputRow}
          />
        </div>
        <div className={style.row}>
          <input
            type="text"
            name="yourDescription"
            id=""
            placeholder="Your description"
            className={style.inputRow}
          />
        </div>
        <div className={style.row}>
          <textarea name="" id="" placeholder="Subjects"></textarea>
        </div>
        <Button fill className={style.btn}>Send Message</Button>
      </div>
    </div>
  );
}
