import { registerCustomCard } from "@flixlix-cards/shared/utils/register-custom-card";
import packageJson from "../package.json" with { type: "json" };
import "./ui-editor/ui-editor";
import { PowerFlowCardPlus } from "./power-flow-card-plus";

Object.assign(PowerFlowCardPlus, {
  getConfigElement: () => document.createElement("power-flow-card-plus-editor"),
});

registerCustomCard({
  type: "power-flow-card-plus",
  name: "Power Flow Card Plus",
  description:
    "An extended version of the power flow card with richer options, advanced features and a few small UI enhancements. Inspired by the Energy Dashboard.",
  version: packageJson.version,
});

if (!customElements.get("power-flow-card-plus")) {
  customElements.define("power-flow-card-plus", PowerFlowCardPlus);
}
