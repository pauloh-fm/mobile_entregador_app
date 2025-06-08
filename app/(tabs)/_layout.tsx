import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { View, TouchableOpacity, Text } from 'react-native';
import { Home, History, User } from 'lucide-react-native';
import { FloatingActionButton } from '../../components/ui/FloatingActionButton';
import { router } from 'expo-router';

function ProfileButton() {
  return (
    <TouchableOpacity 
      style={{
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        marginRight: 16,
      }}
      onPress={() => router.push('/profile')}
    >
      <User size={24} color="#1976D2" />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#E0E0E0',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          headerRight: () => <ProfileButton />,
          tabBarActiveTintColor: '#1976D2',
          tabBarInactiveTintColor: '#757575',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
            paddingTop: 16,
            paddingBottom: 20,
            paddingHorizontal: 20,
            height: 90,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '700',
            marginTop: 8,
            marginBottom: 4,
          },
          tabBarIconStyle: {
            marginTop: 6,
          },
        }}>
        
        {/* Tab 1: Início - 33.33% */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            headerTitle: () => (
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#212121',
                marginLeft: 16,
              }}>
                Início
              </Text>
            ),
            tabBarIcon: ({ size, color }) => (
              <Home size={30} color={color} />
            ),
          }}
        />
        
        {/* Tab 2: Botão Central - 33.33% */}
        <Tabs.Screen
          name="action"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: () => null,
            tabBarButton: () => (
              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                <FloatingActionButton />
              </View>
            ),
          }}
        />
        
        {/* Tab 3: Histórico - 33.33% */}
        <Tabs.Screen
          name="history"
          options={{
            title: 'Histórico',
            headerTitle: () => (
              <Text style={{
                fontSize: 20,
                fontWeight: '700',
                color: '#212121',
                marginLeft: 16,
              }}>
                Histórico de Entregas
              </Text>
            ),
            tabBarIcon: ({ size, color }) => (
              <History size={30} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}