import { HomeHeader, HomeHeaderProps } from "@/components/HomeHeader";
import { View } from "react-native";

const summary: HomeHeaderProps = {
  total: "R$ 2,680.00",
  input: { label: "Entradas", value: "R$ 6,184.90" },
  output: { label: "Saídas", value: "-R$ 883.65" },
};

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <HomeHeader data={summary} />
    </View>
  );
}
