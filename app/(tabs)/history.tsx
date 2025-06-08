import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDelivery } from '@/contexts/DeliveryContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { History, CircleCheck as CheckCircle, Circle as XCircle, Clock, Calendar } from 'lucide-react-native';

export default function HistoryScreen() {
  const { deliveries, isLoading, loadDeliveries } = useDelivery();
  const [filter, setFilter] = useState<'all' | 'delivered' | 'failed'>('all');

  const completedDeliveries = (deliveries || []).filter(d =>
    d.status === 'delivered' || d.status === 'returned' || d.status === 'failed'
  );

  const filteredDeliveries = completedDeliveries.filter(delivery => {
    if (filter === 'all') return true;
    return delivery.status === filter;
  });

  const handleRefresh = () => {
    loadDeliveries();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} color="#2E7D32" />;
      case 'failed':
        return <XCircle size={20} color="#D32F2F" />;
      case 'returned':
        return <Clock size={20} color="#FF6F00" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Entregue';
      case 'failed': return 'Falhada';
      case 'returned': return 'Devolvida';
      default: return 'Desconhecido';
    }
  };

  const getFilterCount = (status: string) => {
    if (status === 'all') return completedDeliveries.length;
    return completedDeliveries.filter(d => d.status === status).length;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <History size={24} color="#1976D2" />
          <Text style={styles.title}>Histórico</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <CheckCircle size={24} color="#2E7D32" />
              <Text style={styles.statValue}>{getFilterCount('delivered')}</Text>
              <Text style={styles.statLabel}>Entregues</Text>
            </View>
            <View style={styles.stat}>
              <XCircle size={24} color="#D32F2F" />
              <Text style={styles.statValue}>{getFilterCount('failed')}</Text>
              <Text style={styles.statLabel}>Falhadas</Text>
            </View>
            <View style={styles.stat}>
              <Calendar size={24} color="#1976D2" />
              <Text style={styles.statValue}>{completedDeliveries.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </Card>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <Button
            title={`Todas (${getFilterCount('all')})`}
            onPress={() => setFilter('all')}
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="small"
            style={styles.filterButton}
          />
          <Button
            title={`Entregues (${getFilterCount('delivered')})`}
            onPress={() => setFilter('delivered')}
            variant={filter === 'delivered' ? 'primary' : 'outline'}
            size="small"
            style={styles.filterButton}
          />
          <Button
            title={`Falhadas (${getFilterCount('failed')})`}
            onPress={() => setFilter('failed')}
            variant={filter === 'failed' ? 'primary' : 'outline'}
            size="small"
            style={styles.filterButton}
          />
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {filteredDeliveries.length > 0 ? (
          filteredDeliveries.map((delivery) => (
            <Card key={delivery.id} style={styles.deliveryCard}>
              <View style={styles.deliveryHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderNumber}>#{delivery.id}</Text>
                  <View style={styles.statusContainer}>
                    {getStatusIcon(delivery.status)}
                    <Text style={[styles.statusText, { color: delivery.status === 'delivered' ? '#2E7D32' : '#D32F2F' }]}>
                      {getStatusText(delivery.status)}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.customerName}>{delivery.customerName}</Text>
              <Text style={styles.address}>
                {delivery.address}, {delivery.city} - {delivery.state}
              </Text>

              <View style={styles.timeInfo}>
                {delivery.deliveredAt && (
                  <View style={styles.timeRow}>
                    <Calendar size={16} color="#757575" />
                    <Text style={styles.timeText}>
                      {formatDate(delivery.deliveredAt)} às {formatTime(delivery.deliveredAt)}
                    </Text>
                  </View>
                )}
                
                {delivery.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Observações:</Text>
                    <Text style={styles.notesText}>{delivery.notes}</Text>
                  </View>
                )}
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.emptyState}>
            <History size={64} color="#E0E0E0" />
            <Text style={styles.emptyText}>
              {filter === 'all' 
                ? 'Nenhuma entrega no histórico'
                : `Nenhuma entrega ${filter === 'delivered' ? 'entregue' : 'falhada'} encontrada`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 12,
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statsCard: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  filterContainer: {
    paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    marginRight: 8,
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
  },
  deliveryCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  deliveryHeader: {
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  timeInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 16,
    textAlign: 'center',
  },
});