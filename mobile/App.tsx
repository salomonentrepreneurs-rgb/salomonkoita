import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salomonkoita</Text>
      <Text style={styles.subtitle}>Salomonkoita is an AI-powered full-stack app builder that lets users create complete websites, web apps, SaaS products, and mobile applications in minutes by describing their idea in natural language. It generates full-stack applications including frontend (React/Next.js), backend (FastAPI), database (PostgreSQL), authentication (JWT/OAuth2), AI models, payment integration (Stripe), and one-click deployment. Includes an AI agent system (Claw-like) for 24/7 autonomous agents on messaging platforms, an AI Gateway with 200+ models, RAG knowledge base, sandbox environments, and a complete CRM module with AI-powered lead scoring, deal pipeline, analytics dashboard, and smart analytics.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

function CrmScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRM</Text>
      <Text style={styles.subtitle}>AI-Powered Sales Intelligence</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          {INCLUDE_CRM ? '<Tab.Screen name="CRM" component={CrmScreen} />' : ''}
          <Tab.Screen name="Settings" component={() => <View style={styles.container}><Text>Settings</Text></View>} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#6366f1' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
});
