import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  Edit,
  Camera,
  Moon,
  Vibrate
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  const handleLogout = async () => {
    if (hapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  const handleEditProfile = async () => {
    if (hapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Implementar edição de perfil
    Alert.alert('Em Desenvolvimento', 'Funcionalidade de edição em breve!');
  };

  const handleSettingToggle = async (setting: string, value: boolean) => {
    if (hapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    switch (setting) {
      case 'notifications':
        setNotificationsEnabled(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'haptic':
        setHapticEnabled(value);
        break;
    }
  };

  const MenuSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const MenuItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement,
    showArrow = false,
    destructive = false 
  }: {
    icon: any,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    showArrow?: boolean,
    destructive?: boolean
  }) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, destructive && styles.destructiveIcon]}>
          <Icon size={20} color={destructive ? "#FFFFFF" : "#1976D2"} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={[styles.menuItemTitle, destructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.menuItemRight}>
        {rightElement}
        {showArrow && (
          <ArrowLeft size={16} color="#BDBDBD" style={{ transform: [{ rotate: '180deg' }] }} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1976D2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit size={20} color="#1976D2" />
          </TouchableOpacity>
        </View>

        {/* Perfil do Usuário */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={40} color="#1976D2" />
            </View>
            <TouchableOpacity style={styles.cameraButton} onPress={handleEditProfile}>
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Nome do Entregador'}</Text>
            <Text style={styles.userRole}>Entregador</Text>
          </View>
        </View>

        {/* Informações de Contato */}
        <MenuSection title="Informações de Contato">
          <MenuItem
            icon={Phone}
            title="Telefone"
            subtitle={user?.phone || '(11) 99999-9999'}
            showArrow={true}
            onPress={handleEditProfile}
          />
          <MenuItem
            icon={Mail}
            title="E-mail"
            subtitle={user?.email || 'entregador@empresa.com'}
            showArrow={true}
            onPress={handleEditProfile}
          />
          <MenuItem
            icon={MapPin}
            title="Endereço"
            subtitle="Rua das Entregas, 123"
            showArrow={true}
            onPress={handleEditProfile}
          />
        </MenuSection>

        {/* Configurações */}
        <MenuSection title="Configurações">
          <MenuItem
            icon={Bell}
            title="Notificações"
            subtitle="Receber alertas de entregas"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) => handleSettingToggle('notifications', value)}
                trackColor={{ false: '#E0E0E0', true: '#1976D2' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <MenuItem
            icon={Moon}
            title="Modo Escuro"
            subtitle="Aparência do aplicativo"
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={(value) => handleSettingToggle('darkMode', value)}
                trackColor={{ false: '#E0E0E0', true: '#1976D2' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <MenuItem
            icon={Vibrate}
            title="Vibração"
            subtitle="Feedback tátil nos botões"
            rightElement={
              <Switch
                value={hapticEnabled}
                onValueChange={(value) => handleSettingToggle('haptic', value)}
                trackColor={{ false: '#E0E0E0', true: '#1976D2' }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </MenuSection>

        {/* Ajuda e Suporte */}
        <MenuSection title="Ajuda e Suporte">
          <MenuItem
            icon={HelpCircle}
            title="Central de Ajuda"
            subtitle="FAQ e tutoriais"
            showArrow={true}
            onPress={() => Alert.alert('Em Desenvolvimento', 'Em breve!')}
          />
          <MenuItem
            icon={Shield}
            title="Privacidade e Segurança"
            subtitle="Configurações de privacidade"
            showArrow={true}
            onPress={() => Alert.alert('Em Desenvolvimento', 'Em breve!')}
          />
        </MenuSection>

        {/* Ações */}
        <MenuSection title="">
          <MenuItem
            icon={LogOut}
            title="Sair da Conta"
            onPress={handleLogout}
            destructive={true}
          />
        </MenuSection>

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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  editButton: {
    padding: 8,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#757575',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  destructiveIcon: {
    backgroundColor: '#F44336',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#F44336',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomSpacer: {
    height: 100,
  },
}); 