import { View, ColorValue } from "react-native";
import { styles } from "./styles";

type Props = {
  color: ColorValue;
};

export function Separator({ color }: Props) {
  return <View style={[styles.container, { backgroundColor: color }]} />;
}
