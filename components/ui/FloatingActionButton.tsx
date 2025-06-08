import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Animated } from 'react-native';
import { ArrowRight, Play, Loader } from 'lucide-react-native';
import { useDelivery } from '@/contexts/DeliveryContext';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export function FloatingActionButton() {
  const { deliveries, currentRoute } = useDelivery();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const pendingDeliveries = (deliveries || []).filter(d => d.status === 'pending');
  const isActive = pendingDeliveries.length > 0;
  const isInProgress = currentRoute?.status === 'active';

  // Animação pulse quando há entregas pendentes
  useEffect(() => {
    if (isActive && !isInProgress) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      
      return () => pulseAnimation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive, isInProgress, pulseAnim]);

  const handlePress = async () => {
    if (!isActive) return;
    
    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animação de press
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
    
    if (pendingDeliveries.length === 1) {
      // Uma entrega - inicia automaticamente
      router.push('/delivery/collecting');
    } else {
      // Múltiplas entregas - abre modal de seleção
      // TODO: Implementar modal de seleção
      router.push('/delivery/collecting');
    }
  };

  const getButtonStyle = () => {
    if (!isActive) return [styles.button, styles.inactive];
    if (isInProgress) return [styles.button, styles.progress];
    return [styles.button, styles.active];
  };

  const getIconColor = () => {
    if (!isActive) return '#BDBDBD';
    return '#FFFFFF';
  };

  const renderIcon = () => {
    if (isInProgress) return <Loader size={28} color={getIconColor()} />;
    if (isActive) return <ArrowRight size={28} color={getIconColor()} />;
    return <Play size={28} color={getIconColor()} />;
  };

  const getBadgeStyle = () => {
    if (pendingDeliveries.length > 9) {
      return [styles.badge, styles.largeBadge];
    }
    return styles.badge;
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          getButtonStyle(),
          {
            transform: [
              { scale: Animated.multiply(pulseAnim, scaleAnim) }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.touchArea}
          onPress={handlePress}
          disabled={!isActive}
          activeOpacity={0.9}
        >
          {renderIcon()}
          {pendingDeliveries.length > 0 && (
            <View style={getBadgeStyle()}>
              <Text style={styles.badgeText}>
                {pendingDeliveries.length > 99 ? '99+' : pendingDeliveries.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -40,
    alignSelf: 'center',
    width: 80,
    height: 80,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  touchArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  active: {
    backgroundColor: '#1976D2',
  },
  inactive: {
    backgroundColor: '#9E9E9E',
    elevation: 6,
    shadowOpacity: 0.2,
  },
  progress: {
    backgroundColor: '#FF6F00',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#D32F2F',
    borderRadius: 14,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  largeBadge: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
}); 