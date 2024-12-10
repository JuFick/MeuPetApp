import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import Colors from "./../../constants/Colors";

const windowWidth = Dimensions.get('window').width;

// Definir número de colunas dinamicamente
const numColumns = windowWidth > 600 ? 4 : 2;
const itemWidth = windowWidth / numColumns;

export default function Category() {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();

  useEffect(() => {
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const snapshot = await getDocs(collection(db, "Category"));
    const categoriesData = snapshot.docs.map((doc) => doc.data());
    setCategoryList(categoriesData);
  };

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
      <Text style={{ fontFamily: "outfit-medium", fontSize: 20, marginBottom: 10 }}>
        Categorias
      </Text>

      <FlatList
        data={categoryList}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedCategory(item.name)}>
            <View
              style={[
                styles.container,
                { width: itemWidth - 40 }, 
                selectedCategory === item.name && styles.selectedCategoryContainer,
              ]}
            >
              <Image
                source={{ uri: item?.imageUrl }}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.itemText}>
                {item?.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRINCIAL,
    padding: 5,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8, // Diminuir o arredondamento
    borderColor: Colors.AMARELINHO_ESCURO,
    margin: 5,
    height: 70, // Reduzir a altura
    justifyContent: "center",
  },
  selectedCategoryContainer: {
    backgroundColor: Colors.ROSINHA,
    borderColor: Colors.ROXO,
  },
  image: {
    width: 25, // Reduzir o tamanho da imagem
    height: 25,
    marginBottom: 3,
  },
  itemText: {
    textAlign: "center",
    fontFamily: "outfit-bold",
    fontSize: 8, // Reduzir o tamanho da fonte
  },
});
