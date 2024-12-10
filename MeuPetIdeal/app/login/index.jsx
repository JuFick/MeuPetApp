import {
  View,
  Text,
  Image,
  Pressable,
  Platform,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "./../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useOAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Função para aquecer o navegador
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "web") {
      void WebBrowser.warmUpAsync();
    }
    return () => {
      if (Platform.OS !== "web") {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};

// Completa a sessão de autenticação no WebBrowser
if (Platform.OS !== "web") {
  WebBrowser.maybeCompleteAuthSession();
}

export default function Login({ navigation }) {
  useWarmUpBrowser();

  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);

  // Verifica se há uma sessão salva no AsyncStorage
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedSession = await AsyncStorage.getItem("userSession");
        if (savedSession) {
          console.log("Sessão encontrada:", savedSession);
          navigation.navigate("Home"); // Redireciona para a Home
        } else {
          console.log("Nenhuma sessão salva encontrada.");
        }
      } catch (err) {
        console.error("Erro ao verificar sessão:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      setAuthenticating(true); // Mostra indicador de carregamento
      console.log("Iniciando OAuth flow");

      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/home", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        console.log("Sessão criada com sucesso:", createdSessionId);
        await AsyncStorage.setItem("userSession", createdSessionId); // Salva a sessão no AsyncStorage
        ToastAndroid.show("Login bem-sucedido!", ToastAndroid.SHORT);
        navigation.navigate("Home"); // Redireciona para a Home
      } else {
        console.log("Usuário precisa completar signIn ou signUp");
      }
    } catch (err) {
      console.error("Erro durante OAuth:", err);
      ToastAndroid.show("Erro ao realizar login.", ToastAndroid.SHORT);
    } finally {
      setAuthenticating(false); // Oculta indicador de carregamento
    }
  }, [startOAuthFlow]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.ROXO} />
        <Text style={{ fontFamily: "outfit-medium", fontSize: 16, marginTop: 10 }}>
          Verificando sessão...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: Colors.CINZA_BEGE, height: "100%" }}>
      <Image
        source={require("./../../assets/images/login.jpg")}
        style={{ width: "100%", height: 500 }}
      />
      <View style={{ padding: 20, display: "flex", alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 25,
            textAlign: "center",
          }}
        >
          Venha conhecer o seu Novo Amigo
        </Text>
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 15,
            textAlign: "center",
            color: Colors.ROXO,
          }}
        >
          Adote um novo PET e torne a sua vida e a dele melhor!!
        </Text>
        <Pressable
          onPress={onPress}
          disabled={authenticating} // Desativa o botão enquanto autentica
          style={{
            padding: 14,
            marginTop: 100,
            backgroundColor: authenticating ? Colors.CINZA : Colors.AMARELINHO_ESCURO,
            width: "100%",
            borderRadius: 14,
            opacity: authenticating ? 0.7 : 1,
          }}
        >
          {authenticating ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text
              style={{
                fontFamily: "outfit-medium",
                fontSize: 18,
                textAlign: "center",
                color: "#FFF",
              }}
            >
              Comece por Aqui
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
