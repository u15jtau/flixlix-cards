import { type HomeAssistant } from "custom-card-helpers";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";

import { type IndividualObject } from "@flixlix-cards/shared/states/raw/individual/get-individual-object";

interface IndividualDeviceAreaProps {
  individualObjs: IndividualObject[];
}

const DEFAULT_INDIVIDUAL_CARD_TYPE = "tile" as const;

const setTileCardConfig = (element: Element | undefined, individual: IndividualObject) => {
  if (!element) return;

  const host = (element.getRootNode() as ShadowRoot | Document).host as
    | (HTMLElement & { hass?: HomeAssistant })
    | undefined;
  const hass = host?.hass;
  if (!hass) return;

  const configure = () => {
    const card = element as HTMLElement & {
      hass?: HomeAssistant;
      setConfig?: (config: Record<string, unknown>) => void;
    };

    card.hass = hass;
    card.setConfig?.({
      type: DEFAULT_INDIVIDUAL_CARD_TYPE,
      entity: individual.entity,
      ...(individual.name ? { name: individual.name } : {}),
      ...(individual.icon ? { icon: individual.icon } : {}),
    });
  };

  if (customElements.get("hui-tile-card")) {
    configure();
  } else {
    void customElements.whenDefined("hui-tile-card").then(configure);
  }
};

export const individualDeviceArea = ({
  individualObjs,
}: IndividualDeviceAreaProps) => {
  if (!individualObjs.length) return html``;

  return html`
    <div class="individual-device-area">
      <div class="individual-device-area-title">Additional Individual Devices</div>

      <div class="individual-device-area-grid">
        ${individualObjs.map(
          (individual) => html`
            <div class="individual-device-area-item">
              <hui-tile-card
                ${ref((element) => setTileCardConfig(element, individual))}
              ></hui-tile-card>
            </div>
          `
        )}
      </div>
    </div>
  `;
};
