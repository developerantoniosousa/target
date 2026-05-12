import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Alert, View } from "react-native";
import { useState, useCallback } from "react";

import { List } from "@/components/List";
import { PageHeader } from "@/components/PageHeader";
import { Progress } from "@/components/Progress";
import { Transaction, TransactionProps } from "@/components/Transaction";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";

import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionDatabase } from "@/database/useTransactionDatabase";
import { numberToCurrency } from "@/utils/numberToCurrency";

export default function InProgress() {
  const [isFetching, setIsFetching] = useState(true);
  const [details, setDetails] = useState({
    name: "",
    current: "R$ 0,00",
    target: "R$ 0,00",
    percentage: 0,
  });
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  const params = useLocalSearchParams<{ id: string }>();
  const targetDatabase = useTargetDatabase();
  const transactionDatabase = useTransactionDatabase();

  async function fetchTargetDetails() {
    try {
      const response = await targetDatabase.show(Number(params.id));
      if (response !== null)
        setDetails({
          name: response.name,
          current: numberToCurrency(response?.current),
          target: numberToCurrency(response?.amount),
          percentage: response?.percentage,
        });
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes da meta.");
    }
  }

  async function fetchTransactions() {
    try {
      const response = await transactionDatabase.listByTargetId(
        Number(params.id),
      );
      if (response !== null) {
        setTransactions(
          response.map((item) => ({
            id: String(item.id),
            date: new Date(item.created_at).toLocaleDateString(),
            type:
              item.amount < 0
                ? TransactionTypes.Output
                : TransactionTypes.Input,
            value: numberToCurrency(item.amount),
            description: item.observation,
          })),
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as transações.");
    }
  }

  async function fetchData() {
    const fetchDetailsPromise = fetchTargetDetails();
    const fetchTransactionsPromise = fetchTransactions();
    await Promise.all([fetchDetailsPromise, fetchTransactionsPromise]);
    setIsFetching(false);
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  if (isFetching) return <Loading />;

  return (
    <View style={{ flex: 1, padding: 24, gap: 32 }}>
      <PageHeader
        title={details.name}
        rightButton={{
          icon: "edit",
          onPress: () => router.navigate(`/target?id=${params.id}`),
        }}
      />
      <Progress data={details} />
      <List
        title="Transações"
        data={transactions}
        renderItem={({ item }) => (
          <Transaction data={item} onRemove={() => {}} />
        )}
        emptyMessage="Nenhuma transação. Toque em nova transação para guardar seu primeiro dinheiro aqui."
      />
      <Button
        title="Nova transação"
        onPress={() => router.navigate(`/transaction/${params.id}`)}
      />
    </View>
  );
}
