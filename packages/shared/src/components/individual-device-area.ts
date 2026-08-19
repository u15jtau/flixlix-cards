import { type IndividualObject } from "@flixlix-cards/shared/states/raw/individual/get-individual-object";
import { html } from "lit";

interface IndividualDeviceAreaProps {
  individualObjs: IndividualObject[];
}

export const individualDeviceArea = ({
  individualObjs,
}: IndividualDeviceAreaProps) => {
  if (!individualObjs.length) return html``;

  return html`
    <div class="individual-device-area">
      <div class="individual-device-area-title">
        Additional Individual Devices
      </div>

      <div class="individual-device-area-grid">
        ${individualObjs.map(
          (individual) => html`
            <div class="individual-device-area-item">
              <span class="label">${individual.name}</span>
            </div>
          `
        )}
      </div>
    </div>
  `;
};
