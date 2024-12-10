import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import Colors from "../../constants/Colors";
import PetListByCategory from "../../components/Home/PetListByCategory";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Slider */}
      <Slider />

      {/* Pet List + Categorias */}
      <PetListByCategory />

      {/* Adicionar novo Pet */}
      <View style={styles.addNewPetContainer}>
        <Link href="/add-new-pet" style={styles.addNewPetLink}>
          <MaterialIcons
            name="pets"
            size={24}
            color={Colors.ROXO}
            style={styles.icon}
          />
          <Text style={styles.addNewPetText}>Adicionar Pet</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: Colors.CINZA_BEGE,
  },
  addNewPetContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginTop: 20,
    backgroundColor: Colors.CINZA,
    borderWidth: 1,
    borderColor: Colors.ROXO,
    borderRadius: 15,
    borderStyle: "dashed",
  },
  addNewPetLink: {
    flexDirection: "row",
    alignItems: "center",
    margin:1
  },
  addNewPetText: {
    fontFamily: "outfit-medium",
    color: Colors.ROXO,
    fontSize: 20,
    textAlign:'center'
  },
});
