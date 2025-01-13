import { FloatButton } from "antd";
import FloatButtonGroup from "antd/es/float-button/FloatButtonGroup";
import { AiFillMessage } from "react-icons/ai";

export default function FloatButtonContact() {
  return (
    <div>
      <FloatButtonGroup
        trigger="hover"
        type="primary"
        style={{ insetInlineEnd: 24 }}
        icon={<AiFillMessage />
        }
      >
        <FloatButton icon={<img src="/assets/icon/facebook.svg"/>} href="https://www.facebook.com/fptboardgameclub"/>
        <FloatButton icon={<img src="/assets/icon/Icon_of_Zalo.svg" />}  href="https://zalo.me/g/alwzje618"/>
      </FloatButtonGroup>
    </div>
  );
}
