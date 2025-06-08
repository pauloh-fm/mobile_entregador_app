import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDelivery } from '@/contexts/DeliveryContext';
import { DeliveryTimeline } from '@/components/delivery/DeliveryTimeline';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  CheckCircle, 
  RotateCcw,
  AlertTriangle,
  Package
} from 'lucide-react-native';

export default function ReturningScreen() {
  const { updateDeliveryStatus } = useDelivery();
  const [returnQuantity, setReturnQuantity] = useState(0);
  const [damagedContainer, setDamagedContainer] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - em produção viria do context/props
  const delivery = {
    id: '1',
    customerName: 'João Silva',
    address: 'Rua das Flores, 123',
    returnable_items: [
      { name: 'Botijão de Gás 13kg', quantity: 2, type: 'container' }
    ]
  };

  const maxReturnQuantity = delivery.returnable_items.reduce((sum, item) => sum + item.quantity, 0);

  const handleTimelineNavigation = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        router.push('/delivery/collecting');
        break;
      case 1:
        router.push('/delivery/delivering');
        break;
      case 2:
        // Já está na tela atual
        break;
    }
  };

  const handleSkipStep = () => {
    Alert.alert(
      'Pular Devolução',
      'Tem certeza que deseja pular a devolução de vasilhames?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Pular', 
          style: 'destructive',
          onPress: () => completeDelivery()
        }
      ]
    );
  };

  const handleGoBack = () => {
    router.push('/delivery/delivering');
  };

  const incrementQuantity = () => {
    if (returnQuantity < maxReturnQuantity) {
      setReturnQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (returnQuantity > 0) {
      setReturnQuantity(prev => prev - 1);
    }
  };

  const completeDelivery = async () => {
    if (returnQuantity > 0 && damagedContainer === null) {
      Alert.alert(
        'Informação Incompleta',
        'Por favor, informe se há botijão avariado antes de finalizar.'
      );
      return;
    }

    setIsLoading(true);
    try {
      await updateDeliveryStatus(delivery.id, 'returned');
      
      Alert.alert(
        'Entrega Concluída!',
        `Vasilhames devolvidos: ${returnQuantity}\nBotijão avariado: ${damagedContainer ? 'Sim' : 'Não'}`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível finalizar a entrega.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1976D2" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Devolução</Text>
            <Text style={styles.headerSubtitle}>#{delivery.id} - {delivery.customerName}</Text>
          </View>
        </View>

        {/* Timeline */}
        <DeliveryTimeline
          currentStep={2}
          onStepPress={handleTimelineNavigation}
          onSkip={handleSkipStep}
          onGoBack={handleGoBack}
          canNavigate={true}
        />

        {/* Instruções */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <RotateCcw size={24} color="#1976D2" />
            <Text style={styles.instructionsTitle}>Instruções de Devolução</Text>
          </View>
          <Text style={styles.instructionsText}>
            • Colete os vasilhames vazios do cliente{'\n'}
            • Verifique o estado dos recipientes{'\n'}
            • Informe se há algum botijão avariado{'\n'}
            • Confirme a quantidade devolvida
          </Text>
        </View>

        {/* Itens Retornáveis */}
        <View style={styles.returnCard}>
          <Text style={styles.cardTitle}>Vasilhames para Devolução</Text>
          
          {delivery.returnable_items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Package size={20} color="#757575" />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Máx: {item.quantity}</Text>
            </View>
          ))}

          {/* Contador de Quantidade */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantidade Devolvida</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={[styles.quantityButton, returnQuantity === 0 && styles.disabledButton]}
                onPress={decrementQuantity}
                disabled={returnQuantity === 0}
              >
                <Minus size={20} color={returnQuantity === 0 ? '#BDBDBD' : '#1976D2'} />
              </TouchableOpacity>
              
              <Text style={styles.quantityValue}>{returnQuantity}</Text>
              
              <TouchableOpacity 
                style={[styles.quantityButton, returnQuantity === maxReturnQuantity && styles.disabledButton]}
                onPress={incrementQuantity}
                disabled={returnQuantity === maxReturnQuantity}
              >
                <Plus size={20} color={returnQuantity === maxReturnQuantity ? '#BDBDBD' : '#1976D2'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botijão Avariado */}
          {returnQuantity > 0 && (
            <View style={styles.damagedSection}>
              <Text style={styles.damagedLabel}>Botijão Avariado?</Text>
              <View style={styles.damagedOptions}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    damagedContainer === true && styles.selectedOption,
                    damagedContainer === true && styles.yesOption
                  ]}
                  onPress={() => setDamagedContainer(true)}
                >
                  <Text style={[
                    styles.optionText,
                    damagedContainer === true && styles.selectedOptionText
                  ]}>
                    Sim
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    damagedContainer === false && styles.selectedOption,
                    damagedContainer === false && styles.noOption
                  ]}
                  onPress={() => setDamagedContainer(false)}
                >
                  <Text style={[
                    styles.optionText,
                    damagedContainer === false && styles.selectedOptionText
                  ]}>
                    Não
                  </Text>
                </TouchableOpacity>
              </View>
              
              {damagedContainer === true && (
                <View style={styles.warningBox}>
                  <AlertTriangle size={16} color="#FF6F00" />
                  <Text style={styles.warningText}>
                    Botijão avariado será reportado para análise.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.completeButton, isLoading && styles.disabledButton]}
            onPress={completeDelivery}
            disabled={isLoading}
          >
            <CheckCircle size={24} color="#FFFFFF" />
            <Text style={styles.completeButtonText}>
              {isLoading ? 'Finalizando...' : 'Finalizar Entrega'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 22,
  },
  returnCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
    marginLeft: 8,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '600',
  },
  quantitySection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
    textAlign: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
  },
  quantityValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1976D2',
    minWidth: 60,
    textAlign: 'center',
  },
  damagedSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  damagedLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
    textAlign: 'center',
  },
  damagedOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  optionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedOption: {
    borderWidth: 2,
  },
  yesOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  noOption: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6F00',
  },
  warningText: {
    fontSize: 14,
    color: '#F57C00',
    marginLeft: 8,
    flex: 1,
  },
  actionsContainer: {
    padding: 16,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 80,
  },
}); 