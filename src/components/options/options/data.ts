export const OptionsData = [
  {
    id: "collectData",
    label: "Always collect data on page load",
    type: "boolean",
    description:
      "If enabled, the extension will always collect data on page load. If disabled, the extension will only collect data when the user allows the extension to scan pages belonging to the domain.",
  },
  {
    id: "newsSiteIntegration",
    label: "Integrate with news sites",
    type: "boolean",
    description:
      "If enabled, the extension will integrate with news sites, detecting media bias. If disabled, the extension will not integrate with news sites.",
  },
  {
    id: "domainList",
    label: "Domain List",
    type: "array",
  },
];
