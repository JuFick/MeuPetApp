import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, router } from "expo-router"; // Adicionando router para navegação
import Colors from "../../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";

export default function AddNewPet() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({});
  const [gender, setGender] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Adicionar Pet",
    });
    GetCategories();
  }, []);

  const GetCategories = async () => {
    const snapshot = await getDocs(collection(db, "Category"));
    const categoriesData = snapshot.docs.map((doc) => doc.data());
    setCategoryList(categoriesData);
  };

  const imagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onSubmit = () => {
    // Validar se todos os campos obrigatórios foram preenchidos
    if (
      !formData.name ||
      !formData.category ||
      !formData.breed ||
      !formData.age ||
      !formData.gender ||
      !formData.weight ||
      !formData.address ||
      !formData.about ||
      !image
    ) {
      ToastAndroid.show("Preencha todos os campos obrigatórios.", ToastAndroid.SHORT);
      return;
    }

    // Simular envio bem-sucedido e redirecionar para a tela inicial
    ToastAndroid.show("Pet cadastrado com sucesso!", ToastAndroid.SHORT);

    // Redirecionar para a página inicial
    router.push("/(tabs)/home"); 
  };

  return (
    <ScrollView style={{ padding: 20, flex: 1 }}>
      <Text style={styles.title}>Adicionar Novo Pet para Adoção</Text>

      <Pressable onPress={imagePicker} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Image
            source={require("./../../assets/images/placeholder.jpg")}
            style={styles.image}
          />
        )}
      </Pressable>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome do Pet*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do Pet"
          onChangeText={(value) => handleInputChange("name", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Categoria*</Text>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            handleInputChange("category", itemValue);
          }}
        >
          {categoryList.map((category, index) => (
            <Picker.Item
              key={index}
              label={category.name}
              value={category.name}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Raça*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a raça do Pet"
          onChangeText={(value) => handleInputChange("breed", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Idade*</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="Digite a idade do Pet"
          onChangeText={(value) => handleInputChange("age", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sexo*</Text>
        <Picker
          selectedValue={gender}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setGender(itemValue);
            handleInputChange("gender", itemValue);
          }}
        >
          <Picker.Item label="Selecione o sexo" value="" />
          <Picker.Item label="Macho" value="Macho" />
          <Picker.Item label="Fêmea" value="Fêmea" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Peso*</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="Digite o peso do Pet"
          onChangeText={(value) => handleInputChange("weight", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Endereço*</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o endereço do Pet"
          onChangeText={(value) => handleInputChange("address", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Sobre o Pet*</Text>
        <TextInput
          style={[styles.input, { height: 120 }]} // Define altura fixa para multiline
          numberOfLines={5}
          multiline={true}
          placeholder="Digite sobre o Pet"
          onChangeText={(value) => handleInputChange("about", value)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    marginBottom: 20,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    fontFamily: "outfit",
    textAlignVertical: "top",
  },
  picker: {
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    padding: 15,
  },
  label: {
    marginBottom: 5,
    fontFamily: "outfit",
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: "center",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: Colors.ROSINHA,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: "#FFF",
    textAlign: "center",
  },
});
