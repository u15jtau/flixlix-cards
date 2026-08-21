import { html } from "lit";
import { ref } from "lit/directives/ref.js";

import { type IndividualObject } from "@flixlix-cards/shared/states/raw/individual/get-individual-object";
import { type FlowCardPlusConfig, type NewDur } from "@flixlix-cards/shared/types";
import { checkShouldShowDots } from "@flixlix-cards/shared/utils/check-should-show-dots";
import { computeIndividualFlowRate } from "@flixlix-cards/shared/utils/compute-flow-rate";
import { showLine } from "@flixlix-cards/shared/utils/show-line";
import { styleLine } from "@flixlix-cards/shared/utils/style-line";
import { type HomeAssistant, type LovelaceCardConfig } from "custom-card-helpers";
import { nothing, svg } from "lit";

interface IndividualDeviceAreaProps {
  individualObjs: IndividualObject[];
  config: FlowCardPlusConfig;
  newDur: NewDur;
}

const DEFAULT_INDIVIDUAL_CARD_TYPE = "tile" as const;

type HassHost = HTMLElement & { hass?: HomeAssistant };
type ConfigurableCard = HTMLElement & {
  hass?: HomeAssistant;
  setConfig?: (config: Record<string, unknown>) => void;
};
type CardHelpers = {
  createCardElement: (config: LovelaceCardConfig) => ConfigurableCard;
};
type WindowWithCardHelpers = Window & {
  loadCardHelpers?: () => Promise<CardHelpers>;
};

const getCardConfig = (individual: IndividualObject): LovelaceCardConfig => {
  const configuredCard = individual.field?.card;
  const actionConfig = {
    ...(individual.field?.tap_action ? { tap_action: individual.field.tap_action } : {}),
    ...(individual.field?.hold_action ? { hold_action: individual.field.hold_action } : {}),
    ...(individual.field?.double_tap_action
      ? { double_tap_action: individual.field.double_tap_action }
      : {}),
  };

  return {
    type: DEFAULT_INDIVIDUAL_CARD_TYPE,
    entity: individual.entity,
    ...(individual.name ? { name: individual.name } : {}),
    ...(individual.icon ? { icon: individual.icon } : {}),
    ...(individual.field?.card_type ? { type: individual.field.card_type } : {}),
    ...(individual.field?.card_entity ? { entity: individual.field.card_entity } : {}),
    ...(individual.field?.card_name ? { name: individual.field.card_name } : {}),
    ...(individual.field?.card_icon ? { icon: individual.field.card_icon } : {}),
    ...actionConfig,
    ...configuredCard,
  } as LovelaceCardConfig;
};

export const configureIndividualCard = async (
  element: Element | undefined,
  individual: IndividualObject
) => {
  if (!element) return;

  const root = element.getRootNode();
  if (!(root instanceof ShadowRoot)) return;

  const hass = (root.host as HassHost).hass;
  if (!hass) return;

  const config = getCardConfig(individual);
  const loadCardHelpers = (window as WindowWithCardHelpers).loadCardHelpers;
  let card: ConfigurableCard | undefined;
  if (loadCardHelpers) {
    card = (await loadCardHelpers()).createCardElement(config);
  } else if (config.type === DEFAULT_INDIVIDUAL_CARD_TYPE) {
    await customElements.whenDefined("hui-tile-card");
    card = document.createElement("hui-tile-card") as ConfigurableCard;
    card.setConfig?.(config as Record<string, unknown>);
  }
  if (!card) return;

  card.hass = hass;
  element.replaceWith(card);
};

export const individualCardElement = (individual: IndividualObject) => html`
  <div class="individual-card-host" ${ref((element) => void configureIndividualCard(element, individual))}></div>
`;

export const individualDeviceArea = ({
  individualObjs,
  config,
  newDur,
}: IndividualDeviceAreaProps) => {
  if (!individualObjs.length || config.hide_individual_devices === true) return html``;

  const devicesPerColumn = Math.max(1, config.individual_devices_per_column ?? 4);
  const columns = Array.from(
    { length: Math.ceil(individualObjs.length / devicesPerColumn) },
    (_, columnIndex) =>
      individualObjs.slice(columnIndex * devicesPerColumn, (columnIndex + 1) * devicesPerColumn)
  );

  return html`
    <div class="individual-device-area" style="width:100%; margin:16px 0 0;">
      <svg class="individual-device-home-trunk" viewBox="0 0 180 100" preserveAspectRatio="none">
        <path d="M0 50 H180" />
      </svg>
      <div class="individual-device-area-grid" style="justify-content:flex-start;">
        ${columns.map(
          (column, columnIndex) => html`
            <div class="individual-device-column-group">
              ${html`<div class="individual-device-column-branch" aria-hidden="true">
                    <svg viewBox="0 0 32 100" preserveAspectRatio="none">
                      <path d="M0 50 H32" />
                    </svg>
                  </div>`}
              <div class="individual-device-column">
                ${column.map((individual, rowIndex) => {
                  const index = columnIndex * devicesPerColumn + rowIndex;
                  return html`
                    <div class="individual-device-area-item">
                      <svg class="individual-device-home-link" viewBox="0 0 64 56">
                      <path
                        id="individual-device-flow-${index}"
                        class=${styleLine(individual.state || 0, config)}
                        d="M0 28 H64"
                        vector-effect="non-scaling-stroke"
                      />
                      ${checkShouldShowDots(config) && individual.state
                        ? svg`<circle r="1.75" class="individual-device-flow-dot">
                            <animateMotion
                              dur="${computeIndividualFlowRate(
                                individual.field?.calculate_flow_rate,
                                newDur.individual[index] || 1.66
                              )}s"
                              repeatCount="indefinite"
                              calcMode="paced"
                              keyPoints="${individual.invertAnimation ? "0;1" : "1;0"}"
                              keyTimes="0;1"
                            >
                              <mpath href="#individual-device-flow-${index}" />
                            </animateMotion>
                          </circle>`
                        : nothing}
                      </svg>
                      ${individualCardElement(individual)}
                    </div>
                  `;
                })}
              </div>
            </div>
          `
        )}
      </div>
    </div>
  `;
};
