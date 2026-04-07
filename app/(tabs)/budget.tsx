import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Colors } from '../../utils/theme';
import { Target, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react-native';
import GlassCard from '../../components/GlassCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();
  const { monthlyBudget, setMonthlyBudget, getMonthlyExpenses, isDarkMode } = useFinanceStore();
  const theme = isDarkMode ? Colors.dark : Colors.light;
  
  const [tempBudget, setTempBudget] = useState(monthlyBudget.toString());
  const budgetExpenses = getMonthlyExpenses();
  const percentUsed = Math.min(Math.round((budgetExpenses / monthlyBudget) * 100), 100);
  const remainingBudget = Math.max(monthlyBudget - budgetExpenses, 0);

  // High-End Logic for KPIs
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = now.getDate();
  const daysRemaining = daysInMonth - daysPassed + 1;
  const safeToSpendDaily = Math.max(Math.round(remainingBudget / daysRemaining), 0);
  const projectedSpending = Math.round((budgetExpenses / daysPassed) * daysInMonth);

  const budgetPresets = [25000, 50000, 75000, 100000];

  const handleSave = (amount: number) => {
    if (!isNaN(amount) && amount > 0) {
      setMonthlyBudget(amount);
      setTempBudget(amount.toString());
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Immersive Header */}
        <LinearGradient
          colors={isDarkMode ? ['#FF6B35', '#4D96FF'] : ['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Monthly Budget</Text>
            <View style={styles.safeToSpendContainer}>
              <Text style={styles.safeToSpendLabel}>Safe to Spend Daily</Text>
              <Text style={styles.safeToSpendValue}>₹{safeToSpendDaily.toLocaleString()}</Text>
            </View>
          </View>

          {/* Futuristic Glow Ring Visualization */}
          <View style={styles.visualWrapper}>
            <View style={styles.glowRingBackground}>
              <View style={[styles.glowRing, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
              <View style={[styles.glowRingInner, { backgroundColor: isDarkMode ? '#1a1a1a' : '#FFF' }]}>
                <Text style={[styles.percentDigit, { color: isDarkMode ? '#FFF' : '#333' }]}>{percentUsed}%</Text>
                <Text style={[styles.percentLabelLine, { color: theme.textSecondary }]}>Used</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentBody}>
            {/* Quick Summary Cards */}
            <View style={styles.statsRow}>
                <GlassCard intensity={20} style={styles.statBox}>
                    <TrendingDown size={20} color={theme.primary} />
                    <Text style={[styles.statBoxLabel, { color: theme.textSecondary }]}>Spent</Text>
                    <Text style={[styles.statBoxValue, { color: theme.text }]}>₹{budgetExpenses.toLocaleString()}</Text>
                </GlassCard>
                <GlassCard intensity={20} style={styles.statBox}>
                    <TrendingUp size={20} color={theme.secondary} />
                    <Text style={[styles.statBoxLabel, { color: theme.textSecondary }]}>Remaining</Text>
                    <Text style={[styles.statBoxValue, { color: theme.text }]}>₹{remainingBudget.toLocaleString()}</Text>
                </GlassCard>
            </View>

            {/* Premium Budget Selectors */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Adjust Monthly Limit</Text>
            <View style={styles.presetsRow}>
                {budgetPresets.map((amount) => (
                    <TouchableOpacity 
                        key={amount}
                        style={[
                            styles.presetBtn, 
                            { backgroundColor: monthlyBudget === amount ? (isDarkMode ? '#FFF' : theme.primary) : theme.card }
                        ]}
                        onPress={() => handleSave(amount)}
                    >
                        <Text style={[
                            styles.presetText, 
                            { color: monthlyBudget === amount ? (isDarkMode ? '#000' : '#FFF') : theme.textSecondary }
                        ]}>
                            ₹{amount / 1000}k
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Custom Input */}
            <View style={[styles.customInputCard, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: theme.border + '40' }]}>
                <View style={styles.inputWrapper}>
                    <View style={[styles.inputIconCircle, { backgroundColor: theme.primary + '20' }]}>
                        <Target size={20} color={theme.primary} />
                    </View>
                    <View style={styles.inputTextContainer}>
                        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Set Custom Limit</Text>
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            value={tempBudget}
                            onChangeText={setTempBudget}
                            keyboardType="numeric"
                            placeholder="Enter amount..."
                            placeholderTextColor={theme.textSecondary}
                            onBlur={() => handleSave(parseFloat(tempBudget))}
                        />
                    </View>
                </View>
            </View>

            {/* Smart Projected Insights */}
            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}>Budget Intelligence</Text>
            <View style={[styles.insightCard, { backgroundColor: isDarkMode ? 'rgba(77, 150, 255, 0.1)' : 'rgba(77, 150, 255, 0.05)' }]}>
                <AlertCircle size={22} color={theme.accentBlue} />
                <View style={styles.insightContent}>
                    <Text style={[styles.insightTitle, { color: theme.text }]}>Projected End Spend</Text>
                    <Text style={[styles.insightDesc, { color: theme.textSecondary }]}>
                        Based on your speed, you'll end with <Text style={{fontWeight: '700'}}>₹{projectedSpending.toLocaleString()}</Text> total spend.
                    </Text>
                </View>
            </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerInfo: {
    marginBottom: 32,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
  },
  safeToSpendContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  safeToSpendLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  safeToSpendValue: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '800',
  },
  visualWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRingBackground: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 12,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  glowRingInner: {
    width: 156,
    height: 156,
    borderRadius: 78,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  percentDigit: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  percentLabelLine: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: -2,
  },
  contentBody: {
    padding: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: -40,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
  },
  statBoxLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  statBoxValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  presetBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    minWidth: 70,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 14,
    fontWeight: '700',
  },
  customInputCard: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  inputIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputTextContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  input: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  insightCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  insightDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  }
});
