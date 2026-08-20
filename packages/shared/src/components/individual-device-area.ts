import { type HomeAssistant } from "custom-card-helpers";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";

import { type IndividualObject } from "@flixlix-cards/shared/states/raw/individual/get-individual-object";

interface IndividualDeviceAreaProps {
  hass: HomeAssistant;
  individualObjs: IndividualObject[];
}

const setTileCardConfig = (element: Element | undefined, individual: IndividualObject) => {
  if (!element || !("setConfig" in element)) return;

  (element as HTMLElement & { setConfig: (config: Record<string, unknown>) => void }).setConfig({
    type: "tile",
    entity: individual.entity,
    ...(individual.name ? { name: individual.name } : {}),
    ...(individual.icon ? { icon: individual.icon } : {}),
  });
};

export const individualDeviceArea = ({
  hass,
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
                .hass=${hass}
                ${ref((element) => setTileCardConfig(element, individual))}
              ></hui-tile-card>
            </div>
          `
        )}
      </div>
    </div>
  `;
};
