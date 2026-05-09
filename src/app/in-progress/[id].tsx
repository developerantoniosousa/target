import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { List } from "@/components/List";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/Progress";
import { Transaction, TransactionProps } from "@/components/Transaction";
import { TransactionTypes } from "@/utils/TransactionTypes";

const details = { current: "R$ 580,00", percentage: 25, target: "R$ 1.790,00" };
const transactions: TransactionProps[] = [
  {
    id: "1",
    date: "12/04/25",
    type: TransactionTypes.Output,
    value: "R$ 20,00",
  },
  {
    id: "2",
    date: "12/04/25",
    type: TransactionTypes.Input,
    value: "R$ 300,00",
    description: "CDB de 110% no banco XPTO",
  },
  {
    id: "3",
    date: "12/04/25",
    type: TransactionTypes.Input,
    value: "R$ 300,00",
    description: "CDB de 110% no banco XPTO",
  },
];

export default function InProgress() {
  const params = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, padding: 24, gap: 32 }}>
      <PageHeader
        title="Apple Watch"
        rightButton={{
          icon: "edit",
          onPress: () => {},
        }}
      />
      <Progress data={details} />
      <List
        title="Transações"
        data={transactions}
        renderItem={({ item }) => (
          <Transaction data={item} onRemove={() => {}} />
        )}
      />
    </View>
  );
}
