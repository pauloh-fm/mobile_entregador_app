import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Truck, Shield } from 'lucide-react-native';

export default function AuthScreen() {
  const [deliveryCode, setDeliveryCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!deliveryCode.trim()) {
      Alert.alert('Erro', 'Por favor, insira o código de entrega');
      return;
    }

    setIsLoading(true);
    const success = await login(deliveryCode.trim());
    
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Erro', 'Código de entrega inválido. Verifique com a revenda.');
    }
    
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Truck size={48} color="#1976D2" />
            <Text style={styles.appName}>Prototipo Entrega</Text>
          </View>
          <Text style={styles.subtitle}>Sistema de Atendimento Especializado</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Shield size={20} color="#757575" />
            <TextInput
              style={styles.input}
              placeholder="Código único de entrega"
              value={deliveryCode}
              onChangeText={setDeliveryCode}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleLogin}
              placeholderTextColor="#9E9E9E"
            />
          </View>

          <Button
            title={isLoading ? "Autenticando..." : "Entrar"}
            onPress={handleLogin}
            disabled={isLoading}
            variant="primary"
            size="large"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Entre em contato com sua revenda para obter o código de acesso
          </Text>
          <Text style={styles.devHint}>
            💡 Modo desenvolvimento: use "teste" para acesso rápido
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1976D2',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    marginLeft: 12,
    fontFamily: 'Roboto-Regular',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 20,
  },
  devHint: {
    fontSize: 12,
    color: '#FF6F00',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});