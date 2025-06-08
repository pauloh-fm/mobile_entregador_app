import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Delivery } from '@/types/delivery';
import { MapPin, Package, Clock, Phone } from 'lucide-react-native';

interface DeliveryCardProps {
  delivery: Delivery;
  onPress: () => void;
}

export function DeliveryCard({ delivery, onPress }: DeliveryCardProps) {
  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return '#FF6F00';
      case 'picked_up': return '#1976D2';
      case 'in_transit': return '#1976D2';
      case 'delivered': return '#2E7D32';
      case 'returned': return '#757575';
      case 'failed': return '#D32F2F';
      case 'cancelled': return '#9E9E9E';
      default: return '#757575';
    }
  };

  const getStatusText = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'picked_up': return 'Coletado';
      case 'in_transit': return 'Em Trânsito';
      case 'delivered': return 'Entregue';
      case 'returned': return 'Devolvido';
      case 'failed': return 'Falhou';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#D32F2F';
      case 'medium': return '#FF6F00';
      case 'low': return '#2E7D32';
      default: return '#757575';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>#{delivery.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(delivery.status) }]}>
              <Text style={styles.statusText}>{getStatusText(delivery.status)}</Text>
            </View>
          </View>
          <View style={[styles.priorityBadge, { borderColor: getPriorityColor(delivery.priority) }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(delivery.priority) }]}>
              {delivery.priority.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{delivery.customerName}</Text>
          <View style={styles.contactInfo}>
            <Phone size={16} color="#757575" />
            <Text style={styles.phone}>{delivery.customerPhone}</Text>
          </View>
        </View>

        <View style={styles.addressInfo}>
          <MapPin size={16} color="#757575" />
          <Text style={styles.address}>
            {delivery.address}, {delivery.city} - {delivery.state}
          </Text>
        </View>

        <View style={styles.itemsInfo}>
          <Package size={16} color="#757575" />
          <Text style={styles.items}>
            {delivery.items.length} item(s) • {delivery.items.reduce((acc, item) => acc + item.quantity, 0)} unidades • R$ {delivery.totalAmount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.timeInfo}>
          <Clock size={16} color="#757575" />
          <Text style={styles.time}>
            Agendado: {delivery.scheduledDate.toLocaleDateString('pt-BR')} às {delivery.scheduledDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {delivery.notes && (
          <View style={styles.notesInfo}>
            <Text style={styles.notes}>💡 {delivery.notes}</Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  customerInfo: {
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phone: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
    flex: 1,
  },
  itemsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  items: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notesInfo: {
    marginTop: 8,
  },
  notes: {
    fontSize: 14,
    color: '#757575',
  },
});