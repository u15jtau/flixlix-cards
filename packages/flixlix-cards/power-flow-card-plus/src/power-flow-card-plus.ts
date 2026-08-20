import {
  type ActionConfig,
  type HomeAssistant,
  type LovelaceCardEditor,
} from "custom-card-helpers";
import { type UnsubscribeFunc } from "home-assistant-js-websocket";
import { html, LitElement, nothing, type PropertyValues, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import packageJson from "../package.json" with { type: "json" };

registerCustomCard({
  type: "power-flow-card-plus-test",
  name: "Power Flow Card Plus Test",
  description:
    "Test build of Power Flow Card Plus with the new individual device area.",
  version: packageJson.version,
});

@customElement("power-flow-card-plus-test")
export class PowerFlowCardPlus extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config = {} as PowerFlowCardPlusConfig;

  @state() private _templateResults: Partial<Record<string, RenderTemplateResult>> = {};
  @state() private _unsubRenderTemplates?: Map<string, Promise<UnsubscribeFunc>> = new Map();
  @state() private _width = 0;