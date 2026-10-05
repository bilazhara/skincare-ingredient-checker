import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6F0",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3D3229",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#8A7B6E",
    marginBottom: 20,
  },
  selected: {
    fontSize: 16,
    color: "#3D3229",
    marginBottom: 6,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8DFD3",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 14,
  },
  chip: {
    backgroundColor: "#E3EDE4",
    borderWidth: 1,
    borderColor: "#B7CDB9",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
    color: "#3D5A40",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#7A9E7E",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  resetButton: {
    padding: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    borderLeftWidth: 6,
    elevation: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  resultNote: {
    fontSize: 14,
    color: "#8A7B6E",
    marginBottom: 2,
  },
});