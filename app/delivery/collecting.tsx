import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDelivery } from '@/contexts/DeliveryContext';
import { DeliveryTimeline } from '@/components/delivery/DeliveryTimeline';
import { useToast } from '@/components/ui/Toast';
import { 
  ArrowLeft,
  Package, 
  CheckCircle, 
  Clock, 
  DollarSign,
  ArrowRight
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function CollectingScreen() {
  const { updateDeliveryStatus } = useDelivery();
  const { showSuccess, showInfo, ToastComponent } = useToast();
  const [isCollecting, setIsCollecting] = useState(false);
  const [hasProducts, setHasProducts] = useState<boolean | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Mock data - em produção viria do context/props
  const delivery = useMemo(() => ({
    id: '1',
    customerName: 'João Silva',
    address: 'Rua das Flores, 123',
    items: [
      { id: '1', name: 'Botijão de Gás 13kg', quantity: 2, price: 85.00 },
      { id: '2', name: 'Água Mineral 20L', quantity: 1, price: 12.50 }
    ],
    totalAmount: 182.50
  }), []);

  const handleTimelineNavigation = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        // Já está na tela atual
        break;
      case 1:
        router.push('/delivery/delivering');
        break;
      case 2:
        router.push('/delivery/returning');
        break;
    }
  };

  const handleSkipStep = () => {
    Alert.alert(
      'Pular Coleta',
      'Tem certeza que já tem todos os produtos? Você será direcionado para a entrega.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sim, tenho os produtos', 
          onPress: () => {
            proceedToDelivery();
          }
        }
      ]
    );
  };

  const proceedToDelivery = async () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptic feedback opcional
    }
    
    try {
      // Atualizar status da entrega
      updateDeliveryStatus(delivery.id, 'collecting');
      
      // Mostrar feedback de sucesso
      showSuccess('Produtos Confirmados!', 'Seguindo para a entrega...');
      
      // Aguardar um pouco para mostrar o toast
      setTimeout(() => {
        router.push('/delivery/delivering');
        setIsNavigating(false);
      }, 800);
      
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showInfo('Atenção', 'Continuando para a entrega...');
      setTimeout(() => {
        router.push('/delivery/delivering');
        setIsNavigating(false);
      }, 800);
    }
  };

  const handleConfirmCollection = async () => {
    setIsCollecting(true);
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Haptic feedback opcional
    }
    
    try {
      // Simular processo de coleta
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await updateDeliveryStatus(delivery.id, 'collecting');
      
      showSuccess('Coleta Confirmada!', 'Produtos coletados com sucesso.');
      
      setTimeout(() => {
        router.push('/delivery/delivering');
      }, 1200);
      
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível confirmar a coleta.');
    } finally {
      setIsCollecting(false);
    }
  };

  const handleAlreadyHaveProducts = async () => {
    if (isNavigating) return;
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptic feedback opcional
    }
    
    Alert.alert(
      'Confirmar Produtos',
      'Você confirma que já possui todos os produtos para esta entrega?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sim, confirmar', 
          onPress: proceedToDelivery
        }
      ]
    );
  };

  const handleProductSelection = async (hasProductsValue: boolean) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Haptic feedback opcional
    }
    
    setHasProducts(hasProductsValue);
    
    if (hasProductsValue) {
      showInfo('Seleção Confirmada', 'Você já possui os produtos');
    } else {
      showInfo('Seleção Confirmada', 'Produtos serão coletados');
    }
  };

  // Memoizar o componente Toast para evitar re-renderizações desnecessárias
  const MemoizedToastComponent = useMemo(() => <ToastComponent />, [ToastComponent]);

  return (
    <SafeAreaView style={styles.container}>
      {MemoizedToastComponent}
      
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1976D2" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Coleta dos Produtos</Text>
            <Text style={styles.headerSubtitle}>#{delivery.id} - {delivery.customerName}</Text>
          </View>
        </View>

        {/* Timeline */}
        <DeliveryTimeline
          currentStep={0}
          onStepPress={handleTimelineNavigation}
          onSkip={handleSkipStep}
          canNavigate={true}
        />

        {/* Instruções */}
        <View style={styles.instructionsCard}>
          <View style={styles.instructionsHeader}>
            <Package size={24} color="#1976D2" />
            <Text style={styles.instructionsTitle}>Instruções de Coleta</Text>
          </View>
          <Text style={styles.instructionsText}>
            • Verifique a lista de produtos abaixo{'\n'}
            • Colete todos os itens no depósito{'\n'}
            • Confirme as quantidades{'\n'}
            • Proceda para a entrega
          </Text>
        </View>

        {/* Lista de Produtos */}
        <View style={styles.productsCard}>
          <Text style={styles.cardTitle}>Produtos para Coleta</Text>
          
          {delivery.items.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <View style={styles.productIcon}>
                <Package size={20} color="#1976D2" />
              </View>
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productQuantity}>Quantidade: {item.quantity}</Text>
              </View>
              
              <View style={styles.productPrice}>
                <Text style={styles.priceValue}>R$ {(item.price * item.quantity).toFixed(2)}</Text>
                <Text style={styles.unitPrice}>R$ {item.price.toFixed(2)} cada</Text>
              </View>
            </View>
          ))}

          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <DollarSign size={20} color="#4CAF50" />
              <Text style={styles.totalLabel}>Total da Entrega:</Text>
              <Text style={styles.totalValue}>R$ {delivery.totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Pergunta de Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Você já possui os produtos?</Text>
          <Text style={styles.statusSubtitle}>
            Selecione se você já tem os produtos ou precisa coletá-los no depósito.
          </Text>
          
          <View style={styles.statusOptions}>
            <TouchableOpacity
              style={[
                styles.statusOption,
                hasProducts === false && styles.selectedStatusOption,
                hasProducts === false && styles.collectOption
              ]}
              onPress={() => handleProductSelection(false)}
              disabled={isNavigating}
            >
              <Clock size={24} color={hasProducts === false ? "#FFFFFF" : "#1976D2"} />
              <Text style={[
                styles.statusOptionText,
                hasProducts === false && styles.selectedStatusText
              ]}>
                Preciso Coletar
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusOption,
                hasProducts === true && styles.selectedStatusOption,
                hasProducts === true && styles.haveOption
              ]}
              onPress={() => handleProductSelection(true)}
              disabled={isNavigating}
            >
              <CheckCircle size={24} color={hasProducts === true ? "#FFFFFF" : "#4CAF50"} />
              <Text style={[
                styles.statusOptionText,
                hasProducts === true && styles.selectedStatusText
              ]}>
                Já Tenho
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          {hasProducts === false && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.collectButton, isCollecting && styles.disabledButton]}
              onPress={handleConfirmCollection}
              disabled={isCollecting || isNavigating}
            >
              <Package size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {isCollecting ? 'Coletando...' : 'Confirmar Coleta'}
              </Text>
            </TouchableOpacity>
          )}

          {hasProducts === true && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.proceedButton, isNavigating && styles.disabledButton]}
              onPress={handleAlreadyHaveProducts}
              disabled={isNavigating}
            >
              <ArrowRight size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {isNavigating ? 'Navegando...' : 'Ir para Entrega'}
              </Text>
            </TouchableOpacity>
          )}

          {hasProducts === null && (
            <View style={styles.selectPrompt}>
              <Text style={styles.selectPromptText}>
                Selecione uma opção acima para continuar
              </Text>
            </View>
          )}
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
  productsCard: {
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
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  productIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: '#757575',
  },
  productPrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
  },
  unitPrice: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  totalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
    marginRight: 12,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statusCard: {
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
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  statusOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  selectedStatusOption: {
    borderWidth: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  collectOption: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  haveOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
  },
  selectedStatusText: {
    color: '#FFFFFF',
  },
  actionsContainer: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  collectButton: {
    backgroundColor: '#1976D2',
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  selectPrompt: {
    padding: 20,
    alignItems: 'center',
  },
  selectPromptText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 80,
  },
}); 