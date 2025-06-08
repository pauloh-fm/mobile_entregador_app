import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDelivery } from '@/contexts/DeliveryContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Truck, MapPin, Camera, PenTool, CheckCircle, Navigation } from 'lucide-react-native';

export default function DeliveringScreen() {
  const { deliveries, updateDeliveryStatus } = useDelivery();
  const [isDelivering, setIsDelivering] = useState(false);

  const pickedUpDeliveries = (deliveries || []).filter(d => d.status === 'picked_up');
  const currentDelivery = pickedUpDeliveries[0]; // Primeira entrega coletada

  const handleCompleteDelivery = async () => {
    if (!currentDelivery) return;

    setIsDelivering(true);
    
    try {
      // Simular processo de entrega
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verificar se precisa de devolução de vasilhame
      const needsReturn = currentDelivery.items.some(item => item.returnContainer);
      
      if (needsReturn) {
        // Atualizar status para entregue e ir para devolução
        updateDeliveryStatus(currentDelivery.id, 'delivered');
        
        Alert.alert(
          'Entrega Concluída',
          'Produto entregue com sucesso! Agora confirme a devolução dos vasilhames vazios.',
          [
            {
              text: 'Confirmar Devolução',
              onPress: () => router.push('/delivery/returning'),
            },
          ]
        );
      } else {
        // Finalizar entrega completamente
        updateDeliveryStatus(currentDelivery.id, 'delivered');
        
        Alert.alert(
          'Entrega Finalizada',
          'Entrega concluída com sucesso!',
          [
            {
              text: 'Voltar ao Mapa',
              onPress: () => router.push('/'),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível confirmar a entrega.');
    } finally {
      setIsDelivering(false);
    }
  };

  const handleTakePhoto = () => {
    Alert.alert('Foto', 'Funcionalidade de câmera será implementada em breve.');
  };

  const handleGetSignature = () => {
    Alert.alert('Assinatura', 'Funcionalidade de assinatura será implementada em breve.');
  };

  const handleOpenNavigation = () => {
    if (currentDelivery) {
      Alert.alert(
        'Navegação',
        `Abrindo navegação para: ${currentDelivery.address}, ${currentDelivery.city}`
      );
    }
  };

  if (!currentDelivery) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Truck size={64} color="#757575" />
          <Text style={styles.emptyTitle}>Nenhum Produto Coletado</Text>
          <Text style={styles.emptyText}>
            Você precisa coletar um produto antes de fazer a entrega.
          </Text>
          <Button
            title="Ir para Coleta"
            onPress={() => router.push('/delivery/collecting')}
            variant="primary"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Truck size={32} color="#1976D2" />
          <Text style={styles.title}>Entrega ao Cliente</Text>
          <Text style={styles.subtitle}>
            Entregue o produto e confirme a recepção
          </Text>
        </View>

        {/* Informações do Cliente */}
        <Card style={styles.customerCard}>
          <View style={styles.customerHeader}>
            <Text style={styles.customerTitle}>Cliente</Text>
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>
                {currentDelivery.priority === 'high' ? 'Alta' : 
                 currentDelivery.priority === 'medium' ? 'Média' : 'Baixa'}
              </Text>
            </View>
          </View>

          <Text style={styles.customerName}>{currentDelivery.customerName}</Text>
          <Text style={styles.customerPhone}>{currentDelivery.customerPhone}</Text>

          <View style={styles.addressSection}>
            <View style={styles.addressHeader}>
              <MapPin size={16} color="#757575" />
              <Text style={styles.addressTitle}>Endereço de Entrega</Text>
            </View>
            <Text style={styles.address}>
              {currentDelivery.address}
            </Text>
            <Text style={styles.cityState}>
              {currentDelivery.city}, {currentDelivery.state} - {currentDelivery.zipCode}
            </Text>
          </View>

          <Button
            title="Abrir Navegação"
            onPress={handleOpenNavigation}
            variant="outline"
            size="medium"
            style={styles.navigationButton}
          />
        </Card>

        {/* Resumo dos Itens */}
        <Card style={styles.itemsCard}>
          <Text style={styles.itemsTitle}>Itens para Entrega</Text>
          
          {currentDelivery.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qtd: {item.quantity}</Text>
                {item.returnContainer && (
                  <Text style={styles.returnNote}>⚠️ Requer devolução de vasilhame</Text>
                )}
              </View>
              <Text style={styles.itemPrice}>
                R$ {(item.unitPrice * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              R$ {currentDelivery.totalAmount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Forma de Pagamento:</Text>
            <Text style={styles.paymentMethod}>
              {currentDelivery.paymentMethod === 'money' ? 'Dinheiro' :
               currentDelivery.paymentMethod === 'card' ? 'Cartão' : 'PIX'}
            </Text>
          </View>
        </Card>

        {/* Confirmações Necessárias */}
        <Card style={styles.confirmationCard}>
          <Text style={styles.confirmationTitle}>Confirmações Necessárias</Text>
          
          <View style={styles.confirmationItem}>
            <Camera size={20} color="#1976D2" />
            <Text style={styles.confirmationText}>Foto da Entrega</Text>
            <Button
              title="Tirar Foto"
              onPress={handleTakePhoto}
              variant="outline"
              size="small"
            />
          </View>

          <View style={styles.confirmationItem}>
            <PenTool size={20} color="#1976D2" />
            <Text style={styles.confirmationText}>Assinatura Digital</Text>
            <Button
              title="Coletar Assinatura"
              onPress={handleGetSignature}
              variant="outline"
              size="small"
            />
          </View>
        </Card>

        {/* Instruções */}
        <Card style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Instruções de Entrega</Text>
          <Text style={styles.instructionsText}>
            1. Confirme a identidade do cliente{'\n'}
            2. Entregue todos os itens da lista{'\n'}
            3. Tire uma foto da entrega{'\n'}
            4. Colete a assinatura digital{'\n'}
            5. Confirme o pagamento{'\n'}
            6. Se houver vasilhames, prossiga para devolução
          </Text>
        </Card>

        {/* Ações */}
        <View style={styles.actions}>
          <Button
            title={isDelivering ? 'Confirmando...' : 'Confirmar Entrega'}
            onPress={handleCompleteDelivery}
            variant="primary"
            size="large"
            disabled={isDelivering}
            style={styles.actionButton}
          />

          <Button
            title="Voltar para Coleta"
            onPress={() => router.push('/delivery/collecting')}
            variant="outline"
            size="medium"
            style={styles.actionButton}
          />

          <Button
            title="Voltar ao Mapa"
            onPress={() => router.push('/')}
            variant="ghost"
            size="medium"
            style={styles.backButton}
          />
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },
  customerCard: {
    margin: 16,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  priorityBadge: {
    backgroundColor: '#FF6F00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  customerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 16,
    color: '#1976D2',
    marginBottom: 16,
  },
  addressSection: {
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
  },
  address: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 4,
  },
  cityState: {
    fontSize: 14,
    color: '#757575',
  },
  navigationButton: {
    marginTop: 8,
  },
  itemsCard: {
    margin: 16,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  returnNote: {
    fontSize: 12,
    color: '#FF6F00',
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1976D2',
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#757575',
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  confirmationCard: {
    margin: 16,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 16,
  },
  confirmationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  confirmationText: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 12,
    flex: 1,
  },
  instructionsCard: {
    margin: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  actions: {
    padding: 16,
    paddingBottom: 32,
  },
  actionButton: {
    marginBottom: 12,
  },
  backButton: {
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
}); 