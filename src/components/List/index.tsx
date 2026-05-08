import {
  FlatList,
  FlatListProps,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";

type Props<T> = FlatListProps<T> & {
  title: string;
  emptyMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

import { styles } from "./styles";
import { Separator } from "../Separator";
import { colors } from "@/theme";

export function List<T>({
  data,
  title,
  emptyMessage,
  containerStyle,
  renderItem,
  ...rest
}: Props<T>) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Separator color={colors.gray[200]} />}
        ListEmptyComponent={() => (
          <Text style={styles.empty}>{emptyMessage}</Text>
        )}
        {...rest}
      />
    </View>
  );
}
