import { router, useLocalSearchParams } from "expo-router";
import { Alert, View } from "react-native";
import { useState } from "react";

import { CurrencyInput } from "@/components/CurrencyInput";
import { Input } from "@/components/Input";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { TransactionType } from "@/components/TransactionType";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { useTransactionDatabase } from "@/database/useTransactionDatabase";

export default function Transaction() {
  const params = useLocalSearchParams<{ id: string }>();
  const transactionDatabase = useTransactionDatabase();

  const [type, setType] = useState(TransactionTypes.Input);
  const [isCreating, setIsCreating] = useState(false);
  const [amount, setAmount] = useState<number | null>(0);
  const [observation, setObservation] = useState("");

  async function handleSave() {
    if (!params.id || !amount || amount <= 0) {
      Alert.alert("Atenção", "Preencha o valor.");
      return;
    }
    try {
      setIsCreating(true);
      await transactionDatabase.create({
        amount: type === TransactionTypes.Input ? amount! : amount! * -1,
        target_id: Number(params.id),
        observation,
      });
      Alert.alert("Sucesso!", "Transação salva com sucesso.", [
        {
          text: "OK",
          onPress: router.back,
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível salvar a transação.");
    }
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <PageHeader
        title="Nova transação"
        subtitle="A cada valor guardado você fica mais próximo da sua meta. Se esforce para guardar e evitar retirar."
      />
      <View style={{ marginTop: 32, gap: 24 }}>
        <TransactionType selected={type} onChange={setType} />
        <CurrencyInput
          label="Valor (R$)"
          value={amount}
          onChangeValue={setAmount}
        />
        <Input
          label="Motivo (opcional)"
          placeholder="Ex: Investir em CDB de 110% no banco XPTO"
          value={observation}
          onChangeText={setObservation}
        />
        <Button title="Salvar" onPress={handleSave} isProcessing={isCreating} />
      </View>
    </View>
  );
}
