import { Alert, View } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { PageHeader } from "@/components/PageHeader";
import { CurrencyInput } from "@/components/CurrencyInput";
import { useTargetDatabase } from "@/database/useTargetDatabase";

export default function Target() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | null>(0);
  const params = useLocalSearchParams<{ id?: string }>();
  const targetDatabase = useTargetDatabase();

  async function fetchTarget() {
    try {
      const response = await targetDatabase.show(Number(params.id));
      if (response !== null) {
        setName(response.name);
        setAmount(response.amount);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar a meta.");
    }
  }

  useEffect(() => {
    if (!!params.id) fetchTarget();
  }, [params.id]);

  function handleSave() {
    if (!name.trim() || amount! <= 0) {
      Alert.alert(
        "Atenção",
        "Preencha nome e valor precisa ser maior que zero.",
      );
      return;
    }
    setIsProcessing(true);

    params.id ? update() : create();
  }

  async function create() {
    try {
      await targetDatabase.create({
        name,
        amount: amount!,
      });
      Alert.alert("Nova meta", "Meta criada com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a meta.");
      console.error(error);
      setIsProcessing(false);
    }
  }

  async function update() {
    try {
      await targetDatabase.update({
        name,
        amount: amount!,
        id: Number(params.id),
      });
      Alert.alert("Sucesso!", "Meta atualizada com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a meta.");
      console.error(error);
      setIsProcessing(false);
    }
  }

  async function remove() {
    try {
      await targetDatabase.remove(Number(params.id));
      Alert.alert("Meta", "Meta removida!", [
        {
          text: "OK",
          onPress: () => router.replace("/"),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível remover a meta.");
    }
  }

  function handleDelete() {
    if (!params.id) return;
    Alert.alert("Remover", "Deseja realmente remover?", [
      {
        text: "Sim",
        onPress: remove,
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <PageHeader
        title="Meta"
        subtitle="Economize para alcançar sua meta financeira."
        rightButton={
          params.id
            ? {
                icon: "delete",
                onPress: handleDelete,
              }
            : undefined
        }
      />
      <View style={{ marginTop: 32, gap: 24 }}>
        <Input
          label="Nome da meta"
          placeholder="Ex: Viagem para praia, Apple Watch"
          value={name}
          onChangeText={setName}
        />
        <CurrencyInput
          label="Valor alvo (R$)"
          value={amount}
          onChangeValue={setAmount}
        />
        <Button
          title="Salvar"
          onPress={handleSave}
          isProcessing={isProcessing}
        />
      </View>
    </View>
  );
}
