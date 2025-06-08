import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Circle, 
  ArrowRight,
  RotateCcw
} from 'lucide-react-native';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  canSkip?: boolean;
  canGoBack?: boolean;
}

interface DeliveryTimelineProps {
  currentStep: number;
  onStepPress: (stepIndex: number) => void;
  onSkip?: () => void;
  onGoBack?: () => void;
  canNavigate?: boolean;
}

const DELIVERY_STEPS: TimelineStep[] = [
  {
    id: 'collect',
    title: 'Coleta do Produto',
    description: 'Retire os produtos no depósito',
    status: 'pending',
    canSkip: true,
  },
  {
    id: 'deliver',
    title: 'Entrega ao Cliente',
    description: 'Entregue os produtos ao cliente',
    status: 'pending',
  },
  {
    id: 'return',
    title: 'Devolução de Vasilhames',
    description: 'Colete os vasilhames vazios (se houver)',
    status: 'pending',
    canSkip: true,
  },
];

export function DeliveryTimeline({ 
  currentStep, 
  onStepPress, 
  onSkip, 
  onGoBack,
  canNavigate = true 
}: DeliveryTimelineProps) {
  
  const getStepStatus = (index: number): 'completed' | 'active' | 'pending' => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getStepIcon = (index: number, stepId: string) => {
    const status = getStepStatus(index);
    const size = 24;
    
    if (status === 'completed') {
      return <CheckCircle size={size} color="#FFFFFF" />;
    }
    
    if (status === 'active') {
      switch (stepId) {
        case 'collect': return <Package size={size} color="#FFFFFF" />;
        case 'deliver': return <Truck size={size} color="#FFFFFF" />;
        case 'return': return <RotateCcw size={size} color="#FFFFFF" />;
        default: return <Circle size={size} color="#FFFFFF" />;
      }
    }
    
    return <Circle size={size} color="#BDBDBD" />;
  };

  const getStepStyles = (index: number) => {
    const status = getStepStatus(index);
    
    switch (status) {
      case 'completed':
        return [styles.stepCircle, styles.completedStep];
      case 'active':
        return [styles.stepCircle, styles.activeStep];
      default:
        return [styles.stepCircle, styles.pendingStep];
    }
  };

  const isStepClickable = (index: number) => {
    if (!canNavigate) return false;
    return index <= currentStep; // Pode clicar apenas em etapas já visitadas ou atual
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progresso da Entrega</Text>
      
      <View style={styles.timeline}>
        {DELIVERY_STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            <View style={styles.stepContainer}>
              <TouchableOpacity
                style={getStepStyles(index)}
                onPress={() => isStepClickable(index) && onStepPress(index)}
                disabled={!isStepClickable(index)}
                activeOpacity={0.7}
              >
                {getStepIcon(index, step.id)}
              </TouchableOpacity>
              
              <View style={styles.stepContent}>
                <Text style={[
                  styles.stepTitle,
                  getStepStatus(index) === 'active' && styles.activeStepTitle
                ]}>
                  {step.title}
                </Text>
                <Text style={styles.stepDescription}>
                  {step.description}
                </Text>
                
                {getStepStatus(index) === 'active' && (
                  <View style={styles.stepActions}>
                    {step.canGoBack && index > 0 && onGoBack && (
                      <TouchableOpacity style={styles.secondaryButton} onPress={onGoBack}>
                        <Text style={styles.secondaryButtonText}>Voltar</Text>
                      </TouchableOpacity>
                    )}
                    
                    {step.canSkip && onSkip && (
                      <TouchableOpacity style={styles.secondaryButton} onPress={onSkip}>
                        <Text style={styles.secondaryButtonText}>Pular Etapa</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
            
            {/* Linha conectora */}
            {index < DELIVERY_STEPS.length - 1 && (
              <View style={[
                styles.connector,
                getStepStatus(index) === 'completed' && styles.completedConnector
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeline: {
    paddingLeft: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  completedStep: {
    backgroundColor: '#4CAF50',
  },
  activeStep: {
    backgroundColor: '#1976D2',
  },
  pendingStep: {
    backgroundColor: '#E0E0E0',
  },
  stepContent: {
    flex: 1,
    paddingBottom: 24,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  activeStepTitle: {
    color: '#1976D2',
  },
  stepDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  stepActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#1976D2',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976D2',
  },
  connector: {
    width: 3,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginLeft: 22.5,
    marginVertical: -12,
    zIndex: -1,
  },
  completedConnector: {
    backgroundColor: '#4CAF50',
  },
}); 