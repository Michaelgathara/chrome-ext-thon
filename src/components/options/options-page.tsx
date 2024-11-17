import { Options } from "./options";
import { OptionsProvider } from "./provider";

export const OptionsPage = () => {
  return (
    <OptionsProvider>
      <Options />
    </OptionsProvider>
  );
};
