import { registerCustomCard } from "@flixlix-cards/shared/utils/register-custom-card";
import packageJson from "../package.json" with { type: "json" };
import "./ui-editor/ui-editor";
import { PowerFlowCardPlus } from "./power-flow-card-plus";

class PowerFlowCardPlusUnlimited extends PowerFlowCardPlus {}

registerCustomCard({
  type: "power-flow-card-plus-test",
  name: "Power Flow Card Plus Unlimited",
  description: "Power Flow Card Plus with an unlimited individual-device card section.",
  version: packageJson.version,
});

if (!customElements.get("power-flow-card-plus-test")) {
  customElements.define("power-flow-card-plus-test", PowerFlowCardPlusUnlimited);
}
