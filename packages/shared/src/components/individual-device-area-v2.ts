import { loadCardHelpers } from "custom-card-helpers";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";

import { type IndividualObject } from "@flixlix-cards/shared/states/raw/individual/get-individual-object";

interface IndividualDeviceAreaProps {
  individualObjs: IndividualObject[];
}

const DEFAULT_INDIVIDUAL_CARD_TYPE = "tile" as const;

type HassHost = HTMLElement & { hass?: HomeAssistant };

const configureCard = async (element: Element | undefined, individual: IndividualObject) => {
  if (!element) return;

  const root = element.getRootNode();
  if (!(root instanceof ShadowRoot)) return;

  const hass = (root.host as HassHost).hass;
  if (!hass) return;

  const helpers = await loadCardHelpers();
  const card = helpers.createCardElement({
    type: DEFAULT_INDIVIDUAL_CARD_TYPE,
    entity: individual.entity,
    ...(individual.name ? { name: individual.name } : {}),
    ...(individual.icon ? { icon: individual.icon } : {}),
  }) as HTMLElement & { hass?: HomeAssistant };

  card.hass = hass;
  element.replaceWith(card);
};

export const individualDeviceArea = ({ individualObjs }: IndividualDeviceAreaProps) => {
  if (!individualObjs.length) return html``;

  return html`
    <div class="individual-device-area">
      <div class="individual-device-area-title">Additional Individual Devices</div>
      <div class="individual-device-area-grid">
        ${individualObjs.map(
          (individual) => html`
            <div class="individual-device-area-item">
              <div ${ref((element) => void configureCard(element, individual))}></div>
            </div>
          `
        )}
      </div>
    </div>
  `;
};
