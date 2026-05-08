import { fontFamily, colors } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 324,
    paddingHorizontal: 24,
    paddingBottom: 18,
    justifyContent: 'flex-end',
    gap: 24
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.white,
  },
  total: {
    fontFamily: fontFamily.medium,
    fontSize: 32,
    color: colors.white,
  },
  summary: {
    width: '100%',
    gap: 12,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})