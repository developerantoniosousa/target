import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, StatusBar, Alert } from "react-native";

import { HomeHeader, HomeHeaderProps } from "@/components/HomeHeader";
import { Target, TargetProps } from "@/components/Target";
import { List } from "@/components/List";
import { Button } from "@/components/Button";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { Loading } from "@/components/Loading";

import { numberToCurrency } from "@/utils/numberToCurrency";
import { useTransactionDatabase } from "@/database/useTransactionDatabase";

const INITIAL_SUMMARY: HomeHeaderProps = {
  total: "R$ 0,00",
  input: { label: "Entradas", value: "R$ 0,00" },
  output: { label: "Saídas", value: "R$ 0,00" },
};

export default function Index() {
  const targetDatabase = useTargetDatabase();
  const transactionDatabase = useTransactionDatabase();
  const [isFetching, setIsFetching] = useState(true);
  const [targets, setTargets] = useState<TargetProps[]>([]);
  const [summary, setSummary] = useState<HomeHeaderProps>(INITIAL_SUMMARY);

  async function fetchTargets(): Promise<TargetProps[]> {
    try {
      const response = await targetDatabase.listBySavedValue();
      return response.map((item) => ({
        id: String(item.id),
        name: item.name,
        current: numberToCurrency(item.current),
        percentage: item.percentage.toFixed(0) + "%",
        target: numberToCurrency(item.amount),
      }));
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as metas.");
      return [];
    }
  }

  async function fetchSummary(): Promise<HomeHeaderProps> {
    try {
      const response = await transactionDatabase.summary();
      if (response !== null) {
        return {
          total: numberToCurrency(response.input - response.output),
          input: { label: "Entradas", value: numberToCurrency(response.input) },
          output: { label: "Saídas", value: numberToCurrency(response.output) },
        };
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar o resumo.");
    }
    return INITIAL_SUMMARY;
  }

  async function fetchData() {
    const targetDataPromise = fetchTargets();
    const summaryDataPromise = fetchSummary();
    const [targetData, summaryData] = await Promise.all([
      targetDataPromise,
      summaryDataPromise,
    ]);
    setTargets(targetData);
    setSummary(summaryData);
    setIsFetching(false);
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  if (isFetching) return <Loading />;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <HomeHeader data={summary} />
      <List
        title="Metas"
        emptyMessage="Nenhuma meta. Toque em nova meta para criar."
        data={targets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Target
            data={item}
            onPress={() => router.navigate(`/in-progress/${item.id}`)}
          />
        )}
        containerStyle={{ paddingHorizontal: 24 }}
      />
      <View style={{ padding: 24, paddingBottom: 32 }}>
        <Button title="Nova meta" onPress={() => router.navigate("/target")} />
      </View>
    </View>
  );
}
