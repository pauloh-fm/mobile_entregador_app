import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Route, Delivery } from '@/types/delivery';
import { MapPin, Clock, Truck } from 'lucide-react-native';

interface RouteProgressProps {
  route: Route;
  deliveries?: Delivery[];
}

export function RouteProgress({ route, deliveries = [] }: RouteProgressProps) {
  // Get deliveries that are part of this route
  const routeDeliveries = deliveries.filter(d => route.deliveryIds.includes(d.id));
  const completedDeliveries = routeDeliveries.filter(d => d.status === 'delivered').length;
  const progress = routeDeliveries.length > 0 ? (completedDeliveries / routeDeliveries.length) * 100 : 0;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Truck size={24} color="#1976D2" />
        <Text style={styles.title}>Progresso da Rota</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {completedDeliveries} de {routeDeliveries.length} entregas
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <MapPin size={20} color="#757575" />
          <Text style={styles.statValue}>{route.distance.toFixed(1)} km</Text>
          <Text style={styles.statLabel}>Distância</Text>
        </View>

        <View style={styles.stat}>
          <Clock size={20} color="#757575" />
          <Text style={styles.statValue}>{route.estimatedDuration} min</Text>
          <Text style={styles.statLabel}>Tempo Est.</Text>
        </View>

        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: '#2E7D32' }]}>{Math.round(progress)}%</Text>
          <Text style={styles.statLabel}>Concluído</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
});