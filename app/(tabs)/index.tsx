import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDelivery } from '@/contexts/DeliveryContext';
import { useToast } from '@/components/ui/Toast';
import { 
  Package, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle,
  TrendingUp,
  Calendar,
  Users,
  Activity,
  ArrowRight
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const { deliveries } = useDelivery();
  const { showSuccess, showInfo, ToastComponent } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Simular carregamento
    setTimeout(() => {
      setRefreshing(false);
      showInfo('Atualizado', 'Dados atualizados com sucesso!');
    }, 1000);
  };

  // Mock data - em produção viria da API
  const stats = {
    pendingDeliveries: (deliveries || []).filter(d => d.status === 'pending').length,
    completedToday: 5,
    totalEarnings: 245.50,
    averageTime: '25 min'
  };

  const upcomingDeliveries = [
    {
      id: '1',
      customerName: 'João Silva',
      address: 'Rua das Flores, 123',
      items: ['Botijão 13kg x2', 'Água 20L x1'],
      estimatedTime: '15 min',
      distance: '2.3 km',
      value: 182.50
    },
    {
      id: '2',
      customerName: 'Maria Santos',
      address: 'Av. Principal, 456',
      items: ['Botijão 13kg x1'],
      estimatedTime: '20 min',
      distance: '3.1 km',
      value: 85.00
    }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color = '#1976D2' }: {
    icon: any,
    title: string,
    value: string | number,
    subtitle?: string,
    color?: string
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity 
          style={styles.statCard}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
            <Icon size={24} color={color} />
          </View>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const DeliveryCard = ({ delivery }: { delivery: any }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePress = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      showInfo('Entrega Selecionada', `${delivery.customerName} - ${delivery.address}`);
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity 
          style={styles.deliveryCard}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <View style={styles.deliveryHeader}>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{delivery.customerName}</Text>
              <View style={styles.addressRow}>
                <MapPin size={14} color="#757575" />
                <Text style={styles.address}>{delivery.address}</Text>
              </View>
            </View>
            <View style={styles.deliveryValue}>
              <Text style={styles.valueAmount}>R$ {delivery.value.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.deliveryDetails}>
            <View style={styles.itemsList}>
              <Package size={16} color="#1976D2" />
              <Text style={styles.itemsText}>{delivery.items.join(', ')}</Text>
            </View>

            <View style={styles.deliveryMeta}>
              <View style={styles.metaItem}>
                <Clock size={14} color="#FF6F00" />
                <Text style={styles.metaText}>{delivery.estimatedTime}</Text>
              </View>
              <View style={styles.metaItem}>
                <MapPin size={14} color="#4CAF50" />
                <Text style={styles.metaText}>{delivery.distance}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionRow}>
            <View style={styles.priorityIndicator}>
              <View style={[styles.priorityDot, { backgroundColor: '#FF6F00' }]} />
              <Text style={styles.priorityText}>Alta Prioridade</Text>
            </View>
            <ArrowRight size={16} color="#1976D2" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ToastComponent />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1976D2']}
            tintColor="#1976D2"
          />
        }
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Saudação */}
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>Olá, Entregador! 👋</Text>
            <Text style={styles.subGreeting}>
              Você tem {stats.pendingDeliveries} entregas pendentes hoje
            </Text>
          </View>

          {/* Estatísticas */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Resumo de Hoje</Text>
            <View style={styles.statsGrid}>
              <StatCard
                icon={Package}
                title="Pendentes"
                value={stats.pendingDeliveries}
                color="#FF6F00"
              />
              <StatCard
                icon={CheckCircle}
                title="Concluídas"
                value={stats.completedToday}
                color="#4CAF50"
              />
              <StatCard
                icon={DollarSign}
                title="Ganhos"
                value={`R$ ${stats.totalEarnings.toFixed(2)}`}
                color="#2196F3"
              />
              <StatCard
                icon={Clock}
                title="Tempo Médio"
                value={stats.averageTime}
                color="#9C27B0"
              />
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Progresso Diário</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Meta: 10 entregas</Text>
                <Text style={styles.progressValue}>
                  {stats.completedToday}/10 ({Math.round((stats.completedToday / 10) * 100)}%)
                </Text>
              </View>
              <View style={styles.progressBarContainer}>
                <Animated.View 
                  style={[
                    styles.progressBar,
                    { width: `${(stats.completedToday / 10) * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressSubtext}>
                Continue assim! Restam {10 - stats.completedToday} entregas para atingir sua meta.
              </Text>
            </View>
          </View>

          {/* Próximas Entregas */}
          {upcomingDeliveries.length > 0 && (
            <View style={styles.deliveriesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Próximas Entregas</Text>
                <TouchableOpacity style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>Ver Todas</Text>
                  <ArrowRight size={16} color="#1976D2" />
                </TouchableOpacity>
              </View>
              
              {upcomingDeliveries.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} />
              ))}
            </View>
          )}

          {/* Estado Vazio */}
          {upcomingDeliveries.length === 0 && (
            <View style={styles.emptyState}>
              <CheckCircle size={48} color="#4CAF50" />
              <Text style={styles.emptyTitle}>Parabéns!</Text>
              <Text style={styles.emptyMessage}>
                Você concluiu todas as entregas de hoje.
              </Text>
            </View>
          )}
        </Animated.View>

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
  content: {
    flex: 1,
  },
  greetingSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#757575',
  },
  statsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginHorizontal: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#BDBDBD',
    textAlign: 'center',
    marginTop: 2,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  deliveriesSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  address: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
  },
  deliveryValue: {
    alignItems: 'flex-end',
  },
  valueAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  deliveryDetails: {
    marginBottom: 12,
  },
  itemsList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  itemsText: {
    fontSize: 14,
    color: '#212121',
    flex: 1,
  },
  deliveryMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#757575',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6F00',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 100,
  },
}); 