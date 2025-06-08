import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { CheckCircle, AlertTriangle, X, Info, AlertCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onHide: () => void;
  position?: 'top' | 'bottom';
}

export function Toast({
  visible,
  type,
  title,
  message,
  duration = 3000,
  onHide,
  position = 'top'
}: ToastProps) {
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onHide();
    });
  }, [position, translateY, opacity, onHide]);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      
      // Haptic feedback baseado no tipo
      const triggerHaptic = async () => {
        try {
          switch (type) {
            case 'success':
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              break;
            case 'error':
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              break;
            case 'warning':
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              break;
            default:
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        } catch (error) {
          // Silently ignore haptic errors
        }
      };
      
      triggerHaptic();

      // Animação de entrada
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide timer
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    } else if (isVisible) {
      hideToast();
    }
  }, [visible, type, duration, hideToast, isVisible]);

  const getToastConfig = useCallback((type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#4CAF50',
          icon: CheckCircle,
          iconColor: '#FFFFFF',
        };
      case 'error':
        return {
          backgroundColor: '#F44336',
          icon: AlertCircle,
          iconColor: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: '#FF9800',
          icon: AlertTriangle,
          iconColor: '#FFFFFF',
        };
      case 'info':
        return {
          backgroundColor: '#2196F3',
          icon: Info,
          iconColor: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: '#757575',
          icon: Info,
          iconColor: '#FFFFFF',
        };
    }
  }, []);

  if (!isVisible) return null;

  const config = getToastConfig(type);
  const Icon = config.icon;

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        { backgroundColor: config.backgroundColor },
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon size={20} color={config.iconColor} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={hideToast}>
          <X size={18} color={config.iconColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// Hook para usar Toast facilmente
export function useToast() {
  const [toastState, setToastState] = useState<{
    visible: boolean;
    type: ToastType;
    title: string;
    message?: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
  });

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    setToastState({
      visible: true,
      type,
      title,
      message,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastState(prev => ({ ...prev, visible: false }));
  }, []);

  const ToastComponent = useCallback(() => (
    <Toast
      visible={toastState.visible}
      type={toastState.type}
      title={toastState.title}
      message={toastState.message}
      onHide={hideToast}
    />
  ), [toastState.visible, toastState.type, toastState.title, toastState.message, hideToast]);

  return {
    showSuccess: useCallback((title: string, message?: string) => showToast('success', title, message), [showToast]),
    showError: useCallback((title: string, message?: string) => showToast('error', title, message), [showToast]),
    showWarning: useCallback((title: string, message?: string) => showToast('warning', title, message), [showToast]),
    showInfo: useCallback((title: string, message?: string) => showToast('info', title, message), [showToast]),
    hideToast,
    ToastComponent,
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  topPosition: {
    top: 60,
  },
  bottomPosition: {
    bottom: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
}); 